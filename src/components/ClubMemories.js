import { useEffect, useState } from 'react';
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

  const activeIndex = memories.findIndex((memory) => memory.id === activeMemoryId);
  const activeMemory = memories[activeIndex] || memories[0];
  const activeGradient = gradients[(activeIndex >= 0 ? activeIndex : 0) % gradients.length];

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

              <div key={activeMemory.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {placeholderTitles.map((title, index) => (
                  <div
                    key={title}
                    className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:scale-105 hover:-translate-y-2 transition-all duration-500 border border-gray-700/50 hover:border-gray-600/50 shadow-xl hover:shadow-2xl"
                    style={{ animationDelay: `${index * 0.05}s`, animation: 'fadeInUp 0.4s ease-out forwards' }}
                  >
                    <div className="relative h-64 overflow-hidden rounded-2xl">
                      {index === 0 && activeMemory.image_url ? (
                        <img src={activeMemory.image_url} alt={activeMemory.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${activeGradient} opacity-80 flex flex-col items-center justify-center text-white`}>
                          <div className="text-5xl font-black mb-3">{activeMemory.title.charAt(0)}</div>
                          <div className="text-xs uppercase tracking-[0.3em] opacity-80">Image Slot</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-white font-bold text-lg mb-1">{title}</h4>
                        <p className="text-gray-300 text-sm">Add image URL from admin panel</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ClubMemories;
