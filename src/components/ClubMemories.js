import { ClubMemoriesAnimatedBackground } from './AnimatedBackground';
import { useState, useEffect, useCallback } from 'react';

// Import Code Fusion images
import codeFusion1 from '../img/club memoriess/Code Fusion/20250204_115212AMByGPSMapCamera.jpg';
import codeFusion2 from '../img/club memoriess/Code Fusion/IMG_20250204_120411.jpg';
import codeFusion3 from '../img/club memoriess/Code Fusion/IMG_20250204_123156.jpg';
import codeFusion4 from '../img/club memoriess/Code Fusion/IMG_2628.JPG';
import codeFusion5 from '../img/club memoriess/Code Fusion/IMG_2637.JPG';

// Import Envision X images
import envisionX1 from '../img/club memoriess/Envision X/20250325_100831AMByGPSMapCamera.jpg';
import envisionX2 from '../img/club memoriess/Envision X/20250325_101709AMByGPSMapCamera.jpg';
import envisionX3 from '../img/club memoriess/Envision X/IMG20250325112216.jpg';
import envisionX4 from '../img/club memoriess/Envision X/IMG20250325112652.jpg';
import envisionX5 from '../img/club memoriess/Envision X/IMG20250325113648.jpg';

// Import Jumpstart Event images
import jumpstart1 from '../img/club memoriess/Jumpstart Event/ASET GUEST TALK (1)~2.jpg';
import jumpstart2 from '../img/club memoriess/Jumpstart Event/ASET GUEST TALK (10).jpg';
import jumpstart3 from '../img/club memoriess/Jumpstart Event/ASET GUEST TALK (11).jpg';
import jumpstart4 from '../img/club memoriess/Jumpstart Event/ASET GUEST TALK (12).jpg';
import jumpstart5 from '../img/club memoriess/Jumpstart Event/ASET GUEST TALK (13).jpg';

// Import Net Secure images
import netSecure1 from '../img/club memoriess/Net Secure/07.jpg';
import netSecure2 from '../img/club memoriess/Net Secure/08.jpg';
import netSecure3 from '../img/club memoriess/Net Secure/09.jpg';
import netSecure4 from '../img/club memoriess/Net Secure/WhatsApp Image 2025-01-20 at 14.14.47_a31b2d7c.jpg';
import netSecure5 from '../img/club memoriess/Net Secure/WhatsApp Image 2025-01-20 at 14.14.48_03be790d.jpg';

// Import NetCamp images
import netCamp1 from '../img/club memoriess/NetCamp/WhatsApp Image 2025-08-04 at 11.52.14_13006d7d.jpg';
import netCamp2 from '../img/club memoriess/NetCamp/WhatsApp Image 2025-08-04 at 11.52.15_3fb0f760.jpg';
import netCamp3 from '../img/club memoriess/NetCamp/WhatsApp Image 2025-08-04 at 17.46.47_ac721afb.jpg';
import netCamp4 from '../img/club memoriess/NetCamp/WhatsApp Image 2025-08-04 at 17.46.48_52086ce2.jpg';
import netCamp5 from '../img/club memoriess/NetCamp/WhatsApp Image 2025-08-05 at 10.03.16_0659c366.jpg';

