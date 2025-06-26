
import React from 'react';
import { motion } from 'framer-motion';
import type { TimelineMilestone } from '@/data/timelineData';

interface ImmersiveProgressTrackerProps {
  milestones: TimelineMilestone[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export const ImmersiveProgressTracker: React.FC<ImmersiveProgressTrackerProps> = ({
  milestones,
  currentIndex,
  onNavigate
}) => {
  const progress = ((currentIndex + 1) / milestones.length) * 100;

  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
      <div className="flex flex-col items-center space-y-4">
        {/* Progress Line */}
        <div className="relative w-1 h-64 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-route66-primary to-route66-accent-gold rounded-full"
            initial={{ height: 0 }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Year Indicators */}
        <div className="flex flex-col items-center space-y-3">
          {milestones.map((milestone, index) => (
            <button
              key={milestone.id}
              onClick={() => onNavigate(index)}
              className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-route66-primary text-white scale-110 shadow-lg'
                  : index < currentIndex
                  ? 'bg-route66-primary/70 text-white'
                  : 'bg-white/30 text-route66-text-muted hover:bg-white/50'
              }`}
            >
              <span className="text-xs font-bold">
                {milestone.year.toString().slice(-2)}
              </span>
              
              {/* Tooltip */}
              <div className="absolute left-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                  {milestone.year}: {milestone.title}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Current Year Display */}
        <div className="text-center">
          <div className="text-2xl font-bold text-route66-primary">
            {milestones[currentIndex]?.year}
          </div>
          <div className="text-xs text-route66-text-muted uppercase tracking-wider">
            {milestones[currentIndex]?.category.replace('_', ' ')}
          </div>
        </div>
      </div>
    </div>
  );
};
