
import React from 'react';

interface StoryProgressProps {
  progress: number;
}

export const StoryProgress: React.FC<StoryProgressProps> = ({ progress }) => {
  return (
    <div className="w-full bg-route66-background-alt/30 rounded-full h-2 mt-2">
      <div 
        className="bg-gradient-to-r from-route66-primary to-route66-accent-gold h-2 rounded-full transition-all duration-500 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-0 w-2 h-2 bg-route66-accent-gold rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};
