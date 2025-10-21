import React from 'react';

function App() {
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      backgroundColor: '#e3f2fd',
      padding: '50px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, [
    React.createElement('div', {
      key: 'container',
      style: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        maxWidth: '700px',
        width: '100%'
      }
    }, [
      React.createElement('h1', {
        key: 'title',
        style: { 
          fontSize: '3.5rem', 
          color: '#1976d2', 
          marginBottom: '20px',
          fontWeight: 'bold'
        }
      }, 'DEVITY CLUB'),
      React.createElement('h2', {
        key: 'status',
        style: { 
          fontSize: '1.8rem', 
          color: '#2e7d32', 
          marginBottom: '20px' 
        }
      }, '✅ React App is Live!'),
      React.createElement('p', {
        key: 'message',
        style: { 
          fontSize: '1.2rem', 
          color: '#424242', 
          lineHeight: '1.6',
          marginBottom: '30px'
        }
      }, 'If you can see this message, the React application is successfully deployed on Vercel.'),
      React.createElement('div', {
        key: 'info',
        style: {
          backgroundColor: '#f3e5f5',
          border: '2px solid #9c27b0',
          padding: '20px',
          borderRadius: '10px',
          color: '#4a148c'
        }
      }, 'The white screen issue has been resolved! 🎉')
    ])
  ]);
}

export default App;
