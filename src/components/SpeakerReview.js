import { SpeakerReviewAnimatedBackground } from './AnimatedBackground';

const reviews = [
  {
    name: "Mr. Rohit Singhal",
    role: "Auger – Software Development Manager",
    image: "https://i.pravatar.cc/150?img=47",
    review:
      "It was a pleasure mentoring your club. I truly appreciated the enthusiasm, curiosity, teamwork, and dedication each member showed. Your professionalism, preparation, and eagerness to learn made the experience smooth and rewarding. Keep pushing boundaries, supporting one another, and staying open to feedback—I'm confident you'll achieve great things. Wishing the club continued success ahead.",
    highlight: "Strong Leadership"
  },
  {
    name: "Mrs. Meeta Rathore ",
    role: "Sr. Big Data Engineer, Optum (UHG)",
    image: "https://i.pravatar.cc/150?img=12",
    review:
      "Mentoring Devity Club’s data science cohort was a rewarding experience—students rapidly progressed from exploratory analysis to production-ready pipelines, demonstrating strong ownership and curiosity. Their final models showed measurable improvements in accuracy and robustness, and their documentation and MLOps hygiene exceeded expectations for early-career talent. Devity Club provides a structured, industry-aligned environment that truly accelerates learning and readiness for real-world projects.",
    highlight: "Highly Professional"
  },
  {
    name: "Mr. Rohit Agarwal",
    role: "Senior Data Engineering Lead |  OPTUM ",
    image: "https://i.pravatar.cc/150?img=32",
    review:
      "Attending the 2-day speaker session at Amity University Raipur was an incredible experience. The event was well-organized, with an enthusiastic team and inspiring participants. I truly enjoyed delivering my session on Data Engineering and engaging with such bright minds. The discussions were insightful, and the energy throughout the event was remarkable. Kudos to the organizers for creating a platform that fosters learning and collaboration.",
    highlight: "Outstanding Tech Culture"
  },
  {
    name: "Mr. Anmol Rangari",
    role: "Cognizant",
    image: "https://i.pravatar.cc/150?img=47",
    review:
      "It was a wonderful experience being part of DEVITY Summit 2025 at Amity University. The event was exceptionally well-organized, and the efforts of the Devity Club were clearly reflected in the smooth execution and warm hospitality. Delivering a session on Cybersecurity and interacting with such enthusiastic students was truly rewarding. The curiosity, engagement, and thoughtful questions from participants highlighted a strong passion for learning and future-ready skills. I appreciate the excellent coordination throughout the event and look forward to contributing to more such initiatives in the future.“Hackers are not criminals; they are curious minds mastering social engineering to expose weaknesses before criminals do.",
    highlight: "Strong Leadership"
  }
];

