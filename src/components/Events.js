import { EventsAnimatedBackground } from './AnimatedBackground';
import '../styles/Events.css';

const Events = () => {
  const events = [
    {
      title: "ENVISION-X 2026: Transform Ideas into Reality",
      date: "February 2026",
      time: "....",
      location: "Virtual Platform",
      type: "Innovation Challenge",
      description: "🚀 The biggest tech innovation challenge is back! Join us for a 45-day online project-based innovation challenge where ideas transform into reality. Build, innovate, and compete with the best minds in tech.",
      status: "Upcoming",
      color: "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
    },

    {
      title: "Legacy Connect 1.0",
      date: "September 12, 2025",
      time: "08:45 PM -10:45 PM",
      location: "Virtual Session",
      type: "Seminar",
      description: "From Footsteps to Milestones-Learn From Those Who Walked Before You.",
      status: "Completed",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "The Devity Spark",
      date: "September 07, 2025",
      time: "10:30 AM ",
      location: "Auditorium",
      type: "Seminar",
      description: "Ignite Your Campus Journey.",
      status: "Completed",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Devity Summit 2025",
      date: "September 01-02, 2025",
      time: "09:00 AM - 04:30 PM ",
      location: "Auditorium",
      type: "Seminar",
      description: "Learn From Leaders . Build For Industries.",
      status: "Ongoing",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "NetCamp",
      date: "August 04-22, 2025",
      time: "09:00 AM - 04:30 PM ",
      location: "Auditorium AUC",
      type: "Training Program",
      description: "Netcamp Summer Internship With Industrial Training 2025",
      status: "Completed",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: " Jumpstart Your Tech Career",
      date: "May 6, 2025",
      time: "09:00 AM - 04:30 PM ",
      location: "Auditorium",
      type: "Seminar",
      description: "Master Networking Fundamentals and Learn CCNA & CCNP for Job Assurance.",
      status: "Completed",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "ENVISION-X 2025: Transform Ideas into Reality",
      date: "February 4 - March 25, 2025",
      time: " ",
      location: "Virtual",
      type: "Innovation Challenge",
      description: "45-day online project-based innovation challenge.",
      status: "Completed",
      color: "bg-blue-100 text-blue-600"
    },

    {
      title: "CodeFusion :The DevOps Synergy",
      date: "February 04, 2025",
      time: "11:00 AM - 01:00 PM",
      location: "Auditorium",
      type: "Seminar",
      description: "Unifying development and operations for seamless integration, automation, and continuous delivery.",
      status: "Completed",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Net Secure 2025",
      date: "January 20, 2025",
      time: "10:00 AM - 11:30 AM",
      location: "Auditorium",
      type: "Seminar",
      description: " Building careers In Network Securities.",
      status: "completed",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Tech Elevate 2024",
      date: "November 22, 2024",
      time: "1:PM",
      location: "Auditorium",
      type: "Seminar",
      description: "DevOps & Cloud Computing.",
      status: "Completed",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <section id="events" className="events-section">
      <EventsAnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Upcoming <span className="text-blue-600 dark:text-blue-400">Events</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
            Join our exciting events and workshops to enhance your skills and connect with fellow tech enthusiasts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => {
            const isUpcoming = event.status.toLowerCase() === 'upcoming';
            const isOngoing = event.status.toLowerCase() === 'ongoing';

            return (
              <div
                key={index}
                className={`event-card group ${isUpcoming
                  ? 'event-card-upcoming'
                  : isOngoing
                    ? 'event-card-ongoing'
                    : 'event-card-completed'
                  }`}
              >
                {/* Upcoming event special effects */}
                {isUpcoming && (
                  <>
                    {/* Animated gradient border */}
                    <div className="upcoming-glow"></div>
                    <div className="upcoming-particles upcoming-particle-1"></div>
                    <div className="upcoming-particles upcoming-particle-2"></div>
                    <div className="upcoming-particles upcoming-particle-3"></div>
                    <div className="upcoming-shimmer"></div>
                  </>
                )}

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={`event-type-badge ${event.color} ${isUpcoming ? 'animate-bounce-subtle' : ''}`}>
                    {event.type}
                  </div>
                  <div className={`event-status-badge ${isUpcoming
                    ? 'event-status-upcoming'
                    : isOngoing
                      ? 'event-status-ongoing'
                      : 'event-status-completed'
                    }`}>
                    {isUpcoming && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-30 animate-pulse"></div>
                    )}
                    <span className="relative">
                      {isUpcoming ? '🚀 Upcoming' : isOngoing ? '⚡ Ongoing' : '✅ Completed'}
                    </span>
                  </div>
                </div>

                {/* Event title with special styling for upcoming */}
                <h3 className={`event-title ${isUpcoming ? 'event-title-upcoming' : 'event-title-regular'}`}>
                  {event.title}
                  {isUpcoming && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur rounded-lg opacity-50 animate-pulse"></div>
                  )}
                </h3>

                <p className={`event-description ${isUpcoming ? 'event-description-upcoming' : 'event-description-regular'}`}>
                  {event.description}
                </p>

                {/* Event details */}
                <div className="event-details space-y-2">
                  <div className={`event-detail-item ${isUpcoming ? 'event-detail-upcoming' : 'event-detail-regular'}`}>
                    <svg className={`event-detail-icon ${isUpcoming ? 'text-blue-500 event-detail-icon-upcoming' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-1 1m7-1l1 1m-1-1v4a2 2 0 01-2 2H9a2 2 0 01-2-2V8m0 0V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                    </svg>
                    <span className={isUpcoming ? 'font-semibold' : ''}>{event.date} • {event.time}</span>
                  </div>
                  <div className={`event-detail-item ${isUpcoming ? 'event-detail-upcoming' : 'event-detail-regular'}`}>
                    <svg className={`event-detail-icon ${isUpcoming ? 'text-purple-500 event-detail-icon-upcoming' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className={isUpcoming ? 'font-semibold' : ''}>{event.location}</span>
                  </div>
                </div>

                {/* Action button */}
                {isUpcoming ? (
                  <button className="event-button event-button-upcoming group/btn">
                    <div className="button-shimmer"></div>
                    <span className="relative z-10 flex items-center justify-center">
                      🎯 Upcoming
                      <svg className="w-5 h-5 ml-2 bounce-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                ) : isOngoing ? (
                  <button className="event-button event-button-ongoing">
                    ⚡ Event in Progress
                  </button>
                ) : (
                  <button className="event-button event-button-completed">
                    ✅ Event Completed
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>


    </section>
  );
};

export default Events;