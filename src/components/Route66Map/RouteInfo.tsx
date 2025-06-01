
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Route, Clock, Eye } from 'lucide-react';
import { route66Towns } from '@/types/route66';
import { supabase } from '@/integrations/supabase/client';
import HiddenGemsLegend from './components/HiddenGemsLegend';

interface RouteInfoProps {
  selectedState: string | null;
}

const RouteInfo: React.FC<RouteInfoProps> = ({ selectedState }) => {
  const [hiddenGemsCount, setHiddenGemsCount] = useState(0);

  useEffect(() => {
    fetchHiddenGemsCount();
  }, []);

  const fetchHiddenGemsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('hidden_gems')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching hidden gems count:', error);
        return;
      }

      console.log(`✨ Found ${count} hidden gems in database`);
      setHiddenGemsCount(count || 0);
    } catch (error) {
      console.error('Error in fetchHiddenGemsCount:', error);
    }
  };

  const stateToFullName: { [key: string]: string } = {
    'CA': 'California',
    'AZ': 'Arizona', 
    'NM': 'New Mexico',
    'TX': 'Texas',
    'OK': 'Oklahoma',
    'MO': 'Missouri',
    'IL': 'Illinois'
  };

  const routeStats = {
    totalMiles: 2448,
    states: 8,
    historicTowns: route66Towns.length,
  };

  const selectedStateFullName = selectedState ? stateToFullName[selectedState] : null;

  const townsInSelectedState = selectedStateFullName
    ? route66Towns.filter(town => town.name.includes(selectedStateFullName))
    : [];

  const selectedStateTownsDescription = selectedStateFullName
    ? `${townsInSelectedState.length} historic stops in ${selectedStateFullName}: ${townsInSelectedState
        .map(town => town.name.split(',')[0])
        .join(', ')}`
    : 'Select a state to see its historic stops.';

  return (
    <div className="mt-2 space-y-2">
      {/* Ultra-Compact Route Statistics Card */}
      <Card className="py-1">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <Route className="h-3 w-3 text-red-600" />
            Route 66 Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">2,448</div>
              <div className="text-xs text-gray-600">Miles</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">8</div>
              <div className="text-xs text-gray-600">States</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{route66Towns.length}</div>
              <div className="text-xs text-gray-600">Towns</div>
            </div>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-1">
            {Object.values(stateToFullName).map((state) => (
              <Badge 
                key={state} 
                variant={selectedState === state ? "default" : "secondary"}
                className="text-xs px-1 py-0"
              >
                {state.substring(0, 2)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ultra-Compact Hidden Gems Legend */}
      <HiddenGemsLegend count={hiddenGemsCount} />

      {/* Ultra-Compact Legend Card */}
      <Card className="py-1">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-3 w-3 text-gray-600" />
            Map Legend
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-2">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span>Historic towns</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-1 bg-orange-500 rounded"></div>
              <span>Route pathway</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-600 rounded-full flex items-center justify-center">
                <div className="w-0.5 h-0.5 bg-white transform rotate-45"></div>
              </div>
              <span>Hidden gems</span>
            </div>
          </div>
          
          <div className="mt-2 p-1 bg-blue-50 rounded">
            <div className="flex items-center gap-1 text-blue-800 mb-1">
              <Clock className="h-2 w-2" />
              <span className="font-medium text-xs">Tip</span>
            </div>
            <p className="text-xs text-blue-700">
              Click markers to learn more. Purple markers show hidden gems!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteInfo;
