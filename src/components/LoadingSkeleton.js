import React from 'react';

const LoadingSkeleton = ({ progress = 0, currentStep = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-start pt-2 sm:pt-4 md:pt-6">
        <div className="relative w-[98%] sm:w-[95%] max-w-7xl rounded-2xl border border-white/20 shadow-2xl bg-gradient-to-r from-blue-600/90 via-blue-700/90 to-blue-800/90 backdrop-blur-lg py-2 sm:py-3">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              {/* Logo Skeleton */}
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full animate-pulse"></div>
                <div className="ml-2 sm:ml-3">
                  <div className="w-32 h-6 sm:h-8 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
              
              {/* Desktop Nav Skeleton */}
              <div className="hidden md:flex space-x-1 lg:space-x-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-16 lg:w-20 h-8 lg:h-10 bg-white/20 rounded-xl animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
              
              {/* Mobile buttons skeleton */}
              <div className="md:hidden flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-xl animate-pulse"></div>
                <div className="w-8 h-8 bg-white/20 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Main title skeleton */}
          <div className="space-y-4 mb-8">
            <div className="w-80 h-12 sm:h-16 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-lg mx-auto animate-pulse"></div>
            <div className="w-96 h-8 sm:h-12 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-lg mx-auto animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          {/* Subtitle skeleton */}
          <div className="space-y-3 mb-12">
            <div className="w-full max-w-2xl h-6 bg-gray-300/30 dark:bg-gray-600/30 rounded mx-auto animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <div className="w-3/4 h-6 bg-gray-300/30 dark:bg-gray-600/30 rounded mx-auto animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          </div>
          
          {/* CTA buttons skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="w-40 h-12 bg-gradient-to-r from-blue-500/40 to-purple-500/40 rounded-xl animate-pulse"></div>
            <div className="w-40 h-12 bg-white/20 border border-white/30 rounded-xl animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="relative">
        {/* Animated background for content sections */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-gray-800/50 dark:via-gray-900/30 dark:to-gray-800/50">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-300/20 dark:bg-blue-400/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 space-y-20 py-20">
          {/* About Section Skeleton */}
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="w-48 h-12 bg-gradient-to-r from-blue-300/40 to-purple-300/40 rounded-lg mx-auto mb-4 animate-pulse"></div>
              <div className="w-96 h-6 bg-gray-300/30 dark:bg-gray-600/30 rounded mx-auto animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-full h-4 bg-gray-300/30 dark:bg-gray-600/30 rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
                <div className="w-3/4 h-4 bg-gray-300/30 dark:bg-gray-600/30 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <div className="w-full h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-2xl animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </div>

          {/* Events Section Skeleton */}
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="w-40 h-12 bg-gradient-to-r from-purple-300/40 to-pink-300/40 rounded-lg mx-auto mb-4 animate-pulse"></div>
              <div className="w-80 h-6 bg-gray-300/30 dark:bg-gray-600/30 rounded mx-auto animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-full h-48 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-xl mb-4"></div>
                  <div className="w-3/4 h-6 bg-gray-300/30 dark:bg-gray-600/30 rounded mb-2"></div>
                  <div className="w-full h-4 bg-gray-300/20 dark:bg-gray-600/20 rounded mb-1"></div>
                  <div className="w-2/3 h-4 bg-gray-300/20 dark:bg-gray-600/20 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section Skeleton */}
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="w-32 h-12 bg-gradient-to-r from-green-300/40 to-blue-300/40 rounded-lg mx-auto mb-4 animate-pulse"></div>
              <div className="w-72 h-6 bg-gray-300/30 dark:bg-gray-600/30 rounded mx-auto animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="text-center animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full mx-auto mb-4"></div>
                  <div className="w-24 h-5 bg-gray-300/30 dark:bg-gray-600/30 rounded mx-auto mb-2"></div>
                  <div className="w-20 h-4 bg-gray-300/20 dark:bg-gray-600/20 rounded mx-auto"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section Skeleton */}
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="w-44 h-12 bg-gradient-to-r from-pink-300/40 to-red-300/40 rounded-lg mx-auto mb-4 animate-pulse"></div>
              <div className="w-64 h-6 bg-gray-300/30 dark:bg-gray-600/30 rounded mx-auto animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="w-20 h-4 bg-gray-300/30 dark:bg-gray-600/30 rounded mb-2"></div>
                      <div className="w-full h-10 bg-gray-300/20 dark:bg-gray-600/20 rounded-lg"></div>
                    </div>
                  ))}
                </div>
                <div className="animate-pulse" style={{ animationDelay: '0.4s' }}>
                  <div className="w-24 h-4 bg-gray-300/30 dark:bg-gray-600/30 rounded mb-2"></div>
                  <div className="w-full h-32 bg-gray-300/20 dark:bg-gray-600/20 rounded-lg"></div>
                </div>
              </div>
              <div className="mt-6">
                <div className="w-32 h-12 bg-gradient-to-r from-blue-500/40 to-purple-500/40 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-24 h-6 bg-gray-300/30 dark:bg-gray-600/30 rounded mb-4"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="w-20 h-4 bg-gray-300/20 dark:bg-gray-600/20 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <div className="w-64 h-4 bg-gray-300/20 dark:bg-gray-600/20 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Loading Progress Indicator */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {/* Outer spinning ring */}
              <div className="w-12 h-12 border-2 border-blue-300/30 border-t-blue-500 rounded-full animate-spin"></div>
              
              {/* Inner progress ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${(progress / 100) * 62.83} 62.83`}
                    className="text-blue-400 transition-all duration-500"
                  />
                </svg>
              </div>
              
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="text-left">
              <div className="text-sm text-blue-100 font-medium mb-1">
                {currentStep}
              </div>
              <div className="text-xs text-blue-200/70">
                {progress}% Complete
              </div>
              
              {/* Progress bar */}
              <div className="w-32 bg-blue-900/30 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles for premium feel */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;