const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectMongoDB = require('../config/mongodb');
const { AdminUser, TeamMember, GuestSpeaker, Event, ClubMemory, SpeakerReview } = require('../models');

const teamMembers = [
    { name: 'Dr. Ashok K. Chauhan', role: 'Founder President, Amity Institutions', team_type: 'leadership', bio: 'Visionary leader and founder of Amity Institutions.', skills: ['Leadership', 'Vision', 'Education'], linkedin_url: '#' },
    { name: 'Dr. Aseem k. Chauhan', role: 'President & Chancellor', team_type: 'leadership', bio: 'Leading educational excellence and innovation.', skills: ['Leadership', 'Education', 'Innovation'], linkedin_url: '#' },
    { name: 'Dr. W.Selvamurthy', role: 'Chancellor, Amity University, Chhattisgarh', team_type: 'leadership', bio: 'Distinguished academic leader and researcher.', skills: ['Research', 'Academia', 'Leadership'], linkedin_url: 'https://www.linkedin.com/in/w-selvamurthy-90733979' },
    { name: 'Prof. Dr. Piyush Kant Pandey', role: 'Vice Chancellor, Amity University, Chhattisgarh', team_type: 'leadership', bio: 'Academic excellence and institutional development.', skills: ['Academia', 'Leadership', 'Development'], linkedin_url: 'https://www.linkedin.com/in/prof-dr-piyush-kant-pandey-60690518' },
    { name: 'Prof. Dr. Sumita Dave', role: 'Pro Vice Chancellor, Amity University, Chhattisgarh', team_type: 'leadership', bio: 'Educational leadership and academic innovation.', skills: ['Education', 'Innovation', 'Leadership'], linkedin_url: 'https://www.linkedin.com/in/prof-dr-sumita-dave-6a4950167' },
    { name: 'Prof. Dr. Vinay Kumar Singh', role: 'Deputy Director & HOI, ASET & AIIT', team_type: 'leadership', bio: 'Leading technology education and research initiatives.', skills: ['Technology', 'Research', 'Education'], linkedin_url: 'https://www.linkedin.com/in/vinay-kumar-singh-307a7819' },
    { name: 'Dr. Kranti Kumar Dewangan', role: 'Head of Department, ASET & AIIT', team_type: 'leadership', bio: 'Department leadership and academic excellence.', skills: ['Leadership', 'Academia', 'Technology'], linkedin_url: 'https://www.linkedin.com/in/dr-kranti-kumar-dewangan-62b416101' },
    { name: 'Er. Nisha Rathore', role: 'Club Mentor, Assistant Professor, ASET, AUC', team_type: 'leadership', bio: 'Mentoring students and guiding technical excellence.', skills: ['Mentoring', 'Leadership', 'Research', 'Teaching', 'Technology'], linkedin_url: 'https://www.linkedin.com/in/nishaa-pravesh-rathore' },
    { name: 'Dr. Shikha Tiwari', role: 'Club Mentor, Assistant Professor, ASET, AUC', team_type: 'leadership', bio: 'Academic guidance and research supervision.', skills: ['Research', 'Teaching', 'Mentoring'], linkedin_url: 'https://www.linkedin.com/in/dr-shikha-tiwari-b383061a0' },
    { name: 'Mr. Poorab Patel', role: 'Board Member, Ex-President (2022-23)', team_type: 'leadership', bio: 'Former club president with strong leadership experience.', skills: ['Leadership', 'Strategy', 'Community'], linkedin_url: 'https://www.linkedin.com/in/poorabpatel' },
    { name: 'Mr. Vaibhav Kumar Sahu', role: 'Board Member, Ex-President (2024-25)', team_type: 'leadership', bio: 'Former Club President known for visionary leadership and strategic planning, inspiring the club to bridge the gap between Industry and Academia.', skills: ['DevOps', 'Software Engineering', 'Linux', 'Docker'], linkedin_url: 'https://www.linkedin.com/in/vaibhavkumarsahu' },
    { name: 'Ms. Manya Sinha', role: 'Club Advisor, Ex-Vice President (2024-25)', team_type: 'leadership', bio: 'Former vice president providing strategic guidance.', skills: ['Strategy', 'Guidance', 'Leadership'], linkedin_url: 'https://www.linkedin.com/in/manya-sinha2004' },
    { name: 'Mr. Aarekh Verma', role: 'President', team_type: 'core', bio: 'Leading the club with vision and strategic direction, fostering innovation and community growth.', skills: ['Leadership', 'Strategy', 'Community Building'], github_url: 'https://github.com/aarekhv', linkedin_url: 'https://www.linkedin.com/in/aarekhv' },
    { name: 'Ms. Naina Sethia', role: 'Vice President', team_type: 'core', bio: 'Supporting club operations and driving creative initiatives with design expertise.', skills: ['Linux', 'Cybersecurity', 'Management'], github_url: 'https://github.com/nainasethia', linkedin_url: 'https://www.linkedin.com/in/nainasethia' },
    { name: 'Ms. Pari Jain', role: 'Secretary', team_type: 'core', bio: 'Managing club documentation, communications, and administrative operations efficiently.', skills: ['Documentation', 'Communication', 'Organization'], github_url: 'https://github.com/Pari-Jain31', linkedin_url: 'https://www.linkedin.com/in/pari-jain-627731325' },
    { name: 'Mr. Abhinav Pandey', role: 'Tech Head', team_type: 'core', bio: 'Overseeing technical projects and guiding development initiatives across all platforms.', skills: ['Full Stack Developer', 'AI/ML Researcher', 'Freelancer', 'Technical Leadership'], github_url: 'https://github.com/Abhinavp16', linkedin_url: 'https://www.linkedin.com/in/abhinavpandey16' },
    { name: 'Ms. Kiran Vishwakarma', role: 'Big Data Lead', team_type: 'core', bio: 'Leading big data initiatives and analytics projects, driving data-driven insights.', skills: ['Big Data', 'Analytics', 'Data Science'], linkedin_url: 'http://www.linkedin.com/in/kirannvish' },
    { name: 'Mr. Kunal Sahu', role: 'AI/ML Lead', team_type: 'core', bio: 'Spearheading artificial intelligence and machine learning projects and research.', skills: ['Machine Learning', 'AI Research', 'Python'], github_url: 'https://github.com/vky342' },
    { name: 'Ms. Vandana Singh', role: 'Devops & Cloud Lead', team_type: 'core', bio: 'Managing cloud infrastructure and deployment pipelines for seamless operations.', skills: ['Docker', 'Kubernetes', 'CI/CD'], github_url: 'https://github.com/vandanasingh11', linkedin_url: 'https://www.linkedin.com/in/vandana-singh1105' },
    { name: 'Ms. Harsha Hariyani', role: 'Management Lead', team_type: 'core', bio: 'Coordinating team activities and ensuring smooth execution of club operations.', skills: ['Project Management', 'Team Coordination', 'Operations'], linkedin_url: 'https://www.linkedin.com/in/harsha-hariyani-b8b8b8321' },
    { name: 'Ms. Ritika Jiwnani', role: 'PR Lead', team_type: 'core', bio: 'Managing public relations, social media presence, and external communications.', skills: ['Public Relations', 'Social Media', 'Marketing'], github_url: 'https://github.com/ritikajiwnani21-gif', linkedin_url: 'https://www.linkedin.com/in/ritika-jiwnani-955884381' },
    { name: 'Mr. Krish Rawlley', role: 'PR Lead', team_type: 'core', bio: 'Handling media outreach, brand promotion, and community engagement initiatives.', skills: ['Media Relations', 'Brand Management', 'Content Creation'], github_url: 'https://github.com/rawlleykrish-commits' },
    { name: 'Ms. Neha Biswal', role: 'UI/UX Coordinator', team_type: 'core', bio: 'Designing user interfaces and enhancing user experience across digital platforms.', skills: ['UI/UX Design', 'Figma', 'User Research'], github_url: 'https://github.com/Nehabiswal-07', linkedin_url: 'https://www.linkedin.com/in/neha-biswal-b8b8b8321' },
    { name: 'Mr. Bhabani Sankar Biswal', role: 'Tech Coordinator', team_type: 'core', bio: 'Coordinating technical workshops, hackathons, and skill development programs.', skills: ['Technical Training', 'Workshop Management', 'Mentoring'], github_url: 'https://github.com/BhabaniSankarBiswal', linkedin_url: 'https://www.linkedin.com/in/bhabani-sankar-biswal' },
    { name: 'Mr. Ashmit Gartia', role: 'Student Coordinator', team_type: 'core', bio: 'Facilitating student engagement and organizing academic support initiatives.', skills: ['Student Engagement', 'Event Planning', 'Academic Support'], github_url: 'https://github.com/ashmitgartia87-cyber', linkedin_url: 'https://www.linkedin.com/in/ashmit-gartia-b8b8b8321' },
    { name: 'Mr. Shreejay Anand', role: 'Student Coordinator', team_type: 'core', bio: 'Supporting student activities and fostering collaborative learning environments.', skills: ['Collaboration', 'Learning Support', 'Community Building'], github_url: 'https://github.com/shreejayanand-rgb', linkedin_url: 'https://www.linkedin.com/in/shreejay-anand-b8b8b8321' }
];

