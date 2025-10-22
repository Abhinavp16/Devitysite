import { AboutAnimatedBackground } from './AnimatedBackground';

const About = () => {
  const features = [
    {
      icon: "🎓",
      title: "Learn & Build",
      description: "Master cutting-edge technologies through hands-on workshops and real-world projects.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: "👥",
      title: "Community Driven",
      description: "Join a passionate community of developers, designers, and tech enthusiasts.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: "🏆",
      title: "Compete & Excel",
      description: "Participate in hackathons, coding competitions, and tech challenges.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: "💡",
      title: "Innovation Hub",
      description: "Turn your ideas into reality with mentorship and collaborative opportunities.",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  const stats = [
    { number: "25+", label: "Industry Mentors" },
    { number: "30+", label: "Events" },
    { number: "25+", label: "Team Members" }
  ];

  return (
    <section id="about" className="py-20 bg-white/60 backdrop-blur-sm relative overflow-hidden">
      <AboutAnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About <span className="text-blue-600">DevityClub</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are a vibrant community of technology enthusiasts dedicated to learning, building,
            and shaping the future of tech together.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 backdrop-blur-sm border border-white/20">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Devity Club empowers students and professionals to explore the endless possibilities
              of technology. We believe in learning by doing, building through collaboration, and
              growing together as a community.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Since our founding in 15 th February 2023, we've hosted over 30+ events, supported 300+ members,
              and launched dozens of innovative projects that have made a real impact.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className={`w-20 h-20 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                <div className="text-xl text-gray-700 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;