import { useState, useEffect, useCallback } from 'react';

export const useImagePreloader = (images, priority = 'normal') => {
  const [loadedImages, setLoadedImages] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const preloadImage = useCallback((src, key) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        setLoadedImages(prev => ({
          ...prev,
          [key]: { loaded: true, error: false, src }
        }));
        resolve(img);
      };
      
      img.onerror = () => {
        setLoadedImages(prev => ({
          ...prev,
          [key]: { loaded: false, error: true, src }
        }));
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });
  }, []);

  const preloadImages = useCallback(async (imageList, keyPrefix = '') => {
    const totalImages = imageList.length;
    let loadedCount = 0;

    const updateProgress = () => {
      loadedCount++;
      setLoadingProgress((loadedCount / totalImages) * 100);
    };

    const promises = imageList.map(async (image, index) => {
      const key = `${keyPrefix}${index}`;
      try {
        await preloadImage(image.src || image, key);
        updateProgress();
      } catch (error) {
        updateProgress();
        console.warn(`Failed to preload image: ${image.src || image}`);
      }
    });

    await Promise.all(promises);
    setIsLoading(false);
  }, [preloadImage]);

  useEffect(() => {
    if (images && images.length > 0) {
      setIsLoading(true);
      setLoadingProgress(0);
      preloadImages(images);
    }
  }, [images, preloadImages]);

  const getImageStatus = useCallback((key) => {
    return loadedImages[key] || { loaded: false, error: false, src: null };
  }, [loadedImages]);

  const isImageLoaded = useCallback((key) => {
    return loadedImages[key]?.loaded || false;
  }, [loadedImages]);

  const hasImageError = useCallback((key) => {
    return loadedImages[key]?.error || false;
  }, [loadedImages]);

  return {
    loadedImages,
    loadingProgress,
    isLoading,
    preloadImages,
    getImageStatus,
    isImageLoaded,
    hasImageError
  };
};

export default useImagePreloader;