const guestSpeakers = [
    { name: 'Mr. Vikas Shrivastava', title: 'Sr. Engineering Manager', company: 'DELL Technologies', expertise: ['Ex-Google', 'Ex-Cisco', 'Engineering Leadership', 'Cloud Architecture'], linkedin_url: 'https://www.linkedin.com/in/vikas-shrivastava-bharat' },
    { name: 'Mr. Nakul Grover', title: 'Sr. DevOps Engineer', company: 'Thomson Reuters', expertise: ['Ex-Deloitte India', 'DevOps', 'CI/CD', 'Cloud Infrastructure'], linkedin_url: 'https://www.linkedin.com/in/nakuulgroverr' },
    { name: 'Mrs. Mahima Saran', title: 'Sr. Solutions Architect', company: 'MongoDB', expertise: ['Ex-AWS', 'Ex-Accenture', 'Database Architecture', 'Cloud Solutions'], linkedin_url: 'https://www.linkedin.com/in/mahima-saran' },
    { name: 'Mrs. Meeta Rathore', title: 'Sr. Big Data Engineer', company: 'Optum, UHG', expertise: ['Ex-IBM', 'Ex-HSBC', 'Big Data', 'Analytics', 'Data Engineering'], linkedin_url: 'https://www.linkedin.com/in/meeta-rathore-a154ba58' },
    { name: 'Mr. Tushar Pandey', title: 'Software Development Engineer', company: 'Rakuten India', expertise: ['Full Stack Development', 'E-commerce', 'Scalable Systems'], linkedin_url: 'https://www.linkedin.com/in/tushark39' },
    { name: 'Mr. Rohit Singhal', title: 'Software Development Manager', company: 'Auger', expertise: ['Ex-Microsoft', 'Ex-Amazon', 'Ex-Motorola', 'Cloud Computing', 'Distributed Systems'], linkedin_url: 'https://www.linkedin.com/in/rohit-singhal-1a82381aa' },
    { name: 'Mr. Himanshu Rathore', title: 'MTS Engineer', company: 'Salesforce', expertise: ['Ex-Amazon', 'Ex-HashedIN', 'CRM Solutions', 'Enterprise Software'], linkedin_url: 'https://www.linkedin.com/in/hrathore' },
    { name: 'Mr. Rohit Agarwal', title: 'Data Engineer Lead', company: 'Optum, UHG', expertise: ['Data Engineering', 'Analytics', 'Big Data', 'Cloud Platforms'], linkedin_url: 'https://www.linkedin.com/in/rohit-agarwal-711b82111' },
    { name: 'Mr. Amol Rangari', title: 'Cybersecurity Consultant', company: 'Cognizant', expertise: ['Cybersecurity', 'Ethical Hacking', 'Security Architecture', 'Compliance'], linkedin_url: 'https://www.linkedin.com/in/amol-rangari' },
    { name: 'Mr. Priyanshu Patel', title: 'Co-founder & AIE', company: 'Brainless AI & Akua', expertise: ['Artificial Intelligence', 'Machine Learning', 'Startup Leadership', 'Innovation'], linkedin_url: 'https://www.linkedin.com/in/priyanshu-patel-hawk' },
    { name: 'Mr. Krutarth Rindani', title: 'Sr. DevOps Engineer', company: 'McAfee', expertise: ['Ex-Asite', 'Ex-Sterlite', 'DevOps', 'Security', 'Infrastructure'], linkedin_url: 'https://www.linkedin.com/in/krutarth-rindani-106167104' },
    { name: 'Ms. Poorvi Dewangan', title: 'MBA Student', company: 'NIT Calicut', expertise: ['Business Strategy', 'Technology Management', 'Innovation', 'Leadership'], linkedin_url: 'https://www.linkedin.com/in/poorvidewanganofficial' },
    { name: 'Mr. Roshan Bishi', title: 'Digital Engineer Intern & MTech Student', company: 'Texas Instruments & IIT Kharagpur', expertise: ['Digital Engineering', 'Embedded Systems', 'Research', 'Innovation'], linkedin_url: 'https://www.linkedin.com/in/roshanbishi' },
    { name: 'Ms. Meghna Parwate', title: 'Enterprise Product & Agile Coach', company: 'Independent Consultant', expertise: ['Product Management', 'Agile Methodology', 'Enterprise Solutions', 'Team Leadership'], linkedin_url: 'https://www.linkedin.com/in/meghana-parwate-0571421' },
    { name: 'Mr. Umamaheshwar Achari', title: 'Principal Engineer', company: 'Charter Communication, Connecticut', expertise: ['Ex-Motorola', 'Ex-Nokia', 'Telecommunications', 'Network Engineering'], linkedin_url: 'https://linkedin.com/in/umamaheshwar-achari' },
    { name: 'Mr. Jai Kumar Relwani', title: 'Program Manager - AI Ready Schools', company: 'igebra.ai', expertise: ['Co-Founder (Talent shaala)', "Academic Specialist (BYJU's)", 'Facilitator Mathematics'], linkedin_url: 'https://www.linkedin.com/in/jai-kumar-relwani-9118a027' },
    { name: 'Ms. Arushi Garg', title: 'SDE-1', company: 'Adobe', expertise: ['GSSoC-24 Program Manager', 'AI enthusiast', 'AWS Cloud Captain-23', 'IGDTUW'], linkedin_url: 'https://www.linkedin.com/in/arushi-garg105' },
    { name: 'Mr. Saurabh Mudgal', title: 'Principal Security Group Manager', company: 'Microsoft', expertise: ['Security Engineering', 'Microsoft Global Hackathon 2025 Grand Prize Winner', 'Author Managing the Cyber Risk', 'Cloud Security'], linkedin_url: 'https://www.linkedin.com/in/smudgal05' },
    { name: 'Mr. Divy Arpit', title: 'Sr. Software Engineer', company: 'Optum (UHG)', expertise: ['Machine Learning', 'Alumnus @ N.I.T. Raipur', 'Microsoft Azure', 'Android Development'], linkedin_url: 'https://www.linkedin.com/in/divy-arpit' }
];

