
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

  // Calculate positioning to ensure card stays on screen
  const cardWidth = 280;
  const cardHeight = 180;
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  let left = position.x - cardWidth / 2;
  if (left < 10) left = 10;
  if (left + cardWidth > viewportWidth - 10) left = viewportWidth - cardWidth - 10;
  
  let top = position.y - cardHeight - 30;
  if (top < 10) top = position.y + 30;

  console.log(`🎨 Rendering attraction hover card for ${attraction.name} at:`, { 
    markerPos: position, 
    cardPos: { left, top },
    viewport: { viewportWidth, viewportHeight }
  });

  const cardStyle = {
    position: 'fixed' as const,
    left: `${left}px`,
    top: `${top}px`,
    zIndex: 999999,
    pointerEvents: 'auto' as const,
  };

  return (
    <div 
      className="transition-all duration-200 ease-out"
      style={cardStyle}
    >
      <div className="w-[280px] max-w-[90vw] bg-white border-2 border-red-600 rounded-lg shadow-xl overflow-hidden">
        {/* Simple header */}
        <div className="bg-red-600 text-white px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              <span className="text-sm font-bold uppercase">Route 66 Attraction</span>
            </div>
            <span className="text-xs bg-white text-red-600 px-2 py-1 rounded font-bold">
              HISTORIC
            </span>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-4 bg-red-50">
          {/* Title Section */}
          <div className="mb-3 text-center">
            <h3 className="font-bold text-lg text-red-900 leading-tight mb-2">
              {attraction.name.split(',')[0].split(' - ')[0].trim()}
            </h3>
            <div className="flex items-center justify-center gap-2 text-red-700">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{attraction.state}</span>
              {attraction.highway_designation && (
                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded font-bold">
                  {attraction.highway_designation}
                </span>
              )}
            </div>
          </div>
          
          {/* Description */}
          {attraction.description && (
            <div className="mb-3 p-3 bg-white border border-red-200 rounded">
              <p className="text-sm text-red-900 leading-relaxed">
                {attraction.description.length > 100 
                  ? `${attraction.description.substring(0, 100)}...` 
                  : attraction.description
                }
              </p>
            </div>
          )}
          
          {/* Simple bottom info */}
          <div className="text-center">
            <span className="text-xs text-red-700 font-medium">
              Stop #{attraction.sequence_order}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionHoverCard;
