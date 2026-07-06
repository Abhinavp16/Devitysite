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
    <section id="about" className="py-10 sm:py-20 bg-slate-900/70 backdrop-blur-sm relative overflow-hidden transition-colors duration-300">
      <AboutAnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-7 grid items-stretch gap-4 sm:mb-12 sm:gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:rounded-3xl sm:p-8">
            <div className="mb-3 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300 sm:mb-5 sm:px-4 sm:py-2 sm:text-sm">About Us</div>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-5xl">
              Building The Future With <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">DevityClub</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:mt-6 sm:text-lg">
              The Devity Club is a dynamic student-led initiative aimed at fostering technical skills and promoting innovation among students. We help learners build real-world projects, grow through mentorship, and contribute to open-source communities.
            </p>
          </div>

          <div className="rounded-xl border border-blue-400/20 bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-blue-950/60 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:rounded-3xl sm:p-8">
            <h3 className="text-lg font-black text-white sm:text-2xl">Our Mission</h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:mt-5 sm:text-base">
              Empower students with hands-on skills across emerging domains like AI, Cybersecurity, DevOps, Cloud Computing, and Web Technologies. Bridge the gap between academic learning and industry expectations through impactful events, mentorship, and collaborative projects.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:mt-5 sm:text-base">
              Since our founding on 15th February 2023, we've hosted over 7+ events, supported 200+ members, and launched innovative projects that create real impact.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mb-7 sm:mb-10">
          {features.map((feature, index) => (
            <div key={index} className="rounded-xl border border-white/10 bg-white/[0.06] p-3.5 text-center shadow-lg backdrop-blur-xl sm:rounded-2xl sm:p-5">
              <div className={`w-11 h-11 ${feature.color} rounded-xl flex items-center justify-center text-lg mx-auto mb-3 shadow-lg sm:w-16 sm:h-16 sm:rounded-2xl sm:text-2xl sm:mb-4`}>
                {feature.icon}
              </div>
              <h4 className="text-[15px] font-black text-white mb-2 sm:text-lg sm:mb-3">{feature.title}</h4>
              <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl md:p-8">
          <div className="grid grid-cols-3 gap-3 text-center md:gap-8">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-2xl font-black text-blue-400 mb-1 md:text-5xl md:mb-2">{stat.number}</div>
                <div className="text-[11px] leading-tight text-slate-300 font-semibold md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
