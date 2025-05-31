
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Attraction } from '../types';

interface DriveInHoverCardProps {
  attraction: Attraction;
  isVisible: boolean;
  position: { x: number; y: number };
  onWebsiteClick?: (website: string) => void;
}

const DriveInHoverCard: React.FC<DriveInHoverCardProps> = ({
  attraction,
  isVisible,
  position,
  onWebsiteClick
}) => {
  // Memoize position calculations for better performance
  const cardPosition = useMemo(() => {
    if (!isVisible) return { left: 0, top: 0, display: 'none' };

    const cardWidth = 280;
    const cardHeight = 180;
    const padding = 20;

    // Smart positioning to keep card in viewport
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let left = position.x - cardWidth / 2;
    let top = position.y - cardHeight - 20;

    // Adjust horizontal position
    if (left < padding) left = padding;
    if (left + cardWidth > viewport.width - padding) {
      left = viewport.width - cardWidth - padding;
    }

    // Adjust vertical position  
    if (top < padding) {
      top = position.y + 20;
    }

    console.log(`🎬 Rendering nostalgic drive-in hover card for ${attraction.name} at:`, {
      markerPos: position,
      cardPos: { left, top },
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
      className="fixed z-[60000] pointer-events-none"
      style={{
        left: `${cardPosition.left}px`,
        top: `${cardPosition.top}px`,
        transform: 'none',
        display: cardPosition.display
      }}
    >
      <Card className="w-70 border-4 border-amber-600 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 shadow-2xl relative overflow-hidden">
        {/* Vintage film strip border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-800 via-yellow-600 to-amber-800"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-800 via-yellow-600 to-amber-800"></div>
        
        {/* Film perforations */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-amber-800 opacity-80">
          <div className="flex flex-col justify-around h-full py-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-2 h-1 bg-yellow-100 rounded-sm mx-auto"></div>
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-amber-800 opacity-80">
          <div className="flex flex-col justify-around h-full py-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-2 h-1 bg-yellow-100 rounded-sm mx-auto"></div>
            ))}
          </div>
        </div>

        <CardContent className="p-4 pl-8 pr-8">
          <div className="text-center">
            {/* Vintage neon-style header */}
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-200 px-3 py-1 rounded-lg shadow-lg mb-3 border-2 border-yellow-400">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl animate-pulse">🎬</span>
                <span className="font-bold text-sm uppercase tracking-widest">Drive-In Theater</span>
                <span className="text-2xl animate-pulse">🍿</span>
              </div>
            </div>
            
            {/* Attraction name with vintage styling */}
            <h3 className="font-black text-lg text-amber-900 leading-tight uppercase tracking-wide mb-2 text-shadow-lg">
              {attraction.name.split(',')[0].split(' - ')[0].trim()}
            </h3>
            
            {/* Location with retro badge */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="bg-amber-800 text-yellow-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                📍 {attraction.state}
              </span>
            </div>
            
            {/* Description with vintage styling */}
            {attraction.description && (
              <div className="bg-gradient-to-br from-yellow-100 to-amber-50 border-2 border-dashed border-amber-600 rounded-lg p-3 mb-3 shadow-inner">
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  {attraction.description.length > 80 
                    ? `${attraction.description.substring(0, 80)}...` 
                    : attraction.description
                  }
                </p>
              </div>
            )}
            
            {/* Website button with vintage neon styling */}
            {attractionWebsite && (
              <button
                className="bg-gradient-to-r from-red-600 to-red-700 text-yellow-200 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide shadow-lg border-2 border-yellow-400 hover:from-red-700 hover:to-red-800 hover:shadow-xl transition-all duration-200 pointer-events-auto animate-pulse"
                onClick={() => onWebsiteClick?.(attractionWebsite)}
              >
                ✨ Visit Theater ✨
              </button>
            )}
            
            {/* Vintage bottom decoration */}
            <div className="mt-3 pt-2 border-t-2 border-dashed border-amber-600">
              <div className="flex items-center justify-center gap-2 text-amber-800">
                <span className="text-lg">🚗</span>
                <span className="text-xs font-bold uppercase tracking-widest">Route 66 Classic</span>
                <span className="text-lg">🌟</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(DriveInHoverCard);
