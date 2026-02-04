import React from 'react';

const FastLoadingSkeleton = ({ progress = 0, currentStep = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      {/* Minimal loading indicator */}
      <div className="text-center">
        {/* Simple spinner */}
        <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {currentStep}
          </p>
          <p className="text-sm text-blue-500 font-medium">
            {progress}%
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4 overflow-hidden">
          <div 
            className="bg-blue-500 h-full rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FastLoadingSkeleton;