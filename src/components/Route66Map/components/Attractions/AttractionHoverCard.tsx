
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
      <div className="w-[320px] max-w-[90vw] bg-white border-4 border-red-600 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Enhanced red film strip border */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-800 via-yellow-600 to-red-800 opacity-90"></div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-red-800 via-yellow-600 to-red-800 opacity-90"></div>
        
        {/* Enhanced film perforations */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-red-800 opacity-85">
          <div className="flex flex-col justify-around h-full py-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-2.5 h-1 bg-yellow-100 rounded-sm mx-auto shadow-sm"></div>
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-red-800 opacity-85">
          <div className="flex flex-col justify-around h-full py-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-2.5 h-1 bg-yellow-100 rounded-sm mx-auto shadow-sm"></div>
            ))}
          </div>
        </div>

        {/* Header Banner - Red vintage style */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-200 px-4 py-2 border-b-2 border-yellow-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-yellow-200 rounded-full flex items-center justify-center border border-red-800 shadow-sm">
                <Route className="h-2.5 w-2.5 text-red-800" />
              </div>
              <span className="text-sm font-bold tracking-wide uppercase">Route 66 Attraction</span>
            </div>
            <div className="text-xs font-bold bg-yellow-200 text-red-800 px-2 py-1 rounded transform -rotate-2 shadow-sm border border-red-800">
              HISTORIC
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-4 pl-9 pr-9 bg-gradient-to-br from-red-50 via-yellow-50 to-orange-100">
          {/* Title Section */}
          <div className="mb-3 text-center">
            <h3 className="font-black text-lg text-red-900 leading-tight uppercase tracking-wide border-b-2 border-red-600 pb-2 mb-2 break-words drop-shadow-md">
              {attraction.name.split(',')[0].split(' - ')[0].trim()}
            </h3>
            <div className="flex items-center justify-center gap-2 text-red-800">
              <MapPin className="h-4 w-4 text-red-800 flex-shrink-0" />
              <span className="text-sm font-bold uppercase tracking-wide">{attraction.state}</span>
              {attraction.highway_designation && (
                <span className="text-xs bg-red-800 text-yellow-100 px-2 py-1 rounded font-bold border border-yellow-400">
                  {attraction.highway_designation}
                </span>
              )}
            </div>
          </div>
          
          {/* Description */}
          {attraction.description && (
            <div className="mb-4 p-3 bg-gradient-to-br from-yellow-100 to-red-50 border border-dashed border-red-600 rounded shadow-inner">
              <p className="text-sm text-red-900 leading-relaxed font-medium text-left break-words">
                {attraction.description.length > 100 
                  ? `${attraction.description.substring(0, 100)}...` 
                  : attraction.description
                }
              </p>
            </div>
          )}
          
          {/* Bottom Banner - Red vintage style */}
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-200 px-3 py-2 -mx-4 -mb-4 text-center rounded-b-lg border-t-2 border-yellow-400">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 bg-yellow-200 rounded-full flex items-center justify-center border border-red-800">
                <span className="text-xs font-black text-red-800">66</span>
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">
                Stop #{attraction.sequence_order}
              </span>
              <div className="w-4 h-4 bg-yellow-200 rounded-full flex items-center justify-center border border-red-800">
                <span className="text-xs font-black text-red-800">66</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionHoverCard;
