
import React from 'react';
import { CactusGrowthStage } from '../types/cactiTypes';

interface CactusGrowthProps {
  stage: CactusGrowthStage;
  isActive: boolean;
  isUnlocked: boolean;
}

const CactusGrowth: React.FC<CactusGrowthProps> = ({ stage, isActive, isUnlocked }) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Cactus container */}
      <div className="relative flex items-end justify-center w-16 h-24">
        {/* Desert ground */}
        <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full opacity-70"></div>
        
        {/* Cactus growth */}
        <div 
          className={`
            ${stage.height} w-8 
            transition-all duration-1000 ease-out
            ${isUnlocked ? 'opacity-100 scale-100' : 'opacity-30 scale-75'}
            ${isActive ? 'animate-pulse' : ''}
          `}
        >
          <div className={`text-2xl ${stage.color} drop-shadow-lg`}>
            {stage.icon}
          </div>
        </div>
        
        {/* Growth sparkles for active stage */}
        {isActive && isUnlocked && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute text-yellow-400 animate-ping"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${10 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.3}s`,
                  fontSize: '8px'
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Stage name */}
      <div className="text-center">
        <div className={`text-xs font-special-elite ${isUnlocked ? 'text-amber-800' : 'text-gray-400'}`}>
          {stage.name}
        </div>
        {isActive && isUnlocked && (
          <div className="text-xs text-amber-600 font-bold animate-bounce">
            Growing! 🌱
          </div>
        )}
      </div>
    </div>
  );
};

export default CactusGrowth;
