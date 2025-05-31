
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, ChevronDown, ChevronUp } from 'lucide-react';
import WeatherWidget from '../../WeatherWidget';
import type { Route66Waypoint } from '../../../types/supabaseTypes';

interface WeatherTileProps {
  destination: Route66Waypoint;
}

const WeatherTile: React.FC<WeatherTileProps> = ({ destination }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cityName = destination.name.split(',')[0].split(' - ')[0].trim();

  return (
    <Card className="bg-gradient-to-br from-sky-50 to-blue-100 border-2 border-sky-300 hover:shadow-lg transition-all duration-200">
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-sm font-bold text-sky-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Weather
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <WeatherWidget 
            lat={destination.latitude}
            lng={destination.longitude}
            cityName={cityName}
            compact={false}
            collapsible={false}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default WeatherTile;
