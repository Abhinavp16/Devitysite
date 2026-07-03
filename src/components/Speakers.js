import { useEffect, useState } from 'react';
import { SpeakersAnimatedBackground } from './AnimatedBackground';
import publicApiService from '../services/publicApiService';

const gradients = [
  ['from-red-500', 'to-pink-600', 'from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50', 'text-red-700 dark:text-red-300'],
  ['from-purple-500', 'to-violet-600', 'from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50', 'text-purple-700 dark:text-purple-300'],
  ['from-green-500', 'to-teal-600', 'from-green-100 to-teal-100 dark:from-green-900/50 dark:to-teal-900/50', 'text-green-700 dark:text-green-300'],
  ['from-blue-500', 'to-cyan-600', 'from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50', 'text-blue-700 dark:text-blue-300'],
  ['from-orange-500', 'to-red-600', 'from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50', 'text-orange-700 dark:text-orange-300'],
  ['from-indigo-500', 'to-purple-600', 'from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50', 'text-indigo-700 dark:text-indigo-300']
];

const getDisplayInitial = (name = '') => {
  const parts = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.|Er\.)\s+/i, '').trim().split(/\s+/);
  return (parts[0] || name || '?').charAt(0).toUpperCase();
};

const LinkedInIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.919-2.063 2.063-2.063s2.063.925 2.063 2.063c0 1.139-.919 2.065-2.063 2.065zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {speakers.map((speaker, index) => {
            const [from, to, skillGradient, textColor] = gradients[index % gradients.length];
            const expertise = speaker.expertise_areas || [];

            return (
              <div key={speaker.id || index} className="group relative bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-700 p-6 text-center transform hover:-translate-y-3 border border-gray-100 dark:border-gray-600 backdrop-blur-sm">
                <div className="relative z-10">
                  <div className={`w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br ${from} ${to} rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl overflow-hidden ring-4 ring-white/50 group-hover:scale-110 transition-all duration-500`}>
                    {speaker.image_url ? (
                      <img src={speaker.image_url} alt={speaker.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-white text-2xl font-bold">{getDisplayInitial(speaker.name)}</span>
                    )}
                  </div>
                  <div className={`inline-block px-3 py-1.5 bg-gradient-to-r ${skillGradient} ${textColor} rounded-full text-xs font-semibold mb-4 shadow-md`}>{speaker.company}</div>
                  <h3 className={`text-xl font-bold bg-gradient-to-r ${from} ${to} bg-clip-text text-transparent mb-2 leading-tight`}>{speaker.name}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-4 transition-colors duration-300 leading-tight">{speaker.title}</p>
                  {speaker.bio && <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{speaker.bio}</p>}
                  {expertise.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-5">
                      {expertise.slice(0, 3).map((skill, skillIndex) => (
                        <span key={skillIndex} className={`px-3 py-1 bg-gradient-to-r ${skillGradient} ${textColor} rounded-full text-xs font-medium border border-gray-200/50 dark:border-gray-500/50`}>{skill}</span>
                      ))}
                      {expertise.length > 3 && <span className={`px-3 py-1 bg-gradient-to-r ${skillGradient} ${textColor} rounded-full text-xs font-medium`}>+{expertise.length - 3}</span>}
                    </div>
                  )}
                  {speaker.linkedin_url && (
                    <a href={speaker.linkedin_url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center bg-gradient-to-r ${from} ${to} p-3 rounded-full text-white hover:shadow-lg transition-all duration-300 transform hover:scale-110`} aria-label={`${speaker.name} LinkedIn`}>
                      <LinkedInIcon className="w-5 h-5" />
                    </a>
                  )}
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
