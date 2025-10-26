import React from 'react';

const LoadingIndicator = ({ 
  isLoading, 
  progress = 0, 
  message = "Loading...", 
  showProgress = true,
  className = "",
  size = "md" 
}) => {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-4"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Spinner */}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-gray-300 border-t-blue-500 rounded-full animate-spin`}></div>
        
        {/* Progress ring overlay */}
        {showProgress && progress > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className={`${sizeClasses[size]} transform -rotate-90`} viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${(progress / 100) * 62.83} 62.83`}
                className="text-blue-500 transition-all duration-300"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Loading message */}
      <div className="text-center">
        <p className={`text-gray-600 dark:text-gray-400 font-medium ${textSizeClasses[size]}`}>
          {message}
        </p>
        
        {/* Progress percentage */}
        {showProgress && progress > 0 && (
          <p className={`text-blue-500 font-semibold mt-1 ${textSizeClasses[size]}`}>
            {Math.round(progress)}%
          </p>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default LoadingIndicator;