const events = [
    { title: 'ENVISION-X 2.0: Transform Ideas into Reality', event_date: '2026-02-09', event_time: '10:00 AM', location: 'Auditorium (AUC) & Virtual Platform', event_type: 'Competition', description: 'The biggest tech innovation challenge is back! Join us for a 45-day online project-based innovation challenge where ideas transform into reality. Build, innovate, and compete with the best minds in tech.', status: 'upcoming', registration_link: 'https://envision-x-20.vercel.app/' },
    { title: 'Legacy Connect 1.0', event_date: '2025-09-12', event_time: '08:45 PM - 10:45 PM', location: 'Virtual Session', event_type: 'Seminar', description: 'From Footsteps to Milestones - Learn From Those Who Walked Before You.', status: 'completed' },
    { title: 'The Devity Spark', event_date: '2025-09-07', event_time: '10:30 AM', location: 'Auditorium', event_type: 'Seminar', description: 'Ignite Your Campus Journey.', status: 'completed' },
    { title: 'Devity Summit 2025', event_date: '2025-09-01', event_time: '09:00 AM - 04:30 PM', location: 'Auditorium', event_type: 'Seminar', description: 'Learn From Leaders. Build For Industries.', status: 'upcoming' },
    { title: 'NetCamp', event_date: '2025-08-04', event_time: '09:00 AM - 04:30 PM', location: 'Auditorium AUC', event_type: 'Bootcamp', description: 'Netcamp Summer Internship With Industrial Training 2025.', status: 'completed' },
    { title: 'Jumpstart Your Tech Career', event_date: '2025-05-06', event_time: '09:00 AM - 04:30 PM', location: 'Auditorium', event_type: 'Seminar', description: 'Master Networking Fundamentals and Learn CCNA & CCNP for Job Assurance.', status: 'completed' },
    { title: 'ENVISION-X 2025: Transform Ideas into Reality', event_date: '2025-02-04', event_time: 'Online', location: 'Virtual', event_type: 'Competition', description: '45-day online project-based innovation challenge.', status: 'completed' },
    { title: 'CodeFusion: The DevOps Synergy', event_date: '2025-02-04', event_time: '11:00 AM - 01:00 PM', location: 'Auditorium', event_type: 'Seminar', description: 'Unifying development and operations for seamless integration, automation, and continuous delivery.', status: 'completed' },
    { title: 'Net Secure 2025', event_date: '2025-01-20', event_time: '10:00 AM - 11:30 AM', location: 'Auditorium', event_type: 'Seminar', description: 'Building careers in Network Securities.', status: 'completed' },
    { title: 'Tech Elevate 2024', event_date: '2024-11-22', event_time: '1:00 PM', location: 'Auditorium', event_type: 'Seminar', description: 'DevOps & Cloud Computing.', status: 'completed' }
];

