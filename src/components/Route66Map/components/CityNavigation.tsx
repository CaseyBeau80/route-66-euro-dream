
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { generateCityUrl, extractCityName } from '@/utils/cityUrlUtils';

const CityNavigation: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { waypoints, isLoading } = useSupabaseRoute66();
  const navigate = useNavigate();

  // Filter for major stops only
  const majorCities = waypoints.filter(waypoint => waypoint.is_major_stop);

  const handleCityClick = (waypoint: any) => {
    const cityUrl = generateCityUrl(waypoint);
    navigate(cityUrl);
  };

  if (isLoading) return null;

  return (
    <Card className="absolute top-4 right-4 z-10 w-80 bg-white shadow-lg border border-amber-300">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-amber-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between text-amber-800">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            <span>Route 66 Cities</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {majorCities.map((city) => {
              const cityName = extractCityName(city.name);
              return (
                <Button
                  key={city.id}
                  variant="ghost"
                  className="w-full justify-start hover:bg-amber-100 text-left p-3"
                  onClick={() => handleCityClick(city)}
                >
                  <div>
                    <div className="font-semibold text-amber-800">{cityName}</div>
                    <div className="text-sm text-amber-600">{city.state}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CityNavigation;
