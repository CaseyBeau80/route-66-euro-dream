
import React, { useEffect, useState } from 'react';
import { TimelineEntry } from './TimelineEntry';
import { TimelineMilestone } from '../../data/timelineData';

interface TimelineDesktopProps {
  milestones: TimelineMilestone[];
}

export const TimelineDesktop: React.FC<TimelineDesktopProps> = ({ milestones }) => {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    // Observe all timeline entries
    milestones.forEach((milestone) => {
      const element = document.getElementById(`timeline-${milestone.id}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [milestones]);

  return (
    <div className="relative">
      {/* Animated vertical timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full rounded-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-b from-route66-primary via-route66-accent-gold to-route66-primary animate-subtle-gradient bg-[length:100%_200%] opacity-90"></div>
        {/* Sparkle effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-highway-blink opacity-30"></div>
      </div>
      
      {/* Timeline entries */}
      <div className="space-y-0">
        {milestones.map((milestone, index) => (
          <div 
            key={milestone.id} 
            id={`timeline-${milestone.id}`}
            className="flex justify-center"
          >
            <TimelineEntry
              milestone={milestone}
              isLeft={index % 2 === 1}
              isVisible={visibleItems.has(`timeline-${milestone.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
