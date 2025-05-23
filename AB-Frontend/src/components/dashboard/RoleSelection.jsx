import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserShield, FaRocket, FaCrown, FaStar, FaGem, FaShieldAlt, FaLock } from 'react-icons/fa';
import { useAuthContext } from '../../context/AuthContext';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { logout, isAdmin, isUser } = useAuthContext();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [particleCount, setParticleCount] = useState(0);

  const handleUserCard = () => {
    if (isUser) {
      navigate('/user-dashboard');
    } else {
      alert('You do not have user access. Please contact an administrator.');
    }
  };

  const handleAdminCard = () => {
    if (isAdmin) {
      navigate('/admin-dashboard');
    } else {
      alert('You do not have admin access. Please contact an administrator.');
    }
  };

  const handleBecomeAdmin = () => {
    navigate('/become-admin');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleParticleClick = () => {
    setParticleCount(prev => prev + 1);
    if (particleCount >= 4) {
      alert('🎉 You found the secret! You\'re a true explorer! 🎉');
      setParticleCount(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      {/* Minimal floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <FaStar className="text-xs opacity-20" style={{ color: 'var(--dynamic-secondary-color)' }} />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 pt-4 pb-6 px-4">
        <div className="text-center max-w-6xl mx-auto">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3">
            <FaRocket className="text-2xl sm:text-4xl text-gray-100" />
            <h1 className="text-2xl sm:text-4xl font-bold">
              <span className="text-white">Welcome to </span>
              <span style={{ color: 'var(--dynamic-secondary-color)' }}>AuthBouncer</span>
            </h1>
            <FaCrown className="text-2xl sm:text-4xl" style={{ color: 'var(--dynamic-secondary-color)' }} />
          </div>
          <p className="text-gray-300 text-base sm:text-lg mb-4">Choose your portal</p>
          
          {/* Secret particle counter */}
          <div 
            className="inline-block cursor-pointer"
            onClick={handleParticleClick}
          >
            <FaGem className="text-lg sm:text-xl hover:opacity-80 transition-opacity duration-200" style={{ color: 'var(--dynamic-secondary-color)' }} />
          </div>
        </div>
      </div>

      {/* Main Cards - Made bigger and more spaced */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {/* User Card */}
          <div
            className={`relative cursor-pointer transition-transform duration-200 ${
              hoveredCard === 'user' ? 'scale-[1.02]' : 'scale-100'
            } ${!isUser ? 'opacity-50 cursor-not-allowed' : ''}`}
            onMouseEnter={() => isUser && setHoveredCard('user')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={handleUserCard}
          >
            <div className="bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-gray-700 hover:border-gray-600 transition-all duration-200 h-full min-h-[400px] flex flex-col justify-center">
              <div className="text-center">
                <div className="mb-6 sm:mb-8">
                  <FaUser className="text-8xl sm:text-9xl mx-auto text-gray-100 mb-4 sm:mb-6" />
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">User Portal</h2>
                </div>
                <p className="text-gray-300 text-lg sm:text-xl mb-6 sm:mb-8">
                  Access your personalized dashboard
                </p>
                <div className="space-y-3 text-gray-400">
                  <div className="flex items-center justify-center space-x-3">
                    <FaStar style={{ color: 'var(--dynamic-secondary-color)' }} className="text-lg" />
                    <span className="text-base sm:text-lg" style={{ color: 'var(--dynamic-secondary-color)' }}>Personal Analytics</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <FaStar style={{ color: 'var(--dynamic-secondary-color)' }} className="text-lg" />
                    <span className="text-base sm:text-lg" style={{ color: 'var(--dynamic-secondary-color)' }}>Account Settings</span>
                  </div>
                </div>
                {!isUser && (
                  <div className="mt-6 p-3 bg-red-900 bg-opacity-20 border border-red-700 rounded-lg">
                    <p className="text-red-300 text-sm">Access Restricted</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Card */}
          <div
            className={`relative cursor-pointer transition-transform duration-200 ${
              hoveredCard === 'admin' ? 'scale-[1.02]' : 'scale-100'
            } ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
            onMouseEnter={() => isAdmin && setHoveredCard('admin')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={handleAdminCard}
          >
            <div className="bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-gray-700 hover:border-gray-600 transition-all duration-200 h-full min-h-[400px] flex flex-col justify-center">
              <div className="text-center">
                <div className="mb-6 sm:mb-8">
                  <FaUserShield className="text-8xl sm:text-9xl mx-auto text-gray-100 mb-4 sm:mb-6" />
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Admin Portal</h2>
                </div>
                <p className="text-gray-300 text-lg sm:text-xl mb-6 sm:mb-8">
                  Manage system and user administration
                </p>
                <div className="space-y-3 text-gray-400">
                  <div className="flex items-center justify-center space-x-3">
                    <FaCrown style={{ color: 'var(--dynamic-secondary-color)' }} className="text-lg" />
                    <span className="text-base sm:text-lg" style={{ color: 'var(--dynamic-secondary-color)' }}>System Management</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <FaCrown style={{ color: 'var(--dynamic-secondary-color)' }} className="text-lg" />
                    <span className="text-base sm:text-lg" style={{ color: 'var(--dynamic-secondary-color)' }}>User Administration</span>
                  </div>
                </div>
                {!isAdmin && (
                  <div className="mt-6 p-3 bg-red-900 bg-opacity-20 border border-red-700 rounded-lg">
                    <p className="text-red-300 text-sm">Access Restricted</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center space-y-4">
          {/* Become Admin Button - Only show if user is not already admin */}
          {isUser && !isAdmin && (
            <div>
              <button
                onClick={handleBecomeAdmin}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{ background: 'var(--dynamic-secondary-color)', color: '#000' }}
              >
                <FaShieldAlt />
                <span>Become an Admin</span>
              </button>
              <p className="text-gray-400 text-sm mt-2">Want admin privileges? Click here to apply</p>
            </div>
          )}
        </div>
      </div>

      {/* Top-right buttons */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex space-x-2">
        <button
          onClick={handleChangePassword}
          className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base flex items-center space-x-1 border border-gray-600 hover:border-gray-500 text-gray-100"
          style={{ background: 'var(--dynamic-secondary-color)', color: '#000' }}
        >
          <FaLock className="text-xs" />
          <span>Change Password</span>
        </button>
        <button
          onClick={logout}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base"
        >
          Logout
        </button>
      </div>
    </div>
  );
} 