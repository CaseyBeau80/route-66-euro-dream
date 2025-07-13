import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Building2, ExternalLink, X, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Route66Waypoint } from '../../types/supabaseTypes';
import { generateCityUrl, extractCityName } from '@/utils/cityUrlUtils';

interface DestinationClickableCardProps {
  destination: Route66Waypoint;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const DestinationClickableCard: React.FC<DestinationClickableCardProps> = ({
  destination,
  isVisible,
  position,
  onClose,
  onMouseEnter,
  onMouseLeave
}) => {
  const navigate = useNavigate();

  const cardPosition = useMemo(() => {
    if (!isVisible) return { left: 0, top: 0, display: 'none' };

    const cardWidth = 320;
    const cardHeight = 280;
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

  const handleNavigateToCity = () => {
    const cityUrl = generateCityUrl(destination);
    console.log(`🧭 Navigating to destination city: ${cityUrl}`);
    onClose();
    navigate(cityUrl);
  };

  if (!isVisible) return null;

  const cardContent = (
    <div
      className="fixed pointer-events-auto z-[60000]"
      style={{
        left: `${cardPosition.left}px`,
        top: `${cardPosition.top}px`,
        zIndex: 60000
      }}
    >
      <Card 
        className="w-80 border-2 border-blue-600 bg-white shadow-2xl"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Close button with minimum tap target */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors z-10 text-xs font-bold touch-manipulation"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="bg-blue-600 text-white px-4 py-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-bold">Route 66 Destination</span>
            <span className="text-xs bg-white text-blue-600 px-2 py-1 rounded font-bold ml-auto">
              #{destination.sequence_order}
            </span>
          </div>
        </div>
        
        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-bold text-xl text-blue-900 mb-3">
            {extractCityName(destination.name)}
          </h3>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-blue-700 mb-4">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{destination.state}</span>
            {destination.highway_designation && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">
                {destination.highway_designation}
              </span>
            )}
          </div>
          
          {/* Description */}
          {destination.description && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800 leading-relaxed">
                {destination.description}
              </p>
            </div>
          )}

          {/* Coordinates */}
          <div className="text-xs text-gray-600 mb-4">
            <strong>Location:</strong> {destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)}
          </div>

          {/* Navigation button with minimum tap target */}
          <button
            onClick={handleNavigateToCity}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 touch-manipulation"
            style={{ minHeight: '44px' }}
          >
            <Navigation className="h-4 w-4" />
            Explore {extractCityName(destination.name)}
          </button>
        </CardContent>
      </Card>
    </div>
  );

  return createPortal(cardContent, document.body);
};

export default DestinationClickableCard;