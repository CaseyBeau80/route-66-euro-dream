
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Attraction } from '../types';

interface DriveInHoverCardProps {
  attraction: Attraction;
  isVisible: boolean;
  position: { x: number; y: number };
  onWebsiteClick?: (website: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const DriveInHoverCard: React.FC<DriveInHoverCardProps> = ({
  attraction,
  isVisible,
  position,
  onWebsiteClick,
  onMouseEnter,
  onMouseLeave
}) => {
  // Enhanced position calculations with better overlap prevention
  const cardPosition = useMemo(() => {
    if (!isVisible) return { left: 0, top: 0, display: 'none' };

    const cardWidth = 300;
    const cardHeight = 220;
    const padding = 40;
    const topOffset = 80; // Increased offset for better separation

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let left = position.x - cardWidth / 2;
    let top = position.y - cardHeight - topOffset;

    // Enhanced horizontal positioning with better edge handling
    if (left < padding) {
      left = padding;
    } else if (left + cardWidth > viewport.width - padding) {
      left = viewport.width - cardWidth - padding;
    }

    // Enhanced vertical positioning with smart placement
    if (top < padding + 120) { // More generous top spacing
      top = position.y + topOffset + 20; // Position below with extra margin
    }

    // Ensure bottom boundary with extra margin
    if (top + cardHeight > viewport.height - padding - 20) {
      top = viewport.height - cardHeight - padding - 20;
    }

    console.log(`🎬 Rendering enhanced drive-in hover card for ${attraction.name} at:`, {
      markerPos: position,
      cardPos: { left, top },
      dimensions: { cardWidth, cardHeight },
      viewport: { viewportWidth: viewport.width, viewportHeight: viewport.height }
    });

    return { left, top, display: 'block' };
  }, [isVisible, position, attraction.name]);

  // Check if attraction has website property
  const attractionWebsite = useMemo(() => {
    const descriptionText = attraction.description || '';
    const websiteMatch = descriptionText.match(/https?:\/\/[^\s]+/);
    return websiteMatch ? websiteMatch[0] : null;
  }, [attraction.description]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-auto"
      style={{
        left: `${cardPosition.left}px`,
        top: `${cardPosition.top}px`,
        transform: 'none',
        display: cardPosition.display,
        zIndex: 45000 // Reduced z-index for better layering
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Card className="w-75 border-4 border-amber-600 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 shadow-2xl relative overflow-hidden transition-all duration-200">
        {/* Enhanced vintage film strip border */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-800 via-yellow-600 to-amber-800 opacity-90"></div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-800 via-yellow-600 to-amber-800 opacity-90"></div>
        
        {/* Enhanced film perforations */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-amber-800 opacity-85">
          <div className="flex flex-col justify-around h-full py-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-2.5 h-1 bg-yellow-100 rounded-sm mx-auto shadow-sm"></div>
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-amber-800 opacity-85">
          <div className="flex flex-col justify-around h-full py-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-2.5 h-1 bg-yellow-100 rounded-sm mx-auto shadow-sm"></div>
            ))}
          </div>
        </div>

        <CardContent className="p-5 pl-9 pr-9">
          <div className="text-center">
            {/* Enhanced vintage neon-style header */}
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-200 px-4 py-2 rounded-lg shadow-lg mb-4 border-2 border-yellow-400">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl animate-pulse">🎬</span>
                <span className="font-bold text-sm uppercase tracking-widest drop-shadow-lg">Drive-In Theater</span>
                <span className="text-2xl animate-pulse">🍿</span>
              </div>
            </div>
            
            {/* Enhanced attraction name with better typography */}
            <h3 className="font-black text-xl text-amber-900 leading-tight uppercase tracking-wide mb-3 drop-shadow-md">
              {attraction.name.split(',')[0].split(' - ')[0].trim()}
            </h3>
            
            {/* Enhanced location badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="bg-amber-800 text-yellow-100 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg border border-yellow-400">
                📍 {attraction.state}
              </span>
            </div>
            
            {/* Enhanced description with better styling */}
            {attraction.description && (
              <div className="bg-gradient-to-br from-yellow-100 to-amber-50 border-2 border-dashed border-amber-600 rounded-lg p-4 mb-4 shadow-inner">
                <p className="text-sm text-amber-900 leading-relaxed font-medium">
                  {attraction.description.length > 90 
                    ? `${attraction.description.substring(0, 90)}...` 
                    : attraction.description
                  }
                </p>
              </div>
            )}
            
            {/* Enhanced website button */}
            {attractionWebsite && (
              <button
                className="bg-gradient-to-r from-red-600 to-red-700 text-yellow-200 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg border-2 border-yellow-400 hover:from-red-700 hover:to-red-800 hover:shadow-xl transition-all duration-300 pointer-events-auto transform hover:scale-105"
                onClick={() => onWebsiteClick?.(attractionWebsite)}
              >
                ✨ Visit Theater ✨
              </button>
            )}
            
            {/* Enhanced vintage bottom decoration */}
            <div className="mt-4 pt-3 border-t-2 border-dashed border-amber-600">
              <div className="flex items-center justify-center gap-3 text-amber-800">
                <span className="text-xl">🚗</span>
                <span className="text-xs font-bold uppercase tracking-widest drop-shadow-sm">Route 66 Classic</span>
                <span className="text-xl">🌟</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(DriveInHoverCard);
