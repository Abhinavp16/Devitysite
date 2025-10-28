import { TeamAnimatedBackground } from './AnimatedBackground';

// Import leadership team images
import img1 from '../img/1.png';
import img2 from '../img/2.png';
import img3 from '../img/3.png';
import img4 from '../img/4.png';
import img5 from '../img/5.png';
import img6 from '../img/6.png';
import img7 from '../img/7.png';
import img8 from '../img/8.png';
import img9 from '../img/9.png';
import img10 from '../img/10.png';
import img11 from '../img/11.png';
import img12 from '../img/12.png';

// Import core team images
import img13 from '../img/13.png';
import img14 from '../img/14.png';
import img15 from '../img/15.png';
import img16 from '../img/16.png';
import img17 from '../img/17.png';
import img18 from '../img/18.png';
import img19 from '../img/19.png';
import img20 from '../img/20.png';
import img21 from '../img/21.png';
import img22 from '../img/22.png';
import img23 from '../img/23.jpg';
import img24 from '../img/24.jpg';
import img25 from '../img/25.jpg';
import img26 from '../img/26.jpg';
import img27 from '../img/27.jpg';

const Team = () => {
  const teamMembers = [
    // Leadership Team (1-12) - Large cards
    { name: "Dr. Ashok K. Chauhan", role: "Founder President, Amity Institutions", image: img1, bio: "Visionary leader and founder of Amity Institutions.", skills: ["Leadership", "Vision", "Education"], social: { linkedin: "#" } },
    { name: "Dr. Aseem k. Chauhan", role: "President & Chancellor", image: img2, bio: "Leading educational excellence and innovation.", skills: ["Leadership", "Education", "Innovation"], social: { linkedin: "#" } },
    { name: "Dr. W.Selvamurthy", role: "Chancellor, Amity University, Chhattisgarh", image: img3, bio: "Distinguished academic leader and researcher.", skills: ["Research", "Academia", "Leadership"], social: { linkedin: "https://www.linkedin.com/in/w-selvamurthy-90733979?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Prof. Dr. Piyush Kant Pandey", role: "Vice Chancellor, Amity University, Chhattisgarh", image: img4, bio: "Academic excellence and institutional development.", skills: ["Academia", "Leadership", "Development"], social: { linkedin: "https://www.linkedin.com/in/prof-dr-piyush-kant-pandey-60690518?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Prof. Dr. Sumita Dave", role: "Pro Vice Chancellor, Amity University, Chhattisgarh", image: img5, bio: "Educational leadership and academic innovation.", skills: ["Education", "Innovation", "Leadership"], social: { linkedin: "https://www.linkedin.com/in/prof-dr-sumita-dave-6a4950167?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Prof. Dr. Vinay Kumar Singh", role: "Deputy Director & HOI, ASET & AIIT", image: img6, bio: "Leading technology education and research initiatives.", skills: ["Technology", "Research", "Education"], social: { linkedin: "https://www.linkedin.com/in/vinay-kumar-singh-307a7819?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Dr. Kranti Kumar Dewangan", role: "Head of Department, ASET & AIIT", image: img7, bio: "Department leadership and academic excellence.", skills: ["Leadership", "Academia", "Technology"], social: { linkedin: "https://www.linkedin.com/in/dr-kranti-kumar-dewangan-62b416101?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Er. Nisha Rathore", role: "Club Mentor, Asst Professor", image: img8, bio: "Mentoring students and guiding technical excellence.", skills: ["Mentoring", "Teaching", "Technology"], social: { linkedin: "https://www.linkedin.com/in/nishaa-pravesh-rathore?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Dr. Shikha Tiwari", role: "Club Mentor, Asst Professor", image: img9, bio: "Academic guidance and research supervision.", skills: ["Research", "Teaching", "Mentoring"], social: { linkedin: "https://www.linkedin.com/in/dr-shikha-tiwari-b383061a0?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Mr. Poorab Patel", role: "Board Member, Ex-President (2022-23)", image: img10, bio: "Former club president with strong leadership experience.", skills: ["Leadership", "Strategy", "Community"], social: { github: "#", linkedin: "https://www.linkedin.com/in/poorabpatel?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Mr. Vaibhav Kumar Sahu", role: "Board Member, Ex-President (2024-25)", image: img11, bio: "Former club president with the vision of bridge the gap between Industry & Academic.", skills: ["DevOps", "Software Engineering", "Linux", "Docker", "Python"], social: { github: "#", linkedin: "https://www.linkedin.com/in/vaibhavkumarsahu?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Ms. Manya Sinha", role: "Club Advisor, Ex-Vice President (2024-25)", image: img12, bio: "Former vice president providing strategic guidance.", skills: ["Strategy", "Guidance", "Leadership"], social: { github: "#", linkedin: "https://www.linkedin.com/in/manya-sinha2004?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },

    // Core Team (13-30) - Medium cards
    { name: "Mr. Aarekh Verma", role: "President", image: img13, bio: "Leading the club with vision and strategic direction, fostering innovation and community growth.", skills: ["Leadership", "Strategy", "Community Building"], social: { github: "https://github.com/aarekhv", linkedin: "https://www.linkedin.com/in/aarekhv?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" } },
    { name: "Ms. Naina Sethia", role: "Vice President", image: img14, bio: "Supporting club operations and driving creative initiatives with design expertise.", skills: ["Figma", "Design Systems", "Prototyping"], social: { github: "https://github.com/nainasethia", linkedin: "https://www.linkedin.com/in/nainasethia?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Ms. Pari Jain", role: "Secretary", image: img15, bio: "Managing club documentation, communications, and administrative operations efficiently.", skills: ["Documentation", "Communication", "Organization"], social: { github: " https://github.com/Pari-Jain31", linkedin: "https://www.linkedin.com/in/pari-jain-627731325?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Mr. Abhinav Pandey", role: "Tech Head", image: img16, bio: "Overseeing technical projects and guiding development initiatives across all platforms.", skills: ["Full Stack Developer", "AI/ML Researcher", "Freelencer", "Technical Leadership"], social: { github: "https://github.com/Abhinavp16", linkedin: "www.linkedin.com/in/abhinavpandey16" } },
    { name: "Ms. Kiran Vishwakarma", role: "Big Data Lead", image: img17, bio: "Leading big data initiatives and analytics projects, driving data-driven insights.", skills: ["Big Data", "Analytics", "Data Science"], social: { github: "#", linkedin: "http://www.linkedin.com/in/kirannvish" } },
    { name: "Mr. Kunal Sahu", role: "AI/ML Lead", image: img18, bio: "Spearheading artificial intelligence and machine learning projects and research.", skills: ["Machine Learning", "AI Research", "Python"], social: { github: "https://github.com/vky342", linkedin: "#" } },
    { name: "Ms. Vandana Singh", role: "Devops & Cloud Lead", image: img19, bio: "Managing cloud infrastructure and deployment pipelines for seamless operations.", skills: ["Docker", "Kubernetes", "CI/CD"], social: { github: "https://github.com/vandanasingh11", linkedin: "https://www.linkedin.com/in/vandana-singh1105?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Ms. Nupur Goyal", role: "Open Source Lead", image: img20, bio: "Promoting open source contributions and managing community-driven projects.", skills: ["Open Source", "Git", "Community Management"], social: { github: "https://github.com/Nupur-goyal22", linkedin: "https://www.linkedin.com/in/nupur-goyal-0283b6321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Ms. Harsha Hariyani", role: "Management Lead", image: img21, bio: "Coordinating team activities and ensuring smooth execution of club operations.", skills: ["Project Management", "Team Coordination", "Operations"], social: { github: "#", linkedin: "https://www.linkedin.com/in/harsha-hariyani-b8b8b8321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Ms. Ritika Jiwnani", role: "PR Lead", image: img22, bio: "Managing public relations, social media presence, and external communications.", skills: ["Public Relations", "Social Media", "Marketing"], social: { github: "https://github.com/ritikajiwnani21-gif", linkedin: "https://www.linkedin.com/in/ritika-jiwnani-955884381" } },
    { name: "Mr. Krish Rawlley", role: "PR Lead", image: img23, bio: "Handling media outreach, brand promotion, and community engagement initiatives.", skills: ["Media Relations", "Brand Management", "Content Creation"], social: { github: "https://github.com/rawlleykrish-commits", linkedin: "#" } },
    { name: "Ms. Neha Biswal", role: "UI/UX Coordinator", image: img24, bio: "Designing user interfaces and enhancing user experience across digital platforms.", skills: ["UI/UX Design", "Figma", "User Research"], social: { github: "https://github.com/Nehabiswal-07", linkedin: "https://www.linkedin.com/in/neha-biswal-b8b8b8321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Mr. Bhabani Sankar Biswal", role: "Tech Coordinator", image: img25, bio: "Coordinating technical workshops, hackathons, and skill development programs.", skills: ["Technical Training", "Workshop Management", "Mentoring"], social: { github: "https://github.com/BhabaniSankarBiswal", linkedin: "https://www.linkedin.com/in/bhabani-sankar-biswal?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Mr. Ashmit Gartia", role: "Student Coordinator", image: img26, bio: "Facilitating student engagement and organizing academic support initiatives.", skills: ["Student Engagement", "Event Planning", "Academic Support"], social: { github: "https://github.com/ashmitgartia87-cyber", linkedin: "https://www.linkedin.com/in/ashmit-gartia-b8b8b8321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } },
    { name: "Mr. Shreejay Anand", role: "Student Coordinator", image: img27, bio: "Supporting student activities and fostering collaborative learning environments.", skills: ["Collaboration", "Learning Support", "Community Building"], social: { github: "https://github.com/shreejayanand-rgb", linkedin: "https://www.linkedin.com/in/shreejay-anand-b8b8b8321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" } }
  ];

  const renderLargeCard = (member, index) => (
    <div key={index} className="group relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl sm:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-700 p-3 sm:p-4 md:p-6 lg:p-8 text-center transform hover:-translate-y-2 sm:hover:-translate-y-4 border border-indigo-100 dark:border-gray-600 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-xl sm:rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 shadow-xl sm:shadow-2xl overflow-hidden ring-2 sm:ring-4 ring-white/50 group-hover:ring-indigo-200/50 transition-all duration-500 group-hover:scale-110">
          {member.image === "#" ? (
            <div className="w-full h-full bg-gradient-to-br from-white/90 to-indigo-50/90 rounded-full flex items-center justify-center text-indigo-600 text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold backdrop-blur-sm">
              {member.name.charAt(0)}
            </div>
          ) : (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
          )}
        </div>
        <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2 leading-tight">{member.name}</h3>
        <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base lg:text-lg transition-colors duration-300 leading-tight">{member.role}</p>
        {member.bio && <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-6 leading-relaxed transition-colors duration-300 hidden sm:block">{member.bio}</p>}
        {member.skills && member.skills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
            {member.skills.slice(0, 3).map((skill, skillIndex) => (
              <span key={skillIndex} className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200/50 dark:border-indigo-500/50">
                {skill}
              </span>
            ))}
            {member.skills.length > 3 && (
              <span className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs sm:text-sm font-semibold shadow-md border border-indigo-200/50 dark:border-indigo-500/50">
                +{member.skills.length - 3}
              </span>
            )}
          </div>
        )}
        <div className="flex justify-center space-x-3 sm:space-x-4 md:space-x-6">
          {member.social.github && (
            <a href={member.social.github} className="text-gray-400 hover:text-gray-700 transition-colors transform hover:scale-110">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599-.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
          {member.social.linkedin && (
            <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );

  const renderMediumCard = (member, index) => (
    <div key={index} className="group relative bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 p-3 sm:p-4 md:p-6 text-center transform hover:-translate-y-2 sm:hover:-translate-y-3 border border-purple-100 dark:border-gray-600 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 shadow-lg sm:shadow-xl overflow-hidden ring-2 sm:ring-4 ring-white/50 group-hover:ring-purple-200/50 transition-all duration-500 group-hover:scale-105">
          {member.image === "#" ? (
            <div className="w-full h-full bg-gradient-to-br from-white/90 to-purple-50/90 rounded-full flex items-center justify-center text-purple-600 text-lg sm:text-xl md:text-2xl font-bold backdrop-blur-sm">
              {member.name.charAt(0)}
            </div>
          ) : (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
          )}
        </div>
        <h3 className="text-sm sm:text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 leading-tight">{member.name}</h3>
        <p className="text-purple-600 dark:text-purple-400 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm md:text-base transition-colors duration-300 leading-tight">{member.role}</p>
        {member.bio && <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed transition-colors duration-300 hidden sm:block">{member.bio}</p>}
        {member.skills && member.skills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-3 sm:mb-4">
            {member.skills.slice(0, 2).map((skill, skillIndex) => (
              <span key={skillIndex} className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all duration-300 border border-purple-200/50 dark:border-purple-500/50">
                {skill}
              </span>
            ))}
            {member.skills.length > 2 && (
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium shadow-sm border border-purple-200/50 dark:border-purple-500/50">
                +{member.skills.length - 2}
              </span>
            )}
          </div>
        )}
        <div className="flex justify-center space-x-3 sm:space-x-4">
          {member.social.github && (
            <a href={member.social.github} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599-.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
          {member.social.linkedin && (
            <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section id="team" className="py-20 bg-gradient-to-br from-slate-50/60 via-blue-50/60 to-indigo-100/60 dark:from-gray-900/60 dark:via-gray-800/60 dark:to-gray-700/60 backdrop-blur-sm relative overflow-hidden transition-colors duration-300">
      <TeamAnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
            Our dedicated team of passionate individuals working together to build an amazing tech community.
          </p>
        </div>

        {/* Leadership Team (1-12) - Large Cards */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center transition-colors duration-300">Leadership Team</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {teamMembers.slice(0, 12).map((member, index) => renderLargeCard(member, index))}
          </div>
        </div>

        {/* Core Team (13-30) - Medium Cards */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center transition-colors duration-300">Core Team</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {teamMembers.slice(12, 27).map((member, index) => renderMediumCard(member, index + 12))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;