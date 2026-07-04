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

const GlobeIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" d="M3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21M12 3C9.8 5.4 8.7 8.4 8.7 12s1.1 6.6 3.3 9" />
  </svg>
);

const cardThemes = [
  {
    image: 'from-pink-50 via-rose-50 to-pink-100',
    role: 'text-pink-500'
  },
  {
    image: 'from-purple-50 via-violet-50 to-purple-100',
    role: 'text-violet-600'
  },
  {
    image: 'from-emerald-50 via-green-50 to-emerald-100',
    role: 'text-emerald-600'
  },
  {
    image: 'from-blue-50 via-sky-50 to-blue-100',
    role: 'text-blue-600'
  },
  {
    image: 'from-orange-50 via-amber-50 to-orange-100',
    role: 'text-orange-500'
  }
];

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

  const renderCard = (member, index, variant = 'core') => {
    const isLeadership = variant === 'leadership';

    if (!isLeadership) {
      const theme = cardThemes[index % cardThemes.length];

      return (
        <div key={member.id || index} className="mx-auto flex w-full max-w-[245px] flex-col rounded-2xl border border-white/80 bg-white p-1.5 text-center shadow-[0_22px_60px_rgba(15,23,42,0.22),inset_1px_1px_0_rgba(255,255,255,0.95)]">
          <div className={`relative h-64 overflow-hidden rounded-xl bg-gradient-to-br ${theme.image}`}>
            {member.image_url ? (
              <img src={member.image_url} alt={member.name} className="h-full w-full object-cover object-center" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-5xl font-bold text-white shadow-lg ring-4 ring-white/90">
                  {getDisplayInitial(member.name)}
                </div>
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent" />
          </div>

          <div className="relative z-10 -mt-10 px-1 pb-1 pt-0">
            <h3 className="truncate text-lg font-black leading-tight text-slate-950">{member.name}</h3>
            <p className={`mt-3 truncate text-sm font-black leading-tight ${theme.role}`}>{member.role}</p>
          </div>

          <div className="mt-2 border-t border-gray-200/80 pt-3">
            <div className="flex items-center justify-center gap-3">
              {member.github_url && (
                <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-700 shadow-[0_8px_20px_rgba(15,23,42,0.12)] ring-1 ring-slate-100" aria-label={`${member.name} GitHub`}>
                  <GitHubIcon className="h-4 w-4" />
                </a>
              )}
              {member.twitter_url && (
                <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sky-500 shadow-[0_8px_20px_rgba(15,23,42,0.12)] ring-1 ring-slate-100" aria-label={`${member.name} X`}>
                  <XIcon className="h-4 w-4" />
                </a>
              )}
              {member.linkedin_url && (
                <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sky-700 shadow-[0_8px_20px_rgba(15,23,42,0.12)] ring-1 ring-slate-100" aria-label={`${member.name} LinkedIn`}>
                  <LinkedInIcon className="h-4 w-4" />
                </a>
              )}
              {!member.github_url && !member.twitter_url && !member.linkedin_url && (
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-400 shadow-[0_8px_20px_rgba(15,23,42,0.12)] ring-1 ring-slate-100">
                  <GlobeIcon className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={member.id || index} className="mx-auto flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-white/80 bg-white p-1.5 shadow-[0_14px_36px_rgba(15,23,42,0.16),inset_1px_1px_0_rgba(255,255,255,0.95)] sm:flex-row">
        <div className="h-36 overflow-hidden rounded-xl bg-gradient-to-br from-slate-200 via-indigo-100 to-purple-100 sm:h-auto sm:w-[40%]">
          {member.image_url ? (
            <img src={member.image_url} alt={member.name} className="h-full w-full object-cover object-center" />
          ) : (
            <div className="flex h-full min-h-36 w-full items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-3xl font-bold text-white shadow-lg ring-4 ring-white/90">
                {getDisplayInitial(member.name)}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col px-3 py-3 text-left text-slate-950 sm:px-4">
          <h3 className="text-base font-medium leading-tight text-black">{member.name}</h3>
          <p className="mt-1.5 text-[11px] font-medium leading-tight text-black">{member.role}</p>
          {member.bio && <p className="mt-3 text-xs font-normal leading-snug text-black">{member.bio}</p>}

          <div className="mt-auto pt-3">
            <div className="mb-2 h-px w-full bg-gray-200" />
            <div className="flex items-center gap-3">
              {member.github_url && (
                <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-black shadow-sm" aria-label={`${member.name} GitHub`}>
                  <GitHubIcon className="h-3 w-3" />
                </a>
            )}
              {member.twitter_url && (
                <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-black shadow-sm" aria-label={`${member.name} X`}>
                  <XIcon className="h-3 w-3" />
                </a>
              )}
            {member.linkedin_url && (
                <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-black shadow-sm" aria-label={`${member.name} LinkedIn`}>
                  <LinkedInIcon className="h-3 w-3" />
                </a>
            )}
              {!member.github_url && !member.twitter_url && !member.linkedin_url && (
                <span className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-black shadow-sm">
                  <GlobeIcon className="h-3 w-3" />
                </span>
              )}
            </div>
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
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto">
              {leadership.map((member, index) => renderCard(member, index, 'leadership'))}
            </div>
          </div>
        )}

        {core.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center transition-colors duration-300">Core Team</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-7xl mx-auto">
              {core.map((member, index) => renderCard(member, index))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;
