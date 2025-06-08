
import React from 'react';

interface EasterEggCelebrationProps {
  isActive: boolean;
}

const EasterEggCelebration: React.FC<EasterEggCelebrationProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-blue-600/80 flex items-center justify-center z-50 animate-fade-in">
      <div className="text-center space-y-4 animate-scale-in">
        <div className="text-6xl animate-birthday-bounce">🎉</div>
        <div className="text-4xl font-bold text-white">
          Happy 100th Birthday Route 66!
        </div>
        <div className="text-xl text-white opacity-90">
          You found the secret celebration!
        </div>
        <div className="text-6xl animate-birthday-bounce" style={{ animationDelay: '0.5s' }}>🛣️</div>
      </div>
    </div>
  );
};

export default EasterEggCelebration;
