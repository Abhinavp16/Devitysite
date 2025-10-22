import { useEffect, useState } from 'react';
import { HeroAnimatedBackground } from './AnimatedBackground';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-hidden transition-colors duration-300">
      <HeroAnimatedBackground />
      {/* Hero background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-70 h-70 bg-blue-400 rounded-full mix-blend-multiply opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-52 h-52 bg-purple-400 rounded-full mix-blend-multiply opacity-20 animate-float-reverse"></div>
        <div className="absolute -bottom-8 left-20 w-42 h-42 bg-pink-400 rounded-full mix-blend-multiply opacity-20 animate-float-diagonal"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className={`text-center lg:text-left ${isVisible ? 'animate-fadeInLeft' : 'opacity-0'}`}>
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-bold mb-4 animate-slideInFromBottom transition-colors duration-300">
                🚀 Welcome to the Future of Tech
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight transition-colors duration-300">
              Welcome to{' '}
              <span className="gradient-text animate-pulse-slow">Devity Club</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-900 dark:text-gray-300 mb-8 leading-relaxed animate-fadeInUp delay-200 font-medium transition-colors duration-300">
              Empowering the next generation of tech innovators through community,
              learning, and collaboration. Join us in shaping the future of technology.
            </p>



            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 animate-fadeInUp delay-600">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">25+</div>
                <div className="text-gray-900 dark:text-gray-300 text-sm font-semibold transition-colors duration-300">Active Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">30+</div>
                <div className="text-gray-900 dark:text-gray-300 text-sm font-semibold transition-colors duration-300">Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">10+</div>
                <div className="text-gray-900 dark:text-gray-300 text-sm font-semibold transition-colors duration-300">Research Paper & Projects</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className={`flex justify-center lg:justify-end ${isVisible ? 'animate-fadeInRight delay-300' : 'opacity-0'}`}>
            <div className="relative">
              {/* Main circle with video logo */}
              <div className="w-96 h-96 rounded-full flex items-center justify-center shadow-2xl hover-scale overflow-hidden relative p-3 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600">
                {/* Video container filling most of the circle */}
                <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
                  {/* Video Logo */}
                  <video
                    className="w-full h-full object-contain"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      filter: 'contrast(1.2) brightness(1.1) saturate(1.3)',
                    }}
                    onError={(e) => {
                      // Fallback to text if video fails to load
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  >
                    <source src="/assets/videos/devity_logo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Fallback content if video doesn't load */}
                  <div className="text-center text-white hidden">
                    <div className="animate-rotateIn delay-500">
                      <svg className="w-32 h-32 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                        <path d="M12 7L8.5 10.5l1.5 1.5L12 10l4-4-1.5-1.5L12 7z" fill="white" opacity="0.9" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Devity Club</h3>
                    <p className="text-blue-100 text-sm">Tech Innovation</p>
                  </div>
                </div>
              </div>

              {/* Floating elements with enhanced animations */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl animate-float hover-rotate border-2 border-white/20">
                <span className="text-3xl drop-shadow-lg">💡</span>
              </div>

              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-float delay-200 hover-rotate border-2 border-white/20">
                <span className="text-3xl drop-shadow-lg">🚀</span>
              </div>

              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-xl animate-float delay-400 hover-rotate border-2 border-white/20">
                <span className="text-2xl drop-shadow-lg">⚡</span>
              </div>

              <div className="absolute top-1/4 -right-4 w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl animate-float delay-600 hover-rotate border-2 border-white/20">
                <span className="text-xl drop-shadow-lg">🔥</span>
              </div>

              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                <div className="absolute -top-2 left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 shadow-lg"></div>
              </div>

              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                <div className="absolute top-1/2 -right-2 w-3 h-3 bg-purple-500 rounded-full transform -translate-y-1/2 shadow-lg"></div>
              </div>

              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '25s' }}>
                <div className="absolute bottom-4 left-1/4 w-2 h-2 bg-pink-500 rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fadeInUp delay-1000">
          <div className="flex flex-col items-center text-gray-800 dark:text-gray-300 transition-colors duration-300">
            <span className="text-sm mb-2 font-semibold">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-700 dark:border-gray-400 rounded-full flex justify-center transition-colors duration-300">
              <div className="w-1 h-3 bg-gray-800 dark:bg-gray-400 rounded-full mt-2 animate-bounce transition-colors duration-300"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;