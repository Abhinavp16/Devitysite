import { EventsAnimatedBackground } from './AnimatedBackground';

const Events = () => {
  const events = [
    {
      title: "ENVISION-X 2026: Transform Ideas into Reality",
      date: "February 2026",
      time: "Coming Soon",
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
    <section id="events" className="py-20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm relative overflow-hidden transition-colors duration-300">
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
                className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 group ${isUpcoming
                  ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:via-gray-800/80 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-500/30 hover:border-blue-300 dark:hover:border-blue-400/50 animate-pulse-glow'
                  : isOngoing
                    ? 'bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-900/20 dark:via-gray-800/80 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-500/30'
                    : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600'
                  } hover:scale-105 transform`}
              >
                {/* Upcoming event special effects */}
                {isUpcoming && (
                  <>
                    {/* Animated gradient border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-xl opacity-20 animate-gradient-x"></div>

                    {/* Floating particles */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute top-4 right-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute top-6 right-3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  </>
                )}

                {/* Event type and status badges */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${event.color} ${isUpcoming ? 'animate-bounce-subtle' : ''}`}>
                    {event.type}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium relative ${isUpcoming
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg animate-pulse-bright'
                    : isOngoing
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
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
                <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 relative z-10 ${isUpcoming
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400'
                  : 'text-gray-900 dark:text-white'
                  }`}>
                  {event.title}
                  {isUpcoming && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur rounded-lg opacity-50 animate-pulse"></div>
                  )}
                </h3>

                <p className={`mb-4 transition-colors duration-300 relative z-10 ${isUpcoming
                  ? 'text-gray-700 dark:text-gray-200 font-medium'
                  : 'text-gray-600 dark:text-gray-300'
                  }`}>
                  {event.description}
                </p>

                {/* Event details */}
                <div className="space-y-2 mb-6 relative z-10">
                  <div className={`flex items-center transition-colors duration-300 ${isUpcoming ? 'text-gray-700 dark:text-gray-200' : 'text-gray-600 dark:text-gray-300'
                    }`}>
                    <svg className={`w-5 h-5 mr-3 ${isUpcoming ? 'text-blue-500 animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-1 1m7-1l1 1m-1-1v4a2 2 0 01-2 2H9a2 2 0 01-2-2V8m0 0V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                    </svg>
                    <span className={isUpcoming ? 'font-semibold' : ''}>{event.date} • {event.time}</span>
                  </div>
                  <div className={`flex items-center transition-colors duration-300 ${isUpcoming ? 'text-gray-700 dark:text-gray-200' : 'text-gray-600 dark:text-gray-300'
                    }`}>
                    <svg className={`w-5 h-5 mr-3 ${isUpcoming ? 'text-purple-500 animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className={isUpcoming ? 'font-semibold' : ''}>{event.location}</span>
                  </div>
                </div>

                {/* Action button */}
                {isUpcoming ? (
                  <button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-lg transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden group/btn">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center">
                      🎯 Register Now
                      <svg className="w-5 h-5 ml-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                ) : isOngoing ? (
                  <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-3 px-6 rounded-lg transition-all duration-300 font-semibold shadow-lg">
                    ⚡ Event in Progress
                  </button>
                ) : (
                  <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-3 px-6 rounded-lg cursor-not-allowed font-semibold transition-colors duration-300">
                    ✅ Event Completed
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom CSS for upcoming event animations */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.5), 0 0 40px rgba(147, 51, 234, 0.3);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        @keyframes pulse-bright {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease-in-out infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .animate-pulse-bright {
          animation: pulse-bright 2s ease-in-out infinite;
        }

        /* Hover effects for upcoming events */
        .group:hover .animate-pulse-glow {
          animation-duration: 1.5s;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .animate-pulse-glow {
            animation-duration: 4s;
          }
          
          .animate-gradient-x {
            animation-duration: 4s;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-glow,
          .animate-gradient-x,
          .animate-bounce-subtle,
          .animate-pulse-bright {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Events;