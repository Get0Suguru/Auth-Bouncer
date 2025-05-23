import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaArrowLeft, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthContext } from '../../context/AuthContext';

export default function PasswordChange() {
  const navigate = useNavigate();
  const { sendPasswordChangeOTP, verifyPasswordChangeOTP, loading, error, clearError } = useAuthContext();
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSendOTP = async () => {
    try {
      await sendPasswordChangeOTP();
      setOtpSent(true);
      setStep(2);
      clearError();
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const handleVerifyOTP = async () => {
    if (newPassword !== confirmPassword) {
      clearError();
      return;
    }

    try {
      await verifyPasswordChangeOTP(newPassword, otp);
      setSuccess(true);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const isPasswordValid = newPassword.length >= 6;
  const isConfirmPasswordValid = newPassword === confirmPassword && confirmPassword.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--dynamic-secondary-color) 20%, transparent)' }}>
              <FaLock className="text-white text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Change Password</h1>
            <p className="text-gray-300">
              {step === 1 ? 'Request an OTP to change your password' : 'Enter the OTP and new password'}
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="bg-green-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaCheckCircle className="text-green-400 text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-green-400 mb-2">Password Changed Successfully!</h2>
              <p className="text-green-300">Redirecting back...</p>
            </div>
          ) : (
            <>
              {step === 1 ? (
                /* Step 1: Send OTP */
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-gray-300 mb-4">
                      We'll send a verification code to your email address to confirm the password change.
                    </p>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleSendOTP}
                      disabled={loading}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                        !loading
                          ? 'text-black'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      style={!loading ? { background: 'var(--dynamic-secondary-color)' } : {}}
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                    
                    <button
                      onClick={() => navigate(-1)}
                      className="w-full py-3 px-4 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <FaArrowLeft />
                      <span>Go Back</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 2: Verify OTP and Change Password */
                <div className="space-y-6">
                  {/* OTP Input */}
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                      maxLength={6}
                    />
                  </div>

                  {/* New Password Input */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${
                          newPassword && !isPasswordValid ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {newPassword && !isPasswordValid && (
                      <p className="text-red-400 text-sm mt-1">Password must be at least 6 characters</p>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${
                          confirmPassword && !isConfirmPasswordValid ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {confirmPassword && !isConfirmPasswordValid && (
                      <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
                    )}
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleVerifyOTP}
                      disabled={!otp || !isPasswordValid || !isConfirmPasswordValid || loading}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                        otp && isPasswordValid && isConfirmPasswordValid && !loading
                          ? 'text-black'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      style={otp && isPasswordValid && isConfirmPasswordValid && !loading ? { background: 'var(--dynamic-secondary-color)' } : {}}
                    >
                      {loading ? 'Changing Password...' : 'Change Password'}
                    </button>
                    
                    <button
                      onClick={() => setStep(1)}
                      className="w-full py-3 px-4 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                    >
                      Back to Step 1
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 