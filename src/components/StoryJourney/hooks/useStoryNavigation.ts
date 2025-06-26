
import { useState, useEffect } from 'react';

export const useStoryNavigation = (totalSections: number) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate progress based on current section
    const newProgress = totalSections > 0 ? ((currentSectionIndex + 1) / totalSections) * 100 : 0;
    setProgress(newProgress);
  }, [currentSectionIndex, totalSections]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          if (currentSectionIndex > 0) {
            setCurrentSectionIndex(currentSectionIndex - 1);
          }
          event.preventDefault();
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          if (currentSectionIndex < totalSections - 1) {
            setCurrentSectionIndex(currentSectionIndex + 1);
          }
          event.preventDefault();
          break;
        case 'm':
        case 'M':
          setIsMapVisible(!isMapVisible);
          event.preventDefault();
          break;
        case 'Escape':
          if (isMapVisible) {
            setIsMapVisible(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSectionIndex, totalSections, isMapVisible]);

  return {
    currentSectionIndex,
    setCurrentSectionIndex,
    isMapVisible,
    setIsMapVisible,
    progress
  };
};
