import React, { useState, useEffect } from 'react';
import '../styles/launching-video.css';

const LaunchingVideo = ({ onComplete }) => {
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    // Mark video as shown in session storage (not localStorage to show on every new session)
    const videoShown = sessionStorage.getItem('launchingVideoShown');
    
    if (videoShown) {
      // If already shown in this session, skip immediately
      onComplete();
    }
  }, [onComplete]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    sessionStorage.setItem('launchingVideoShown', 'true');
    setTimeout(() => {
      onComplete();
    }, 300); // Small delay for smooth transition
  };

  const handleSkip = () => {
    sessionStorage.setItem('launchingVideoShown', 'true');
    onComplete();
  };

  // If video was already shown, don't render anything
  if (sessionStorage.getItem('launchingVideoShown')) {
    return null;
  }

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

export default LaunchingVideo;
