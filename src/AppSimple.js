import React from 'react';

function AppSimple() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        textAlign: 'center',
        paddingTop: '100px'
      }}>
        <h1 style={{ 
          color: '#333', 
          fontSize: '3rem', 
          marginBottom: '20px' 
        }}>
          Devity Club
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1.2rem', 
          marginBottom: '40px' 
        }}>
          Welcome to our technology community!
        </p>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#007bff', marginBottom: '20px' }}>
            Site is Loading...
          </h2>
          <p style={{ color: '#666' }}>
            If you see this message, the basic React app is working.
            The issue might be with Tailwind CSS or a specific component.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AppSimple;