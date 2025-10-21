import React, { useState, useEffect } from 'react';
import './App.css';
import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import ClubMemories from './components/ClubMemories';
import Events from './components/Events';
import Team from './components/Team';
import Speakers from './components/Speakers';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Simple routing based on URL pathname
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path === '/dashboard') {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('home');
      }
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  if (currentPage === 'dashboard') {
    return <AdminProtectedRoute />;
  }

  return (
    <div className="min-h-screen">
      {/* Header and Hero without animated background */}
      <div className="relative">
        <Header />
        <Hero />
      </div>

      {/* Rest of the sections with animated background */}
      <div className="relative min-h-screen">
        <AnimatedBackground />
        <div className="relative z-10">
          <About />
          <ClubMemories />
          <Events />
          <Team />
          <Speakers />
          <Contact />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
