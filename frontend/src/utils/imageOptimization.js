// Image optimization utilities for faster loading

export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = (imageArray) => {
  return Promise.all(imageArray.map(src => preloadImage(src)));
};

export const createImageWithFallback = (src, fallbackSrc = null) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ src, loaded: true, error: false });
    img.onerror = () => {
      if (fallbackSrc) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve({ src: fallbackSrc, loaded: true, error: false });
        fallbackImg.onerror = () => resolve({ src: null, loaded: false, error: true });
        fallbackImg.src = fallbackSrc;
      } else {
        resolve({ src: null, loaded: false, error: true });
      }
    };
    img.src = src;
  });
};

export const optimizeImageLoading = (images, priority = 'normal') => {
  const loadingStrategy = {
    high: { loading: 'eager', fetchPriority: 'high', decoding: 'sync' },
    normal: { loading: 'lazy', fetchPriority: 'auto', decoding: 'async' },
    low: { loading: 'lazy', fetchPriority: 'low', decoding: 'async' }
  };

  return images.map((image, index) => ({
    ...image,
    ...loadingStrategy[priority],
    // First few images get higher priority
    ...(index < 3 ? loadingStrategy.high : loadingStrategy.normal)
  }));
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Image compression utility (for future use)
export const compressImage = (file, quality = 0.8, maxWidth = 1920) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};