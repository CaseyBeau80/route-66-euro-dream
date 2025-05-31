
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

    const cardWidth = 240;
    const cardHeight = 160;
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

    console.log(`🎬 Rendering drive-in hover card for ${attraction.name} at:`, {
      markerPos: position,
      cardPos: { left, top },
      viewport: { viewportWidth: viewport.width, viewportHeight: viewport.height }
    });

    return { left, top, display: 'block' };
  }, [isVisible, position, attraction.name]);

  // Check if attraction has website property (accessing it safely from the base Route66Waypoint type)
  const attractionWebsite = useMemo(() => {
    // Since Attraction extends Route66Waypoint, we need to check if description contains a website
    // or if there's any website-like property we can extract
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
      <Card className="w-60 border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-100 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="text-3xl">🎬</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-amber-900 text-sm leading-tight mb-1">
                {attraction.name}
              </h3>
              <p className="text-xs text-amber-700 mb-2">
                Drive-In Theater • {attraction.state}
              </p>
              {attraction.description && (
                <p className="text-xs text-amber-800 mb-2 line-clamp-2">
                  {attraction.description}
                </p>
              )}
              {attractionWebsite && (
                <button
                  className="text-xs text-amber-900 hover:text-yellow-600 font-medium underline pointer-events-auto"
                  onClick={() => onWebsiteClick?.(attractionWebsite)}
                >
                  Visit Website
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(DriveInHoverCard);
