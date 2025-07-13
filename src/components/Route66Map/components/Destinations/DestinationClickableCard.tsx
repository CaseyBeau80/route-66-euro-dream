import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Building2, ExternalLink, X, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Route66Waypoint } from '../../types/supabaseTypes';
import { generateCityUrl, extractCityName } from '@/utils/cityUrlUtils';
import { useMobileCardDismissal } from '@/hooks/useMobileCardDismissal';
import TileContainer from './tiles/TileContainer';
import FunFactsTile from './tiles/FunFactsTile';
import EventsCalendarTile from './tiles/EventsCalendarTile';
import WeatherTile from './tiles/WeatherTile';

// Population data for Route 66 cities
const cityPopulations: Record<string, string> = {
  'Chicago': '2,746,388',
  'Joliet': '150,362',
  'Pontiac': '11,150',
  'Springfield, IL': '114,394',
  'St. Louis': '300,576',
  'Springfield, MO': '169,176',
  'Joplin': '51,762',
  'Tulsa': '413,066',
  'Oklahoma City': '695,724',
  'Elk City': '11,544',
  'Amarillo': '200,393',
  'Tucumcari': '4,976',
  'Albuquerque': '564,559',
  'Gallup': '22,580',
  'Holbrook': '5,053',
  'Flagstaff': '76,831',
  'Seligman': '456',
  'Kingman': '32,689',
  'Needles': '4,931',
  'Barstow': '25,415',
  'San Bernardino': '222,101',
  'Pasadena': '138,699',
  'Los Angeles': '3,898,747',
  'Santa Monica': '93,076'
};

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
  const cardId = `destination-${destination.id}`;
  
  useMobileCardDismissal({
    isVisible,
    onClose,
    cardId
  });

  const cardPosition = useMemo(() => {
    if (!isVisible) return { left: 0, top: 0, display: 'none' };

    const cardWidth = 320;
    const cardHeight = 500; // Increased height for rich content
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
      data-card-id={cardId}
    >
      <Card 
        className="w-80 border-2 border-blue-600 bg-white shadow-2xl"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Close button with minimum tap target */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log(`🚫 Close button clicked for destination: ${destination.name}`);
            onClose();
          }}
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
        
        <CardContent className="p-4 overflow-y-auto max-h-[calc(90vh-2rem)]">
          <div className="space-y-3">
            {/* City, State and Population Header */}
            <div className="text-center py-3 px-4">
              <h4 className="text-2xl font-black text-black mb-1 uppercase tracking-wide">
                {extractCityName(destination.name)}, {destination.state}
              </h4>
              <p className="text-black font-bold text-lg uppercase tracking-wider">
                Population: {cityPopulations[extractCityName(destination.name)] || 'Unknown'}
              </p>
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

            {/* Tiles Container */}
            <TileContainer>
              <FunFactsTile destination={destination} />
              <EventsCalendarTile destination={destination} />
              <WeatherTile destination={destination} />
            </TileContainer>

            {/* Navigation button with minimum tap target */}
            <button
              onClick={handleNavigateToCity}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 touch-manipulation"
              style={{ minHeight: '44px' }}
            >
              <Navigation className="h-4 w-4" />
              Explore {extractCityName(destination.name)}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return createPortal(cardContent, document.body);
};

export default DestinationClickableCard;