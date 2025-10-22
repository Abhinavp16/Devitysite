import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-110 hover:-translate-y-0.5 group overflow-hidden shadow-lg hover:shadow-2xl"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/30 to-yellow-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-xl"></div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
      
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500 rounded-xl"></div>
      
      {/* Icon container */}
      <div className="relative z-10 w-6 h-6 flex items-center justify-center">
        {/* Sun Icon (Light Mode) */}
        <svg
          className={`absolute w-6 h-6 text-yellow-300 transition-all duration-500 transform ${
            isDarkMode 
              ? 'rotate-180 scale-0 opacity-0' 
              : 'rotate-0 scale-100 opacity-100'
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
        
        {/* Moon Icon (Dark Mode) */}
        <svg
          className={`absolute w-6 h-6 text-blue-300 transition-all duration-500 transform ${
            isDarkMode 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-180 scale-0 opacity-0'
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
        </svg>
      </div>
      
      {/* Floating particles */}
      <div className="absolute top-1 right-1 w-1 h-1 bg-yellow-300/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
      <div className="absolute bottom-1 left-1 w-1 h-1 bg-blue-300/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" style={{ animationDelay: '0.2s' }}></div>
    </button>
  );
};

export default ThemeToggle;