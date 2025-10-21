import { useState, useEffect } from 'react';
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
    console.log('App component mounted');
    // Simple routing based on URL pathname
    const handleRouteChange = () => {
      const path = window.location.pathname;
      console.log('Current path:', path);
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

  console.log('Rendering App, currentPage:', currentPage);

  if (currentPage === 'dashboard') {
    return <AdminProtectedRoute />;
  }

  try {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Test with just basic content first */}
        <div className="p-8 text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Devity Club</h1>
          <p className="text-xl text-gray-600 mb-8">Loading components...</p>
        </div>

        {/* Gradually add components */}
        <Header />
        <Hero />
        <About />
        {/* <ClubMemories />
        <Events />
        <Team />
        <Speakers />
        <Contact />
        <Footer /> */}
      </div>
    );
  } catch (error) {
    console.error('Error in App render:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Error loading application</h1>
        <p>Please check the console for details.</p>
      </div>
    );
  }
}

export default App;