const reviews = [
    { name: 'Mr. Rohit Singhal', role: 'Auger - Software Development Manager', review: 'It was a pleasure mentoring your club. I truly appreciated the enthusiasm, curiosity, teamwork, and dedication each member showed. Your professionalism, preparation, and eagerness to learn made the experience smooth and rewarding. Keep pushing boundaries, supporting one another, and staying open to feedback. I am confident you will achieve great things. Wishing the club continued success ahead.', highlight: 'Strong Leadership' },
    { name: 'Mrs. Meeta Rathore', role: 'Sr. Big Data Engineer, Optum (UHG)', review: 'Mentoring Devity Club data science cohort was a rewarding experience. Students rapidly progressed from exploratory analysis to production-ready pipelines, demonstrating strong ownership and curiosity. Their final models showed measurable improvements in accuracy and robustness, and their documentation and MLOps hygiene exceeded expectations for early-career talent. Devity Club provides a structured, industry-aligned environment that truly accelerates learning and readiness for real-world projects.', highlight: 'Highly Professional' },
    { name: 'Mr. Rohit Agarwal', role: 'Senior Data Engineering Lead | OPTUM', review: 'Attending the 2-day speaker session at Amity University Raipur was an incredible experience. The event was well-organized, with an enthusiastic team and inspiring participants. I truly enjoyed delivering my session on Data Engineering and engaging with such bright minds. The discussions were insightful, and the energy throughout the event was remarkable. Kudos to the organizers for creating a platform that fosters learning and collaboration.', highlight: 'Outstanding Tech Culture' },
    { name: 'Mr. Amol Rangari', role: 'Cognizant', review: 'It was a wonderful experience being part of DEVITY Summit 2025 at Amity University. The event was exceptionally well-organized, and the efforts of the Devity Club were clearly reflected in the smooth execution and warm hospitality. Delivering a session on Cybersecurity and interacting with such enthusiastic students was truly rewarding. The curiosity, engagement, and thoughtful questions from participants highlighted a strong passion for learning and future-ready skills. I appreciate the excellent coordination throughout the event and look forward to contributing to more such initiatives in the future. Hackers are not criminals; they are curious minds mastering social engineering to expose weaknesses before criminals do.', highlight: 'Strong Leadership' }
];

