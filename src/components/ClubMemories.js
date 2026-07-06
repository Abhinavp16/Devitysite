import { useEffect, useRef, useState } from 'react';
import { ClubMemoriesAnimatedBackground } from './AnimatedBackground';
import publicApiService from '../services/publicApiService';

const gradients = [
  'from-red-500 to-pink-600',
  'from-blue-500 to-indigo-600',
  'from-green-500 to-emerald-600',
  'from-purple-500 to-violet-600',
  'from-orange-500 to-amber-600',
  'from-cyan-500 to-blue-600',
  'from-pink-500 to-rose-600'
];

const placeholderTitles = [
  'Opening Ceremony',
  'Interactive Session',
  'Team Collaboration',
  'Problem Solving',
  'Award Ceremony'
];

const ClubMemories = () => {
  const [memories, setMemories] = useState([]);
  const [activeMemoryId, setActiveMemoryId] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const carouselRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    publicApiService.getMemories()
      .then((data) => {
        if (isMounted) {
          setMemories(data);
          setActiveMemoryId(data[0]?.id || '');
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || memories.length === 0) return undefined;

    const interval = setInterval(() => {
      if (window.innerWidth >= 768) return;

      const nextScroll = carousel.scrollLeft + carousel.clientWidth * 0.86;
      const atEnd = nextScroll >= carousel.scrollWidth - carousel.clientWidth - 8;

      carousel.scrollTo({
        left: atEnd ? 0 : nextScroll,
        behavior: 'smooth'
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [activeMemoryId, memories.length]);

  const activeIndex = memories.findIndex((memory) => memory.id === activeMemoryId);
  const activeMemory = memories[activeIndex] || memories[0];
  const activeGradient = gradients[(activeIndex >= 0 ? activeIndex : 0) % gradients.length];
  const activeImages = activeMemory ? [...(activeMemory.image_urls && activeMemory.image_urls.length ? activeMemory.image_urls : [activeMemory.image_url || '']), '', '', '', ''].slice(0, 5) : [];
  const activeImageTitles = activeMemory ? [...(activeMemory.image_titles && activeMemory.image_titles.length ? activeMemory.image_titles : placeholderTitles), '', '', '', ''].slice(0, 5) : [];

  const handleMemoryChange = (memoryId) => {
    if (memoryId === activeMemoryId) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveMemoryId(memoryId);
      setIsTransitioning(false);
    }, 120);
  };

  return (
    <section id="memories" className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      <ClubMemoriesAnimatedBackground />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-cyan-400/40 rounded-full animate-ping"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">Club Memories</h2>
          <p className="text-xl text-gray-300 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">Capturing moments of innovation, learning, and friendship that define our journey together.</p>
        </div>

        {isLoading && <p className="text-center text-gray-300">Loading memories from database...</p>}
        {error && <p className="text-center text-red-400">Unable to load memories: {error}</p>}
        {!isLoading && !error && memories.length === 0 && <p className="text-center text-gray-300">No club memories available yet.</p>}

        {activeMemory && (
          <>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {memories.map((memory, index) => {
                const gradient = gradients[index % gradients.length];
                return (
                  <button
                    key={memory.id || memory.title}
                    onClick={() => handleMemoryChange(memory.id)}
                    disabled={isTransitioning}
                    className={`relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group overflow-hidden ${activeMemory.id === memory.id
                      ? `bg-gradient-to-r ${gradient} text-white shadow-xl`
                      : 'bg-gray-800/50 text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-600/50'
                      } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    <span className="relative z-10">{memory.title}</span>
                  </button>
                );
              })}
            </div>

            <div className={`mb-8 transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="text-center mb-8">
                <h3 className={`text-3xl font-bold bg-gradient-to-r ${activeGradient} bg-clip-text text-transparent mb-3`}>
                  {activeMemory.title}
                </h3>
                <p className="text-gray-400 text-lg max-w-5xl mx-auto leading-relaxed">
                  {activeMemory.description}
                </p>
                {activeMemory.event_date && (
                  <p className="text-gray-500 text-sm mt-4">
                    {new Date(activeMemory.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>

              <div ref={carouselRef} key={activeMemory.id} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 lg:grid-cols-3 xl:grid-cols-5 hide-scrollbar">
                {placeholderTitles.map((fallbackTitle, index) => {
                  const imageUrl = activeImages[index];
                  const title = activeImageTitles[index] || fallbackTitle;

                  return (
                  <div
                    key={title}
                    className="group relative min-w-[82vw] max-w-[82vw] snap-center overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl md:min-w-0 md:max-w-none"
                    style={{ animationDelay: `${index * 0.05}s`, animation: 'fadeInUp 0.4s ease-out forwards' }}
                  >
                    <div className="relative h-64 overflow-hidden rounded-2xl">
                      {imageUrl ? (
                        <img src={imageUrl} alt={`${activeMemory.title} ${title}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${activeGradient} flex flex-col items-center justify-center text-white`}>
                          <div className="text-5xl font-black mb-3">{title.charAt(0)}</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/10"></div>
                      <div className="absolute right-3 top-3 rounded-full bg-pink-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                        {title}
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ClubMemories;
