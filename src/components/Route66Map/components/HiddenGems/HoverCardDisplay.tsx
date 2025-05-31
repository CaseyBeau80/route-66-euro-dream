
import React, { useEffect, useState } from 'react';
import { Star, MapPin, ExternalLink } from 'lucide-react';
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
  const [showFallback, setShowFallback] = useState(false);

  // Fallback immediate display after 2 seconds if normal display fails
  useEffect(() => {
    if (!isVisible) {
      const fallbackTimer = setTimeout(() => {
        setShowFallback(true);
        console.log(`⚡ Fallback display activated for ${gem.title}`);
      }, 2000);

      return () => {
        clearTimeout(fallbackTimer);
        setShowFallback(false);
      };
    } else {
      setShowFallback(false);
    }
  }, [isVisible, gem.title]);

  // Show either normal visibility or fallback
  const shouldShow = isVisible || showFallback;

  if (!shouldShow) return null;

  // Calculate positioning to ensure card stays on screen
  const cardWidth = 350;
  const cardHeight = 280;
  
  // Calculate position ensuring the card stays within viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Center the card horizontally on the marker, but adjust if it goes off-screen
  let left = position.x - cardWidth / 2;
  if (left < 10) left = 10;
  if (left + cardWidth > viewportWidth - 10) left = viewportWidth - cardWidth - 10;
  
  // Position above the marker with some offset
  let top = position.y - cardHeight - 30;
  if (top < 10) top = position.y + 30; // If it goes above viewport, show below

  console.log(`🎨 Rendering ${showFallback ? 'FALLBACK' : 'NORMAL'} hover card for ${gem.title} at:`, { 
    markerPos: position, 
    cardPos: { left, top },
    viewport: { viewportWidth, viewportHeight },
    isVisible,
    showFallback
  });

  const cardStyle = {
    position: 'fixed' as const,
    left: `${left}px`,
    top: `${top}px`,
    zIndex: 999999,
    pointerEvents: 'auto' as const, // Hover persistence
  };

  return (
    <div 
      className={`transition-all duration-200 ease-out ${showFallback ? 'animate-pulse' : ''}`}
      style={cardStyle}
    >
      <div className={`w-[350px] max-w-[90vw] bg-white border-2 ${showFallback ? 'border-orange-500' : 'border-black'} rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
        {/* Header Banner */}
        <div className={`bg-gradient-to-r ${showFallback ? 'from-orange-100 to-orange-200' : 'from-[#F5F2EA] to-[#EFEDE7]'} text-black px-4 py-2 border-b-2 ${showFallback ? 'border-orange-500' : 'border-black'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 ${showFallback ? 'bg-orange-500' : 'bg-black'} rounded-full flex items-center justify-center border ${showFallback ? 'border-orange-500' : 'border-black'} shadow-sm`}>
                <Star className="h-2.5 w-2.5 text-white" fill="currentColor" />
              </div>
              <span className="text-sm font-bold tracking-wide uppercase text-black">
                {showFallback ? 'Hidden Gem (Fallback)' : 'Hidden Gem'}
              </span>
            </div>
            <div className={`text-xs font-bold ${showFallback ? 'bg-orange-500 text-white' : 'bg-black text-white'} px-2 py-1 rounded transform -rotate-2 shadow-sm`}>
              ROUTE 66
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className={`p-4 bg-gradient-to-br ${showFallback ? 'from-orange-50 to-yellow-50' : 'from-[#F8F6F0] to-[#E6E4DE]'}`}>
          {/* Title Section */}
          <div className="mb-3 text-center">
            <h3 className={`font-black text-lg text-black leading-tight uppercase tracking-wide border-b-2 ${showFallback ? 'border-orange-500' : 'border-black'} pb-2 mb-2 break-words`}>
              {gem.title}
            </h3>
            <div className="flex items-center justify-center gap-2 text-black">
              <MapPin className="h-4 w-4 text-black flex-shrink-0" />
              <span className="text-sm font-bold uppercase tracking-wide">{gem.city_name}</span>
            </div>
          </div>
          
          {/* Description */}
          {gem.description && (
            <div className={`mb-4 p-3 bg-white border border-dashed ${showFallback ? 'border-orange-500' : 'border-black'} rounded shadow-inner`}>
              <p className="text-sm text-black leading-relaxed font-medium text-left break-words">
                {gem.description.length > 120 
                  ? `${gem.description.substring(0, 120)}...` 
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
                  console.log(`🌐 Opening website for ${gem.title}: ${gem.website}`);
                  onWebsiteClick(gem.website!);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 ${showFallback ? 'bg-orange-500 hover:bg-orange-600' : 'bg-black hover:bg-gray-800'} text-white font-bold text-sm rounded-full border ${showFallback ? 'border-orange-500' : 'border-black'} transition-all duration-200 shadow transform hover:scale-105 uppercase tracking-wide`}
              >
                <ExternalLink className="h-3 w-3" />
                Visit Website
              </button>
            </div>
          )}
          
          {/* Bottom Banner */}
          <div className={`bg-gradient-to-r ${showFallback ? 'from-orange-100 to-orange-200' : 'from-[#F5F2EA] to-[#EFEDE7]'} text-black px-3 py-2 -mx-4 -mb-4 text-center rounded-b-lg border-t-2 ${showFallback ? 'border-orange-500' : 'border-black'}`}>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-4 h-4 ${showFallback ? 'bg-orange-500' : 'bg-black'} rounded-full flex items-center justify-center border ${showFallback ? 'border-orange-500' : 'border-black'}`}>
                <span className="text-xs font-black text-white">66</span>
              </div>
              <span className="text-sm font-bold uppercase tracking-wider text-black">
                America's Main Street
              </span>
              <div className={`w-4 h-4 ${showFallback ? 'bg-orange-500' : 'bg-black'} rounded-full flex items-center justify-center border ${showFallback ? 'border-orange-500' : 'border-black'}`}>
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
