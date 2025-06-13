
import { useState, useCallback, useRef } from 'react';

interface ItineraryLoadingState {
  isPreLoading: boolean;
  progress: number;
  currentStep: string;
  totalSegments: number;
  loadedSegments: number;
  isReady: boolean;
}

interface UseItineraryLoadingReturn extends ItineraryLoadingState {
  startPreLoading: (totalSegments: number) => void;
  updateProgress: (step: string, progress: number) => void;
  markSegmentLoaded: () => void;
  completeLoading: () => void;
  resetLoading: () => void;
}

const loadingSteps = [
  'Initializing Route 66 planning...',
  'Loading historic destinations...',
  'Preparing weather data...',
  'Calculating travel segments...',
  'Finalizing your itinerary...'
];

export const useItineraryLoading = (): UseItineraryLoadingReturn => {
  const [state, setState] = useState<ItineraryLoadingState>({
    isPreLoading: false,
    progress: 0,
    currentStep: '',
    totalSegments: 0,
    loadedSegments: 0,
    isReady: false
  });

  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepProgressRef = useRef(0);

  const startPreLoading = useCallback((totalSegments: number) => {
    console.log('🎬 Starting itinerary pre-loading sequence', { totalSegments });
    
    setState({
      isPreLoading: true,
      progress: 0,
      currentStep: loadingSteps[0],
      totalSegments,
      loadedSegments: 0,
      isReady: false
    });

    // Simulate progressive loading steps
    stepProgressRef.current = 0;
    let currentStepIndex = 0;

    const progressStep = () => {
      stepProgressRef.current += 15;
      
      if (stepProgressRef.current >= 100 && currentStepIndex < loadingSteps.length - 1) {
        currentStepIndex++;
        stepProgressRef.current = 0;
      }

      const overallProgress = (currentStepIndex * 20) + (stepProgressRef.current * 0.2);
      
      setState(prev => ({
        ...prev,
        progress: Math.min(overallProgress, 85), // Never reach 100% until complete
        currentStep: loadingSteps[currentStepIndex]
      }));

      if (overallProgress < 85) {
        progressTimerRef.current = setTimeout(progressStep, 300);
      }
    };

    progressTimerRef.current = setTimeout(progressStep, 200);
  }, []);

  const updateProgress = useCallback((step: string, progress: number) => {
    setState(prev => ({
      ...prev,
      currentStep: step,
      progress: Math.min(Math.max(progress, prev.progress), 85)
    }));
  }, []);

  const markSegmentLoaded = useCallback(() => {
    setState(prev => ({
      ...prev,
      loadedSegments: prev.loadedSegments + 1
    }));
  }, []);

  const completeLoading = useCallback(() => {
    console.log('✅ Itinerary loading completed');
    
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
    }

    setState(prev => ({
      ...prev,
      progress: 100,
      currentStep: 'Your Route 66 adventure is ready!',
      isReady: true
    }));

    // Brief delay to show completion, then hide pre-loader
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isPreLoading: false
      }));
    }, 800);
  }, []);

  const resetLoading = useCallback(() => {
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
    }
    
    setState({
      isPreLoading: false,
      progress: 0,
      currentStep: '',
      totalSegments: 0,
      loadedSegments: 0,
      isReady: false
    });
  }, []);

  return {
    ...state,
    startPreLoading,
    updateProgress,
    markSegmentLoaded,
    completeLoading,
    resetLoading
  };
};
