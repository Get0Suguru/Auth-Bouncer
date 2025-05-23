import { useState, useEffect } from 'react';
import { FaUserShield, FaUsers, FaChartBar, FaShieldAlt, FaBell, FaExclamationTriangle, FaCheckCircle, FaClock, FaDatabase, FaServer } from 'react-icons/fa';
import { useAuthContext } from '../../context/AuthContext';

export default function AdminDashboard({ onLogout }) {
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
  const systemStats = {
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    activeUsers: Math.floor(Math.random() * 100) + 50,
    securityAlerts: Math.floor(Math.random() * 5),
    systemUptime: '99.9%'
  };

  const recentActivities = [
    { type: 'user_registered', message: 'New user registered: john_doe', time: '2 minutes ago', status: 'success' },
    { type: 'login_attempt', message: 'Failed login attempt detected', time: '5 minutes ago', status: 'warning' },
    { type: 'system_update', message: 'System backup completed', time: '10 minutes ago', status: 'success' },
    { type: 'security_alert', message: 'Suspicious activity detected', time: '15 minutes ago', status: 'error' }
  ];

  const quickActions = [
    { name: 'User Management', icon: FaUsers, color: 'blue', count: systemStats.totalUsers },
    { name: 'Security Center', icon: FaShieldAlt, color: 'red', count: systemStats.securityAlerts },
    { name: 'System Analytics', icon: FaChartBar, color: 'green', count: systemStats.activeUsers },
    { name: 'Database Status', icon: FaDatabase, color: 'purple', count: 'Online' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black overflow-x-hidden">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="rounded-full p-2" style={{ background: 'var(--dynamic-secondary-color)' }}>
                <FaUserShield className="text-black text-xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{greeting}, Administrator!</h1>
                <p className="text-gray-300 text-sm sm:text-base">System overview and management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs sm:text-sm text-gray-300">System Time</p>
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
        {/* System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="rounded-lg p-2 sm:p-3" style={{ background: 'var(--dynamic-secondary-color)' }}>
                <FaUsers className="text-black text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-300">Total Users</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{systemStats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="rounded-lg p-2 sm:p-3" style={{ background: 'var(--dynamic-secondary-color)' }}>
                <FaChartBar className="text-black text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-300">Active Users</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{systemStats.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="rounded-lg p-2 sm:p-3" style={{ background: 'var(--dynamic-secondary-color)' }}>
                <FaExclamationTriangle className="text-black text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-300">Security Alerts</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{systemStats.securityAlerts}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="rounded-lg p-2 sm:p-3" style={{ background: 'var(--dynamic-secondary-color)' }}>
                <FaServer className="text-black text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-300">System Uptime</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{systemStats.systemUptime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center mb-4 sm:mb-6">
                <FaBell className="text-purple-500 text-xl sm:text-2xl mr-3" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Activities</h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center p-3 sm:p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                    <div className={`p-2 rounded-lg ${
                      activity.status === 'success' ? 'bg-green-100' :
                      activity.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {activity.status === 'success' ? (
                        <FaCheckCircle className="text-green-600" />
                      ) : activity.status === 'warning' ? (
                        <FaExclamationTriangle className="text-yellow-600" />
                      ) : (
                        <FaExclamationTriangle className="text-red-600" />
                      )}
                    </div>
                    <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{activity.message}</p>
                      <p className="text-xs sm:text-sm text-gray-500 flex items-center">
                        <FaClock className="mr-1" />
                        {activity.time}
                      </p>
                    </div>
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
                {quickActions.map((action, index) => (
                  <button key={index} className="w-full bg-gray-50 hover:bg-gray-100 p-3 sm:p-4 rounded-lg transition-colors duration-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`bg-${action.color}-100 rounded-lg p-2`}>
                        <action.icon className={`text-${action.color}-600`} />
                      </div>
                      <span className="font-medium text-gray-900 text-sm sm:text-base">{action.name}</span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">{action.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 sm:p-6 text-white">
              <div className="text-center">
                <FaServer className="text-3xl sm:text-4xl mx-auto mb-3 sm:mb-4 text-yellow-300" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">System Health</h3>
                <p className="text-purple-100 mb-3 sm:mb-4 text-sm sm:text-base">All systems operational</p>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-xs sm:text-sm">Last check: {currentTime.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 