const memories = [
    { title: 'Tech Elevate', description: 'Tech Elevate 2024: DevOps & Cloud Career Pathways was successfully held on 22nd November 2024 at Amity University Chhattisgarh. The keynote speaker, Mr. Vikas Shrivastava, shared his expertise in DevOps workflows, cloud technologies, and career pathways.', event_date: '2024-11-22' },
    { title: 'Code Fusion', description: 'CodeFusion: The DevOps Synergy was successfully held on 4th February 2025 at Amity University Chhattisgarh. The keynote speaker, Mr. Nakul Grover, DevOps Engineer at Thomson Reuters, shared his expertise in DevOps workflows, cloud technologies, and automation tools.', event_date: '2025-02-04' },
    { title: 'Envision X 2025', description: 'Envision-X 2025, the biggest tech event at Amity University Chhattisgarh, was successfully conducted from February 4 to March 25, 2025. This 45-day online project-based innovation challenge gave students a platform to work on real-world projects while receiving mentorship from top industry experts.', event_date: '2025-03-25' },
    { title: 'Jumpstart Event', description: 'Jumpstart Your Tech Career: Master Networking Fundamentals and Learn CCNA & CCNP for Job Assurance was hosted by Devity Club with AIIT and ASET to empower students with foundational and advanced networking knowledge aligned with industry certifications.', event_date: '2025-05-06' },
    { title: 'Net Secure 2025', description: 'NetSecure 2025 was held on 20th January 2025. This online event focused on guiding students into the critical and rapidly evolving field of network security, including career opportunities, industry trends, and essential cybersecurity skills.', event_date: '2025-01-20' },
    { title: 'NetCamp', description: 'NetCamp was a networking bootcamp and skill development program focused on practical learning, technical training, and hands-on networking concepts.', event_date: '2025-08-04' },
    { title: 'Devity Summit 2025', description: 'Devity Summit 2025 brought together leaders, mentors, and students around the theme Learn From Leaders, Build For Industries.', event_date: '2025-09-01' }
];

