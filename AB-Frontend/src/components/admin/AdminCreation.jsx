import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrown, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import { useAuthContext } from '../../context/AuthContext';

export default function AdminCreation() {
  const navigate = useNavigate();
  const { makeAdmin, loading, error, clearError } = useAuthContext();
  const [confirmationText, setConfirmationText] = useState('');
  const [success, setSuccess] = useState(false);

  const handleMakeAdmin = async () => {
    if (confirmationText !== "i'll give geto a job") {
      clearError();
      return;
    }

    try {
      await makeAdmin();
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 2000);
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const isConfirmationValid = confirmationText === "i'll give geto a job";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--dynamic-secondary-color) 20%, transparent)' }}>
              <FaCrown className="text-white text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Become an Admin</h1>
            <p className="text-gray-300 mb-4">Enter the secret phrase to unlock admin privileges</p>
            
            {/* Secret Phrase Display */}
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-300 mb-1">Secret Phrase:</p>
              <code className="text-gray-100 font-mono text-sm bg-gray-600 px-2 py-1 rounded border select-all">
                i'll give geto a job
              </code>
            </div>
          </div>

          {success ? (
            <div className="text-center">
              <div className="bg-green-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaShieldAlt className="text-green-400 text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-green-400 mb-2">Admin Created Successfully!</h2>
              <p className="text-green-300">Redirecting to admin dashboard...</p>
            </div>
          ) : (
            <>
              {/* Confirmation Input */}
              <div className="mb-6">
                <label htmlFor="confirmation" className="block text-sm font-medium text-gray-300 mb-2">
                  Secret Phrase
                </label>
                <input
                  type="text"
                  id="confirmation"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Type the secret phrase..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                    confirmationText && !isConfirmationValid 
                      ? 'border-red-500 focus:ring-red-500' 
                      : isConfirmationValid 
                        ? 'border-green-500 focus:ring-green-500' 
                        : 'border-gray-600 focus:ring-blue-500'
                  }`}
                />
                {confirmationText && !isConfirmationValid && (
                  <p className="text-red-400 text-sm mt-2">Incorrect phrase. Try again.</p>
                )}
                {isConfirmationValid && (
                  <p className="text-green-400 text-sm mt-2">✓ Correct phrase!</p>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleMakeAdmin}
                  disabled={!isConfirmationValid || loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                    isConfirmationValid && !loading
                      ? 'text-black'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  style={isConfirmationValid && !loading ? { background: 'var(--dynamic-secondary-color)' } : {}}
                >
                  {loading ? 'Creating Admin...' : 'Become Admin'}
                </button>
                
                <button
                  onClick={() => navigate(-1)}
                  className="w-full py-3 px-4 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <FaArrowLeft />
                  <span>Go Back</span>
                </button>
              </div>

              {/* Warning */}
              <div className="mt-6 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>Warning:</strong> Admin privileges grant access to system management features. 
                  Use responsibly.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 