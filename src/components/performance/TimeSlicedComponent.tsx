import React from 'react';
import { yieldToMain, globalScheduler } from '@/utils/timeSlicing';

/**
 * Component wrapper that implements time-slicing for rendering
 * Breaks up expensive render operations to prevent main-thread blocking
 */
interface TimeSlicedComponentProps {
  children: React.ReactNode;
  priority?: 'high' | 'normal' | 'low';
  delay?: number;
  fallback?: React.ReactNode;
}

export const TimeSlicedComponent: React.FC<TimeSlicedComponentProps> = ({
  children,
  priority = 'normal',
  delay = 0,
  fallback = null
}) => {
  const [isReady, setIsReady] = React.useState(delay === 0);
  
  React.useEffect(() => {
    if (delay > 0) {
      globalScheduler.schedule(() => {
        setIsReady(true);
      }, priority);
    }
  }, [delay, priority]);
  
  return <>{isReady ? children : fallback}</>;
};

/**
 * Hook for progressive component mounting with time-slicing
 */
export const useProgressiveMount = (
  componentCount: number,
  mountDelay: number = 50,
  batchSize: number = 3
) => {
  const [mountedCount, setMountedCount] = React.useState(0);
  
  React.useEffect(() => {
    if (componentCount === 0) return;
    
    const mountNextBatch = async () => {
      for (let i = 0; i < Math.min(batchSize, componentCount - mountedCount); i++) {
        await yieldToMain();
        setMountedCount(prev => Math.min(prev + 1, componentCount));
        
        // Small delay between mounts
        if (mountDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, mountDelay));
        }
      }
      
      // Schedule next batch if needed
      if (mountedCount + batchSize < componentCount) {
        globalScheduler.schedule(mountNextBatch, 'normal');
      }
    };
    
    if (mountedCount < componentCount) {
      globalScheduler.schedule(mountNextBatch, 'normal');
    }
  }, [componentCount, mountDelay, batchSize, mountedCount]);
  
  return {
    mountedCount,
    shouldMount: (index: number) => index < mountedCount,
    isComplete: mountedCount >= componentCount,
    progress: componentCount > 0 ? (mountedCount / componentCount) * 100 : 0
  };
};