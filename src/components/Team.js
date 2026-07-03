import { useEffect, useState } from 'react';
import { TeamAnimatedBackground } from './AnimatedBackground';
import publicApiService from '../services/publicApiService';

const getDisplayInitial = (name = '') => {
  const parts = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.|Er\.)\s+/i, '').trim().split(/\s+/);
  return (parts[0] || name || '?').charAt(0).toUpperCase();
};

const GitHubIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

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

const ArrowUpRightIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
  </svg>
);

const GlobeIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" d="M3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21M12 3C9.8 5.4 8.7 8.4 8.7 12s1.1 6.6 3.3 9" />
  </svg>
);

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    publicApiService.getTeamMembers()
      .then((members) => {
        if (isMounted) setTeamMembers(members);
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

  const leadership = teamMembers.filter((member) => member.team_type === 'leadership');
  const core = teamMembers.filter((member) => member.team_type !== 'leadership');

  const renderAvatar = (member, colorClass) => (
    <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ${colorClass} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xl overflow-hidden ring-2 sm:ring-4 ring-white/50 group-hover:scale-105 transition-all duration-500`}>
      {member.image_url ? (
        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover rounded-full" />
      ) : (
        <span className="text-white text-xl md:text-2xl font-bold">{getDisplayInitial(member.name)}</span>
      )}
    </div>
  );

  const renderCard = (member, index, variant = 'core') => {
    const isLeadership = variant === 'leadership';
    const colorClass = isLeadership
      ? 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500'
      : 'bg-gradient-to-br from-purple-500 to-pink-600';
    const titleClass = isLeadership
      ? 'from-indigo-600 to-purple-600'
      : 'from-purple-600 to-pink-600';

    if (!isLeadership) {
      const primaryLink = member.linkedin_url || member.github_url || member.twitter_url || '#';

      return (
        <div key={member.id || index} className="relative overflow-hidden rounded-md border border-white/40 bg-white shadow-[inset_1px_1px_0_rgba(255,255,255,0.75),inset_-1px_-1px_0_rgba(15,23,42,0.18),0_10px_24px_rgba(15,23,42,0.18)]">
          <div className="relative aspect-[4/5] min-h-[360px] bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 overflow-hidden">
            {member.image_url ? (
              <img src={member.image_url} alt={member.name} className="w-full h-full object-cover object-center" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-200 via-indigo-100 to-purple-100 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white flex items-center justify-center text-5xl font-bold shadow-xl ring-4 ring-white/70">
                  {getDisplayInitial(member.name)}
                </div>
              </div>
            )}

            <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/50 bg-gray-700/45 px-4 py-3 text-white shadow-[inset_1px_1px_0_rgba(255,255,255,0.45),inset_-1px_-1px_0_rgba(15,23,42,0.25),0_10px_28px_rgba(15,23,42,0.22)] backdrop-blur-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-base font-bold leading-tight truncate">{member.name}</h3>
                  <p className="mt-1.5 text-xs font-bold leading-tight text-white/95 truncate">{member.role}</p>
                </div>
                <a href={primaryLink} target="_blank" rel="noopener noreferrer" className="shrink-0 text-white" aria-label={`${member.name} profile`}>
                  <ArrowUpRightIcon className="w-4 h-4" />
                </a>
              </div>

              <div className="mt-3 flex items-center gap-3 text-white/95">
                {member.twitter_url && (
                  <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} X`}>
                    <XIcon className="w-4 h-4" />
                  </a>
                )}
                {member.linkedin_url && (
                  <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} LinkedIn`}>
                    <LinkedInIcon className="w-4 h-4" />
                  </a>
                )}
                {member.github_url && (
                  <a href={member.github_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} GitHub`}>
                    <GlobeIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={member.id || index} className="group relative bg-gradient-to-br from-white via-indigo-50 to-cyan-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-4 md:p-6 text-center transform hover:-translate-y-2 border border-indigo-100 dark:border-gray-600 backdrop-blur-sm">
        <div className="relative z-10">
          {renderAvatar(member, colorClass)}
          <h3 className={`text-lg md:text-xl font-bold bg-gradient-to-r ${titleClass} bg-clip-text text-transparent mb-1 leading-tight`}>{member.name}</h3>
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-3 text-sm md:text-base transition-colors duration-300 leading-tight">{member.role}</p>
          {member.bio && <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed transition-colors duration-300">{member.bio}</p>}
          {member.skills && member.skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {member.skills.slice(0, 4).map((skill, skillIndex) => (
                <span key={skillIndex} className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold border border-indigo-200/50 dark:border-indigo-500/50">
                  {skill}
                </span>
              ))}
            </div>
          )}
          <div className="flex justify-center items-center gap-4">
            {member.github_url && (
              <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all duration-300 transform hover:scale-125" aria-label={`${member.name} GitHub`}>
                <GitHubIcon />
              </a>
            )}
            {member.linkedin_url && (
              <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-125" aria-label={`${member.name} LinkedIn`}>
                <LinkedInIcon />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="team" className="py-20 bg-gradient-to-br from-slate-50/60 via-blue-50/60 to-indigo-100/60 dark:from-gray-900/60 dark:via-gray-800/60 dark:to-gray-700/60 backdrop-blur-sm relative overflow-hidden transition-colors duration-300">
      <TeamAnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Meet Our Team</h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">Our dedicated team of passionate individuals working together to build an amazing tech community.</p>
        </div>

        {isLoading && <p className="text-center text-gray-600 dark:text-gray-300">Loading team from database...</p>}
        {error && <p className="text-center text-red-600">Unable to load team: {error}</p>}
        {!isLoading && !error && teamMembers.length === 0 && <p className="text-center text-gray-600 dark:text-gray-300">No team members available yet.</p>}

        {leadership.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center transition-colors duration-300">Leadership Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {leadership.map((member, index) => renderCard(member, index, 'leadership'))}
            </div>
          </div>
        )}

        {core.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center transition-colors duration-300">Core Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {core.map((member, index) => renderCard(member, index))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;
