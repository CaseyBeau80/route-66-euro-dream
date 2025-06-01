
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Attraction } from './types';

interface AttractionHoverCardProps {
  attraction: Attraction;
  isVisible: boolean;
  position: { x: number; y: number };
  onWebsiteClick?: (website: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const AttractionHoverCard: React.FC<AttractionHoverCardProps> = ({
  attraction,
  isVisible,
  position,
  onWebsiteClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const cardPosition = useMemo(() => {
    if (!isVisible) return { left: 0, top: 0, display: 'none' };

    const cardWidth = 280;
    const cardHeight = 200;
    const padding = 20;
    const topOffset = 60;

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let left = position.x - cardWidth / 2;
    let top = position.y - cardHeight - topOffset;

    // Horizontal positioning
    if (left < padding) {
      left = padding;
    } else if (left + cardWidth > viewport.width - padding) {
      left = viewport.width - cardWidth - padding;
    }

    // Vertical positioning
    if (top < padding + 60) {
      top = position.y + topOffset + 10;
    }

    if (top + cardHeight > viewport.height - padding) {
      top = viewport.height - cardHeight - padding;
    }

    return { left, top, display: 'block' };
  }, [isVisible, position]);

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
        zIndex: 45000
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Card className="w-70 border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-xl">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="bg-blue-600 text-white px-3 py-1 rounded mb-3">
              <span className="font-bold text-sm">Route 66 Attraction</span>
            </div>
            
            <h3 className="font-bold text-lg text-blue-900 mb-2">
              {attraction.name.split(',')[0].split(' - ')[0].trim()}
            </h3>
            
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                📍 {attraction.state}
              </span>
            </div>
            
            {attraction.description && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                <p className="text-sm text-blue-800 leading-relaxed">
                  {attraction.description.length > 80 
                    ? `${attraction.description.substring(0, 80)}...` 
                    : attraction.description
                  }
                </p>
              </div>
            )}
            
            {attractionWebsite && (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 transition-colors pointer-events-auto"
                onClick={() => onWebsiteClick?.(attractionWebsite)}
              >
                Visit Website
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(AttractionHoverCard);
