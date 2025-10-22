import { EventsAnimatedBackground } from './AnimatedBackground';

const Events = () => {
  const events = [
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
      title: "Devity Summit 2025",
      date: "September 01-02, 2025",
      time: "09:00 AM - 04:30 PM ",
      location: "Auditorium",
      type: "Seminar",
      description: "Learn From Leaders . Build For Industries.",
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
          {events.map((event, index) => (
            <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${event.color}`}>
                  {event.type}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${event.status === 'upcoming' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                  {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">{event.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">{event.description}</p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-1 1m7-1l1 1m-1-1v4a2 2 0 01-2 2H9a2 2 0 01-2-2V8m0 0V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                  </svg>
                  {event.date} • {event.time}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </div>
              </div>

              {event.status === 'upcoming' ? (
                <button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors duration-300 font-semibold">
                  Register Now
                </button>
              ) : (
                <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-3 px-6 rounded-lg cursor-not-allowed font-semibold transition-colors duration-300">
                  Event Completed
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;