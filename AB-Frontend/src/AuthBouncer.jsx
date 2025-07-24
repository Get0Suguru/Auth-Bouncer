import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaDiscord } from 'react-icons/fa'
import { RiShieldUserFill } from 'react-icons/ri'

export default function AuthBouncer({ isLogin = true }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    remember: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Your backend security magic happens here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 flex">
      {/* Left Creative Side */}
      <div className="hidden md:flex flex-col w-1/2 p-12 justify-between bg-[url('https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2232&auto=format&fit=crop')] bg-cover bg-center">
        <div className="flex items-center">
          <RiShieldUserFill className="text-4xl text-orange-500 mr-3" />
          <h1 className="text-3xl font-bold">
            <span className="text-white">Auth</span>
            <span className="text-orange-500">Bouncer</span>
          </h1>
        </div>

        <div className="space-y-6">
          <h2 className="text-5xl font-bold leading-tight">
            Your Ultimate <br />
            <span className="text-orange-500">Security</span> Gateway
          </h2>
          <p className="text-gray-300 text-lg max-w-md">
            Industry-leading authentication with military-grade encryption and 
            zero-trust architecture. Sleep well knowing your data is protected.
          </p>
        </div>

        <div className="flex space-x-4">
          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
          </div>
          <div>
            <p className="text-sm text-gray-400">Active Protection</p>
            <p className="font-medium">24/7 Threat Monitoring</p>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center md:hidden mb-10">
            <RiShieldUserFill className="text-4xl text-orange-500 mx-auto mb-2" />
            <h1 className="text-3xl font-bold">
              <span className="text-white">Auth</span>
              <span className="text-orange-500">Bouncer</span>
            </h1>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Club'}
            </h2>
            <p className="text-gray-400">
              {isLogin ? 'Secure login to your account' : 'Get started with the most secure auth system'}
            </p>
          </div>

          {/* OAuth Providers */}
          <div className="space-y-4 mb-8">
            <button className="w-full flex items-center justify-center space-x-3 bg-gray-800 hover:bg-gray-700 py-3 px-4 rounded-lg transition-all">
              <FcGoogle className="text-xl" />
              <span>Continue with Google</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-3 bg-gray-800 hover:bg-gray-700 py-3 px-4 rounded-lg transition-all">
              <FaGithub className="text-xl" />
              <span>Continue with GitHub</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-3 bg-gray-800 hover:bg-gray-700 py-3 px-4 rounded-lg transition-all">
              <FaDiscord className="text-xl text-indigo-400" />
              <span>Continue with Discord</span>
            </button>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your username"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm">
                  Remember me
                </label>
              </div>

              {isLogin && (
                <Link to="/forgot-password" className="text-sm text-orange-500 hover:underline">
                  Forgot password?
                </Link>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {isLogin ? 'Secure Login' : 'Get Secured Access'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="text-orange-500 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-orange-500 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our <br />
              <a href="#" className="text-orange-500 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}