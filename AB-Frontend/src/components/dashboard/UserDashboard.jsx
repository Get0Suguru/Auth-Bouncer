import { useState, useEffect } from 'react';
import { FaUser, FaShieldAlt, FaClock, FaCalendarAlt, FaChartLine, FaTrophy, FaStar, FaRocket, FaCrown } from 'react-icons/fa';
import { useAuthContext } from '../../context/AuthContext';

export default function UserDashboard({ onLogout }) {
  const { user, token } = useAuthContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const hour = currentTime.getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    return () => clearInterval(timer);
  }, [currentTime]);

  // Simplified mock data
  const userStats = {
    loginStreak: Math.floor(Math.random() * 30) + 5,
    securityScore: Math.floor(Math.random() * 20) + 80,
    lastLogin: '2 hours ago',
    accountAge: '3 months'
  };

  const achievements = [
    { name: 'First Login', icon: FaStar, earned: true, date: '3 months ago' },
    { name: 'Week Warrior', icon: FaTrophy, earned: true, date: '2 weeks ago' },
    { name: 'Security Master', icon: FaShieldAlt, earned: true, date: '1 week ago' },
    { name: 'Early Bird', icon: FaClock, earned: false, date: 'In Progress' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black overflow-x-hidden">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="rounded-full p-2" style={{ background: 'var(--dynamic-secondary-color)' }}>
                <FaUser className="text-black text-xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{greeting}, Explorer!</h1>
                <p className="text-gray-300 text-sm sm:text-base">Welcome back to your dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs sm:text-sm text-gray-300">Current Time</p>
                <p className="font-mono text-sm sm:text-lg font-bold text-white">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors duration-200 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-2 sm:p-3">
                <FaChartLine className="text-blue-600 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Login Streak</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{userStats.loginStreak} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-2 sm:p-3">
                <FaShieldAlt className="text-green-600 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Security Score</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{userStats.securityScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-lg p-2 sm:p-3">
                <FaClock className="text-purple-600 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Last Login</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{userStats.lastLogin}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-orange-100 rounded-lg p-2 sm:p-3">
                <FaCalendarAlt className="text-orange-600 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Account Age</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{userStats.accountAge}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Achievements */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center mb-4 sm:mb-6">
                <FaTrophy className="text-yellow-500 text-xl sm:text-2xl mr-3" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Achievements</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`flex items-center p-3 sm:p-4 rounded-lg border ${
                    achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`p-2 rounded-lg ${
                      achievement.earned ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <achievement.icon className={`text-base sm:text-lg ${
                        achievement.earned ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                      <h3 className={`font-medium text-sm sm:text-base truncate ${
                        achievement.earned ? 'text-green-900' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{achievement.date}</p>
                    </div>
                    {achievement.earned && (
                      <FaStar className="text-yellow-400 text-base sm:text-lg flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
              <div className="space-y-2 sm:space-y-3">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 sm:p-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base">
                  <FaRocket />
                  <span>Update Profile</span>
                </button>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white p-2 sm:p-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base">
                  <FaShieldAlt />
                  <span>Security Settings</span>
                </button>
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white p-2 sm:p-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base">
                  <FaChartLine />
                  <span>View Analytics</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
              <div className="text-center">
                <FaCrown className="text-3xl sm:text-4xl mx-auto mb-3 sm:mb-4 text-yellow-300" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">Premium Features</h3>
                <p className="text-blue-100 mb-3 sm:mb-4 text-sm sm:text-base">Unlock advanced analytics</p>
                <button className="bg-white text-blue-600 px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 