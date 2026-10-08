import { useState, useEffect, useRef } from 'react';
import devityLogo from '../img/devity logo.png';

const ALWAYS_SHOW_ABOVE = 120; // px from top where the navbar never hides
const SCROLL_THRESHOLD = 12;   // ignore tiny scroll jitter

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const menuOpenRef = useRef(false);

  // Never hide while the mobile menu is open
  useEffect(() => {
    menuOpenRef.current = isMenuOpen;
    if (isMenuOpen) setIsHidden(false);
  }, [isMenuOpen]);

  // Hide on scroll down, reveal on scroll up
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      setIsScrolled(y > 20);
      if (y < ALWAYS_SHOW_ABOVE || menuOpenRef.current) setIsHidden(false);
      else if (delta > SCROLL_THRESHOLD) setIsHidden(true);
      else if (delta < -SCROLL_THRESHOLD) setIsHidden(false);

      // Only move the baseline once past the threshold so slow scrolls still accumulate
      if (Math.abs(delta) > SCROLL_THRESHOLD || y < ALWAYS_SHOW_ABOVE) lastY = y;

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navbar drop-in animation, injected via a real <style> tag
  const logoKeyframes = `
    @keyframes navDrop {
      from { transform: translateY(-120%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .nav-drop-in { animation: navDrop 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
    @media (prefers-reduced-motion: reduce) {
      .nav-drop-in { animation: none; }
    }
  `;

  return (
    <>
      <style>{logoKeyframes}</style>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-[transform,opacity,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none flex justify-center items-start pointer-events-none ${isScrolled ? 'pt-1 sm:pt-2' : 'pt-2 sm:pt-4 md:pt-6'} ${isHidden ? '-translate-y-[130%] opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className={`nav-drop-in relative w-[98%] sm:w-[95%] max-w-7xl pointer-events-auto transition-[background-color,padding,box-shadow] duration-500 ease-in-out rounded-2xl border border-gold/30 shadow-2xl backdrop-blur-xl ${isScrolled
          ? 'bg-navy-ink/95 py-1.5 sm:py-2'
          : 'bg-navy/95 py-2 sm:py-3'
          }`}>
          {/* Both states use solid background-color (not a gradient) so the scroll color change can
              cross-fade — swapping gradient <-> color snaps to transparent first and flickers */}
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-gold/20 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-3 right-1/3 w-3 h-3 bg-gold/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-2 right-10 w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 relative">
            <div className="flex justify-between items-center transition-all duration-300">
              {/* Logo — plain, no hover effects */}
              <a href="#home" className="flex items-center gap-2.5 sm:gap-3" aria-label="Devity Club — back to top">
                <img src={devityLogo} alt="" className="h-9 w-auto sm:h-10" />
                <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">DevityClub</span>
              </a>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1 lg:space-x-2">
                {['Home', 'Events', 'About', 'Team', 'Speakers', 'Contact'].map((item, index) => {
                  // Different effect styles for each nav item
                  const getItemEffects = (itemName) => {
                    const effects = {
                      Home: {
                        gradient: 'from-emerald-500/30 via-blue-500/30 to-cyan-500/30',
                        glow: 'from-emerald-400 via-blue-400 to-cyan-400',
                        shimmer: 'from-transparent via-emerald-200/30 to-transparent'
                      },
                      About: {
                        gradient: 'from-orange-500/30 via-yellow-500/30 to-amber-500/30',
                        glow: 'from-orange-400 via-yellow-400 to-amber-400',
                        shimmer: 'from-transparent via-yellow-200/30 to-transparent'
                      },
                      Events: {
                        gradient: 'from-purple-500/30 via-pink-500/30 to-red-500/30',
                        glow: 'from-purple-400 via-pink-400 to-red-400',
                        shimmer: 'from-transparent via-purple-200/30 to-transparent'
                      },
                      Team: {
                        gradient: 'from-indigo-500/30 via-purple-500/30 to-blue-500/30',
                        glow: 'from-indigo-400 via-purple-400 to-blue-400',
                        shimmer: 'from-transparent via-indigo-200/30 to-transparent'
                      },
                      Speakers: {
                        gradient: 'from-teal-500/30 via-green-500/30 to-lime-500/30',
                        glow: 'from-teal-400 via-green-400 to-lime-400',
                        shimmer: 'from-transparent via-teal-200/30 to-transparent'
                      },
                      Contact: {
                        gradient: 'from-rose-500/30 via-pink-500/30 to-fuchsia-500/30',
                        glow: 'from-rose-400 via-pink-400 to-fuchsia-400',
                        shimmer: 'from-transparent via-rose-200/30 to-transparent'
                      }
                    };
                    return effects[itemName] || effects.Home;
                  };

                  const effects = getItemEffects(item);

                  return (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="relative px-3 lg:px-5 py-2 lg:py-2.5 text-blue-100 hover:text-white transition-all duration-500 rounded-xl group overflow-hidden transform hover:scale-110 hover:-translate-y-1 shadow-md hover:shadow-xl text-sm lg:text-base"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Multi-layer animated background */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${effects.gradient} translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-xl`}></div>

                      {/* Shimmer effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${effects.shimmer} translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out`}></div>

                      {/* Outer glow */}
                      <div className={`absolute -inset-1 bg-gradient-to-r ${effects.glow} opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-500 rounded-xl`}></div>

                      {/* Inner glow */}
                      <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>

                      <span className="relative z-10 font-semibold transform group-hover:scale-105 transition-all duration-300">
                        {item}
                      </span>

                      {/* Animated border */}
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500"></div>

                      {/* Bottom pulse line */}
                      <div className={`absolute bottom-0 left-1/2 w-0 h-1 bg-gradient-to-r ${effects.glow} group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out rounded-full`}></div>

                      {/* Floating particles */}
                      <div className="absolute top-1 right-1 w-1 h-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                      <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" style={{ animationDelay: '0.2s' }}></div>
                    </a>
                  );
                })}
              </nav>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-2">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="relative text-blue-100 hover:text-white p-2 sm:p-3 rounded-xl hover:bg-blue-500/30 transition-all duration-500 transform hover:scale-110 hover:rotate-3 group overflow-hidden"
                >
                  {/* Button glow */}
                  <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>

                  <svg
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-500 relative z-10 ${isMenuOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden overflow-hidden transition-all duration-700 ease-out ${isMenuOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'
              }`}>
              <div className="py-6 border-t border-gold/30 bg-navy-ink/60 backdrop-blur-sm rounded-b-2xl mt-2">
                <div className="flex flex-col space-y-3">
                  {['Home', 'Events', 'About', 'Team', 'Speakers', 'Contact'].map((item, index) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="relative text-blue-100 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/40 hover:to-indigo-500/40 px-6 py-3 rounded-xl transition-all duration-500 transform hover:translate-x-3 hover:scale-105 group overflow-hidden"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: isMenuOpen ? 'slideInLeft 0.5s ease-out forwards' : 'none'
                      }}
                    >
                      {/* Hover shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                      {/* Item glow */}
                      <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>

                      <span className="relative z-10 font-medium">{item}</span>

                      {/* Arrow indicator */}
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </a>
                  ))}


                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
