
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { Route66Waypoint } from '../../types/supabaseTypes';
import { generateCityUrl, extractCityName } from '@/utils/cityUrlUtils';

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
    <Card className="w-64 shadow-lg border-2 border-amber-700 bg-gradient-to-b from-amber-50 to-amber-100">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with vintage Route 66 styling */}
          <div className="text-center border-b-2 border-amber-600 pb-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-8 h-6 bg-amber-700 text-amber-100 rounded text-xs font-bold flex items-center justify-center">
                66
              </div>
              <h3 className="text-lg font-bold text-amber-900">Destination</h3>
            </div>
          </div>

          {/* City and State */}
          <div className="text-center">
            <h4 className="text-xl font-bold text-amber-900 mb-1">{cityName}</h4>
            <p className="text-amber-700 font-semibold">{stateName}</p>
          </div>

          {/* Description if available */}
          {destination.description && (
            <div className="text-sm text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
              <p>{destination.description}</p>
            </div>
          )}

          {/* Highway designation if available */}
          {destination.highway_designation && (
            <div className="text-center">
              <span className="inline-block bg-amber-700 text-amber-100 px-2 py-1 rounded text-xs font-semibold">
                {destination.highway_designation}
              </span>
            </div>
          )}

          {/* Visit City Page Button */}
          {destination.is_major_stop && (
            <div className="text-center pt-2">
              <Button 
                onClick={handleVisitCityPage}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-full font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                <ExternalLink className="w-4 h-4" />
                Visit City Page
              </Button>
            </div>
          )}

          {/* Coordinates */}
          <div className="text-xs text-amber-600 text-center border-t border-amber-300 pt-2">
            <p>{destination.latitude.toFixed(4)}°N, {Math.abs(destination.longitude).toFixed(4)}°W</p>
          </div>

          {/* Vintage Route 66 footer */}
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 px-3 py-1 rounded-full text-xs font-bold shadow-md">
              Historic Route 66 Stop
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DestinationHoverCard;
