
import React from 'react';
import { HiddenGem } from './types';

interface HoverCardDisplayProps {
  gem: HiddenGem;
  isVisible: boolean;
  position: { x: number; y: number };
  onWebsiteClick: (website: string) => void;
}

const HoverCardDisplay: React.FC<HoverCardDisplayProps> = ({
  gem,
  isVisible,
  position,
  onWebsiteClick
}) => {
  if (!isVisible) return null;

  // Calculate proper positioning relative to the map container
  const cardStyle = {
    position: 'absolute' as const,
    left: `${position.x}px`,
    top: `${position.y - 200}px`, // Position above the marker with more offset
    transform: 'translateX(-50%)',
    zIndex: 999999,
    opacity: isVisible ? 1 : 0,
    pointerEvents: 'auto' as const,
  };

  return (
    <div 
      className="transition-all duration-200 ease-out"
      style={cardStyle}
    >
      <div className="w-80 max-w-[90vw] bg-white border-2 border-blue-600 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center border border-white shadow-sm">
                <span className="text-xs font-black text-white">★</span>
              </div>
              <span className="text-sm font-bold tracking-wide uppercase">Hidden Gem</span>
            </div>
            <div className="text-xs font-bold bg-white text-blue-600 px-2 py-1 rounded transform -rotate-2 shadow-sm">
              ROUTE 66
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-4 bg-white">
          {/* Title Section */}
          <div className="mb-3 text-center">
            <h3 className="font-black text-lg text-blue-600 leading-tight uppercase tracking-wide border-b-2 border-red-600 pb-2 mb-2 break-words">
              {gem.title}
            </h3>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <span className="text-sm font-bold uppercase tracking-wide">{gem.city_name}</span>
            </div>
          </div>
          
          {/* Description */}
          {gem.description && (
            <div className="mb-4 p-3 bg-gray-50 border border-dashed border-blue-600 rounded">
              <p className="text-sm text-gray-800 leading-relaxed font-medium text-left break-words">
                {gem.description.length > 150 
                  ? `${gem.description.substring(0, 150)}...` 
                  : gem.description
                }
              </p>
            </div>
          )}
          
          {/* Website Button */}
          {gem.website && (
            <div className="text-center mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWebsiteClick(gem.website!);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-full border border-blue-600 hover:bg-red-700 transition-all duration-200 shadow transform hover:scale-105 uppercase tracking-wide"
              >
                Visit Website
              </button>
            </div>
          )}
          
          {/* Bottom Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-2 -mx-4 -mb-4 text-center rounded-b-lg">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center border border-white">
                <span className="text-xs font-black text-white">66</span>
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">
                America's Main Street
              </span>
              <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center border border-white">
                <span className="text-xs font-black text-white">66</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoverCardDisplay;
