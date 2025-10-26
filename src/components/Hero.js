import { useEffect, useState } from 'react';
import { initMobileOptimizations } from '../utils/mobileUtils';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Initialize mobile optimizations
    initMobileOptimizations();

    // Enhanced video preloading with better error handling
    const preloadVideo = async () => {
      try {
        const video = document.createElement('video');
        video.src = '/assets/videos/devity_logo.mp4';
        video.preload = 'metadata';
        video.muted = true; // Ensure muted for autoplay

        // Add multiple event listeners for better loading detection
        const handleLoadedData = () => {
          setVideoLoaded(true);
          video.removeEventListener('loadeddata', handleLoadedData);
          video.removeEventListener('canplaythrough', handleLoadedData);
        };

        const handleError = () => {
          setVideoError(true);
          setVideoLoaded(false);
          video.removeEventListener('error', handleError);
        };

        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('canplaythrough', handleLoadedData);
        video.addEventListener('error', handleError);

        // Timeout fallback
        setTimeout(() => {
          if (!videoLoaded && !videoError) {
            setVideoError(true);
          }
        }, 5000);

      } catch (error) {
        console.warn('Video preload failed:', error);
        setVideoError(true);
      }
    };

    preloadVideo();
  }, [videoLoaded, videoError]);

  return (
    <section id="home" className="relative min-h-screen hero-mobile bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-black overflow-hidden transition-colors duration-300">
      {/* Hero background elements - responsive positioning */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-32 h-32 sm:w-70 sm:h-70 bg-blue-400/10 dark:bg-blue-500/20 rounded-full animate-float"></div>
        <div className="absolute top-20 sm:top-40 right-4 sm:right-10 w-28 h-28 sm:w-52 sm:h-52 bg-purple-400/10 dark:bg-purple-500/20 rounded-full animate-float-reverse"></div>
        <div className="absolute -bottom-4 sm:-bottom-8 left-8 sm:left-20 w-24 h-24 sm:w-42 sm:h-42 bg-pink-400/10 dark:bg-pink-500/20 rounded-full animate-float-diagonal"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32 hero-content">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Hero Content */}
          <div className={`text-center lg:text-left ${isVisible ? 'animate-fadeInLeft' : 'opacity-0'}`}>
            <div className="mb-4 sm:mb-6">
              <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-white rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 animate-slideInFromBottom transition-colors duration-300">
                🚀 Welcome to the Future of Tech
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight transition-colors duration-300">
              Welcome to{' '}
              <span className="gradient-text animate-pulse-slow block sm:inline">Devity Club</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-white mb-6 sm:mb-8 leading-relaxed animate-fadeInUp delay-200 font-medium transition-colors duration-300 px-2 sm:px-0">
              Empowering the next generation of tech innovators through community,
              learning, and collaboration. Join us in shaping the future of technology.
            </p>



            {/* Stats - Mobile optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12 animate-fadeInUp delay-600 px-4 sm:px-0">
              <div className="text-center bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-3 lg:p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">25+</div>
                <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-semibold transition-colors duration-300">Active Team Members</div>
              </div>
              <div className="text-center bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-3 lg:p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">7+</div>
                <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-semibold transition-colors duration-300">Events</div>
              </div>
              <div className="text-center bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-3 lg:p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">10+</div>
                <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-semibold transition-colors duration-300">Research Paper & Projects</div>
              </div>
            </div>
          </div>

          {/* Hero Visual - Mobile responsive */}
          <div className={`flex justify-center lg:justify-end mt-8 lg:mt-0 ${isVisible ? 'animate-fadeInRight delay-300' : 'opacity-0'}`}>
            <div className="relative">
              {/* Main circle with video logo - responsive sizing */}
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full flex items-center justify-center shadow-2xl hover-scale overflow-hidden relative p-2 sm:p-3 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600">
                {/* Video container filling most of the circle */}
                <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
                  {/* Loading placeholder */}
                  {!videoLoaded && !videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-blue-600 font-semibold">Loading...</p>
                      </div>
                    </div>
                  )}

                  {/* Video Logo */}
                  <video
                    className={`w-full h-full object-contain transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    style={{
                      filter: 'contrast(1.2) brightness(1.1) saturate(1.3)',
                    }}
                    onLoadedData={() => setVideoLoaded(true)}
                    onError={() => {
                      setVideoError(true);
                      setVideoLoaded(false);
                    }}
                  >
                    <source src="/assets/videos/devity_logo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Fallback content if video doesn't load */}
                  <div className={`text-center text-gray-800 transition-opacity duration-500 ${videoError ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${videoError ? 'block' : 'absolute inset-0 flex items-center justify-center'}`}>
                    <div className="animate-rotateIn delay-500">
                      <svg className="w-32 h-32 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                        <path d="M12 7L8.5 10.5l1.5 1.5L12 10l4-4-1.5-1.5L12 7z" fill="currentColor" opacity="0.9" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Devity Club</h3>
                    <p className="text-blue-600 text-sm">Tech Innovation</p>
                  </div>
                </div>
              </div>

              {/* Floating elements with enhanced animations - mobile responsive */}
              <div className="absolute -top-3 sm:-top-6 -right-3 sm:-right-6 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl animate-float hover-rotate border-2 border-white/20">
                <span className="text-lg sm:text-2xl lg:text-3xl drop-shadow-lg">💡</span>
              </div>

              <div className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-float delay-200 hover-rotate border-2 border-white/20">
                <span className="text-lg sm:text-2xl lg:text-3xl drop-shadow-lg">🚀</span>
              </div>

              <div className="absolute top-1/2 -left-4 sm:-left-6 lg:-left-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-xl animate-float delay-400 hover-rotate border-2 border-white/20">
                <span className="text-sm sm:text-lg lg:text-2xl drop-shadow-lg">⚡</span>
              </div>

              <div className="absolute top-1/4 -right-2 sm:-right-3 lg:-right-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl animate-float delay-600 hover-rotate border-2 border-white/20">
                <span className="text-xs sm:text-sm lg:text-xl drop-shadow-lg">🔥</span>
              </div>

              {/* Orbiting elements - mobile responsive */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                <div className="absolute -top-1 sm:-top-2 left-1/2 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-blue-500 rounded-full transform -translate-x-1/2 shadow-lg"></div>
              </div>

              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                <div className="absolute top-1/2 -right-1 sm:-right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-purple-500 rounded-full transform -translate-y-1/2 shadow-lg"></div>
              </div>

              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '25s' }}>
                <div className="absolute bottom-2 sm:bottom-4 left-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - mobile responsive */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-fadeInUp delay-1000">
          <div className="flex flex-col items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <span className="text-xs sm:text-sm mb-1 sm:mb-2 font-semibold">Scroll to explore</span>
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-gray-700 dark:border-gray-400 rounded-full flex justify-center transition-colors duration-300">
              <div className="w-0.5 h-2 sm:w-1 sm:h-3 bg-gray-700 dark:bg-gray-400 rounded-full mt-1.5 sm:mt-2 animate-bounce transition-colors duration-300"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;