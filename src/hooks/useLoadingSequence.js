import { useState, useEffect } from 'react';

const useLoadingSequence = (initialDelay = 100) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  useEffect(() => {
    const loadingSteps = [
      { step: 'Initializing DevityClub...', progress: 15, delay: 300 },
      { step: 'Loading components...', progress: 35, delay: 500 },
      { step: 'Fetching club data...', progress: 55, delay: 400 },
      { step: 'Preparing events...', progress: 70, delay: 300 },
      { step: 'Loading team info...', progress: 85, delay: 250 },
      { step: 'Finalizing interface...', progress: 95, delay: 200 },
      { step: 'Ready to explore!', progress: 100, delay: 150 }
    ];

    let stepIndex = 0;
    
    const executeLoadingStep = () => {
      if (stepIndex < loadingSteps.length) {
        const { step, progress: stepProgress, delay } = loadingSteps[stepIndex];
        setCurrentStep(step);
        setProgress(stepProgress);
        
        setTimeout(() => {
          stepIndex++;
          if (stepIndex < loadingSteps.length) {
            executeLoadingStep();
          } else {
            // Add a final delay before completing
            setTimeout(() => {
              setIsLoading(false);
            }, 400);
          }
        }, delay);
      }
    };

    // Start loading sequence after initial delay
    const startTimeout = setTimeout(() => {
      executeLoadingStep();
    }, initialDelay);

    return () => clearTimeout(startTimeout);
  }, [initialDelay]);

  return { isLoading, progress, currentStep };
};

export default useLoadingSequence;