import { useEffect, useRef, useState } from 'react';
import Icon from './admin/icons';
import JoinCard from './JoinCard';

const CLUB_EMAIL = 'club.devity@gmail.com';

// Collaboration formats; each opens a pre-filled email in the visitor's own mail app
const FORMATS = [
  {
    key: 'seminar', label: 'Seminar', duration: '1–2 hrs', icon: 'presentation',
    subject: 'Technical Seminar Proposal',
    body: 'Hello Devity Club,\n\nI am interested in proposing a technical seminar for your community.\n\nProposed topic:\nDuration: 1–2 hours\nTarget audience:\n\nAbout me\n- Name:\n- Organization:\n- Expertise:\n\nBest regards'
  },
  {
    key: 'workshop', label: 'Workshop', duration: '3–6 hrs', icon: 'wrench',
    subject: 'Workshop Planning Proposal',
    body: 'Hello Devity Club,\n\nI would like to conduct a hands-on workshop for your students.\n\nTopic:\nDuration: 3–6 hours\nMaterials needed:\nPrerequisites:\n\nAbout me\n- Name:\n- Organization:\n- Experience:\n\nBest regards'
  },
  {
    key: 'bootcamp', label: 'Bootcamp', duration: '2–5 days', icon: 'bolt',
    subject: 'Intensive Bootcamp Proposal',
    body: 'Hello Devity Club,\n\nI am interested in organizing an intensive bootcamp for your students.\n\nTopic / domain:\nDuration: 2–5 days\nSchedule:\nCertification:\n\nAbout me\n- Name:\n- Organization:\n- Qualifications:\n\nBest regards'
  },
  {
    key: 'talk', label: 'Industry talk', duration: '45–90 min', icon: 'microphone',
    subject: 'Industry Talk Proposal',
    body: 'Hello Devity Club,\n\nI would like to give an industry talk to your students.\n\nTopic:\nDuration: 45–90 minutes\nFormat: Presentation + Q&A\n\nAbout me\n- Name:\n- Current position:\n- Company:\n\nBest regards'
  },
  {
    key: 'hackathon', label: 'Hackathon', duration: '24–48 hrs', icon: 'trophy',
    subject: 'Hackathon Sponsorship Proposal',
    body: 'Hello Devity Club,\n\nI am interested in sponsoring or judging hackathons and coding competitions.\n\nSponsorship level:\nJudging availability:\nPrizes / mentorship:\n\nAbout us\n- Name:\n- Company / organization:\n\nBest regards'
  },
  {
    key: 'custom', label: 'Something else', duration: 'Flexible', icon: 'lightBulb',
    subject: 'Custom Collaboration Proposal',
    body: "Hello Devity Club,\n\nI have a collaboration idea I'd like to discuss with you.\n\nConcept:\nFormat:\nExpected outcomes:\n\nAbout me\n- Name:\n- Organization:\n\nBest regards"
  }
];

const CLUB_PROVIDES = [
  { icon: 'building', label: 'Venue & AV setup' },
  { icon: 'users', label: 'Student turnout' },
  { icon: 'megaphone', label: 'Promotion & posters' },
  { icon: 'academicCap', label: 'Certificates' }
];

const mailtoFor = (format) => `mailto:${CLUB_EMAIL}?subject=${encodeURIComponent(format.subject)}&body=${encodeURIComponent(format.body)}`;

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers without the async clipboard API
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    const ok = document.execCommand('copy');
    input.remove();
    return ok;
  }
};

