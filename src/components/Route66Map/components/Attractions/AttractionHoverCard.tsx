
import React from 'react';
import { MapPin, Route, ExternalLink } from 'lucide-react';
import { AttractionHoverProps } from './types';

const AttractionHoverCard: React.FC<AttractionHoverProps> = ({
  attraction,
  isVisible,
  position,
  onWebsiteClick
}) => {
  if (!isVisible) return null;

  // Calculate positioning to ensure card stays on screen
  const cardWidth = 320;
  const cardHeight = 240;
  
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
      <div className="w-[320px] max-w-[90vw] bg-white border-2 border-red-600 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center border border-white shadow-sm">
                <Route className="h-2.5 w-2.5 text-red-600" />
              </div>
              <span className="text-sm font-bold tracking-wide uppercase">Route 66 Stop</span>
            </div>
            <div className="text-xs font-bold bg-white text-red-600 px-2 py-1 rounded transform -rotate-2 shadow-sm">
              HISTORIC
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-4 bg-white">
          {/* Title Section */}
          <div className="mb-3 text-center">
            <h3 className="font-black text-lg text-red-600 leading-tight uppercase tracking-wide border-b-2 border-yellow-500 pb-2 mb-2 break-words">
              {attraction.name.split(',')[0].split(' - ')[0].trim()}
            </h3>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-red-600 flex-shrink-0" />
              <span className="text-sm font-bold uppercase tracking-wide">{attraction.state}</span>
              {attraction.highway_designation && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded font-bold">
                  {attraction.highway_designation}
                </span>
              )}
            </div>
          </div>
          
          {/* Description */}
          {attraction.description && (
            <div className="mb-4 p-3 bg-gray-50 border border-dashed border-red-600 rounded">
              <p className="text-sm text-gray-800 leading-relaxed font-medium text-left break-words">
                {attraction.description.length > 100 
                  ? `${attraction.description.substring(0, 100)}...` 
                  : attraction.description
                }
              </p>
            </div>
          )}
          
          {/* Bottom Banner */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-3 py-2 -mx-4 -mb-4 text-center rounded-b-lg">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center border border-white">
                <span className="text-xs font-black text-red-600">66</span>
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">
                Stop #{attraction.sequence_order}
              </span>
              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center border border-white">
                <span className="text-xs font-black text-red-600">66</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionHoverCard;
