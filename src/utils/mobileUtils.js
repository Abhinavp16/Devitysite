// Mobile utility functions and viewport management

export const isMobile = () => {
  return window.innerWidth <= 640;
};

export const isTablet = () => {
  return window.innerWidth > 640 && window.innerWidth <= 1024;
};

export const isDesktop = () => {
  return window.innerWidth > 1024;
};

export const getViewportHeight = () => {
  // Use dynamic viewport height for mobile browsers
  return window.visualViewport ? window.visualViewport.height : window.innerHeight;
};

export const setViewportMeta = () => {
  // Ensure proper viewport meta tag
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    document.head.appendChild(viewport);
  }
  viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
};

export const preventZoom = () => {
  // Prevent zoom on input focus for mobile
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  });

  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
};

export const handleOrientationChange = (callback) => {
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      callback();
    }, 100);
  });
};

export const optimizeForMobile = () => {
  if (isMobile()) {
    setViewportMeta();
    preventZoom();
    
    // Add mobile-specific classes
    document.body.classList.add('mobile-optimized');
    
    // Handle iOS Safari viewport issues
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.body.classList.add('ios-safari-fix');
    }
    
    // Handle Android Chrome viewport issues
    if (/Android/.test(navigator.userAgent)) {
      document.body.classList.add('android-chrome-fix');
    }
  }
};

export const getOptimalImageSize = () => {
  const width = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;
  
  if (width <= 640) {
    return Math.min(640 * dpr, 1280); // Mobile
  } else if (width <= 1024) {
    return Math.min(1024 * dpr, 2048); // Tablet
  } else {
    return Math.min(1920 * dpr, 3840); // Desktop
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Initialize mobile optimizations
export const initMobileOptimizations = () => {
  optimizeForMobile();
  
  // Handle resize events
  const handleResize = debounce(() => {
    optimizeForMobile();
  }, 250);
  
  window.addEventListener('resize', handleResize);
  
  // Handle orientation changes
  handleOrientationChange(() => {
    optimizeForMobile();
  });
};

export default {
  isMobile,
  isTablet,
  isDesktop,
  getViewportHeight,
  setViewportMeta,
  preventZoom,
  handleOrientationChange,
  optimizeForMobile,
  getOptimalImageSize,
  debounce,
  initMobileOptimizations
};