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
    { number: "15+", label: "Industry Mentors" },
    { number: "7+", label: "Events" },
    { number: "25+", label: "Team Members" }
  ];

  return (
    <section id="about" className="py-20 bg-slate-900/70 backdrop-blur-sm relative overflow-hidden transition-colors duration-300">
      <AboutAnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 grid items-stretch gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <div className="mb-5 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.22em] text-blue-300">About Us</div>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Building The Future With <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">DevityClub</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              The Devity Club is a dynamic student-led initiative aimed at fostering technical skills and promoting innovation among students. We help learners build real-world projects, grow through mentorship, and contribute to open-source communities.
            </p>
          </div>

          <div className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-blue-950/60 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <h3 className="text-2xl font-black text-white">Our Mission</h3>
            <p className="mt-5 text-base leading-relaxed text-slate-300">
              Empower students with hands-on skills across emerging domains like AI, Cybersecurity, DevOps, Cloud Computing, and Web Technologies. Bridge the gap between academic learning and industry expectations through impactful events, mentorship, and collaborative projects.
            </p>
            <p className="mt-5 text-base leading-relaxed text-slate-300">
              Since our founding on 15th February 2023, we've hosted over 7+ events, supported 200+ members, and launched innovative projects that create real impact.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {features.map((feature, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-center shadow-lg backdrop-blur-xl">
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg`}>
                {feature.icon}
              </div>
              <h4 className="text-lg font-black text-white mb-3">{feature.title}</h4>
              <p className="text-sm leading-relaxed text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl md:p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-black text-blue-400 mb-2">{stat.number}</div>
                <div className="text-base text-slate-300 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
