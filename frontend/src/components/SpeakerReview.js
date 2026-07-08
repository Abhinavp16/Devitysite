import { useEffect, useRef, useState } from 'react';
import { SpeakerReviewAnimatedBackground } from './AnimatedBackground';
import publicApiService from '../services/publicApiService';

export default function SpeakerReview() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const carouselRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    publicApiService.getReviews()
      .then((data) => {
        if (isMounted) setReviews(data);
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
    if (!carousel || reviews.length === 0) return undefined;

    let animationFrame;
    let lastTimestamp;

    const scroll = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;

      const elapsed = timestamp - lastTimestamp;
      const loopWidth = carousel.scrollWidth / 3;

      carousel.scrollLeft += elapsed * 0.055;

      if (carousel.scrollLeft >= loopWidth) {
        carousel.scrollLeft -= loopWidth;
      }

      lastTimestamp = timestamp;
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [reviews.length]);

  if (!isLoading && !error && reviews.length === 0) {
    return null;
  }

  return (
    <section className="relative py-12 overflow-hidden bg-gradient-to-br from-[#0B1426] via-[#0E1A33] to-[#1A2332]">
      <SpeakerReviewAnimatedBackground />
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent mb-6">Voices from Our Speakers</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium">Real feedback from industry leaders and academicians who've experienced our community.</p>
        </div>
      </div>

      {isLoading && <p className="relative z-10 text-center text-gray-300">Loading speaker voices from database...</p>}
      {error && <p className="relative z-10 text-center text-red-400">Unable to load speaker voices: {error}</p>}

      <div ref={carouselRef} className="hide-scrollbar relative w-full overflow-x-auto z-20">
        <div className="flex w-fit">
          {[...Array(3)].map((_, loopIndex) => (
            <div key={loopIndex} className="flex gap-8 py-10 pr-8">
              {reviews.map((item, index) => (
                <div key={`${item.id || index}-${loopIndex}`} className="group relative w-[320px] md:w-[380px] flex-shrink-0 snap-center transition-all duration-700 hover:-translate-y-3 hover:scale-[1.02] min-h-[360px]">
                  <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-gray-900/90 border border-slate-700/50 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover:shadow-[0_20px_60px_rgba(59,130,246,0.4)] group-hover:border-blue-400/50">
                    <div className="relative z-10 p-6 h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="inline-block text-xs px-3 py-1.5 rounded-full font-bold tracking-wide uppercase bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white shadow-lg">{item.highlight || 'Speaker Feedback'}</span>
                      </div>
                      <blockquote className="hide-scrollbar text-gray-100 text-sm leading-relaxed font-medium flex-1 mb-6 italic max-h-[180px] overflow-y-auto pr-2">"{item.review}"</blockquote>
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-4"></div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-0.5 overflow-hidden flex items-center justify-center text-white font-bold">
                          {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full rounded-full object-cover" /> : item.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-base mb-0.5 group-hover:text-blue-300 transition-colors duration-300">{item.name}</h4>
                          <p className="text-gray-400 text-xs leading-tight max-w-[220px] line-clamp-2">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
