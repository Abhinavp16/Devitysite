// Performance monitoring utilities for image and video loading

export const measureLoadTime = (startTime, label = 'Resource') => {
  const endTime = performance.now();
  const loadTime = endTime - startTime;
  console.log(`${label} loaded in ${loadTime.toFixed(2)}ms`);
  return loadTime;
};

export const trackLoadingSequence = (startTime, stepName) => {
  const currentTime = performance.now();
  const stepTime = currentTime - startTime;
  console.log(`Loading step "${stepName}" completed in ${stepTime.toFixed(2)}ms`);
  return stepTime;
};

export const measureTotalLoadingTime = () => {
  const startTime = performance.now();
  
  return {
    start: startTime,
    end: () => {
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      console.log(`Total loading sequence completed in ${totalTime.toFixed(2)}ms`);
      return totalTime;
    }
  };
};

export const createPerformanceObserver = (callback) => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(callback);
    });
    
    observer.observe({ entryTypes: ['resource', 'navigation', 'measure'] });
    return observer;
  }
  return null;
};

export const trackImageLoading = (imageSrc, onLoad, onError) => {
  const startTime = performance.now();
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const loadTime = measureLoadTime(startTime, `Image: ${imageSrc.split('/').pop()}`);
      onLoad && onLoad(loadTime);
      resolve({ src: imageSrc, loadTime, loaded: true });
    };
    
    img.onerror = (error) => {
      const loadTime = measureLoadTime(startTime, `Image Error: ${imageSrc.split('/').pop()}`);
      onError && onError(error, loadTime);
      reject({ src: imageSrc, loadTime, error, loaded: false });
    };
    
    img.src = imageSrc;
  });
};

export const trackVideoLoading = (videoSrc, onLoad, onError) => {
  const startTime = performance.now();
  
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    
    const handleLoad = () => {
      const loadTime = measureLoadTime(startTime, `Video: ${videoSrc.split('/').pop()}`);
      onLoad && onLoad(loadTime);
      resolve({ src: videoSrc, loadTime, loaded: true });
      cleanup();
    };
    
    const handleError = (error) => {
      const loadTime = measureLoadTime(startTime, `Video Error: ${videoSrc.split('/').pop()}`);
      onError && onError(error, loadTime);
      reject({ src: videoSrc, loadTime, error, loaded: false });
      cleanup();
    };
    
    const cleanup = () => {
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('canplaythrough', handleLoad);
      video.removeEventListener('error', handleError);
    };
    
    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('canplaythrough', handleLoad);
    video.addEventListener('error', handleError);
    
    video.src = videoSrc;
  });
};

// Web Vitals tracking
export const trackWebVitals = () => {
  if ('web-vital' in window) {
    // Track Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Track First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log('CLS:', clsValue);
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }
};

export default {
  measureLoadTime,
  createPerformanceObserver,
  trackImageLoading,
  trackVideoLoading,
  trackWebVitals
};