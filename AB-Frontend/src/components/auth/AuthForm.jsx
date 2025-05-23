import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthContext } from '../../context/AuthContext';

export default function AuthForm({ isLogin = true, onLogin, onRegister, loading, error }) {
  const { verifyOTP, clearError } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    remember: false,
    otp: '',
    confirmPassword: ''
  });
  const [otpMode, setOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  // Reset form fields when switching between login/register or OTP mode
  useEffect(() => {
    setFormData({ email: '', password: '', username: '', remember: false, otp: '', confirmPassword: '' });
    setOtpError('');
    setOtpSuccess('');
    setOtpTimer(0);
  }, [isLogin, otpMode]);

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Auto-dismiss error messages after 4 seconds
  useEffect(() => {
    let timeout;
    if (error) {
      timeout = setTimeout(() => {
        clearError();
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [error, clearError]);

  // Auto-dismiss OTP error messages after 4 seconds
  useEffect(() => {
    let timeout;
    if (otpError) {
      timeout = setTimeout(() => {
        setOtpError('');
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [otpError]);

  // Auto-dismiss OTP success messages after 4 seconds
  useEffect(() => {
    let timeout;
    if (otpSuccess) {
      timeout = setTimeout(() => {
        setOtpSuccess('');
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [otpSuccess]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear OTP error and success when user types in email
    if (name === 'email') {
      setOtpError('');
      setOtpSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otpMode) {
      // OTP login logic
      if (onLogin) {
        try {
          await verifyOTP(formData.email, formData.otp);
          // If successful, the useAuth hook will handle setting isLoggedIn and redirect
        } catch (err) {
          // Error is already handled by useAuth hook and will be displayed
        }
      }
    } else {
      // Password login/register
      if (isLogin) {
        if (onLogin) onLogin(formData);
      } else {
        if (onRegister) onRegister(formData);
      }
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email.trim()) {
      setOtpError('Please enter your email address first');
      setOtpSuccess('');
      return;
    }
    
    if (otpTimer > 0) {
      return; // Don't allow sending if timer is active
    }
    
    setIsOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');
    
    try {
      // Call the actual API
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL}/api/auth/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.status === 201) {
        // OTP sent successfully
        setOtpSent(true);
        setOtpTimer(60); // Start 60 second countdown
        setOtpSuccess('OTP sent successfully!');
        console.log('OTP sent to:', formData.email);
      } else if (response.status === 400) {
        // Show backend error message
        setOtpError(data.message || 'Failed to send OTP');
        setOtpSuccess('');
      } else {
        setOtpError(data.message || 'Failed to send OTP');
        setOtpSuccess('');
      }
    } catch (err) {
      setOtpError('Failed to send OTP. Please try again.');
      setOtpSuccess('');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {otpError && <div className="text-red-500 text-sm mb-2">{otpError}</div>}
      {otpSuccess && <div className="text-green-500 text-sm mb-2">{otpSuccess}</div>}
      
      {/* Username field for register */}
      {!isLogin && (
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4"
            placeholder="Enter your username"
            required
          />
        </div>
      )}

      {/* Login fields container for tutorial */}
      {isLogin && !otpMode ? (
        <div data-tutorial="email-password" className="space-y-6">
          {/* Email field */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pr-24"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password field for login */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-3 pr-10"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 hover:text-gray-200"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      ) : (
        /* Email field for OTP mode */
        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pr-24"
            placeholder="Enter your email"
            required
          />
          {isLogin && otpMode && (
            <div className="absolute right-2 bottom-2">
              {otpTimer > 0 ? (
                <span className="text-xs text-gray-400">
                  {formatTime(otpTimer)}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isOtpLoading}
                  className="text-xs underline disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: 'var(--dynamic-secondary-color)' }}
                >
                  {isOtpLoading ? 'Sending...' : 'Send OTP'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {isLogin && otpMode && (
        <div>
          <label htmlFor="otp" className="block text-sm font-medium mb-2">
            One-Time Password (OTP)
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4"
            placeholder="Enter the OTP sent to your email"
            required
          />
        </div>
      )}

      {/* Password and Confirm Password for register */}
      {!isLogin && (
        <>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pr-10"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 hover:text-gray-200"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4"
              placeholder="Confirm your password"
              required
            />
          </div>
        </>
      )}

      {/* Remember me and Forgot password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 text-orange-500 bg-gray-800 border-gray-700 rounded"
          />
          <label htmlFor="remember" className="ml-2 text-sm">
            Remember me
          </label>
        </div>

        {isLogin && !otpMode && (
          <button
            type="button"
            onClick={() => { 
              setOtpMode(true); 
              setOtpSent(false); 
              setFormData(f => ({ ...f, otp: '', password: '' })); 
            }}
            className="text-sm text-orange-500 hover:underline"
            style={{ color: 'var(--dynamic-secondary-color)' }}
          >
            Forgot password?
          </button>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        style={{ background: 'var(--dynamic-secondary-color)', color: '#000' }}
        className="w-full font-bold py-3 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        data-tutorial="jwt-security"
      >
        {loading ? 'Loading...' : (
          isLogin ? (otpMode ? 'Secure Login with OTP' : 'Secure Login') : 'Get Secured Access'
        )}
      </button>

      {/* OTP toggle */}
      {isLogin && (
        <div className="flex justify-center mt-2" data-tutorial="otp-toggle">
          <button
            type="button"
            onClick={() => { setOtpMode(m => !m); setOtpSent(false); setFormData(f => ({ ...f, otp: '', password: '' })); }}
            className="text-sm underline"
            style={{ color: 'var(--dynamic-secondary-color)' }}
          >
            {otpMode ? 'Login with Password' : 'Login with OTP'}
          </button>
        </div>
      )}
    </form>
  );
} 