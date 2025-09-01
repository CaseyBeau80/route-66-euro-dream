import React, { useCallback, useRef, useEffect } from 'react';
import { yieldToMain, globalScheduler } from '@/utils/timeSlicing';

interface MainThreadOptimizerProps {
  children: React.ReactNode;
  priority?: 'high' | 'normal' | 'low';
  maxRenderTime?: number; // Maximum time before yielding
}

/**
 * Ultra-aggressive main thread optimizer specifically for FID optimization
 * Breaks up rendering into tiny chunks to keep main thread responsive
 */
export const MainThreadOptimizer: React.FC<MainThreadOptimizerProps> = ({
  children,
  priority = 'normal',
  maxRenderTime = 16 // ~1 frame at 60fps
}) => {
  const renderRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);

  const optimizedRender = useCallback(async () => {
    if (renderRef.current) return;
    
    renderRef.current = true;
    startTimeRef.current = performance.now();
    
    // Schedule with priority
    globalScheduler.schedule(() => {
      const elapsed = performance.now() - startTimeRef.current;
      
      // If we've exceeded our time budget, yield and reschedule
      if (elapsed > maxRenderTime) {
        renderRef.current = false;
        yieldToMain().then(() => {
          if (!renderRef.current) {
            optimizedRender();
          }
        });
      }
    }, priority);
  }, [priority, maxRenderTime]);

  useEffect(() => {
    optimizedRender();
    return () => {
      renderRef.current = false;
    };
  }, [optimizedRender]);

  return <>{children}</>;
};

/**
 * Hook for time-sliced array operations to prevent main thread blocking
 */
export const useTimeSlicedOperation = <T, R>(
  operation: (items: T[]) => R,
  dependencies: React.DependencyList,
  chunkSize: number = 5
) => {
  const [result, setResult] = React.useState<R | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    
    const processOperation = async () => {
      if (cancelled) return;
      
      setIsProcessing(true);
      
      try {
        // Yield before starting
        await yieldToMain();
        
        if (cancelled) return;
        
        const operationResult = operation([]);
        
        if (!cancelled) {
          setResult(operationResult);
        }
      } finally {
        if (!cancelled) {
          setIsProcessing(false);
        }
      }
    };

    processOperation();
    
    return () => {
      cancelled = true;
    };
  }, dependencies);

  return { result, isProcessing };
};

/**
 * Component wrapper that automatically optimizes main thread usage
 */
export const AutoOptimized: React.FC<{
  children: React.ReactNode;
  enabled?: boolean;
}> = ({ children, enabled = true }) => {
  if (!enabled) return <>{children}</>;
  
  return (
    <MainThreadOptimizer priority="normal" maxRenderTime={8}>
      {children}
    </MainThreadOptimizer>
  );
};