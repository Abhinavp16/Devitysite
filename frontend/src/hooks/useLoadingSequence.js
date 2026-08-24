import { useState, useEffect } from 'react';
import { measureTotalLoadingTime, trackLoadingSequence } from '../utils/performanceMonitor';

const useLoadingSequence = (initialDelay = 100) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  useEffect(() => {
    const loadingTimer = measureTotalLoadingTime();
    let stepStartTime = performance.now();
    const pendingTimeouts = [];

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

        if (stepIndex > 0) {
          trackLoadingSequence(stepStartTime, loadingSteps[stepIndex - 1].step);
        }

        stepStartTime = performance.now();
        setCurrentStep(step);
        setProgress(stepProgress);

        const tid = setTimeout(() => {
          stepIndex++;
          if (stepIndex < loadingSteps.length) {
            executeLoadingStep();
          } else {
            trackLoadingSequence(stepStartTime, step);
            const finalTid = setTimeout(() => {
              loadingTimer.end();
              setIsLoading(false);
            }, 150);
            pendingTimeouts.push(finalTid);
          }
        }, delay);
        pendingTimeouts.push(tid);
      }
    };

    const startTimeout = setTimeout(() => {
      executeLoadingStep();
    }, initialDelay);

    return () => {
      clearTimeout(startTimeout);
      pendingTimeouts.forEach(clearTimeout);
    };
  }, [initialDelay]);

  return { isLoading, progress, currentStep };
};

export default useLoadingSequence;