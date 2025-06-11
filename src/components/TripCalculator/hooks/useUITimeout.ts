
import { useEffect, useRef } from 'react';

interface UseUITimeoutOptions {
  timeoutMs: number;
  onTimeout: () => void;
  isActive: boolean;
}

export const useUITimeout = ({ timeoutMs, onTimeout, isActive }: UseUITimeoutOptions) => {
  const uiTimeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      // Clear any existing timeout
      if (uiTimeoutId.current) {
        clearTimeout(uiTimeoutId.current);
      }

      // Set new timeout
      uiTimeoutId.current = setTimeout(() => {
        onTimeout();
        uiTimeoutId.current = null;
      }, timeoutMs);
    } else {
      // Clear timeout when not active
      if (uiTimeoutId.current) {
        clearTimeout(uiTimeoutId.current);
        uiTimeoutId.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (uiTimeoutId.current) {
        clearTimeout(uiTimeoutId.current);
        uiTimeoutId.current = null;
      }
    };
  }, [isActive, timeoutMs, onTimeout]);

  const clearUITimeout = () => {
    if (uiTimeoutId.current) {
      clearTimeout(uiTimeoutId.current);
      uiTimeoutId.current = null;
    }
  };

  return { clearUITimeout };
};
