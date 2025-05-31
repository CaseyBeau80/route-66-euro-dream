
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, ChevronDown, ChevronUp } from 'lucide-react';
import WeatherWidget from '../../WeatherWidget';
import SimpleWeatherApiKeyInput from '../../weather/SimpleWeatherApiKeyInput';
import { WeatherService } from '../../../services/WeatherService';
import type { Route66Waypoint } from '../../../types/supabaseTypes';

interface WeatherTileProps {
  destination: Route66Waypoint;
}

const WeatherTile: React.FC<WeatherTileProps> = ({ destination }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [apiKeyRefreshTrigger, setApiKeyRefreshTrigger] = useState(0);

  const cityName = destination.name.split(',')[0].split(' - ')[0].trim();
  const weatherService = WeatherService.getInstance();
  const hasApiKey = weatherService.hasApiKey();

  console.log(`🌤️ WeatherTile: Rendering for ${cityName}, hasApiKey: ${hasApiKey}`);

  const handleApiKeySet = () => {
    console.log('🔑 WeatherTile: API key set, triggering refresh');
    setApiKeyRefreshTrigger(prev => prev + 1);
  };

  return (
    <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-500 hover:shadow-lg transition-all duration-200 hover:border-orange-600">
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-sm font-bold text-orange-900 flex items-center justify-between">
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
        <CardContent className="p-0 m-0">
          {hasApiKey ? (
            <WeatherWidget 
              key={apiKeyRefreshTrigger}
              lat={destination.latitude}
              lng={destination.longitude}
              cityName={cityName}
              compact={false}
              collapsible={false}
            />
          ) : (
            <div className="p-4">
              <SimpleWeatherApiKeyInput 
                onApiKeySet={handleApiKeySet}
                cityName={cityName}
              />
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default WeatherTile;
