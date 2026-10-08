import { useEffect, useRef, useState } from 'react';
import '../styles/spotlight.css';

// Heroicons (outline) paths
const ICON_PATHS = {
  learn: 'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5',
  community: 'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z',
  compete: 'M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0',
  innovate: 'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18'
};

const FEATURES = [
  { icon: 'learn', title: 'Learn & Build', description: 'Master cutting-edge technologies through hands-on workshops and real-world projects.' },
  { icon: 'community', title: 'Community Driven', description: 'Join a passionate community of developers, designers, and tech enthusiasts.' },
  { icon: 'compete', title: 'Compete & Excel', description: 'Participate in hackathons, coding competitions, and tech challenges.' },
  { icon: 'innovate', title: 'Innovation Hub', description: 'Turn your ideas into reality with mentorship and collaborative opportunities.' }
];

const STATS = [
  { value: 200, label: 'Members' },
  { value: 15, label: 'Industry Mentors' },
  { value: 7, label: 'Events Hosted' },
  { value: 25, label: 'Team Members' }
];

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Counts from 0 to `value` once `start` is true (ease-out, 1.6 s)
const CountUp = ({ value, start }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return undefined;
    if (prefersReducedMotion()) {
      setDisplay(value);
      return undefined;
    }
    let frame;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / 1600);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, value]);

  return display;
};

const About = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Play the entrance animation once, when the section scrolls into view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Gold spotlight follows the cursor across all cards
  const handleMouseMove = (event) => {
    cardsRef.current?.querySelectorAll('.spotlight-card').forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--y', `${event.clientY - rect.top}px`);
    });
  };

  const delay = (seconds) => ({ transitionDelay: `${seconds}s` });

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`relative overflow-hidden bg-slate-900 py-20 transition-colors duration-300 sm:py-28 ${visible ? 'about-visible' : ''}`}
    >
      <div className="about-aurora -left-20 -top-32 h-[420px] w-[420px] bg-gold" aria-hidden="true" />
      <div className="about-aurora -bottom-48 -right-28 h-[480px] w-[480px] bg-blue-900" style={{ animationDuration: '22s', opacity: 0.35 }} aria-hidden="true" />
      <div className="about-grid" aria-hidden="true" />

      {/* Soft light behind the heading */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gold/[0.05] blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="about-reveal text-xs font-semibold uppercase tracking-[0.14em] text-gold">About us</p>
          <span className="about-reveal mx-auto mt-2 block h-0.5 w-11 bg-gold" style={delay(0.05)} aria-hidden="true" />
          <h2 className="about-reveal mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl" style={delay(0.1)}>
            Building the future <span className="text-gold">with Devity Club</span>
          </h2>
          <p className="about-reveal mt-5 text-base leading-relaxed text-slate-300 sm:text-lg" style={delay(0.2)}>
            A student-led initiative, founded 15 February 2023, empowering students with hands-on skills in AI,
            Cybersecurity, DevOps, Cloud and Web — bridging the gap between academic learning and industry expectations.
          </p>
        </div>

        <div ref={cardsRef} onMouseMove={handleMouseMove} className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="spotlight-card about-reveal rounded-2xl bg-white/[0.04] p-7 transition-transform duration-300 hover:-translate-y-1"
              style={delay(0.25 + index * 0.1)}
            >
              <svg className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[feature.icon]} />
              </svg>
              <h3 className="mt-5 text-lg font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <dl className="about-reveal mt-14 grid grid-cols-2 gap-y-10 text-center sm:grid-cols-4" style={delay(0.65)}>
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse">
              <dt className="mt-2 text-sm text-slate-300">{stat.label}</dt>
              <dd className="font-display text-5xl font-extrabold leading-none text-gold">
                <span className="sr-only">{stat.value}+</span>
                <span aria-hidden="true"><CountUp value={stat.value} start={visible} />+</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default About;
