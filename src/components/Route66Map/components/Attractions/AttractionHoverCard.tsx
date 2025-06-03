
import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, ExternalLink } from 'lucide-react';
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

    const cardWidth = 320;
    const cardHeight = 240; // Increased height to accommodate website button
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

  // Extract website from description if available
  const attractionWebsite = useMemo(() => {
    const descriptionText = attraction.description || '';
    const websiteMatch = descriptionText.match(/https?:\/\/[^\s]+/);
    return websiteMatch ? websiteMatch[0] : null;
  }, [attraction.description]);

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
      <Card className="w-80 border-3 border-blue-600 bg-gradient-to-br from-blue-50 via-white to-blue-100 shadow-2xl overflow-hidden relative">
        {/* Vintage Route 66 decorative border */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-600 via-white via-blue-600 to-red-600"></div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-red-600 via-white via-blue-600 to-red-600"></div>
        
        {/* Side decorative elements */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-600"></div>
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-blue-600"></div>

        {/* Header with vintage styling */}
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 text-white px-6 py-4 mt-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-blue-200 shadow-sm">
              <Star className="h-4 w-4 text-blue-800" fill="currentColor" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-bold tracking-wider uppercase text-blue-100">Route 66 Attraction</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-white text-blue-800 px-2 py-1 rounded-full font-bold">
                  #{attraction.sequence_order}
                </span>
                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                  Historic Stop
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 pb-3">
          {/* Enhanced title with better typography */}
          <div className="text-center mb-4">
            <h3 className="font-black text-xl text-blue-900 leading-tight mb-2 break-words">
              {attraction.name.split(',')[0].split(' - ')[0].trim()}
            </h3>
            
            {/* Location with enhanced styling */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-blue-700" />
              <span className="bg-blue-800 text-blue-100 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                {attraction.state}
              </span>
            </div>
          </div>
          
          {/* Description with improved styling */}
          {attraction.description && (
            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-dashed border-blue-300 rounded-lg p-4 mb-4 shadow-inner">
              <p className="text-sm text-blue-800 leading-relaxed font-medium text-center break-words">
                {attraction.description.length > 100 
                  ? `${attraction.description.substring(0, 100)}...` 
                  : attraction.description
                }
              </p>
            </div>
          )}

          {/* Website button - clickable with pointer events */}
          {attractionWebsite && (
            <div className="mb-4 pointer-events-auto">
              <button
                onClick={() => onWebsiteClick?.(attractionWebsite)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </button>
            </div>
          )}
          
          {/* Enhanced footer with vintage Route 66 styling */}
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white px-4 py-3 -mx-6 -mb-3 rounded-b-lg border-t-2 border-blue-600">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-red-200 shadow-sm">
                <span className="text-xs font-black text-red-700">66</span>
              </div>
              <span className="text-sm font-bold uppercase tracking-wider text-center">
                America's Main Street
              </span>
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-red-200 shadow-sm">
                <span className="text-xs font-black text-red-700">66</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return createPortal(cardContent, document.body);
};

export default AttractionHoverCard;
