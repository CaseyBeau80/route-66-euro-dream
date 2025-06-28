
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

const DestinationHoverCard: React.FC<DestinationHoverCardProps> = ({ destination }) => {
  const navigate = useNavigate();
  const cityName = extractCityName(destination.name);
  const stateName = destination.state;
  
  // Create a lookup key that includes state for Springfield cities
  const populationKey = cityName === 'Springfield' ? `${cityName}, ${stateName}` : cityName;
  const population = cityPopulations[populationKey] || 'Population data unavailable';

  const handleVisitCityPage = () => {
    const cityUrl = generateCityUrl(destination);
    navigate(cityUrl);
  };

  return (
    <Card className="w-80 max-w-sm shadow-xl border-4 border-black bg-amber-50 max-h-[85vh] overflow-hidden">
      <CardContent className="p-4 overflow-y-auto max-h-[calc(85vh-2rem)]">
        <div className="space-y-3">
          {/* City, State and Population Header */}
          <div className="text-center py-3 px-4">
            <h4 className="text-2xl font-black text-black mb-1 uppercase tracking-wide">
              {cityName}, {stateName}
            </h4>
            <p className="text-black font-bold text-lg uppercase tracking-wider">
              Population: {population}
            </p>
          </div>

          {/* Interactive Tiles */}
          <TileContainer>
            <FunFactsTile destination={destination} />
            <EventsCalendarTile destination={destination} />
            <WeatherTile destination={destination} />
          </TileContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DestinationHoverCard;
