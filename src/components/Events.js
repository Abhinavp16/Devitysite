import { useEffect, useState } from 'react';
import { EventsAnimatedBackground } from './AnimatedBackground';
import publicApiService from '../services/publicApiService';
import '../styles/Events.css';

const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

const formatDay = (date) => date ? new Date(date).toLocaleDateString('en-US', { day: '2-digit' }) : '';

const formatMonth = (date) => date ? new Date(date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : '';

const pastEventVisuals = [
  'from-fuchsia-600 via-purple-700 to-slate-950',
  'from-slate-950 via-gray-800 to-zinc-700',
  'from-cyan-500 via-blue-700 to-slate-950',
  'from-orange-500 via-rose-700 to-slate-950'
];

const eventColor = (status) => {
  if (status === 'upcoming') return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white';
  if (status === 'cancelled') return 'bg-red-100 text-red-600';
  return 'bg-blue-100 text-blue-600';
};

const SectionNotice = ({ tone = 'neutral', children }) => {
  const toneClass = tone === 'error'
    ? 'border-red-200/70 bg-red-50/80 text-red-700 dark:border-red-400/30 dark:bg-red-950/30 dark:text-red-200'
    : 'border-blue-200/70 bg-white/70 text-gray-700 dark:border-white/10 dark:bg-gray-900/50 dark:text-gray-200';

  return (
    <div className={`mx-auto max-w-2xl rounded-2xl border px-5 py-4 text-center shadow-lg backdrop-blur-xl ${toneClass}`}>
      {children}
    </div>
  );
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  const featuredEvents = events.filter((event) => event.status === 'upcoming' || event.status === 'ongoing');
  const pastEvents = events.filter((event) => event.status !== 'upcoming' && event.status !== 'ongoing');

  const renderEventCard = (event, index, small = false) => {
    const isUpcoming = event.status === 'upcoming';
    const isCancelled = event.status === 'cancelled';
    const isOngoing = event.status === 'ongoing';

    if (small) {
      const buttonLabel = event.status === 'completed' ? 'Completed' : isCancelled ? 'Cancelled' : 'Register Now';

      return (
        <div key={event.id || index} className="overflow-hidden rounded-xl bg-white text-slate-950 shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
          <div className={`relative h-16 sm:h-20 bg-gradient-to-br ${pastEventVisuals[index % pastEventVisuals.length]}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_26%),radial-gradient(circle_at_70%_65%,rgba(255,255,255,0.2),transparent_28%)]" />
            <div className="absolute left-3 top-3 rounded bg-orange-600 px-2 py-1 text-[10px] font-bold text-white">{event.event_type}</div>
            <div className="absolute right-3 top-3 rounded bg-white px-2 py-1 text-center text-slate-950 shadow-sm">
              <div className="text-sm font-black leading-none">{formatDay(event.event_date)}</div>
              <div className="mt-0.5 text-[10px] font-black leading-none text-orange-600">{formatMonth(event.event_date)}</div>
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <h3 className="line-clamp-2 text-sm font-black leading-tight text-slate-950 sm:text-base">{event.title}</h3>
            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[10px] font-medium text-slate-600 sm:mt-3 sm:gap-x-4 sm:text-xs">
              <span>{event.event_time}</span>
              <span>{event.location}</span>
            </div>
            <p className="mt-2 line-clamp-3 text-[10px] leading-relaxed text-slate-600 sm:mt-3 sm:text-xs">{event.description}</p>
            <button className={`mt-3 w-fit rounded px-2.5 py-1.5 text-[10px] font-semibold text-white sm:mt-4 sm:px-3 sm:py-2 sm:text-xs ${event.status === 'completed' ? 'bg-slate-500' : isCancelled ? 'bg-red-500' : 'bg-blue-600'}`}>{buttonLabel}</button>
          </div>
        </div>
      );
    }

    return (
      <div key={event.id || index} className={`event-card group ${isUpcoming ? 'event-card-upcoming' : 'event-card-completed'} ${small ? 'event-card-small' : ''}`}>
        {isUpcoming && <><div className="upcoming-glow"></div><div className="upcoming-shimmer"></div></>}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className={`${small ? 'event-type-badge-small' : 'event-type-badge'} ${eventColor(event.status)}`}>{event.event_type}</div>
          <div className={`event-status-badge ${isUpcoming ? 'event-status-upcoming' : isOngoing ? 'event-status-ongoing' : 'event-status-completed'}`}>
            <span>{isUpcoming ? 'Upcoming' : isOngoing ? 'Ongoing' : isCancelled ? 'Cancelled' : 'Completed'}</span>
          </div>
        </div>
        <h3 className={small ? 'event-title event-title-small' : `event-title ${isUpcoming ? 'event-title-upcoming' : 'event-title-regular'}`}>{event.title}</h3>
        <p className={small ? 'event-description event-description-small' : `event-description ${isUpcoming ? 'event-description-upcoming' : 'event-description-regular'}`}>{event.description}</p>
        <div className={`${small ? 'event-details-small' : 'event-details'} space-y-2`}>
          <div className={`event-detail-item ${isUpcoming ? 'event-detail-upcoming' : 'event-detail-regular'} ${small ? 'text-xs' : ''}`}>
            <span>{formatDate(event.event_date)} | {event.event_time}</span>
          </div>
          <div className={`event-detail-item ${isUpcoming ? 'event-detail-upcoming' : 'event-detail-regular'} ${small ? 'text-xs' : ''}`}>
            <span>{event.location}</span>
          </div>
        </div>
        {!small && event.registration_link && isUpcoming && (
          <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="event-button event-button-upcoming group/btn block text-center no-underline mt-4">Register Now</a>
        )}
      </div>
    );
  };

  return (
    <section id="events" className="events-section">
      <EventsAnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="mb-4 inline-flex rounded-full border border-blue-200/70 bg-white/70 px-4 py-2 text-sm font-bold uppercase tracking-[0.25em] text-blue-600 shadow-sm backdrop-blur-xl dark:border-blue-400/20 dark:bg-white/5 dark:text-blue-300">Live Calendar</div>
          <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-5 transition-colors duration-300 sm:text-5xl md:text-6xl">Upcoming Events</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300 sm:text-xl">Join our exciting events and workshops to enhance your skills and connect with fellow tech enthusiasts.</p>
        </div>

        {isLoading && <SectionNotice>Loading events from database...</SectionNotice>}
        {error && <SectionNotice tone="error">Unable to load events: {error}</SectionNotice>}
        {!isLoading && !error && events.length === 0 && <SectionNotice>No events available yet.</SectionNotice>}

        {featuredEvents.length > 0 && <div className="grid md:grid-cols-2 gap-8 mb-12">{featuredEvents.map((event, index) => renderEventCard(event, index))}</div>}
        {pastEvents.length > 0 && (
          <div className="mt-16">
            <h3 className="text-center text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-6">Past <span className="text-blue-600 dark:text-blue-400">Events</span></h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">{pastEvents.map((event, index) => renderEventCard(event, index, true))}</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
