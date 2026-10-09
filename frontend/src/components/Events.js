import { useCallback, useEffect, useRef, useState } from 'react';
import publicApiService from '../services/publicApiService';
import Icon from './admin/icons';
import SkeletonBone from './SkeletonBone';
import '../styles/Events.css';

// Event dates are stored as UTC midnight ("YYYY-MM-DD"), so format them in UTC
const formatPart = (date, options) => new Date(date).toLocaleDateString('en-US', { ...options, timeZone: 'UTC' });

const daysUntil = (date) => {
  const now = new Date();
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((new Date(date).getTime() - todayUTC) / 86400000);
};

const countdownLabel = (date) => {
  const days = daysUntil(date);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
};

const isUpcoming = (event) => event.status === 'upcoming' || event.status === 'ongoing';
const byDate = (a, b) => new Date(a.event_date) - new Date(b.event_date);

const Ticket = ({ event, number }) => {
  const upcoming = isUpcoming(event);

  return (
    <div className={`event-ticket-wrap ${upcoming ? 'is-upcoming' : ''}`}>
      <article className={`event-ticket event-type-${event.event_type}`}>
        <div className="event-stub" aria-hidden="true">
          <b className="event-stub-day">{formatPart(event.event_date, { day: '2-digit' })}</b>
          <small className="event-stub-month">{formatPart(event.event_date, { month: 'short' }).toUpperCase()}</small>
          <span className="event-stub-year">{formatPart(event.event_date, { year: 'numeric' })}</span>
          <em className="event-stub-no not-italic">{upcoming ? 'NEXT UP' : `No. ${String(number).padStart(3, '0')}`}</em>
        </div>

        <div className="flex min-w-0 flex-col gap-2.5 py-5 pl-5 pr-4 sm:pl-6 sm:pr-5">
          <div className="flex flex-wrap gap-1.5">
            {upcoming && <span className="event-tag event-tag-next">Upcoming</span>}
            <span className="event-tag">{event.event_type}</span>
          </div>

          <h3 className="event-ticket-title line-clamp-2 text-[17px] font-extrabold tracking-tight text-navy-ink">{event.title}</h3>
          <p className="sr-only">{formatPart(event.event_date, { day: 'numeric', month: 'long', year: 'numeric' })}</p>

          <div className="flex flex-col gap-1.5 text-[13.5px] font-medium text-slate-500">
            <span className="flex min-w-0 items-center gap-2.5">
              <Icon name="clock" className="h-5 w-5 shrink-0 text-navy" strokeWidth={1.8} />
              <span className="truncate">{event.event_time}</span>
            </span>
            <span className="flex min-w-0 items-center gap-2.5">
              <Icon name="mapPin" className="h-5 w-5 shrink-0 text-navy" strokeWidth={1.8} />
              <span className="truncate">{event.location}</span>
            </span>
          </div>

          <div className="mt-auto flex min-h-[46px] items-center justify-between gap-2.5 border-t border-dashed border-navy-ink/10 pt-3">
            {upcoming ? (
              <>
                <span className="whitespace-nowrap text-[12.5px] font-bold text-gold-dark">{countdownLabel(event.event_date)}</span>
                {event.registration_link ? (
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-navy px-4 py-2.5 text-[13.5px] font-bold text-white"
                  >
                    Register now <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
                  </a>
                ) : (
                  <span className="whitespace-nowrap rounded-full bg-cream px-4 py-2.5 text-[12.5px] font-bold text-slate-500">Registration opens soon</span>
                )}
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-bold text-green-700">
                  <Icon name="check" className="h-[18px] w-[18px]" strokeWidth={2} /> Completed
                </span>
                <span className="event-barcode" aria-hidden="true" />
              </>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

const TicketSkeleton = ({ index }) => (
  <div className="event-ticket-wrap">
    <div className="event-ticket">
      <SkeletonBone className="h-full w-full rounded-none" delay={index * 0.1} />
      <div className="flex flex-col gap-3 p-6">
        <SkeletonBone className="h-5 w-24 rounded-md" delay={index * 0.1} />
        <SkeletonBone className="h-5 w-full rounded-md" delay={index * 0.1 + 0.05} />
        <SkeletonBone className="h-4 w-2/3 rounded-md" delay={index * 0.1 + 0.1} />
        <SkeletonBone className="h-4 w-1/2 rounded-md" delay={index * 0.1 + 0.15} />
      </div>
    </div>
  </div>
);

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [scroll, setScroll] = useState({ pages: 1, current: 0, atStart: true, atEnd: true });
  const railRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    publicApiService.getEvents()
      .then((data) => {
        if (isMounted) setEvents(data);
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

  // Soonest upcoming first, then past events newest first
  const upcomingEvents = events.filter(isUpcoming).sort(byDate);
  const pastEvents = events.filter((event) => !isUpcoming(event)).sort((a, b) => byDate(b, a));
  const tickets = [...upcomingEvents, ...pastEvents];

  const syncScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    const pages = Math.max(1, Math.ceil(rail.scrollWidth / rail.clientWidth));
    setScroll({
      pages,
      current: maxScroll > 0 ? Math.round((rail.scrollLeft / maxScroll) * (pages - 1)) : 0,
      atStart: rail.scrollLeft < 4,
      atEnd: rail.scrollLeft > maxScroll - 4
    });
  }, []);

  useEffect(() => {
    syncScroll();
    window.addEventListener('resize', syncScroll);
    return () => window.removeEventListener('resize', syncScroll);
  }, [syncScroll, tickets.length]);

  const scrollBy = (direction) => {
    const rail = railRef.current;
    if (rail) rail.scrollBy({ left: direction * (rail.clientWidth - 60), behavior: 'smooth' });
  };

  const arrowClass = 'flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-navy-ink/10 bg-white text-navy disabled:cursor-default disabled:opacity-35';

  return (
    <section id="events" className="bg-white py-20 font-jakarta text-navy-ink transition-colors duration-300 dark:bg-slate-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-dark dark:text-gold">Events</p>
            <span className="mb-4 mt-2.5 block h-0.5 w-11 bg-gold" aria-hidden="true" />
            <h2 className="text-4xl font-extrabold leading-tight tracking-[-0.03em] dark:text-white sm:text-[2.9rem]">
              Events we've <span className="text-navy dark:text-gold">hosted</span>
            </h2>
            <p className="mt-3 text-base text-slate-500 dark:text-slate-300 sm:text-[16.5px]">Workshops, bootcamps, seminars and competitions run by the club.</p>
          </div>

          {tickets.length > 1 && (
            <div className="flex gap-2.5">
              <button type="button" className={arrowClass} onClick={() => scrollBy(-1)} disabled={scroll.atStart} aria-label="Previous events">
                <Icon name="arrowLeft" className="h-5 w-5" strokeWidth={2} />
              </button>
              <button type="button" className={arrowClass} onClick={() => scrollBy(1)} disabled={scroll.atEnd} aria-label="Next events">
                <Icon name="arrowRight" className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>

        {!isLoading && !error && upcomingEvents.length === 0 && (
          <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-cream-line bg-cream py-3 pl-3 pr-5 text-[14.5px] font-medium text-navy-ink">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gold-dark">
              <Icon name="calendar" className="h-6 w-6" strokeWidth={1.8} />
            </span>
            {events.length > 0
              ? 'No upcoming events right now — the next one will appear here first.'
              : 'No events yet — the first one will appear here.'}
          </div>
        )}

        {error && (
          <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            Unable to load events: {error}
          </div>
        )}

        {(isLoading || tickets.length > 0) && (
          <>
            <div
              ref={railRef}
              onScroll={() => requestAnimationFrame(syncScroll)}
              className="event-rail -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-11 pt-9 sm:-mx-6 sm:scroll-px-6 sm:gap-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8"
            >
              {isLoading
                ? [0, 1, 2].map((index) => <TicketSkeleton key={index} index={index} />)
                : tickets.map((event, index) => (
                  <Ticket key={event.id || index} event={event} number={pastEvents.length - (index - upcomingEvents.length)} />
                ))}
            </div>

            {!isLoading && scroll.pages > 1 && (
              <div className="flex justify-center gap-1.5" aria-hidden="true">
                {Array.from({ length: scroll.pages }, (_, index) => (
                  <span
                    key={index}
                    className={`h-[7px] rounded transition-all duration-300 ${index === scroll.current ? 'w-6 bg-navy dark:bg-gold' : 'w-[7px] bg-slate-300 dark:bg-slate-600'}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Events;