export default function SpeakerReview() {
  return (
    <section
      className="relative py-12 overflow-hidden
        bg-gradient-to-br from-[#0B1426] via-[#0E1A33] to-[#1A2332]"
    >
      {/* Animated Background */}
      <SpeakerReviewAnimatedBackground />

      {/* Background effects */}
      <div
        className="absolute -top-24 left-1/4 w-[22rem] h-[22rem]
          bg-blue-500/10 blur-[120px] rounded-full animate-orb"
      />
      <div
        className="absolute top-1/3 right-10 w-[18rem] h-[18rem]
          bg-purple-500/10 blur-[120px] rounded-full animate-orb-slow"
      />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-5xl animate-bounce">🎤</div>
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
              Voices from Our Speakers
            </h2>
            <div className="text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>💬</div>
          </div>
          <div className="relative">
            <p className="text-xl text-gray-300 max-w-3xl mx-auto flex items-center justify-center gap-3 font-medium">
              <span className="text-3xl animate-pulse">⭐</span>
              Real feedback from industry leaders and academicians who've experienced our community
              <span className="text-3xl animate-pulse" style={{ animationDelay: '1s' }}>⭐</span>
            </p>
            {/* Decorative underline */}
            <div className="mt-4 flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Marquee */}
      <div className="relative w-full overflow-hidden z-20">
        {/* Side Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0B1426] via-[#0B1426]/50 to-transparent z-20 pointer-events-none hidden md:block" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#1A2332] via-[#1A2332]/50 to-transparent z-20 pointer-events-none hidden md:block" />

        <div className="flex animate-marquee hover:[animation-play-state:paused] w-fit">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 py-10 pr-8">
              {reviews.map((item, index) => (
                <div
                  key={index}
                  className="group relative w-[320px] md:w-[380px] flex-shrink-0
                    transition-all duration-700 hover:-translate-y-3 hover:scale-[1.02]
                    min-h-[420px] perspective-1000"
                  style={{
                    transform: `rotate(${index % 2 === 0 ? '-0.5deg' : '0.5deg'})`,
                    transformOrigin: 'center center'
                  }}
                >
                  {/* Main Card */}
                  <div className="relative h-full rounded-3xl overflow-hidden
                    bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-gray-900/90
                    border border-slate-700/50 backdrop-blur-2xl
                    shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                    group-hover:shadow-[0_20px_60px_rgba(59,130,246,0.4)]
                    group-hover:border-blue-400/50
                    before:absolute before:inset-0 before:rounded-3xl
                    before:bg-gradient-to-br before:from-blue-500/10 before:via-transparent before:to-purple-500/10
                    before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700">
                    
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700
                      bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-purple-500/5"></div>
                    
                    {/* Floating particles */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
                    <div className="absolute top-8 right-8 w-1 h-1 bg-cyan-400 rounded-full opacity-40 animate-pulse"></div>
                    <div className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50 animate-bounce"></div>

                    {/* Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col">
                      {/* Header with highlight badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl animate-pulse">
                            {item.highlight === 'Strong Leadership' ? '👑' :
                              item.highlight === 'Highly Professional' ? '🏆' :
                                item.highlight === 'Outstanding Tech Culture' ? '🚀' : '⭐'}
                          </div>
                          <span className="inline-block text-xs px-3 py-1.5 rounded-full font-bold tracking-wide uppercase
                            bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white
                            shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/25 
                            transition-all duration-500 group-hover:scale-105">
                            {item.highlight}
                          </span>
                        </div>
                        <div className="text-xl opacity-60 group-hover:opacity-100 group-hover:animate-spin transition-all duration-500">
                          ✨
                        </div>
                      </div>

                      {/* Quote */}
                      <div className="flex-1 mb-4">
                        <div className="relative">
                          {/* Large decorative quotes */}
                          <div className="absolute -top-1 -left-1 text-4xl text-blue-400/30 font-serif leading-none">"</div>
                          <div className="absolute -bottom-2 -right-1 text-4xl text-blue-400/30 font-serif leading-none rotate-180">"</div>
                          
                          <blockquote className="relative z-10 text-gray-100 text-sm leading-relaxed font-medium
                            px-3 py-1 min-h-[160px] flex items-start">
                            <span className="italic line-clamp-none overflow-y-auto max-h-[200px] pr-2 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent">
                              {item.review}
                            </span>
                          </blockquote>
                        </div>
                      </div>

                      {/* Speaker Profile */}
                      <div className="relative">
                        {/* Decorative line */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-4"></div>
                        
                        <div className="flex items-center gap-3">
                          {/* Avatar with enhanced styling */}
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-0.5
                              group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-500">
                              <div className="w-full h-full rounded-full bg-slate-900 p-0.5">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-full object-cover
                                    group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                            </div>
                            {/* Status indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full
                              bg-gradient-to-r from-green-400 to-emerald-500 
                              flex items-center justify-center text-xs shadow-lg">
                              {item.role.includes('Industry') ? '💼' :
                                item.role.includes('Academic') ? '🎓' :
                                  item.role.includes('Guest') ? '🎤' : '👨‍🏫'}
                            </div>
                          </div>
                          
                          {/* Speaker details */}
                          <div className="flex-1">
                            <h4 className="text-white font-bold text-base mb-0.5 
                              group-hover:text-blue-300 transition-colors duration-300">
                              {item.name}
                            </h4>
                            <p className="text-gray-400 text-xs leading-tight max-w-[180px] md:max-w-[200px] line-clamp-2">
                              {item.role}
                            </p>
                            {/* Rating stars */}
                            <div className="flex items-center gap-0.5 mt-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-yellow-400 text-xs">⭐</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700
                      bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Bottom decorative elements */}
        <div className="flex justify-center items-center gap-6 mt-12 opacity-70">
          <div className="flex items-center gap-4">
            <span className="text-3xl animate-pulse hover:scale-125 transition-transform cursor-pointer">🎙️</span>
            <span className="text-3xl animate-pulse hover:scale-125 transition-transform cursor-pointer" style={{ animationDelay: '0.5s' }}>💬</span>
            <span className="text-3xl animate-pulse hover:scale-125 transition-transform cursor-pointer" style={{ animationDelay: '1s' }}>⭐</span>
            <span className="text-3xl animate-pulse hover:scale-125 transition-transform cursor-pointer" style={{ animationDelay: '1.5s' }}>👏</span>
            <span className="text-3xl animate-pulse hover:scale-125 transition-transform cursor-pointer" style={{ animationDelay: '2s' }}>🌟</span>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm font-medium">
            Join our community and become part of these amazing experiences
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes orb {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(180deg); }
        }
        .animate-orb {
          animation: orb 15s ease-in-out infinite;
        }
        .animate-orb-slow {
          animation: orb 20s ease-in-out infinite reverse;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
        @keyframes float-diagonal {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(-10px, -15px) rotate(3deg); }
        }
        @keyframes float-circular {
          0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(147, 51, 234, 0.3); }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
          50% { transform: translateY(-8px) rotate(0.5deg); }
        }
        @keyframes cardFloatReverse {
          0%, 100% { transform: translateY(0px) rotate(0.5deg); }
          50% { transform: translateY(-8px) rotate(-0.5deg); }
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 8s ease-in-out infinite;
        }
        .animate-float-diagonal {
          animation: float-diagonal 10s ease-in-out infinite;
        }
        .animate-float-circular {
          animation: float-circular 12s linear infinite;
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .animate-card-float:nth-child(odd) {
          animation: cardFloat 8s ease-in-out infinite;
        }
        .animate-card-float:nth-child(even) {
          animation: cardFloatReverse 10s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .group:hover .animate-card-float {
          animation-play-state: paused;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-none {
          display: block;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thumb-blue-500\/50::-webkit-scrollbar-thumb {
          background-color: rgba(59, 130, 246, 0.5);
          border-radius: 2px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </section>
  );
}