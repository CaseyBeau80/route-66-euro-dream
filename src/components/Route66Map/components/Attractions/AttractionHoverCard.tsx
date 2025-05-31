
import React from 'react';
import { MapPin, Route } from 'lucide-react';
import { AttractionHoverProps } from './types';

const AttractionHoverCard: React.FC<AttractionHoverProps> = ({
  attraction,
  isVisible,
  position,
  onWebsiteClick
}) => {
  if (!isVisible) return null;

  // Simplified positioning to reduce interference with hover detection
  const cardWidth = 280;
  const cardHeight = 160; // Reduced height for simpler design
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // More conservative positioning to avoid mouse interference
  let left = position.x - cardWidth / 2;
  if (left < 20) left = 20;
  if (left + cardWidth > viewportWidth - 20) left = viewportWidth - cardWidth - 20;
  
  // Always position above the marker to avoid mouse interference
  let top = position.y - cardHeight - 40; // Fixed positioning above marker
  if (top < 20) top = position.y + 40; // Fallback to below if not enough space

  console.log(`🎨 Rendering simplified attraction hover card for ${attraction.name}`);

  const cardStyle = {
    position: 'fixed' as const,
    left: `${left}px`,
    top: `${top}px`,
    zIndex: 999999,
    pointerEvents: 'none' as const, // Prevent card from interfering with mouse events
  };

  return (
    <div 
      className="transition-opacity duration-200 ease-out"
      style={cardStyle}
    >
      <div className="w-[280px] max-w-[90vw] bg-white border-2 border-red-600 rounded-lg shadow-xl overflow-hidden">
        {/* Simplified header */}
        <div className="bg-red-600 text-white px-4 py-2">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            <span className="text-sm font-bold">Route 66 Stop</span>
            <span className="text-xs bg-white text-red-600 px-2 py-1 rounded font-bold ml-auto">
              #{attraction.sequence_order}
            </span>
          </div>
        </div>
        
        {/* Simplified content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-bold text-lg text-red-900 mb-2">
            {attraction.name.split(',')[0].split(' - ')[0].trim()}
          </h3>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-red-700 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{attraction.state}</span>
          </div>
          
          {/* Description - simplified */}
          {attraction.description && (
            <p className="text-sm text-red-800 leading-relaxed">
              {attraction.description.length > 120 
                ? `${attraction.description.substring(0, 120)}...` 
                : attraction.description
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttractionHoverCard;
