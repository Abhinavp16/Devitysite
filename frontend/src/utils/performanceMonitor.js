// Performance monitoring utilities for image and video loading
const isDev = process.env.NODE_ENV !== 'production';

export const measureLoadTime = (startTime, label = 'Resource') => {
  const endTime = performance.now();
  const loadTime = endTime - startTime;
  if (isDev) console.log(`${label} loaded in ${loadTime.toFixed(2)}ms`);
  return loadTime;
};

export const trackLoadingSequence = (startTime, stepName) => {
  const currentTime = performance.now();
  const stepTime = currentTime - startTime;
  if (isDev) console.log(`Loading step "${stepName}" completed in ${stepTime.toFixed(2)}ms`);
  return stepTime;
};

export const measureTotalLoadingTime = () => {
  const startTime = performance.now();
  return {
    start: startTime,
    end: () => {
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      if (isDev) console.log(`Total loading sequence completed in ${totalTime.toFixed(2)}ms`);
      return totalTime;
    }
  };
};

export const createPerformanceObserver = (callback) => {
  if (typeof PerformanceObserver === 'undefined') return null;
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach(callback);
  });
  observer.observe({ entryTypes: ['resource', 'navigation', 'measure'] });
  return observer;
};

export const trackImageLoading = (imageSrc, onLoad, onError) => {
  const startTime = performance.now();
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const loadTime = measureLoadTime(startTime, `Image: ${imageSrc.split('/').pop()}`);
      onLoad?.(loadTime);
      resolve({ src: imageSrc, loadTime, loaded: true });
    };
    img.onerror = (error) => {
      const loadTime = measureLoadTime(startTime, `Image Error: ${imageSrc.split('/').pop()}`);
      onError?.(error, loadTime);
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

    const cleanup = () => {
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('canplaythrough', handleLoad);
      video.removeEventListener('error', handleError);
    };

    const handleLoad = () => {
      const loadTime = measureLoadTime(startTime, `Video: ${videoSrc.split('/').pop()}`);
      onLoad?.(loadTime);
      resolve({ src: videoSrc, loadTime, loaded: true });
      cleanup();
    };

    const handleError = (error) => {
      const loadTime = measureLoadTime(startTime, `Video Error: ${videoSrc.split('/').pop()}`);
      onError?.(error, loadTime);
      reject({ src: videoSrc, loadTime, error, loaded: false });
      cleanup();
    };

    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('canplaythrough', handleLoad);
    video.addEventListener('error', handleError);
    video.src = videoSrc;
  });
};

// Web Vitals tracking — only in dev, braces fixed
export const trackWebVitals = () => {
  if (typeof PerformanceObserver === 'undefined') return;

  // LCP
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    if (isDev) console.log('LCP:', entries[entries.length - 1]?.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // FID
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (isDev) console.log('FID:', entry.processingStart - entry.startTime);
    });
  }).observe({ entryTypes: ['first-input'] });

  // CLS
  let clsValue = 0;
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        if (isDev) console.log('CLS:', clsValue);
      }
    });
  }).observe({ entryTypes: ['layout-shift'] });
};

export default {
  measureLoadTime,
  createPerformanceObserver,
  trackImageLoading,
  trackVideoLoading,
  trackWebVitals
};
