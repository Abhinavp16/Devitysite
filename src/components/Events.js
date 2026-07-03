import { useEffect, useState } from 'react';
import { EventsAnimatedBackground } from './AnimatedBackground';
import publicApiService from '../services/publicApiService';
import '../styles/Events.css';

const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

const eventColor = (status) => {
  if (status === 'upcoming') return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white';
  if (status === 'cancelled') return 'bg-red-100 text-red-600';
  return 'bg-blue-100 text-blue-600';
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

    return (
      <div key={event.id || index} className={`event-card group ${isUpcoming ? 'event-card-upcoming' : 'event-card-completed'} ${small ? 'event-card-small' : ''}`}>
        {isUpcoming && <><div className="upcoming-glow"></div><div className="upcoming-shimmer"></div></>}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className={`${small ? 'event-type-badge-small' : 'event-type-badge'} ${eventColor(event.status)}`}>{event.event_type}</div>
          <div className={`event-status-badge ${isUpcoming ? 'event-status-upcoming' : isOngoing ? 'event-status-ongoing' : 'event-status-completed'}`}>
            <span>{isUpcoming ? '🚀 Upcoming' : isOngoing ? '⚡ Ongoing' : isCancelled ? '⚠️ Cancelled' : '✅ Completed'}</span>
          </div>
        </div>
        <h3 className={small ? 'event-title event-title-small' : `event-title ${isUpcoming ? 'event-title-upcoming' : 'event-title-regular'}`}>{event.title}</h3>
        <p className={small ? 'event-description event-description-small' : `event-description ${isUpcoming ? 'event-description-upcoming' : 'event-description-regular'}`}>{event.description}</p>
        <div className={`${small ? 'event-details-small' : 'event-details'} space-y-2`}>
          <div className={`event-detail-item ${isUpcoming ? 'event-detail-upcoming' : 'event-detail-regular'} ${small ? 'text-xs' : ''}`}>
            <span>{formatDate(event.event_date)} • {event.event_time}</span>
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
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Upcoming <span className="text-blue-600 dark:text-blue-400">Events</span></h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">Join our exciting events and workshops to enhance your skills and connect with fellow tech enthusiasts.</p>
        </div>

        {isLoading && <p className="text-center text-gray-600 dark:text-gray-300">Loading events from database...</p>}
        {error && <p className="text-center text-red-600">Unable to load events: {error}</p>}
        {!isLoading && !error && events.length === 0 && <p className="text-center text-gray-600 dark:text-gray-300">No events available yet.</p>}

        {featuredEvents.length > 0 && <div className="grid md:grid-cols-2 gap-8 mb-12">{featuredEvents.map((event, index) => renderEventCard(event, index))}</div>}
        {pastEvents.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Past <span className="text-blue-600 dark:text-blue-400">Events</span></h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">{pastEvents.map((event, index) => renderEventCard(event, index, true))}</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
