import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/mobile-optimizations.css';
import './styles/loading-skeleton.css';
import './styles/fast-loading.css';
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
import AdminLogin from './components/AdminLogin';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import LoadingSkeleton from './components/LoadingSkeleton';
import useLoadingSequence from './hooks/useLoadingSequence';
import { ThemeProvider } from './contexts/ThemeContext';

// Helper: SPA navigation without full-page reload
export const navigate = (path) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { isLoading, progress, currentStep } = useLoadingSequence(50);

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path === '/dashboard') {
        setCurrentPage('dashboard');
      } else if (path === '/login') {
        setCurrentPage('login');
      } else {
        setCurrentPage('home');
      }
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // ThemeProvider wraps ALL pages so ThemeToggle / useTheme() never runs outside it
  return (
    <ThemeProvider>
      {isLoading ? (
        <LoadingSkeleton progress={progress} currentStep={currentStep} />
      ) : currentPage === 'dashboard' ? (
        <AdminProtectedRoute />
      ) : currentPage === 'login' ? (
        <AdminLogin onLoginSuccess={() => navigate('/dashboard')} />
      ) : (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="relative">
            <Header />
            <Hero />
          </div>
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
      )}
    </ThemeProvider>
  );
}

export default App;
