import { SpeakersAnimatedBackground } from './AnimatedBackground';

// Import speaker images
import vikashImage from '../img/Vikash Shrivastava.jpeg';
import rohitImage from '../img/rohit agrawal.jpeg';
import amolImage from '../img/amol rangari.jpeg';
import nakulImage from '../img/Nakul; Grover.jpeg';
import umamaheshwarImage from '../img/umamaheshwar.jpeg';

const Speakers = () => {
  const speakers = [
    {
      name: "Mr. Vikash Shrivastava",
      title: "Senior Engineer Manager ",
      company: "Dell Technologies",
      expertise: ["Ex-Google", "Ex-Cisco"],
      image: vikashImage,
      gradientFrom: "from-red-500",
      gradientTo: "to-pink-600",
      bgGradient: "from-red-50 via-white to-pink-50",
      skillGradient: "from-red-100 to-pink-100",
      textColor: "text-red-700"
    },
    {
      name: "Mr. Rohit Agarwal ",
      title: "Senior Data Engineering Lead",
      company: "Optum ( A United Health Group Company )",
      expertise: ["Data Engineering", "Analytics", "Microservices"],
      image: rohitImage,
      gradientFrom: "from-blue-500",
      gradientTo: "to-indigo-600",
      bgGradient: "from-blue-50 via-white to-indigo-50",
      skillGradient: "from-blue-100 to-indigo-100",
      textColor: "text-blue-700"
    },
    {
      name: "Mr. Amol Rangari ",
      title: "Cybersecurity consultant",
      company: "Cognizant",
      expertise: ["Cybersecurity", "Ethical Hacking", "Zero Trust"],
      image: amolImage,
      gradientFrom: "from-green-500",
      gradientTo: "to-emerald-600",
      bgGradient: "from-green-50 via-white to-emerald-50",
      skillGradient: "from-green-100 to-emerald-100",
      textColor: "text-green-700"
    },
    {
      name: "Mr. Nakul Grover",
      title: "Sr.DevOps Engineer",
      company: "Thomson Reuters",
      expertise: ["Ex-Deloitte", "Docker", "DevOps"],
      image: nakulImage,
      gradientFrom: "from-purple-500",
      gradientTo: "to-violet-600",
      bgGradient: "from-purple-50 via-white to-violet-50",
      skillGradient: "from-purple-100 to-violet-100",
      textColor: "text-purple-700"
    },
    {
      name: "Mr. Umamaheshwar Achari kakinada",
      title: "Principal Engineer ",
      company: "Charter Communication,Stamford,Connecticut",
      expertise: ["Ex-motorola", "Ex-Nokia"],
      image: umamaheshwarImage,
      gradientFrom: "from-pink-500",
      gradientTo: "to-rose-600",
      bgGradient: "from-pink-50 via-white to-rose-50",
      skillGradient: "from-pink-100 to-rose-100",
      textColor: "text-pink-700"
    },

  ];

  return (
    <section id="speakers" className="py-20 bg-gradient-to-br from-slate-50/60 via-purple-50/60 to-pink-100/60 backdrop-blur-sm relative overflow-hidden">
      <SpeakersAnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6">
            Guest Speakers
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Learn from industry leaders and tech innovators who are shaping the future of technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker, index) => (
            <div key={index} className={`group relative bg-gradient-to-br ${speaker.bgGradient} rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-700 p-8 text-center transform hover:-translate-y-4 border border-gray-100 backdrop-blur-sm`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${speaker.gradientFrom}/5 ${speaker.gradientTo}/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <div className={`w-24 h-24 bg-gradient-to-br ${speaker.gradientFrom} ${speaker.gradientTo} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl overflow-hidden ring-4 ring-white/50 group-hover:ring-gray-200/50 transition-all duration-500 group-hover:scale-110`}>
                  <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover rounded-full" />
                </div>

                <div className={`inline-block px-4 py-2 bg-gradient-to-r ${speaker.skillGradient} ${speaker.textColor} rounded-full text-sm font-semibold mb-4 shadow-md`}>
                  {speaker.company}
                </div>

                <h3 className={`text-2xl font-bold bg-gradient-to-r ${speaker.gradientFrom} ${speaker.gradientTo} bg-clip-text text-transparent mb-2`}>{speaker.name}</h3>
                <p className="text-gray-700 font-medium mb-6">{speaker.title}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {speaker.expertise.map((skill, skillIndex) => (
                    <span key={skillIndex} className={`px-3 py-1 bg-gradient-to-r ${speaker.skillGradient} ${speaker.textColor} rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200/50`}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="border-t border-gray-200/50 pt-6">
                  <div className="flex justify-center">
                    <a href="#"
                      className={`bg-gradient-to-r ${speaker.gradientFrom} ${speaker.gradientTo} p-3 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-110 group`}
                      aria-label={`Connect with ${speaker.name} on LinkedIn`}
                    >
                      <svg
                        className="w-6 h-6 text-white group-hover:text-gray-100 transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Speakers;