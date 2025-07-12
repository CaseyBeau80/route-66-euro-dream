import { useRef, useCallback } from 'react';

interface HoverClearFunction {
  (): void;
}

export const useMapHoverManager = () => {
  const hoverClearFunctionsRef = useRef<Set<HoverClearFunction>>(new Set());

  const registerHoverClear = useCallback((clearFunction: HoverClearFunction) => {
    hoverClearFunctionsRef.current.add(clearFunction);
    
    // Return cleanup function
    return () => {
      hoverClearFunctionsRef.current.delete(clearFunction);
    };
  }, []);

  const clearAllHovers = useCallback(() => {
    console.log(`🧹 Clearing all hover states (${hoverClearFunctionsRef.current.size} registered)`);
    hoverClearFunctionsRef.current.forEach(clearFunction => {
      try {
        clearFunction();
      } catch (error) {
        console.error('❌ Error clearing hover state:', error);
      }
    });
  }, []);

  return {
    registerHoverClear,
    clearAllHovers
  };
};