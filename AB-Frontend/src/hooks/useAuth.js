import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      checkUserRoles(savedToken);
    }
  }, []);

  // Check user roles
  const checkUserRoles = async (authToken) => {
    try {
      const adminResult = await authAPI.checkAdminRole(authToken);
      const userResult = await authAPI.checkUserRole(authToken);
      setIsAdmin(adminResult);
      setIsUser(userResult);
    } catch (err) {
      console.error('Failed to check roles:', err);
      // If role check fails, try to refresh token
      await refreshTokenIfNeeded();
    }
  };

  // Token refresh logic
  const refreshTokenIfNeeded = async () => {
    if (isRefreshing) return; // Prevent multiple refresh attempts
    
    setIsRefreshing(true);
    try {
      const data = await authAPI.refreshToken();
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      setIsLoggedIn(true);
      await checkUserRoles(data.token);
    } catch (err) {
      console.error('Token refresh failed:', err);
      // If refresh fails, logout user
      logout();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Wrapper for API calls with automatic token refresh
  const apiCallWithRefresh = async (apiCall) => {
    try {
      return await apiCall();
    } catch (err) {
      if (err.message.includes('unauthorized') || err.message.includes('401') || err.message.includes('403')) {
        // Try to refresh token and retry the call
        await refreshTokenIfNeeded();
        if (token) {
          return await apiCall();
        }
      }
      throw err;
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.login(credentials);
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      setIsLoggedIn(true);
      await checkUserRoles(data.token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.register(userData);
      setRegistrationSuccess(true);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout(token);
      }
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      setToken(null);
      setUser(null);
      setIsLoggedIn(false);
      setIsAdmin(false);
      setIsUser(false);
      localStorage.removeItem('authToken');
    }
  };

  const sendOTP = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.sendOTP(email);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.verifyOTP(email, otp);
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      setIsLoggedIn(true);
      await checkUserRoles(data.token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleOAuthLogin = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.googleOAuthCallback(code);
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      setIsLoggedIn(true);
      await checkUserRoles(data.token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const githubOAuthLogin = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.githubOAuthCallback(code);
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      setIsLoggedIn(true);
      await checkUserRoles(data.token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCallWithRefresh(() => authAPI.makeAdmin(token));
      // Refresh roles after making admin
      await checkUserRoles(token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordChangeOTP = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCallWithRefresh(() => authAPI.sendPasswordChangeOTP(token));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyPasswordChangeOTP = async (newPassword, otp) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCallWithRefresh(() => authAPI.verifyPasswordChangeOTP(token, newPassword, otp));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearRegistrationSuccess = () => {
    setRegistrationSuccess(false);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isLoggedIn, user, token, loading, error, registrationSuccess,
    isAdmin, isUser, isRefreshing,
    login, register, logout, sendOTP, verifyOTP, googleOAuthLogin, githubOAuthLogin, makeAdmin,
    sendPasswordChangeOTP, verifyPasswordChangeOTP,
    clearRegistrationSuccess, clearError,
  };
}; 