import { useEffect, useState } from 'react';
import { SpeakersAnimatedBackground } from './AnimatedBackground';
import publicApiService from '../services/publicApiService';

const getDisplayInitial = (name = '') => {
  const parts = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.|Er\.)\s+/i, '').trim().split(/\s+/);
  return (parts[0] || name || '?').charAt(0).toUpperCase();
};

const LinkedInIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.919-2.063 2.063-2.063s2.063.925 2.063 2.063c0 1.139-.919 2.065-2.063 2.065zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l16 16M20 4L4 20" />
  </svg>
);

const GlobeIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" d="M3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21M12 3C9.8 5.4 8.7 8.4 8.7 12s1.1 6.6 3.3 9" />
  </svg>
);

const Speakers = () => {
  const [speakers, setSpeakers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    publicApiService.getSpeakers()
      .then((data) => {
        if (isMounted) setSpeakers(data);
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

  return (
    <section id="speakers" className="py-20 bg-gradient-to-br from-slate-50/60 via-purple-50/60 to-pink-100/60 dark:from-gray-900/60 dark:via-gray-800/60 dark:to-gray-700/60 backdrop-blur-sm relative overflow-hidden transition-colors duration-300">
      <SpeakersAnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6">Guest Speakers</h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">Learn from industry leaders and tech innovators who are shaping the future of technology.</p>
        </div>

        {isLoading && <p className="text-center text-gray-600 dark:text-gray-300">Loading speakers from database...</p>}
        {error && <p className="text-center text-red-600">Unable to load speakers: {error}</p>}
        {!isLoading && !error && speakers.length === 0 && <p className="text-center text-gray-600 dark:text-gray-300">No speakers available yet.</p>}

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-6xl mx-auto">
          {speakers.map((speaker, index) => {
            return (
              <div key={speaker.id || index} className="mx-auto w-full max-w-[190px] rounded-xl border border-white/80 bg-white p-3 text-center shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),inset_-1px_-1px_0_rgba(15,23,42,0.08),0_12px_28px_rgba(15,23,42,0.16)]">
                <div className="h-44 overflow-hidden rounded-lg bg-gradient-to-br from-stone-100 via-purple-50 to-pink-100 shadow-inner">
                  {speaker.image_url ? (
                    <img src={speaker.image_url} alt={speaker.name} className="h-full w-full object-cover object-center" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-red-100">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-4xl font-bold text-white shadow-lg ring-4 ring-white/80">
                        {getDisplayInitial(speaker.name)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-1 pb-2 pt-3">
                  <h3 className="truncate text-sm font-extrabold leading-tight text-gray-950">{speaker.name}</h3>
                  <p className="mt-1 truncate text-[10px] font-semibold leading-tight text-gray-600">{speaker.title}</p>
                  <p className="mt-1 truncate text-[10px] font-bold leading-tight text-purple-600">{speaker.company}</p>
                </div>

                <div className="border-t border-gray-200/80 pt-2">
                  <div className="flex items-center justify-center gap-3">
                    {speaker.website_url && (
                      <a href={speaker.website_url} target="_blank" rel="noopener noreferrer" className="flex h-5 w-5 items-center justify-center rounded bg-orange-50 text-orange-500 shadow-sm" aria-label={`${speaker.name} website`}>
                        <GlobeIcon className="h-3 w-3" />
                      </a>
                    )}
                    {speaker.twitter_url && (
                      <a href={speaker.twitter_url} target="_blank" rel="noopener noreferrer" className="flex h-5 w-5 items-center justify-center rounded bg-sky-50 text-sky-500 shadow-sm" aria-label={`${speaker.name} X`}>
                        <XIcon className="h-3 w-3" />
                      </a>
                    )}
                    {speaker.linkedin_url && (
                      <a href={speaker.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex h-5 w-5 items-center justify-center rounded bg-blue-50 text-blue-600 shadow-sm" aria-label={`${speaker.name} LinkedIn`}>
                        <LinkedInIcon className="h-3 w-3" />
                      </a>
                    )}
                    {!speaker.website_url && !speaker.twitter_url && !speaker.linkedin_url && (
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-gray-50 text-gray-400 shadow-sm">
                        <GlobeIcon className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Speakers;
