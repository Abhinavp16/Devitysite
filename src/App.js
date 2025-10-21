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

  // Test with inline styles first (no Tailwind)
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        paddingTop: '50px'
      }}>
        <h1 style={{ 
          fontSize: '3rem',
          color: '#007bff',
          marginBottom: '20px'
        }}>
          Devity Club
        </h1>
        <p style={{ 
          fontSize: '1.2rem',
          color: '#666',
          marginBottom: '40px'
        }}>
          React App is Working!
        </p>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#28a745', marginBottom: '15px' }}>
            ✅ Basic React App Loaded
          </h2>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            If you can see this, React is working correctly. 
            The white screen was likely caused by Tailwind CSS or component errors.
          </p>
        </div>
        
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          padding: '20px',
          borderRadius: '8px',
          color: '#856404'
        }}>
          <strong>Next Step:</strong> We'll gradually add back the components to identify the issue.
        </div>
      </div>
    </div>
  );
}

export default App;
