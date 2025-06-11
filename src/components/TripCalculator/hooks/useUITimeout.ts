
import { useEffect, useRef, useCallback } from 'react';

interface UseUITimeoutOptions {
  timeoutMs: number;
  onTimeout: () => void;
  isActive: boolean;
}

export const useUITimeout = ({ timeoutMs, onTimeout, isActive }: UseUITimeoutOptions) => {
  const uiTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(0);

  const clearUITimeout = useCallback(() => {
    if (uiTimeoutId.current) {
      clearTimeout(uiTimeoutId.current);
      uiTimeoutId.current = null;
    }
  }, []);

  const resetTimeout = useCallback(() => {
    clearUITimeout();
    if (isActive) {
      startTime.current = Date.now();
      console.log(`⏰ Starting UI timeout (${timeoutMs}ms)`);
      
      uiTimeoutId.current = setTimeout(() => {
        console.log(`⏰ UI timeout triggered after ${timeoutMs}ms`);
        onTimeout();
        uiTimeoutId.current = null;
      }, timeoutMs);
    }
  }, [isActive, timeoutMs, onTimeout, clearUITimeout]);

  useEffect(() => {
    if (isActive) {
      resetTimeout();
    } else {
      clearUITimeout();
    }

    // Cleanup on unmount
    return () => {
      clearUITimeout();
    };
  }, [isActive, resetTimeout, clearUITimeout]);

  // Force clear when dependencies change
  useEffect(() => {
    return () => {
      clearUITimeout();
    };
  }, [timeoutMs, onTimeout, clearUITimeout]);

  return { 
    clearUITimeout,
    resetTimeout,
    getRemainingTime: () => {
      if (!isActive || !startTime.current) return 0;
      const elapsed = Date.now() - startTime.current;
      return Math.max(0, timeoutMs - elapsed);
    }
  };
};
