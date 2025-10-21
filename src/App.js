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

  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      padding: '50px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }
  }, [
    React.createElement('h1', {
      key: 'title',
      style: { fontSize: '48px', color: '#333', marginBottom: '20px' }
    }, 'DEVITY CLUB'),
    React.createElement('p', {
      key: 'subtitle',
      style: { fontSize: '24px', color: '#666', marginBottom: '30px' }
    }, 'React is Working!'),
    React.createElement('div', {
      key: 'status',
      style: {
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        padding: '20px',
        borderRadius: '8px',
        color: '#155724',
        maxWidth: '600px',
        margin: '0 auto'
      }
    }, '✅ If you see this, the React app is successfully deployed!')
  ]);
}

export default App;
