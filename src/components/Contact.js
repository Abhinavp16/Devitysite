import React, { useState } from 'react';
import { ContactAnimatedBackground } from './AnimatedBackground';

const Contact = () => {
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [mentorForm, setMentorForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleStudentChange = (e) => {
    setStudentForm({
      ...studentForm,
      [e.target.name]: e.target.value
    });
  };

  const handleMentorChange = (e) => {
    setMentorForm({
      ...mentorForm,
      [e.target.name]: e.target.value
    });
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    console.log('Student inquiry submitted:', studentForm);
    alert('Student inquiry sent successfully!');
    setStudentForm({ name: '', email: '', message: '' });
  };

  const handleMentorSubmit = (e) => {
    e.preventDefault();
    console.log('Mentorship application submitted:', mentorForm);
    alert('Mentorship application sent successfully!');
    setMentorForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-16 bg-white/90 backdrop-blur-sm relative overflow-hidden">
      <ContactAnimatedBackground />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Contact Us
          </h2>
          <p className="text-lg text-gray-600">
            Join our community as a student or become an industry mentor
          </p>
        </div>

        {/* Collaboration Opportunities Grid - Compact Version */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Collaboration Opportunities
            </h3>
            <p className="text-gray-600">
              Partner with us to conduct seminars, workshops, and educational events
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Seminars */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Technical Seminars</h4>
              <p className="text-gray-600 text-sm mb-3">
                Host technical seminars on cutting-edge technologies and industry trends.
              </p>
              <a 
                href="mailto:club.devity@gmail.com?subject=Technical Seminar Proposal&body=Hello Devity Club,%0D%0A%0D%0AI am interested in proposing a technical seminar for your community.%0D%0A%0D%0AProposed Topic:%0D%0ADuration: 1-2 hours%0D%0ATarget Audience: Students interested in [your topic]%0D%0A%0D%0AAbout me:%0D%0A- Name:%0D%0A- Organization:%0D%0A- Expertise:%0D%0A- Contact:%0D%0A%0D%0APlease let me know your availability and requirements.%0D%0A%0D%0ABest regards"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm text-center block"
              >
                Propose Seminar
              </a>
            </div>

            {/* Workshops */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Hands-on Workshops</h4>
              <p className="text-gray-600 text-sm mb-3">
                Conduct interactive workshops where students learn by doing.
              </p>
              <a 
                href="mailto:club.devity@gmail.com?subject=Workshop Planning Proposal&body=Hello Devity Club,%0D%0A%0D%0AI would like to conduct a hands-on workshop for your students.%0D%0A%0D%0AWorkshop Details:%0D%0A- Topic:%0D%0A- Duration: 3-6 hours%0D%0A- Expected Participants: 20-40 students%0D%0A- Materials needed:%0D%0A- Prerequisites:%0D%0A%0D%0AAbout me:%0D%0A- Name:%0D%0A- Organization:%0D%0A- Experience:%0D%0A- Contact:%0D%0A%0D%0AI can provide all necessary materials and resources.%0D%0A%0D%0ABest regards"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm text-center block"
              >
                Plan Workshop
              </a>
            </div>

            {/* Bootcamps */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Intensive Bootcamps</h4>
              <p className="text-gray-600 text-sm mb-3">
                Multi-day intensive training programs for comprehensive learning.
              </p>
              <a 
                href="mailto:club.devity@gmail.com?subject=Intensive Bootcamp Proposal&body=Hello Devity Club,%0D%0A%0D%0AI am interested in organizing an intensive bootcamp for your students.%0D%0A%0D%0ABootcamp Details:%0D%0A- Topic/Domain:%0D%0A- Duration: 2-5 days%0D%0A- Participants: 15-30 students%0D%0A- Certification: Available%0D%0A- Schedule:%0D%0A%0D%0AAbout me:%0D%0A- Name:%0D%0A- Organization:%0D%0A- Qualifications:%0D%0A- Previous bootcamp experience:%0D%0A- Contact:%0D%0A%0D%0AThis will be a comprehensive training program with hands-on projects.%0D%0A%0D%0ABest regards"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm text-center block"
              >
                Organize Bootcamp
              </a>
            </div>

            {/* Industry Talks */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Industry Talks</h4>
              <p className="text-gray-600 text-sm mb-3">
                Share industry insights and career guidance with students.
              </p>
              <a 
                href="mailto:club.devity@gmail.com?subject=Industry Talk Proposal&body=Hello Devity Club,%0D%0A%0D%0AI would like to give an industry talk to your students.%0D%0A%0D%0ATalk Details:%0D%0A- Topic:%0D%0A- Duration: 45-90 minutes%0D%0A- Format: Presentation + Q&A%0D%0A- Target Audience: 100+ students%0D%0A- Focus: Career guidance and industry insights%0D%0A%0D%0AAbout me:%0D%0A- Name:%0D%0A- Current Position:%0D%0A- Company:%0D%0A- Industry Experience:%0D%0A- Speaking Experience:%0D%0A- Contact:%0D%0A%0D%0AI can share valuable insights about career paths and industry trends.%0D%0A%0D%0ABest regards"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm text-center block"
              >
                Schedule Talk
              </a>
            </div>

            {/* Hackathons */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200 hover:border-red-300 transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Hackathons</h4>
              <p className="text-gray-600 text-sm mb-3">
                Sponsor or judge hackathons and coding competitions.
              </p>
              <a 
                href="mailto:club.devity@gmail.com?subject=Hackathon Sponsorship Proposal&body=Hello Devity Club,%0D%0A%0D%0AI am interested in sponsoring or judging hackathons and coding competitions.%0D%0A%0D%0AEvent Details:%0D%0A- Event Type: Hackathon/Competition%0D%0A- Duration: 24-48 hours%0D%0A- Expected Participants: 50-200%0D%0A- Sponsorship Level:%0D%0A- Judging Availability:%0D%0A%0D%0AAbout me/Organization:%0D%0A- Name:%0D%0A- Company/Organization:%0D%0A- Industry:%0D%0A- Previous sponsorship experience:%0D%0A- Contact:%0D%0A%0D%0AWe can provide prizes, mentorship, and judging expertise.%0D%0A%0D%0ABest regards"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm text-center block"
              >
                Sponsor Event
              </a>
            </div>

            {/* Custom Collaborations */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-md">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1v-1a2 2 0 114 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Custom Ideas</h4>
              <p className="text-gray-600 text-sm mb-3">
                Have a unique collaboration idea? Let's discuss it together.
              </p>
              <a 
                href="mailto:club.devity@gmail.com?subject=Custom Collaboration Proposal&body=Hello Devity Club,%0D%0A%0D%0AI have a unique collaboration idea that I'd like to discuss with you.%0D%0A%0D%0ACollaboration Idea:%0D%0A- Concept:%0D%0A- Duration: Flexible%0D%0A- Target Audience: Customizable%0D%0A- Format:%0D%0A- Expected Outcomes:%0D%0A%0D%0AAbout me:%0D%0A- Name:%0D%0A- Organization:%0D%0A- Background:%0D%0A- Why this collaboration:%0D%0A- Contact:%0D%0A%0D%0AI believe this could be a valuable partnership for both parties.%0D%0A%0D%0ABest regards"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm text-center block"
              >
                Discuss Ideas
              </a>
            </div>
          </div>

          {/* Contact for Collaborations */}
          <div className="mt-8 text-center">
            <h4 className="text-lg font-bold text-gray-900 mb-3">Ready to Collaborate?</h4>
            <p className="text-gray-600 mb-4 text-sm max-w-2xl mx-auto">
              We're excited to partner with industry professionals and organizations to provide valuable learning experiences.
            </p>
            <div className="flex justify-center">
              <a 
                href="mailto:club.devity@gmail.com?subject=General Collaboration Inquiry&body=Hello Devity Club,%0D%0A%0D%0AI am interested in collaborating with your club.%0D%0A%0D%0APlease let me know about available collaboration opportunities and how we can work together.%0D%0A%0D%0AAbout me:%0D%0A- Name:%0D%0A- Organization:%0D%0A- Area of Interest:%0D%0A- Contact:%0D%0A%0D%0ALooking forward to hearing from you.%0D%0A%0D%0ABest regards" 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors font-medium inline-flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 grid lg:grid-cols-2 gap-6 mb-12">
          {/* Student Inquiries Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Student Inquiries</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Are you a student eager to join our community?
            </p>
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={studentForm.name}
                  onChange={handleStudentChange}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={studentForm.email}
                  onChange={handleStudentChange}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={studentForm.message}
                  onChange={handleStudentChange}
                  rows={3}
                  placeholder="Tell us about your interests and why you want to join..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
              >
                Submit Inquiry
              </button>
            </form>
          </div>

          {/* Mentorship Opportunities Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mentorship Opportunities</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Interested in mentoring our students or speaking at events?
            </p>
            <form onSubmit={handleMentorSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={mentorForm.name}
                  onChange={handleMentorChange}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={mentorForm.email}
                  onChange={handleMentorChange}
                  placeholder="your.email@company.com"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={mentorForm.message}
                  onChange={handleMentorChange}
                  rows={3}
                  placeholder="Tell us about your expertise and how you'd like to contribute..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm"
              >
                Offer Mentorship
              </button>
            </form>
          </div>
        </div>
        
        {/* Follow Us Section */}
        <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-xl p-8 mx-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Follow Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay connected with us on social media for the latest updates, tech news, and community highlights.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-3xl mx-auto">
            {/* GitHub */}
            <button className="flex flex-col items-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 mb-3 text-gray-500 group-hover:text-gray-700 transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599-.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">GitHub</span>
            </button>

            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/devity-club-auc?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="flex flex-col items-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 mb-3 text-gray-500 group-hover:text-blue-600 transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">LinkedIn</span>
            </a>

            {/* X (formerly Twitter) */}
            <a href="https://x.com/devity_club441?t=FM5tFNSHb3UhQPMPcI8J8w&s=09" className="flex flex-col items-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 mb-3 text-gray-500 group-hover:text-black transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">X</span>
            </a>

            {/* Instagram */}
            <a href="https://www.instagram.com/devity_club_auc?igsh=MWVtcnNoY295N2RnNQ==" className="flex flex-col items-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 mb-3 text-gray-500 group-hover:text-pink-500 transition-colors">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"/>
                  <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="2"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-pink-500 transition-colors">Instagram</span>
            </a>

            {/* Discord */}
            <a href="https://discord.gg/p4wPhaBn" className="flex flex-col items-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 mb-3 text-gray-500 group-hover:text-indigo-500 transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-500 transition-colors">Discord</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;