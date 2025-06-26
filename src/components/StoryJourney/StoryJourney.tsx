
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { timelineMilestones } from '@/data/timelineData';
import { ImmersiveStorySection } from './components/ImmersiveStorySection';
import { ImmersiveProgressTracker } from './components/ImmersiveProgressTracker';
import { MobileSwipeNavigation } from './components/MobileSwipeNavigation';
import { AnimatedRouteLine } from './components/AnimatedRouteLine';
import { useTimelineValidation } from './hooks/useTimelineValidation';
import { AudioService } from './services/AudioService';

const StoryJourney: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Validate timeline images on component mount
  useTimelineValidation(timelineMilestones);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      AudioService.cleanup();
    };
  }, []);

  const handleNavigate = (index: number) => {
    if (index >= 0 && index < timelineMilestones.length && index !== currentIndex) {
      // Stop any playing audio when navigating
      AudioService.stopAllAudio();
      
      setCurrentIndex(index);
      setIsScrolling(true);
      
      // Scroll to section
      const element = document.getElementById(`timeline-${timelineMilestones[index].year}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
      
      // Reset scrolling state
      setTimeout(() => setIsScrolling(false), 1000);
    }
  };

  const handleSectionBecomeActive = (index: number) => {
    if (!isScrolling && index !== currentIndex) {
      // Stop any playing audio when changing sections
      AudioService.stopAllAudio();
      setCurrentIndex(index);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-route66-bg-primary via-route66-bg-secondary to-route66-bg-tertiary">
      {/* Timeline sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key="timeline-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {timelineMilestones.map((milestone, index) => (
            <ImmersiveStorySection
              key={milestone.id}
              milestone={milestone}
              index={index}
              isActive={index === currentIndex}
              onBecomeActive={() => handleSectionBecomeActive(index)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Progress tracker for desktop */}
      <ImmersiveProgressTracker
        milestones={timelineMilestones}
        currentIndex={currentIndex}
        onNavigate={handleNavigate}
      />

      {/* Mobile navigation */}
      <MobileSwipeNavigation
        currentIndex={currentIndex}
        totalSections={timelineMilestones.length}
        onNavigate={handleNavigate}
        currentYear={timelineMilestones[currentIndex]?.year || 1926}
        currentCategory={timelineMilestones[currentIndex]?.category || 'establishment'}
      />

      {/* Animated route line */}
      <AnimatedRouteLine
        milestones={timelineMilestones}
        currentIndex={currentIndex}
      />
    </div>
  );
};

export default StoryJourney;
