import { SpeakersAnimatedBackground } from './AnimatedBackground';

// Import speaker images
import vikashImage from '../img/speakers/Vikash Shrivastava.jpeg';
import rohitAgarwalImage from '../img/speakers/rohit agrawal.jpeg';
import amolImage from '../img/speakers/amol rangari.jpeg';
import nakulImage from '../img/speakers/Nakul; Grover.jpeg';
import umamaheshwarImage from '../img/speakers/umamaheshwar.jpeg';
import mahimaImage from '../img/speakers/Mahima Saran.png';
import meetaImage from '../img/speakers/Meeta Rathore.png';
import tusharImage from '../img/speakers/Tushar Pandey.png';
import rohitSinghalImage from '../img/speakers/Rohit Singhal.png';
import himanshuImage from '../img/speakers/Himanshu Rathore.png';
import priyanshuImage from '../img/speakers/Priyanshu Patel.png';
import krutarthImage from '../img/speakers/Krutarth Rindani.png';
import poorviImage from '../img/speakers/Poorvi Dewangan.png';
import roshanImage from '../img/speakers/Roshan Bishi.png';
import meghnaImage from '../img/speakers/Meghna Parwate.png';

const Speakers = () => {
  const speakers = [
    {
      name: "Mr. Vikas Shrivastava",
      title: "Sr. Engineering Manager",
      company: "DELL Technologies",
      expertise: ["Ex-Google", "Ex-Cisco", "Engineering Leadership", "Cloud Architecture"],
      image: vikashImage,
      linkedin: "https://www.linkedin.com/in/vikas-shrivastava-bharat?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_appa",
      gradientFrom: "from-red-500",
      gradientTo: "to-pink-600",
      bgGradient: "from-red-50 via-white to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50",
      textColor: "text-red-700 dark:text-red-300"
    },
    {
      name: "Mr. Nakul Grover",
      title: "Sr. DevOps Engineer",
      company: "Thomson Reuters",
      expertise: ["Ex-Deloitte India", "DevOps", "CI/CD", "Cloud Infrastructure"],
      image: nakulImage,
      linkedin: "https://www.linkedin.com/in/nakuulgroverr?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      gradientFrom: "from-purple-500",
      gradientTo: "to-violet-600",
      bgGradient: "from-purple-50 via-white to-violet-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50",
      textColor: "text-purple-700 dark:text-purple-300"
    },
    {
      name: "Mrs. Mahima Saran",
      title: "Sr. Solutions Architect",
      company: "MongoDB",
      expertise: ["Ex-AWS", "Ex-Accenture", "Database Architecture", "Cloud Solutions"],
      image: mahimaImage,
      linkedin: "https://www.linkedin.com/in/mahima-saran?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      gradientFrom: "from-green-500",
      gradientTo: "to-teal-600",
      bgGradient: "from-green-50 via-white to-teal-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-green-100 to-teal-100 dark:from-green-900/50 dark:to-teal-900/50",
      textColor: "text-green-700 dark:text-green-300"
    },
    {
      name: "Mrs. Meeta Rathore",
      title: "Sr. Big Data Engineer",
      company: "Optum, UHG",
      expertise: ["Ex-IBM", "Ex-HSBC", "Big Data", "Analytics", "Data Engineering"],
      image: meetaImage,
      linkedin: "https://www.linkedin.com/in/meeta-rathore-a154ba58?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      gradientFrom: "from-blue-500",
      gradientTo: "to-cyan-600",
      bgGradient: "from-blue-50 via-white to-cyan-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50",
      textColor: "text-blue-700 dark:text-blue-300"
    },
    {
      name: "Mr. Tushar Pandey",
      title: "Software Development Engineer",
      company: "Rakuten India",
      expertise: ["Full Stack Development", "E-commerce", "Scalable Systems"],
      image: tusharImage,
      linkedin: "https://www.linkedin.com/in/tushark39?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      gradientFrom: "from-orange-500",
      gradientTo: "to-red-600",
      bgGradient: "from-orange-50 via-white to-red-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50",
      textColor: "text-orange-700 dark:text-orange-300"
    },
    {
      name: "Mr. Rohit Singhal",
      title: "Sr. Software Development Engineer",
      company: "Microsoft",
      expertise: ["Ex-Amazon", "Ex-Motorola", "Cloud Computing", "Distributed Systems"],
      image: rohitSinghalImage,
      linkedin: "https://www.linkedin.com/in/rohit-singhal-1a82381aa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      gradientFrom: "from-indigo-500",
      gradientTo: "to-purple-600",
      bgGradient: "from-indigo-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50",
      textColor: "text-indigo-700 dark:text-indigo-300"
    },
    {
      name: "Mr. Himanshu Rathore",
      title: "MTS Engineer",
      company: "Salesforce",
      expertise: ["Ex-Amazon", "Ex-HashedIN", "CRM Solutions", "Enterprise Software"],
      image: himanshuImage,
      linkedin: "https://www.linkedin.com/in/hrathore?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      gradientFrom: "from-cyan-500",
      gradientTo: "to-blue-600",
      bgGradient: "from-cyan-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/50",
      textColor: "text-cyan-700 dark:text-cyan-300"
    },
    {
      name: "Mr. Rohit Agarwal",
      title: "Data Engineer Lead",
      company: "Optum, UHG",
      expertise: ["Data Engineering", "Analytics", "Big Data", "Cloud Platforms"],
      image: rohitAgarwalImage,
      linkedin: "https://www.linkedin.com/in/rohit-agarwal-711b82111?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      gradientFrom: "from-emerald-500",
      gradientTo: "to-green-600",
      bgGradient: "from-emerald-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50",
      textColor: "text-emerald-700 dark:text-emerald-300"
    },
    {
      name: "Mr. Amol Rangari",
      title: "Cybersecurity Consultant",
      company: "Cognizant",
      expertise: ["Cybersecurity", "Ethical Hacking", "Security Architecture", "Compliance"],
      image: amolImage,
      linkedin: "https://www.linkedin.com/in/amol-rangari?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      gradientFrom: "from-red-500",
      gradientTo: "to-orange-600",
      bgGradient: "from-red-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50",
      textColor: "text-red-700 dark:text-red-300"
    },
    {
      name: "Mr. Priyanshu Patel",
      title: "Co-founder & AIE",
      company: "Brainless AI & Akua",
      expertise: ["Artificial Intelligence", "Machine Learning", "Startup Leadership", "Innovation"],
      image: priyanshuImage,
      linkedin: "https://www.linkedin.com/in/priyanshu-patel-hawk?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      gradientFrom: "from-violet-500",
      gradientTo: "to-purple-600",
      bgGradient: "from-violet-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50",
      textColor: "text-violet-700 dark:text-violet-300"
    },
    {
      name: "Mr. Krutarth Rindani",
      title: "Sr. DevOps Engineer",
      company: "McAfee",
      expertise: ["Ex-Asite", "Ex-Sterlite", "DevOps", "Security", "Infrastructure"],
      image: krutarthImage,
      linkedin: "https://www.linkedin.com/in/krutarth-rindani-106167104?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      gradientFrom: "from-teal-500",
      gradientTo: "to-cyan-600",
      bgGradient: "from-teal-50 via-white to-cyan-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50",
      textColor: "text-teal-700 dark:text-teal-300"
    },
    {
      name: "Ms. Poorvi Dewangan",
      title: "MBA Student",
      company: "NIT Calicut",
      expertise: ["Business Strategy", "Technology Management", "Innovation", "Leadership"],
      image: poorviImage,
      linkedin: "https://www.linkedin.com/in/poorvidewanganofficial?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      gradientFrom: "from-pink-500",
      gradientTo: "to-rose-600",
      bgGradient: "from-pink-50 via-white to-rose-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-pink-100 to-rose-100 dark:from-pink-900/50 dark:to-rose-900/50",
      textColor: "text-pink-700 dark:text-pink-300"
    },
    {
      name: "Mr. Roshan Bishi",
      title: "Digital Engineer Intern & MTech Student",
      company: "Texas Instruments & IIT Kharagpur",
      expertise: ["Digital Engineering", "Embedded Systems", "Research", "Innovation"],
      image: roshanImage,
      linkedin: "https://www.linkedin.com/in/roshanbishi?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      gradientFrom: "from-amber-500",
      gradientTo: "to-orange-600",
      bgGradient: "from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50",
      textColor: "text-amber-700 dark:text-amber-300"
    },
    {
      name: "Ms. Meghna Parwate",
      title: "Enterprise Product & Agile Coach",
      company: "Independent Consultant",
      expertise: ["Product Management", "Agile Methodology", "Enterprise Solutions", "Team Leadership"],
      image: meghnaImage,
      linkedin: "https://www.linkedin.com/in/meghana-parwate-0571421?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      gradientFrom: "from-rose-500",
      gradientTo: "to-pink-600",
      bgGradient: "from-rose-50 via-white to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-rose-100 to-pink-100 dark:from-rose-900/50 dark:to-pink-900/50",
      textColor: "text-rose-700 dark:text-rose-300"
    },
    {
      name: "Mr. Umamaheshwar Achari",
      title: "Principal Engineer",
      company: "Charter Communication, Connecticut",
      expertise: ["Ex-Motorola", "Ex-Nokia", "Telecommunications", "Network Engineering"],
      image: umamaheshwarImage,
      linkedin: "https://linkedin.com/in/umamaheshwar-achari",
      gradientFrom: "from-slate-500",
      gradientTo: "to-gray-600",
      bgGradient: "from-slate-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
      skillGradient: "from-slate-100 to-gray-100 dark:from-slate-900/50 dark:to-gray-900/50",
      textColor: "text-slate-700 dark:text-slate-300"
    }
  ];

  return (
    <section id="speakers" className="py-20 bg-gradient-to-br from-slate-50/60 via-purple-50/60 to-pink-100/60 dark:from-gray-900/60 dark:via-gray-800/60 dark:to-gray-700/60 backdrop-blur-sm relative overflow-hidden transition-colors duration-300">
      <SpeakersAnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6">
            Guest Speakers
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
            Learn from industry leaders and tech innovators who are shaping the future of technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker, index) => (
            <div key={index} className={`group relative bg-gradient-to-br ${speaker.bgGradient} rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-700 p-8 text-center transform hover:-translate-y-4 border border-gray-100 dark:border-gray-600 backdrop-blur-sm`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${speaker.gradientFrom}/5 ${speaker.gradientTo}/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <div className={`w-24 h-24 bg-gradient-to-br ${speaker.gradientFrom} ${speaker.gradientTo} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl overflow-hidden ring-4 ring-white/50 group-hover:ring-gray-200/50 transition-all duration-500 group-hover:scale-110`}>
                  <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover rounded-full" />
                </div>

                <div className={`inline-block px-4 py-2 bg-gradient-to-r ${speaker.skillGradient} ${speaker.textColor} rounded-full text-sm font-semibold mb-4 shadow-md`}>
                  {speaker.company}
                </div>

                <h3 className={`text-2xl font-bold bg-gradient-to-r ${speaker.gradientFrom} ${speaker.gradientTo} bg-clip-text text-transparent mb-2`}>{speaker.name}</h3>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-6 transition-colors duration-300">{speaker.title}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {speaker.expertise.map((skill, skillIndex) => (
                    <span key={skillIndex} className={`px-3 py-1 bg-gradient-to-r ${speaker.skillGradient} ${speaker.textColor} rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200/50 dark:border-gray-500/50`}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="border-t border-gray-200/50 dark:border-gray-500/50 pt-6 transition-colors duration-300">
                  <div className="flex justify-center">
                    <a
                      href={speaker.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
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