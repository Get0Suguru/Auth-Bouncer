const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      // Login successful - return token and expiration
      return {
        token: data.token,
        expiration: data.expiresIn
      };
    } else if (response.status === 400) {
      // Bad credentials - show specific error message from backend
      throw new Error(data.message || 'Login failed');
    } else {
      // Other errors - show specific error message from backend
      throw new Error(data.message || 'Login failed');
    }
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword
      }),
    });

    const data = await response.json();

    if (response.status === 201) {
      // Registration successful
      return data;
    } else if (response.status === 400) {
      // Bad credentials - username taken, email taken, password don't match
      throw new Error(data.message || 'Registration failed');
    } else {
      // Other errors
      throw new Error(data.message || 'Registration failed');
    }
  },

  sendOTP: async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/request-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.status === 201) {
      // OTP sent successfully
      return data;
    } else if (response.status === 400) {
      // Bad request - user not found, etc.
      throw new Error(data.message || 'Failed to send OTP');
    } else {
      // Other errors
      throw new Error(data.message || 'Failed to send OTP');
    }
  },

  verifyOTP: async (email, otp) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (response.status === 200) {
      // OTP verification successful - return token and expiration
      return {
        token: data.token,
        expiration: data.expiresIn
      };
    } else if (response.status === 400) {
      // Invalid OTP - show specific error message from backend
      throw new Error(data.message || 'OTP verification failed');
    } else {
      // Other errors
      throw new Error(data.message || 'OTP verification failed');
    }
  },

  googleOAuthCallback: async (code) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/google/callback?code=${encodeURIComponent(code)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.status === 200 || response.status === 201) {
      // Google OAuth successful - return token and expiration
      return {
        token: data.token || data.message, // Handle both possible response formats
        expiration: data.expiresIn
      };
    } else if (response.status === 400) {
      // Token exchange failed
      throw new Error(data.message || 'Google OAuth failed');
    } else {
      // Other errors
      throw new Error(data.message || 'Google OAuth failed');
    }
  },

  githubOAuthCallback: async (code) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/github/callback?code=${encodeURIComponent(code)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.status === 200 || response.status === 201) {
      // GitHub OAuth successful - return token and expiration
      return {
        token: data.token || data.message, // Handle both possible response formats
        expiration: data.expiresIn
      };
    } else if (response.status === 400) {
      // Token exchange failed
      throw new Error(data.message || 'GitHub OAuth failed');
    } else {
      // Other errors
      throw new Error(data.message || 'GitHub OAuth failed');
    }
  },

  logout: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include', // This is important for CORS and cookies
    });

    const data = await response.json();

    if (response.status === 200) {
      return data;
    } else {
      throw new Error(data.message || 'Logout failed');
    }
  },

  refreshToken: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This is important for sending HTTP-only cookies
    });

    const data = await response.json();

    if (response.status === 200) {
      return {
        token: data.token,
        expiresIn: data.expiresIn
      };
    } else if (response.status === 400) {
      throw new Error(data.message || 'Token refresh failed');
    } else {
      throw new Error(data.message || 'Token refresh failed');
    }
  },

  checkAdminRole: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/is-admin/test`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (response.status === 200) {
      return true;
    } else if (response.status === 403) {
      return false;
    } else {
      throw new Error('Failed to check admin role');
    }
  },

  checkUserRole: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/is-user/test`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (response.status === 200) {
      return true;
    } else if (response.status === 403) {
      return false;
    } else {
      throw new Error('Failed to check user role');
    }
  },

  makeAdmin: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/modify-user/make-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (response.status === 201) {
      return data;
    } else if (response.status === 400) {
      throw new Error(data.message || 'Failed to make admin');
    } else {
      throw new Error(data.message || 'Failed to make admin');
    }
  },

  sendPasswordChangeOTP: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/modify-user/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      return data;
    } else if (response.status === 400) {
      throw new Error(data.message || 'Failed to send OTP');
    } else {
      throw new Error(data.message || 'Failed to send OTP');
    }
  },

  verifyPasswordChangeOTP: async (token, newPassword, otp) => {
    const response = await fetch(`${API_BASE_URL}/api/modify-user/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        newPassword,
        otp
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data;
    } else if (response.status === 400) {
      throw new Error(data.message || 'Failed to verify OTP');
    } else {
      throw new Error(data.message || 'Failed to verify OTP');
    }
  },
}; 