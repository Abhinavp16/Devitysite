import { ClubMemoriesAnimatedBackground } from './AnimatedBackground';
import { useState, useEffect, useCallback } from 'react';
import { preloadImage } from '../utils/imageOptimization';

//Import Tech Elevator images
import TechElevate1 from '../img/club memoriess/Tech Elevate/1.JPG';
import TechElevate2 from '../img/club memoriess/Tech Elevate/2.JPG';
import TechElevate4 from '../img/club memoriess/Tech Elevate/4.JPG';
import TechElevate5 from '../img/club memoriess/Tech Elevate/5.jpg';
import TechElevate6 from '../img/club memoriess/Tech Elevate/6.JPG';

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
import envisionX6 from '../img/club memoriess/Envision X/IMG20250325112003.jpg';

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

    'Tech Elevate': {
      title: 'Tech Elevate',
      description: 'Tech Elevate 2024: DevOps & Cloud Career Pathways, was successfully held on 22nd  November 2024 at Amity University Chhattisgarh.  The keynote speaker, Mr. Vikas Shrivastava, shared his expertise in DevOps workflows, cloud technologies, and Career Pathways . ',
      gradient: 'from-red-500 to-pink-600',
      bgGradient: 'from-red-50 via-white to-pink-50',
      images: [
        { src: TechElevate1, title: 'Opening Ceremony' },
        { src: TechElevate2, title: 'Coding Session' },
        { src: TechElevate4, title: 'Problem Solving' },
        { src: TechElevate5, title: 'Problem Solving' },
        { src: TechElevate6, title: 'Award Ceremony' }
      ]
    },

    'Code Fusion': {
      title: 'Code Fusion',
      description: 'CodeFusion: The DevOps Synergy, was successfully held on 4th February 2025 at Amity University Chhattisgarh.  The keynote speaker, Mr. Nakul Grover, DevOps Engineer at Thomson Reuters, shared his expertise in DevOps workflows, cloud technologies, and automation tools. ',
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
      title: 'Envision X 2025',
      description: ' Envision-X 2025: The Biggest Tech Event at Amity University Chhattisgarh Envision-X 2025, organized under the leadership of Vaibhav Kumar Sahu, was successfully conducted from February 4 to March 25, 2025, at Amity University Chhattisgarh. This 45-day online project-based innovation challenge, hosted by the Devity Club in collaboration with the Amity School of Engineering & Technology (ASET) and Amity Institute of Information Technology (AIIT), provided a unique platform for students to work on real-world projects while receiving mentorship from top industry experts.',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 via-white to-indigo-50',
      images: [
        { src: envisionX1, title: 'Project Setup' },
        { src: envisionX2, title: 'Innovation Display' },
        { src: envisionX6, title: 'President speech' },
        { src: envisionX3, title: 'Team Presentations' },
        { src: envisionX4, title: 'Audience Engagement' },
        { src: envisionX5, title: 'Networking Session' }
      
      ]
    },
    'Jumpstart Event': {
      title: 'Jumpstart Event',
      description: ' Jumpstart Your Tech Career: Master Networking Fundamentals and Learn CCNA & CCNP for Job Assurance, organized under the leadership of Vaibhav Kumar Sahu, was successfully held at Amity University Chhattisgarh. This insightful offline event was hosted by the Devity Club in association with Amity Institute of Information Technology (AIIT) and Amity School of Engineering & Technology (ASET), with the goal of empowering students with foundational and advanced networking knowledge aligned with industry certifications',
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
      title: 'Net Secure 2025',
      description: ' NetSecure 2025, organized under the leadership of Vaibhav Kumar Sahu, was successfully held on 20th January 2025. This online event, hosted by Devity Club, focused on guiding students into the critical and rapidly evolving field of network security. The event provided deep insights into career opportunities, industry trends, and the essential skills required to excel in cybersecurity.',
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

  // Preload images for faster switching with priority loading
  useEffect(() => {
    const preloadImages = async () => {
      // First, preload active section images with high priority
      const activeImages = memorySections[activeSection].images;
      
      // Use Promise.all for faster parallel loading of active section
      const activePromises = activeImages.map(async (image, index) => {
        try {
          await preloadImage(image.src);
          setImagesLoaded(prev => ({
            ...prev,
            [`${activeSection}-${index}`]: true
          }));
        } catch (error) {
          setImagesLoaded(prev => ({
            ...prev,
            [`${activeSection}-${index}`]: 'error'
          }));
        }
      });

      await Promise.all(activePromises);

      // Then preload other sections with lower priority
      setTimeout(() => {
        Object.keys(memorySections).forEach(sectionName => {
          if (sectionName !== activeSection) {
            memorySections[sectionName].images.forEach(async (image, index) => {
              try {
                await preloadImage(image.src);
                setImagesLoaded(prev => ({
                  ...prev,
                  [`${sectionName}-${index}`]: true
                }));
              } catch (error) {
                setImagesLoaded(prev => ({
                  ...prev,
                  [`${sectionName}-${index}`]: 'error'
                }));
              }
            });
          }
        });
      }, 500); // Reduced delay for faster background loading
    };

    preloadImages();
  }, [activeSection]);

  // Handle section change with smooth transition and preloading
  const handleSectionChange = useCallback((sectionName) => {
    if (sectionName === activeSection) return;

    setIsTransitioning(true);

    // Preload new section images immediately with optimized loading
    const preloadPromises = memorySections[sectionName].images.map(async (image, index) => {
      if (!imagesLoaded[`${sectionName}-${index}`]) {
        try {
          await preloadImage(image.src);
          setImagesLoaded(prev => ({
            ...prev,
            [`${sectionName}-${index}`]: true
          }));
        } catch (error) {
          setImagesLoaded(prev => ({
            ...prev,
            [`${sectionName}-${index}`]: 'error'
          }));
        }
      }
    });

    // Don't wait for all images to load before switching
    Promise.all(preloadPromises);

    // Smooth transition with reduced delay
    setTimeout(() => {
      setActiveSection(sectionName);
      setIsTransitioning(false);
    }, 100);
  }, [activeSection, imagesLoaded]);

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
                  {/* Enhanced loading placeholder with skeleton */}
                  {!imagesLoaded[`${activeSection}-${index}`] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      {/* Skeleton loader */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                      </div>
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mb-2"></div>
                        <div className="text-white/60 text-xs">Loading...</div>
                      </div>
                    </div>
                  )}

                  <img
                    src={image.src}
                    alt={image.title}
                    loading={index < 3 ? "eager" : "lazy"} // Eager load first 3 images
                    decoding="async"
                    fetchPriority={index < 3 ? "high" : "low"}
                    className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110 ${imagesLoaded[`${activeSection}-${index}`] ? 'opacity-100' : 'opacity-0'
                      }`}
                    onLoad={() => {
                      setImagesLoaded(prev => ({
                        ...prev,
                        [`${activeSection}-${index}`]: true
                      }));
                    }}
                    onError={() => {
                      // Handle image load error
                      setImagesLoaded(prev => ({
                        ...prev,
                        [`${activeSection}-${index}`]: 'error'
                      }));
                    }}
                  />

                  {/* Error state */}
                  {imagesLoaded[`${activeSection}-${index}`] === 'error' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <div className="text-center text-white/60">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                        <div className="text-xs">Image unavailable</div>
                      </div>
                    </div>
                  )}

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
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default ClubMemories;