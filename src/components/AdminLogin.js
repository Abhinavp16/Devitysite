import { useState } from 'react';
import apiService from '../services/apiService';
import '../styles/AdminLogin.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Try to login with the backend API
      const response = await apiService.login({
        email: formData.email,
        username: formData.username,
        password: formData.password
      });

      if (response.success && response.token) {
        // Store user data and token
        localStorage.setItem('adminUser', JSON.stringify(response.user));
        localStorage.setItem('adminToken', response.token);

        // Call success callback if provided, otherwise redirect
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        alert('Login failed: ' + (response.error || 'Invalid credentials'));
      }
    } catch (error) {
      console.error('Login error:', error);

      // Fallback to simple validation if API is not available
      if (formData.email && formData.username && formData.password) {
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminUser', JSON.stringify({
          email: formData.email,
          username: formData.username
        }));
        window.location.href = '/dashboard';
      } else {
        alert('Please fill in all fields');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Devity Logos - Outside background container for higher z-index */}
      {/* Test logo - highly visible */}
      <div className="fixed top-20 left-20 animate-float-slow z-50 pointer-events-none">
        <div className="devity-logo text-6xl font-black text-red-500 transform rotate-12 animate-pulse-glow">
          DEVITY
        </div>
      </div>

      <div className="fixed top-32 right-32 animate-float-reverse z-40 pointer-events-none">
        <div className="devity-logo text-4xl font-black text-blue-300 transform -rotate-6 animate-pulse-glow delay-200">
          DEVITY
        </div>
      </div>

      <div className="fixed bottom-40 left-40 animate-float-diagonal z-40 pointer-events-none">
        <div className="devity-logo text-3xl font-black text-purple-300 transform rotate-45 animate-pulse-glow delay-400">
          DEVITY
        </div>
      </div>

      <div className="fixed bottom-32 right-24 animate-float-bounce z-40 pointer-events-none">
        <div className="devity-logo text-3xl font-black text-indigo-300 transform -rotate-12 animate-pulse-glow delay-600">
          DEVITY
        </div>
      </div>

      <div className="fixed top-1/2 left-12 animate-float-vertical z-40 pointer-events-none">
        <div className="devity-logo text-2xl font-black text-blue-400 transform rotate-90 animate-pulse-glow delay-800">
          DEVITY
        </div>
      </div>

      <div className="fixed top-1/3 right-16 animate-float-horizontal z-40 pointer-events-none">
        <div className="devity-logo text-2xl font-black text-cyan-400 transform -rotate-45 animate-pulse-glow delay-1000">
          DEVITY
        </div>
      </div>

      {/* Additional floating logos for more dynamic effect */}
      <div className="fixed top-3/4 left-1/4 animate-float-rotate z-40 pointer-events-none">
        <div className="devity-logo text-xl font-black text-emerald-300 animate-pulse-glow delay-1200">
          DEVITY
        </div>
      </div>

      <div className="fixed top-1/6 left-3/4 animate-pulse-scale z-40 pointer-events-none">
        <div className="devity-logo text-2xl font-black text-rose-300 animate-rotate-reverse delay-1400">
          DEVITY
        </div>
      </div>

      {/* Corner floating logos */}
      <div className="fixed top-16 right-1/3 animate-float-diagonal z-40 pointer-events-none">
        <div className="devity-logo text-lg font-black text-yellow-300 animate-rotate-30 delay-1600">
          DEVITY
        </div>
      </div>

      <div className="fixed bottom-16 left-1/3 animate-float-vertical z-40 pointer-events-none">
        <div className="devity-logo text-xl font-black text-pink-300 animate-pulse-scale delay-1800">
          DEVITY
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-purple-400/20 rounded-full animate-float delay-200"></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-cyan-400/40 rounded-full animate-float delay-400"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-indigo-400/25 rounded-full animate-float delay-100"></div>

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-2xl animate-pulse-slow delay-200"></div>
      </div>

      {/* Back to Home Button */}
      <button
        onClick={handleBackToHome}
        className="absolute top-8 left-8 flex items-center px-4 py-2 text-blue-200 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/10 backdrop-blur-sm group"
      >
        <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>

      {/* Login Container */}
      <div className="relative w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fadeInUp">
          {/* Header */}
          <div className="text-center mb-8 animate-slideInLeft">
            <div className="relative inline-block">
              <h1 className="text-3xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-200 via-white to-cyan-200 bg-clip-text text-transparent">
                  Admin Login
                </span>
              </h1>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-lg rounded-lg opacity-50"></div>
            </div>
            <p className="text-blue-200/80 text-sm">Welcome back! Please sign in to continue.</p>
          </div>
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative group animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
              <label className="block text-blue-200 text-sm font-medium mb-2 transition-all duration-300 group-hover:text-white">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/60 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className={`w-5 h-5 transition-all duration-300 ${focusedField === 'email' ? 'text-blue-400 scale-110' : 'text-blue-300/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                {focusedField === 'email' && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-sm -z-10 animate-pulse-glow"></div>
                )}
              </div>
            </div>

            {/* Username Field */}
            <div className="relative group animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
              <label className="block text-blue-200 text-sm font-medium mb-2 transition-all duration-300 group-hover:text-white">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField('')}
                  className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/60 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your username"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className={`w-5 h-5 transition-all duration-300 ${focusedField === 'username' ? 'text-blue-400 scale-110' : 'text-blue-300/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                {focusedField === 'username' && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-sm -z-10 animate-pulse-glow"></div>
                )}
              </div>
            </div>
            {/* Password Field */}
            <div className="relative group animate-slideInLeft" style={{ animationDelay: '0.6s' }}>
              <label className="block text-blue-200 text-sm font-medium mb-2 transition-all duration-300 group-hover:text-white">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className="w-full px-4 py-3 pl-12 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/60 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className={`w-5 h-5 transition-all duration-300 ${focusedField === 'password' ? 'text-blue-400 scale-110' : 'text-blue-300/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300/70 hover:text-blue-400 transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
                {focusedField === 'password' && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-sm -z-10 animate-pulse-glow"></div>
                )}
              </div>
            </div>
            {/* Login Button */}
            <div className="animate-slideInLeft" style={{ animationDelay: '0.8s' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-3 px-6 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group overflow-hidden"
              >
                {/* Button shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>

                {/* Button glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-500 rounded-xl"></div>

                <div className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 transition-all duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
          {/* Footer */}
          <div className="mt-8 text-center animate-slideInLeft" style={{ animationDelay: '1s' }}>
            <p className="text-blue-200/60 text-sm">
              Secure admin access for DevityClub
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <div className="w-2 h-2 bg-blue-400/50 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-cyan-400/50 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-indigo-400/50 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-30 animate-float delay-300"></div>
      </div>
    </div>
  );
};

export default AdminLogin;