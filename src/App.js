import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/mobile-optimizations.css';
import './styles/loading-skeleton.css';
import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import ClubMemories from './components/ClubMemories';
import SpeakerReview from './components/SpeakerReview';
import Events from './components/Events';
import Team from './components/Team';
import Speakers from './components/Speakers';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import LoadingSkeleton from './components/LoadingSkeleton';
import useLoadingSequence from './hooks/useLoadingSequence';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { isLoading, progress, currentStep } = useLoadingSequence(200);

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

  // Show loading skeleton during initial load
  if (isLoading) {
    return <LoadingSkeleton progress={progress} currentStep={currentStep} />;
  }

  if (currentPage === 'dashboard') {
    return <AdminProtectedRoute />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
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
            <SpeakerReview />
            <Events />
            <Team />
            <Speakers />
            <Contact />
            <Footer />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
