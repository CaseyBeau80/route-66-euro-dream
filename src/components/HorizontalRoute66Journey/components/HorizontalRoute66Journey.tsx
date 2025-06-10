
import React, { useRef, useEffect, useState } from 'react';
import { JourneySection } from './JourneySection';
import { JourneyMiniMap } from './JourneyMiniMap';
import { route66JourneyStops } from '../data/journeyStops';
import { useScrollProgress } from '../hooks/useScrollProgress';

export const HorizontalRoute66Journey: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleStops, setVisibleStops] = useState<Set<number>>(new Set([0]));
  const { progress, updateProgress, scrollToStop } = useScrollProgress(route66JourneyStops.length);

  // Handle scroll events
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      updateProgress(container);
      
      // Update visible stops for performance
      const containerRect = container.getBoundingClientRect();
      const newVisibleStops = new Set<number>();
      
      route66JourneyStops.forEach((_, index) => {
        const section = document.getElementById(`journey-${route66JourneyStops[index].id}`);
        if (section) {
          const sectionRect = section.getBoundingClientRect();
          const isVisible = sectionRect.left < containerRect.right && 
                           sectionRect.right > containerRect.left;
          if (isVisible) {
            newVisibleStops.add(index);
          }
        }
      });
      
      setVisibleStops(newVisibleStops);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [updateProgress]);

  // Handle mini-map navigation
  const handleStopClick = (stopIndex: number) => {
    if (scrollContainerRef.current) {
      scrollToStop(stopIndex, scrollContainerRef.current);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!scrollContainerRef.current) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (progress.currentStop > 0) {
            scrollToStop(progress.currentStop - 1, scrollContainerRef.current);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (progress.currentStop < route66JourneyStops.length - 1) {
            scrollToStop(progress.currentStop + 1, scrollContainerRef.current);
          }
          break;
        case 'Home':
          event.preventDefault();
          scrollToStop(0, scrollContainerRef.current);
          break;
        case 'End':
          event.preventDefault();
          scrollToStop(route66JourneyStops.length - 1, scrollContainerRef.current);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [progress.currentStop, scrollToStop]);

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Mini Map */}
      <JourneyMiniMap 
        stops={route66JourneyStops}
        progress={progress}
        onStopClick={handleStopClick}
      />

      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="flex h-full overflow-x-auto overflow-y-hidden scroll-smooth"
        style={{ 
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth'
        }}
      >
        {route66JourneyStops.map((stop, index) => (
          <div 
            key={stop.id}
            style={{ scrollSnapAlign: 'start' }}
            className="flex-shrink-0"
          >
            <JourneySection
              stop={stop}
              isActive={progress.currentStop === index}
              isVisible={visibleStops.has(index)}
            />
          </div>
        ))}
      </div>

      {/* Navigation Hints */}
      <div className="fixed bottom-4 right-4 z-40 bg-black/50 backdrop-blur-sm text-white rounded-lg p-3 text-sm">
        <div className="flex flex-col gap-1">
          <div>← → Navigate stops</div>
          <div>Scroll horizontally</div>
          <div>Click map to jump</div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 bg-black/50 backdrop-blur-sm text-white rounded-full px-6 py-2 text-sm">
        {Math.round(progress.scrollProgress * 100)}% Complete • Stop {progress.currentStop + 1} of {route66JourneyStops.length}
      </div>
    </div>
  );
};
