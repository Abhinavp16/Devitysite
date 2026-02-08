import React, { useState } from 'react';
import '../styles/launching-video.css';

// This version plays the launching video on EVERY page load/refresh
const LaunchingVideoAlways = ({ onComplete }) => {
  const [videoEnded, setVideoEnded] = useState(false);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setTimeout(() => {
      onComplete();
    }, 300); // Small delay for smooth transition
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className={`launching-video-container ${videoEnded ? 'fade-out' : ''}`}>
      <video
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="launching-video"
      >
        <source src="/launching.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <button 
        className="skip-button"
        onClick={handleSkip}
        aria-label="Skip intro"
      >
        Skip
      </button>
    </div>
  );
};

export default LaunchingVideoAlways;
