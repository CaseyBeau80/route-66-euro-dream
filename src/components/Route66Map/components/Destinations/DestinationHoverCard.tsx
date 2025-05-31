
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { Route66Waypoint } from '../../types/supabaseTypes';
import { generateCityUrl, extractCityName } from '@/utils/cityUrlUtils';
import TileContainer from './tiles/TileContainer';
import FunFactsTile from './tiles/FunFactsTile';
import EventsCalendarTile from './tiles/EventsCalendarTile';
import WeatherTile from './tiles/WeatherTile';

interface DestinationHoverCardProps {
  destination: Route66Waypoint;
}

const DestinationHoverCard: React.FC<DestinationHoverCardProps> = ({ destination }) => {
  const navigate = useNavigate();
  const cityName = extractCityName(destination.name);
  const stateName = destination.state;

  const handleVisitCityPage = () => {
    const cityUrl = generateCityUrl(destination);
    navigate(cityUrl);
  };

  return (
    <Card className="w-80 max-w-sm shadow-xl border-3 border-orange-800 bg-gradient-to-b from-orange-50 via-orange-100 to-orange-200 max-h-[85vh] overflow-hidden">
      <CardContent className="p-4 overflow-y-auto max-h-[calc(85vh-2rem)]">
        <div className="space-y-3">
          {/* Clean City and State Header */}
          <div className="text-center bg-gradient-to-r from-orange-200 to-orange-300 py-3 px-4 rounded-lg border-2 border-orange-600 shadow-inner">
            <h4 className="text-2xl font-black text-orange-900 mb-1 uppercase tracking-wide">{cityName}</h4>
            <p className="text-orange-800 font-bold text-lg uppercase tracking-wider">{stateName}</p>
          </div>

          {/* Description if available */}
          {destination.description && (
            <div className="text-sm text-orange-900 bg-orange-100 p-3 rounded-lg border-2 border-orange-400 shadow-inner">
              <p className="font-medium leading-relaxed">{destination.description}</p>
            </div>
          )}

          {/* Interactive Tiles */}
          <TileContainer>
            <FunFactsTile destination={destination} />
            <EventsCalendarTile destination={destination} />
            <WeatherTile destination={destination} />
          </TileContainer>

          {/* Visit City Page Button */}
          {destination.is_major_stop && (
            <div className="text-center pt-2">
              <Button 
                onClick={handleVisitCityPage}
                className="bg-red-700 hover:bg-red-800 text-white text-sm px-6 py-3 rounded-full font-black transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg border-2 border-red-900 uppercase tracking-wide transform hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" />
                Visit City Page
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DestinationHoverCard;