const ClubMemories = () => {
  const [activeSection, setActiveSection] = useState('Code Fusion');
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const memorySections = {
    'Code Fusion': {
      title: 'Code Fusion',
      description: 'Competitive programming and coding challenges',
      gradient: 'from-red-500 to-pink-600',
      bgGradient: 'from-red-50 via-white to-pink-50',
      images: [
        { src: codeFusion1, title: 'Opening Ceremony' },
        { src: codeFusion2, title: 'Coding Session' },
        { src: codeFusion3, title: 'Team Collaboration' },
        { src: codeFusion4, title: 'Problem Solving' },
        { src: codeFusion5, title: 'Award Ceremony' }
      ]
    },
    'Envision X': {
      title: 'Envision X',
      description: 'Innovation showcase and project presentations',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 via-white to-indigo-50',
      images: [
        { src: envisionX1, title: 'Project Setup' },
        { src: envisionX2, title: 'Innovation Display' },
        { src: envisionX3, title: 'Team Presentations' },
        { src: envisionX4, title: 'Audience Engagement' },
        { src: envisionX5, title: 'Networking Session' }
      ]
    },
    'Jumpstart Event': {
      title: 'Jumpstart Event',
      description: 'Guest talks and industry insights',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 via-white to-emerald-50',
      images: [
        { src: jumpstart1, title: 'Guest Speaker' },
        { src: jumpstart2, title: 'Interactive Session' },
        { src: jumpstart3, title: 'Knowledge Sharing' },
        { src: jumpstart4, title: 'Networking Break' },
        { src: jumpstart5, title: 'Group Discussion' }
      ]
    },
    'Net Secure': {
      title: 'Net Secure',
      description: 'Cybersecurity workshops and awareness sessions',
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 via-white to-violet-50',
      images: [
        { src: netSecure1, title: 'Security Workshop' },
        { src: netSecure2, title: 'Hands-on Training' },
        { src: netSecure3, title: 'Ethical Hacking Demo' },
        { src: netSecure4, title: 'Team Collaboration' },
        { src: netSecure5, title: 'Security Awareness' }
      ]
    },
    'NetCamp': {
      title: 'NetCamp',
      description: 'Networking bootcamp and skill development',
      gradient: 'from-orange-500 to-amber-600',
      bgGradient: 'from-orange-50 via-white to-amber-50',
      images: [
        { src: netCamp1, title: 'Bootcamp Opening' },
        { src: netCamp2, title: 'Skill Development' },
        { src: netCamp3, title: 'Practical Sessions' },
        { src: netCamp4, title: 'Team Projects' },
        { src: netCamp5, title: 'Final Presentations' }
      ]
    }
  };

  const getSectionColor = (sectionName) => {
    return memorySections[sectionName]?.gradient || 'from-gray-500 to-gray-600';
  };

  // Preload images for faster switching
  useEffect(() => {
    const preloadImages = () => {
      Object.keys(memorySections).forEach(sectionName => {
        memorySections[sectionName].images.forEach((image, index) => {
          const img = new Image();
          img.onload = () => {
            setImagesLoaded(prev => ({
              ...prev,
              [`${sectionName}-${index}`]: true
            }));
          };
          img.src = image.src;
        });
      });
    };

    preloadImages();
  }, []);

  // Handle section change with smooth transition
  const handleSectionChange = useCallback((sectionName) => {
    if (sectionName === activeSection) return;

    setIsTransitioning(true);

    // Small delay to allow transition effect
    setTimeout(() => {
      setActiveSection(sectionName);
      setIsTransitioning(false);
    }, 150);
  }, [activeSection]);

  return (
    <section id="memories" className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      <ClubMemoriesAnimatedBackground />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-cyan-400/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-pink-400/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
            Club Memories
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
            Capturing moments of innovation, learning, and friendship that define our journey together.
          </p>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(memorySections).map((sectionName) => (
            <button
              key={sectionName}
              onClick={() => handleSectionChange(sectionName)}
              disabled={isTransitioning}
              className={`relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group overflow-hidden ${activeSection === sectionName
                ? `bg-gradient-to-r ${getSectionColor(sectionName)} text-white shadow-xl`
                : 'bg-gray-800/50 text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-600/50'
                } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

              {/* Button glow */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${getSectionColor(sectionName)} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500 rounded-2xl`}></div>

              <span className="relative z-10">{sectionName}</span>
            </button>
          ))}
        </div>

        {/* Active Section Content */}
        <div className={`mb-8 transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="text-center mb-8">
            <h3 className={`text-3xl font-bold bg-gradient-to-r ${getSectionColor(activeSection)} bg-clip-text text-transparent mb-3`}>
              {memorySections[activeSection].title}
            </h3>
            <p className="text-gray-400 text-lg">
              {memorySections[activeSection].description}
            </p>
          </div>

          {/* Images Grid */}
          <div key={activeSection} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {memorySections[activeSection].images.map((image, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-gray-700/50 hover:border-gray-600/50 shadow-xl hover:shadow-2xl"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  animation: 'fadeInUp 0.4s ease-out forwards'
                }}
              >
                {/* Image container with overlay effects */}
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  {/* Loading placeholder */}
                  {!imagesLoaded[`${activeSection}-${index}`] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                    </div>
                  )}

                  <img
                    src={image.src}
                    alt={image.title}
                    loading="eager"
                    decoding="async"
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 ${imagesLoaded[`${activeSection}-${index}`] ? 'opacity-100' : 'opacity-0'
                      }`}
                    onLoad={() => {
                      setImagesLoaded(prev => ({
                        ...prev,
                        [`${activeSection}-${index}`]: true
                      }));
                    }}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

                  {/* Section badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 bg-gradient-to-r ${getSectionColor(activeSection)} rounded-full text-white text-xs font-semibold shadow-lg backdrop-blur-sm border border-white/20`}>
                    {activeSection}
                  </div>

                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

                  {/* Floating particles on hover */}
                  <div className="absolute top-2 left-2 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-blue-400/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" style={{ animationDelay: '0.3s' }}></div>
                </div>

                {/* Title overlay on hover */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="text-white font-semibold text-sm">
                    {image.title}
                  </h4>
                </div>

                {/* Ripple effect on hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/10 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>


      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default ClubMemories;