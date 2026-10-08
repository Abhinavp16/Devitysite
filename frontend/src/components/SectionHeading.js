// Eyebrow label + gold rule + serif title, shared by the navy & gold styled sections
const SectionHeading = ({ eyebrow, title, className = '' }) => (
  <div className={`mb-10 ${className}`}>
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-dark dark:text-gold">{eyebrow}</p>
    <span className="mt-2 block h-0.5 w-10 bg-gold" aria-hidden="true" />
    <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-navy-ink dark:text-white sm:text-[2.6rem]">
      {title}
    </h2>
  </div>
);

export default SectionHeading;
