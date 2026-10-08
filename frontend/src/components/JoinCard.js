import { useState } from 'react';

const CLUB_EMAIL = 'club.devity@gmail.com';

// Heroicons (outline) paths
const ICONS = {
  student: 'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5',
  mentor: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z',
  check: 'm4.5 12.75 6 6 9-13.5',
  mail: 'M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75',
  arrow: 'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3'
};

const Icon = ({ name, className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[name]} />
  </svg>
);

const MODES = {
  student: {
    label: "I'm a student",
    eyebrow: 'For students',
    title: 'Learn by building, alongside 200+ members.',
    perks: ['Hands-on workshops, hackathons and bootcamps', 'Mentorship from industry engineers', 'Real projects for your portfolio'],
    emailLabel: 'Email address',
    messageLabel: 'Your interests and why you want to join',
    button: 'Send inquiry',
    subject: 'Student Inquiry'
  },
  mentor: {
    label: "I'm a mentor",
    eyebrow: 'For industry professionals',
    title: 'Share what you know with the next generation.',
    perks: ['Speak at a summit or run a workshop', 'Mentor students on real projects', 'Judge or sponsor a hackathon'],
    emailLabel: 'Work email',
    messageLabel: "Your expertise and how you'd like to contribute",
    button: 'Offer mentorship',
    subject: 'Mentorship Application'
  }
};

const swapIn = { animation: 'fadeInUp 0.45s cubic-bezier(0.22, 1, 0.36, 1)' };

// Input with a label that floats above the text once focused or filled
const FloatingField = ({ id, label, multiline = false, ...props }) => {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className="relative mt-4">
      <Tag
        id={id}
        placeholder=" "
        className={`peer w-full resize-y rounded-[10px] border-[1.5px] border-cream-line bg-white px-3.5 pb-2 pt-[22px] text-[15px] text-navy-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-gold focus:shadow-[0_0_0_4px_rgba(201,162,39,0.15)] dark:border-white/15 dark:bg-white/5 dark:text-white ${multiline ? 'min-h-[112px]' : ''}`}
        {...props}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-[15px] top-[7px] text-[11.5px] font-semibold tracking-wide text-gold-dark transition-all duration-200 peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-400 peer-focus:top-[7px] peer-focus:text-[11.5px] peer-focus:font-semibold peer-focus:tracking-wide peer-focus:text-gold-dark dark:text-gold dark:peer-focus:text-gold"
      >
        {label}
      </label>
    </div>
  );
};

// One card for both audiences: a toggle switches between the student and mentor forms.
// Submitting opens the visitor's email app with the message pre-filled.
const JoinCard = () => {
  const [mode, setMode] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', message: '' }); // shared, so switching keeps what was typed
  const copy = MODES[mode];
  const isMentor = mode === 'mentor';

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(copy.subject);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:${CLUB_EMAIL}?subject=${subject}&body=${body}`;
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="mx-auto mt-20 mb-12 max-w-5xl">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark dark:text-gold">Get involved</p>
        <span className="mx-auto mt-2 block h-0.5 w-11 bg-gold" aria-hidden="true" />
        <h3 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-navy-ink dark:text-white">
          Join us <span className="text-navy dark:text-gold">or help us grow</span>
        </h3>
      </div>

      <div className="grid overflow-hidden rounded-[18px] bg-white shadow-[0_30px_60px_rgba(11,29,58,0.12)] dark:bg-slate-800 md:grid-cols-[0.9fr_1.1fr]">
        {/* Info panel — changes with the toggle */}
        <div className="relative overflow-hidden bg-slate-900 p-8 text-white sm:p-11">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold opacity-20 blur-[110px]" aria-hidden="true" />
          <div key={mode} className="relative" style={swapIn}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">{copy.eyebrow}</p>
            <p className="mt-3 font-display text-3xl font-extrabold leading-tight">{copy.title}</p>
            <ul className="mt-5 space-y-2.5">
              {copy.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2.5 text-[15px] leading-snug text-slate-300">
                  <Icon name="check" className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mt-9 border-t border-white/10 pt-6">
            <p className="text-[13px] text-slate-400">Prefer email?</p>
            <a href={`mailto:${CLUB_EMAIL}`} className="mt-1 inline-block font-semibold text-white hover:text-gold">{CLUB_EMAIL}</a>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 sm:p-11">
          <div className="relative inline-grid grid-cols-2 rounded-full border border-cream-line bg-cream p-1 dark:border-white/10 dark:bg-slate-900" role="group" aria-label="I am a">
            <span
              className={`absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full bg-navy transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-gold ${isMentor ? 'translate-x-full' : ''}`}
              aria-hidden="true"
            />
            {Object.entries(MODES).map(([key, value]) => (
              <button
                key={key}
                type="button"
                aria-pressed={mode === key}
                onClick={() => setMode(key)}
                className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-300 sm:px-5 ${mode === key ? 'text-white dark:text-navy-ink' : 'text-slate-500 hover:text-navy-ink dark:text-slate-400 dark:hover:text-white'}`}
              >
                <Icon name={key} className="h-4 w-4" />
                {value.label}
              </button>
            ))}
          </div>

          <form key={mode} onSubmit={handleSubmit} className="mt-3" style={swapIn}>
            <FloatingField id="join-name" name="name" label="Full name" value={form.name} onChange={handleChange} autoComplete="name" required />
            <FloatingField id="join-email" name="email" type="email" label={copy.emailLabel} value={form.email} onChange={handleChange} autoComplete="email" required />
            <FloatingField id="join-message" name="message" label={copy.messageLabel} value={form.message} onChange={handleChange} multiline rows={4} required />

            <button
              type="submit"
              className={`group mt-5 flex w-full items-center justify-center gap-2 rounded-[10px] px-5 py-3.5 text-[15px] font-semibold transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 ${isMentor
                ? 'bg-gold text-navy-ink shadow-[0_10px_24px_rgba(201,162,39,0.3)]'
                : 'bg-navy text-white shadow-[0_10px_24px_rgba(11,42,91,0.25)] dark:bg-gold dark:text-navy-ink'
                }`}
            >
              {copy.button}
              <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="mt-3 flex items-center gap-1.5 text-[12.5px] text-slate-500 dark:text-slate-400">
              <Icon name="mail" className="h-4 w-4" />
              Opens your email app with your message ready to send.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinCard;
