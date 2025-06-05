
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Route66Badge from './Route66Map/MapElements/Route66Badge';

interface CompactCentennialButtonProps {
  onClick: () => void;
}

const CompactCentennialButton: React.FC<CompactCentennialButtonProps> = ({ onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className="group flex flex-col items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full p-3 hover:bg-black/30 border border-white/20 transition-all duration-300 hover:scale-110"
            aria-label="100 Years of Adventure - Route 66 Centennial"
          >
            {/* Route 66 Shield with celebratory glow */}
            <div className="relative">
              <div className="scale-75 transform group-hover:scale-90 transition-transform duration-300">
                <Route66Badge />
              </div>
              
              {/* Celebratory starburst/glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Starburst rays */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-8 bg-gradient-to-t from-transparent via-yellow-400 to-transparent"
                      style={{
                        transform: `rotate(${i * 45}deg)`,
                        transformOrigin: '50% 50%',
                        animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Golden glow */}
                <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-lg animate-pulse" />
              </div>
            </div>
            
            {/* Compact label */}
            <span className="text-xs font-bold text-white/90 group-hover:text-white transition-colors duration-300 tracking-wide">
              CENTENNIAL
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="bg-black/90 text-white border-white/20 px-4 py-2 rounded-lg shadow-xl"
        >
          <div className="text-center">
            <div className="font-bold text-sm">🎉 100 Years of Adventure</div>
            <div className="text-xs text-white/80 mt-1">Route 66 Centennial Celebration</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CompactCentennialButton;
