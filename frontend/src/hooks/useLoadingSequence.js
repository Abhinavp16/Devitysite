import { useState, useEffect } from 'react';
import { measureTotalLoadingTime, trackLoadingSequence } from '../utils/performanceMonitor';

const useLoadingSequence = (initialDelay = 100) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  useEffect(() => {
    const loadingTimer = measureTotalLoadingTime();
    let stepStartTime = performance.now();
    
    const loadingSteps = [
      { step: 'Initializing DevityClub...', progress: 25, delay: 150 },
      { step: 'Loading components...', progress: 50, delay: 200 },
      { step: 'Fetching data...', progress: 75, delay: 150 },
      { step: 'Ready to explore!', progress: 100, delay: 100 }
    ];

    let stepIndex = 0;
    
    const executeLoadingStep = () => {
      if (stepIndex < loadingSteps.length) {
        const { step, progress: stepProgress, delay } = loadingSteps[stepIndex];
        
        // Track previous step completion time
        if (stepIndex > 0) {
          trackLoadingSequence(stepStartTime, loadingSteps[stepIndex - 1].step);
        }
        
        stepStartTime = performance.now();
        setCurrentStep(step);
        setProgress(stepProgress);
        
        setTimeout(() => {
          stepIndex++;
          if (stepIndex < loadingSteps.length) {
            executeLoadingStep();
          } else {
            // Track final step and total time
            trackLoadingSequence(stepStartTime, step);
            setTimeout(() => {
              loadingTimer.end();
              setIsLoading(false);
            }, 150);
          }
        }, delay);
      }
    };

    // Start loading sequence after minimal initial delay
    const startTimeout = setTimeout(() => {
      executeLoadingStep();
    }, initialDelay);

    return () => clearTimeout(startTimeout);
  }, [initialDelay]);

  return { isLoading, progress, currentStep };
};

export default useLoadingSequence;