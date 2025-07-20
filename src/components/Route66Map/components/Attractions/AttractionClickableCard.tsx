
import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Route, ExternalLink, X } from 'lucide-react';
import type { Route66Waypoint } from '../../types/supabaseTypes';
import { useMobileCardDismissal } from '@/hooks/useMobileCardDismissal';
import { openMobileAwareLink, createMobileAwareReturnUrl } from '@/utils/mobileAwareLinkUtils';

interface AttractionClickableCardProps {
  attraction: Route66Waypoint;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onWebsiteClick?: (website: string) => void;
}

const AttractionClickableCard: React.FC<AttractionClickableCardProps> = ({
  attraction,
  isVisible,
  position,
  onClose,
  onWebsiteClick
}) => {
  const cardId = `attraction-${attraction.id}`;
  
  useMobileCardDismissal({
    isVisible,
    onClose,
    cardId
  });

  const cardPosition = useMemo(() => {
    if (!isVisible) return { left: 0, top: 0, display: 'none' };

    const cardWidth = 320;
    const cardHeight = 240;
    const padding = 20;
    const topOffset = 80;

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

    return { left, top, display: 'block' };
  }, [isVisible, position]);

  // Use direct website field from attraction data
  const attractionWebsite = attraction.website || null;

  if (!isVisible) return null;

  const cardContent = (
    <div
      className="fixed pointer-events-auto z-50"
      style={{
        left: `${cardPosition.left}px`,
        top: `${cardPosition.top}px`,
        zIndex: 50000
      }}
      data-card-id={cardId}
    >
      <Card className="w-80 border-2 border-red-600 bg-white shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-10 text-xs font-bold"
        >
          <X className="h-3 w-3" />
        </button>

        {/* Header */}
        <div className="bg-red-600 text-white px-4 py-3">
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            <span className="text-sm font-bold">Route 66 Attraction</span>
            <span className="text-xs bg-white text-red-600 px-2 py-1 rounded font-bold ml-auto">
              #{attraction.sequence_order}
            </span>
          </div>
        </div>
        
        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-bold text-xl text-red-900 mb-3">
            {attraction.name.split(',')[0].split(' - ')[0].trim()}
          </h3>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-red-700 mb-4">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{attraction.state}</span>
            {attraction.highway_designation && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">
                {attraction.highway_designation}
              </span>
            )}
          </div>
          
          {/* Description */}
          {attraction.description && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-800 leading-relaxed">
                {attraction.description}
              </p>
            </div>
          )}

          {/* Coordinates */}
          <div className="text-xs text-gray-600 mb-4">
            <strong>Location:</strong> {attraction.latitude.toFixed(4)}, {attraction.longitude.toFixed(4)}
          </div>

          {/* Website button */}
          {attractionWebsite && (
            <button
              onClick={() => openMobileAwareLink(attractionWebsite, attraction.name, {
                returnUrl: createMobileAwareReturnUrl(),
                linkSource: 'attraction-clickable-card',
                showReturnButton: true,
                showLoadingState: true
              })}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Website
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return createPortal(cardContent, document.body);
};

export default AttractionClickableCard;
