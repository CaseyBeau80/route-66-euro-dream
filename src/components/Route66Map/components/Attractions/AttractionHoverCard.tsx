
import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Route } from 'lucide-react';
import { AttractionHoverProps } from './types';

const AttractionHoverCard: React.FC<AttractionHoverProps> = ({
  attraction,
  isVisible,
  position,
  onWebsiteClick
}) => {
  // Enhanced position calculations similar to HoverCardPortal
  const cardPosition = useMemo(() => {
    if (!isVisible) return { left: 0, top: 0, display: 'none' };

    const cardWidth = 280;
    const cardHeight = 160;
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
    if (top < padding) {
      top = position.y + topOffset + 20;
    }

    if (top + cardHeight > viewport.height - padding) {
      top = viewport.height - cardHeight - padding;
    }

    console.log(`🎨 Attraction hover card positioned:`, {
      attractionName: attraction.name,
      markerPos: position,
      cardPos: { left, top }
    });

    return { left, top, display: 'block' };
  }, [isVisible, position, attraction.name]);

  if (!isVisible) return null;

  const cardContent = (
    <div
      className="fixed pointer-events-none"
      style={{
        left: `${cardPosition.left}px`,
        top: `${cardPosition.top}px`,
        zIndex: 40000
      }}
    >
      <Card className="w-70 border-2 border-red-600 bg-white shadow-2xl transition-all duration-200">
        {/* Header */}
        <div className="bg-red-600 text-white px-4 py-2">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            <span className="text-sm font-bold">Route 66 Stop</span>
            <span className="text-xs bg-white text-red-600 px-2 py-1 rounded font-bold ml-auto">
              #{attraction.sequence_order}
            </span>
          </div>
        </div>
        
        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-bold text-lg text-red-900 mb-2">
            {attraction.name.split(',')[0].split(' - ')[0].trim()}
          </h3>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-red-700 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{attraction.state}</span>
          </div>
          
          {/* Description */}
          {attraction.description && (
            <p className="text-sm text-red-800 leading-relaxed">
              {attraction.description.length > 120 
                ? `${attraction.description.substring(0, 120)}...` 
                : attraction.description
              }
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return createPortal(cardContent, document.body);
};

export default AttractionHoverCard;
