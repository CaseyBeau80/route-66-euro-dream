
import { useState, useEffect, useCallback } from 'react';
import { JourneyProgress } from '../types';

export const useScrollProgress = (totalStops: number) => {
  const [progress, setProgress] = useState<JourneyProgress>({
    currentStop: 0,
    scrollProgress: 0,
    totalDistance: 2448, // Total Route 66 miles
    completedDistance: 0
  });

  const updateProgress = useCallback((scrollContainer: HTMLElement) => {
    const scrollLeft = scrollContainer.scrollLeft;
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const scrollProgress = Math.min(scrollLeft / maxScroll, 1);
    
    const currentStop = Math.floor(scrollProgress * totalStops);
    const completedDistance = scrollProgress * 2448;

    setProgress({
      currentStop: Math.min(currentStop, totalStops - 1),
      scrollProgress,
      totalDistance: 2448,
      completedDistance
    });
  }, [totalStops]);

  const scrollToStop = useCallback((stopIndex: number, scrollContainer: HTMLElement) => {
    const targetProgress = stopIndex / (totalStops - 1);
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const targetScroll = targetProgress * maxScroll;
    
    scrollContainer.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }, [totalStops]);

  return {
    progress,
    updateProgress,
    scrollToStop
  };
};
