
import React, { useState } from 'react';
import { CactusGrowthStage } from '../types/cactiTypes';
import DesertCactusSVG from './DesertCactusSVG';

interface CactusGrowthProps {
  stage: CactusGrowthStage;
  stageIndex: number;
  isActive: boolean;
  isUnlocked: boolean;
}

const CactusGrowth: React.FC<CactusGrowthProps> = ({ stage, stageIndex, isActive, isUnlocked }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-2 relative">
      {/* Tooltip */}
      {showTooltip && isUnlocked && (
        <div className="absolute bottom-full mb-2 w-64 p-3 bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-300 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="text-sm font-bold text-orange-800 mb-1">{stage.name}</div>
          <div className="text-xs text-orange-700 mb-2">{stage.tooltip}</div>
          <div className="text-xs text-orange-600 italic">📍 {stage.region}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-orange-300"></div>
        </div>
      )}
      
      {/* Cactus container with enhanced desert styling */}
      <div 
        className="relative flex items-end justify-center w-16 h-24 cursor-pointer transition-all duration-300 hover:scale-110"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Desert ground with sunset gradient */}
        <div className="absolute bottom-0 w-full h-3 bg-gradient-to-r from-orange-400 via-amber-500 to-red-400 rounded-full opacity-80 shadow-md"></div>
        
        {/* Sand texture */}
        <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-60"></div>
        
        {/* Cactus SVG */}
        <div 
          className={`
            transition-all duration-1000 ease-out relative z-10
            ${isUnlocked ? 'opacity-100 scale-100' : 'opacity-30 scale-75'}
            ${isActive ? 'animate-pulse' : ''}
          `}
        >
          <DesertCactusSVG 
            stage={stageIndex} 
            size={48} 
            className={isActive ? 'animate-bounce' : ''}
          />
        </div>
        
        {/* Growth sparkles for active stage */}
        {isActive && isUnlocked && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute text-yellow-300 animate-ping"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${10 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.3}s`,
                  fontSize: '10px'
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}
        
        {/* Desert heat shimmer effect */}
        {isActive && isUnlocked && (
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-orange-100 to-transparent opacity-30 animate-pulse pointer-events-none"></div>
        )}
      </div>
      
      {/* Stage name with desert theming */}
      <div className="text-center">
        <div className={`text-xs font-special-elite font-bold ${isUnlocked ? 'text-amber-800' : 'text-gray-400'}`}>
          {stage.name}
        </div>
        <div className={`text-xs ${isUnlocked ? 'text-orange-600' : 'text-gray-300'}`}>
          {stage.region}
        </div>
        {isActive && isUnlocked && (
          <div className="text-xs text-amber-600 font-bold animate-bounce flex items-center justify-center gap-1 mt-1">
            Growing! 🌱
          </div>
        )}
      </div>
    </div>
  );
};

export default CactusGrowth;