const skillDocs = (skills) => (skills || []).map((skill) => ({ skill_name: skill, proficiency_level: 'intermediate' }));
const expertiseDocs = (expertise) => (expertise || []).map((area) => ({ area, years_experience: 0 }));

async function seed() {
    await connectMongoDB();
    const admin = await AdminUser.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });

    await Promise.all([
        TeamMember.deleteMany({}),
        GuestSpeaker.deleteMany({}),
        Event.deleteMany({}),
        ClubMemory.deleteMany({}),
        SpeakerReview.deleteMany({})
    ]);

    await TeamMember.insertMany(teamMembers.map((member, index) => ({
        legacyId: index + 1,
        ...member,
        image_url: null,
        skills: skillDocs(member.skills),
        created_by: admin ? admin._id : undefined,
        legacyCreatedBy: admin ? admin.legacyId : undefined
    })));

    await GuestSpeaker.insertMany(guestSpeakers.map((speaker, index) => ({
        legacyId: index + 1,
        ...speaker,
        image_url: null,
        bio: speaker.bio || '',
        speaking_topics: [],
        expertise: expertiseDocs(speaker.expertise),
        created_by: admin ? admin._id : undefined,
        legacyCreatedBy: admin ? admin.legacyId : undefined
    })));

    await Event.insertMany(events.map((event, index) => ({
        legacyId: index + 1,
        ...event,
        event_date: new Date(event.event_date),
        speakers: [],
        created_by: admin ? admin._id : undefined,
        legacyCreatedBy: admin ? admin.legacyId : undefined
    })));

    await ClubMemory.insertMany(memories.map((memory, index) => ({
        legacyId: index + 1,
        ...memory,
        image_url: null,
        event_date: new Date(memory.event_date),
        created_by: admin ? admin._id : undefined,
        legacyCreatedBy: admin ? admin.legacyId : undefined
    })));

    await SpeakerReview.insertMany(reviews.map((review, index) => ({
        legacyId: index + 1,
        ...review,
        image_url: null,
        is_active: true
    })));

    const counts = {
        teamMembers: await TeamMember.countDocuments(),
        guestSpeakers: await GuestSpeaker.countDocuments(),
        events: await Event.countDocuments(),
        clubMemories: await ClubMemory.countDocuments(),
        speakerReviews: await SpeakerReview.countDocuments()
    };

    console.log('Website data seeded into MongoDB:', counts);
}

seed()
    .catch((error) => {
        console.error('Website data seed failed:', error);
        process.exitCode = 1;
    })
    .finally(() => mongoose.connection.close());