const Contact = () => {
  const [selectedKey, setSelectedKey] = useState(FORMATS[0].key);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef(null);
  const selected = FORMATS.find((format) => format.key === selectedKey);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  const handleCopy = async () => {
    if (!(await copyText(CLUB_EMAIL))) return;
    setCopied(true);
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="bg-white py-20 transition-colors duration-300 dark:bg-slate-900 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="font-jakarta text-navy-ink">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-dark dark:text-gold">Collaborate</p>
            <span className="mx-auto mb-4 mt-2.5 block h-0.5 w-11 bg-gold" aria-hidden="true" />
            <h2 className="text-4xl font-extrabold leading-tight tracking-[-0.03em] dark:text-white sm:text-[2.75rem]">
              What would you like to <span className="text-navy dark:text-gold">run?</span>
            </h2>
            <p className="mt-3 text-base text-slate-500 dark:text-slate-300 sm:text-[16.5px]">Pick a format — we've drafted the email for you.</p>
          </div>

          <div className="mt-11 grid items-start gap-7 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Collaboration format">
                {FORMATS.map((format) => {
                  const isSelected = format.key === selectedKey;
                  return (
                    <button
                      key={format.key}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedKey(format.key)}
                      className={`flex items-center gap-3 rounded-2xl border-[1.5px] bg-white p-3.5 text-left ${isSelected ? 'border-navy shadow-[0_0_0_3px_rgba(11,42,91,0.08)]' : 'border-navy-ink/10'}`}
                    >
                      <span className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl ${isSelected ? 'bg-navy text-white' : 'bg-cream text-navy'}`}>
                        <Icon name={format.icon} className="h-[22px] w-[22px]" strokeWidth={1.7} />
                      </span>
                      <span>
                        <b className="block text-[14.5px] font-extrabold text-navy-ink">{format.label}</b>
                        <small className="text-xs font-semibold text-slate-500">{format.duration}</small>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-cream-line bg-cream px-5 py-5">
                <h3 className="mb-3 text-sm font-extrabold">What the club takes care of</h3>
                <ul className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
                  {CLUB_PROVIDES.map((item) => (
                    <li key={item.label} className="flex items-center gap-2.5 text-[13.5px] font-semibold text-slate-700">
                      <Icon name={item.icon} className="h-5 w-5 text-navy" strokeWidth={1.7} />
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 flex items-start gap-2 text-[13.5px] text-slate-500 dark:text-slate-400">
                <Icon name="info" className="mt-px h-[18px] w-[18px] shrink-0 text-gold-dark dark:text-gold" strokeWidth={1.8} />
                The email opens in your own mail app with a short template to fill in. Nothing is sent until you hit send.
              </p>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-navy-ink/10 bg-white shadow-[0_18px_40px_rgba(11,29,58,0.08)]">
              <div className="flex items-center gap-[7px] border-b border-cream-line bg-cream px-[18px] py-3" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-[#d9d4c7]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#d9d4c7]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#d9d4c7]" />
                <span className="ml-2 text-[12.5px] font-bold text-slate-500">New message</span>
              </div>
              <dl className="border-b border-navy-ink/10 px-[22px] py-1.5 text-sm">
                <div className="flex gap-3 border-b border-navy-ink/10 py-2.5">
                  <dt className="w-[60px] shrink-0 text-[13px] font-semibold text-slate-500">To</dt>
                  <dd className="min-w-0 break-all font-bold">{CLUB_EMAIL}</dd>
                </div>
                <div className="flex gap-3 py-2.5">
                  <dt className="w-[60px] shrink-0 text-[13px] font-semibold text-slate-500">Subject</dt>
                  <dd className="font-bold">{selected.subject}</dd>
                </div>
              </dl>
              <pre className="min-h-[230px] whitespace-pre-wrap px-[22px] py-[18px] font-jakarta text-[13.5px] font-medium leading-[1.7] text-slate-700">{selected.body}</pre>
              <div className="flex flex-wrap gap-2.5 border-t border-navy-ink/10 bg-[#fcfbf8] px-[22px] py-4">
                <a href={mailtoFor(selected)} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-navy px-[22px] py-[13px] text-[14.5px] font-bold text-white">
                  <Icon name="send" className="h-[18px] w-[18px]" strokeWidth={1.8} /> Open in mail app
                </a>
                <button type="button" onClick={handleCopy} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-navy-ink/10 bg-white px-[22px] py-[13px] text-[14.5px] font-bold text-navy">
                  <Icon name={copied ? 'check' : 'clipboard'} className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  <span aria-live="polite">{copied ? 'Copied' : 'Copy address'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Student / mentor sign-up card */}
        <JoinCard />
      </div>
    </section>
  );
};

export default Contact;
