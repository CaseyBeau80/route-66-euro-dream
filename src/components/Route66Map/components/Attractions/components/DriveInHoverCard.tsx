
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
  // Stabilized position calculations to prevent flickering
  const cardPosition = useMemo(() => {
    if (!isVisible) return { left: 0, top: 0, display: 'none' };

    const cardWidth = 280; // Slightly smaller for better positioning
    const cardHeight = 200; // Adjusted height
    const padding = 50;
    const topOffset = 100; // Increased offset for better separation

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Use a more stable positioning algorithm
    let left = Math.max(padding, Math.min(position.x - cardWidth / 2, viewport.width - cardWidth - padding));
    let top = position.y - cardHeight - topOffset;

    // If card would be off-screen at top, position it below the marker
    if (top < padding + 100) {
      top = position.y + topOffset;
    }

    // Final boundary check
    top = Math.max(padding, Math.min(top, viewport.height - cardHeight - padding));

    console.log(`🎬 Stable drive-in card positioning for ${attraction.name}:`, {
      markerPos: position,
      cardPos: { left, top },
      cardSize: { cardWidth, cardHeight }
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
      className="fixed pointer-events-none z-[40000]"
      style={{
        left: `${cardPosition.left}px`,
        top: `${cardPosition.top}px`,
        transform: 'none',
        display: cardPosition.display
      }}
    >
      <Card className="w-70 border-3 border-amber-600 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 shadow-xl relative overflow-hidden transition-all duration-300 ease-out">
        {/* Enhanced vintage film strip border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-800 via-yellow-600 to-amber-800"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-800 via-yellow-600 to-amber-800"></div>
        
        {/* Film perforations */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-amber-800">
          <div className="flex flex-col justify-around h-full py-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-2 h-1 bg-yellow-100 rounded-sm mx-auto"></div>
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-amber-800">
          <div className="flex flex-col justify-around h-full py-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-2 h-1 bg-yellow-100 rounded-sm mx-auto"></div>
            ))}
          </div>
        </div>

        <CardContent className="p-4 pl-7 pr-7">
          <div className="text-center">
            {/* Vintage neon-style header */}
            <div className="bg-gradient-to-r from-red-700 to-red-600 text-yellow-200 px-3 py-1.5 rounded-lg shadow-md mb-3 border border-yellow-400">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🎬</span>
                <span className="font-bold text-xs uppercase tracking-wide">Drive-In Theater</span>
                <span className="text-lg">🍿</span>
              </div>
            </div>
            
            {/* Attraction name */}
            <h3 className="font-black text-lg text-amber-900 leading-tight uppercase tracking-wide mb-2">
              {attraction.name.split(',')[0].split(' - ')[0].trim()}
            </h3>
            
            {/* Location badge */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="bg-amber-800 text-yellow-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md border border-yellow-400">
                📍 {attraction.state}
              </span>
            </div>
            
            {/* Description */}
            {attraction.description && (
              <div className="bg-gradient-to-br from-yellow-100 to-amber-50 border border-dashed border-amber-600 rounded-lg p-3 mb-3">
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  {attraction.description.length > 80 
                    ? `${attraction.description.substring(0, 80)}...` 
                    : attraction.description
                  }
                </p>
              </div>
            )}
            
            {/* Website button */}
            {attractionWebsite && (
              <button
                className="bg-gradient-to-r from-red-600 to-red-700 text-yellow-200 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide shadow-md border border-yellow-400 hover:from-red-700 hover:to-red-800 transition-all duration-200 pointer-events-auto transform hover:scale-105"
                onClick={() => onWebsiteClick?.(attractionWebsite)}
              >
                ✨ Visit Theater ✨
              </button>
            )}
            
            {/* Bottom decoration */}
            <div className="mt-3 pt-2 border-t border-dashed border-amber-600">
              <div className="flex items-center justify-center gap-2 text-amber-800">
                <span className="text-sm">🚗</span>
                <span className="text-xs font-bold uppercase tracking-wide">Route 66 Classic</span>
                <span className="text-sm">🌟</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(DriveInHoverCard);
