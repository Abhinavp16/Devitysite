import ThemeToggle from './ThemeToggle';

const CLUB_EMAIL = 'club.devity@gmail.com';

// Brand marks (Simple Icons); Instagram is drawn as an outline
const SOCIAL_LINKS = [
  {
    name: 'GitHub', handle: 'devity-club', color: 'text-slate-100',
    href: 'https://github.com/devity-club',
    icon: <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599-.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  },
  {
    name: 'LinkedIn', handle: 'devity-club-auc', color: 'text-blue-400',
    href: 'https://www.linkedin.com/in/devity-club-auc',
    icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  },
  {
    name: 'X', handle: '@devity_club441', color: 'text-slate-100',
    href: 'https://x.com/devity_club441',
    icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  },
  {
    name: 'Instagram', handle: '@devity_club_auc', color: 'text-pink-400',
    href: 'https://www.instagram.com/devity_club_auc',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </g>
    )
  }
];

const Footer = () => (
  <footer className="overflow-hidden border-t border-transparent bg-slate-900 pt-16 dark:border-white/[0.08] font-jakarta text-white sm:pt-[72px]">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Stay connected</p>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.03em] sm:text-[2.6rem]">
            Let's stay <span className="text-gold">in touch</span>
          </h2>
          <p className="mt-3.5 max-w-[420px] text-[15.5px] leading-relaxed text-slate-400">
            Follow along for event announcements, tech news and community highlights from Devity Club, Amity University Chhattisgarh.
          </p>
          <a href={`mailto:${CLUB_EMAIL}`} className="mt-6 inline-flex items-center gap-2.5 border-b-2 border-gold pb-1 text-[17px] font-bold text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            {CLUB_EMAIL}
          </a>
        </div>

        {/* Compact 2×2 tiles */}
        <ul className="grid gap-3 sm:grid-cols-2" aria-label="Devity Club on social media">
          {SOCIAL_LINKS.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3"
              >
                <svg className={`h-6 w-6 ${social.color}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">{social.icon}</svg>
                <span>
                  <b className="block text-[15px] font-bold leading-tight">{social.name}</b>
                  <small className="block text-[12.5px] font-medium text-slate-400">{social.handle}</small>
                </span>
                <svg className="h-[18px] w-[18px] text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[13.5px] text-slate-400">
          © {new Date().getFullYear()} Devity Club · Made with <span className="text-rose-500">♥</span> by the Devity Tech Team
        </p>
        <ThemeToggle />
      </div>

      {/* Gold wordmark fading downwards, cropped so only the top 70% of the letters shows.
          Plus Jakarta 800: cap top sits 0.165em below the line box, cap height 0.745em. */}
      <div className="mt-10 h-[0.52em] select-none overflow-hidden text-center text-[clamp(80px,15.5vw,205px)]" aria-hidden="true">
        <div className="-mt-[0.165em] whitespace-nowrap bg-[linear-gradient(180deg,rgba(201,162,39,0.34)_16%,rgba(201,162,39,0.03)_68%)] bg-clip-text font-extrabold leading-none tracking-[-0.05em] text-transparent">
          DEVITY
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
