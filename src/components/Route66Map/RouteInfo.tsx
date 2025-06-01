
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
    <div className="mt-4 space-y-3">
      {/* Compact Route Statistics Card */}
      <Card className="py-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Route className="h-4 w-4 text-red-600" />
            Route 66 Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">2,448</div>
              <div className="text-xs text-gray-600">Miles Total</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">8</div>
              <div className="text-xs text-gray-600">States</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{route66Towns.length}</div>
              <div className="text-xs text-gray-600">Historic Towns</div>
            </div>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1">
            {Object.values(stateToFullName).map((state) => (
              <Badge 
                key={state} 
                variant={selectedState === state ? "default" : "secondary"}
                className="text-xs px-2 py-0"
              >
                {state}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compact Hidden Gems Legend */}
      <HiddenGemsLegend count={hiddenGemsCount} />

      {/* Compact Legend Card */}
      <Card className="py-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-4 w-4 text-gray-600" />
            Map Legend
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-sm">Historic Route 66 towns</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1.5 bg-orange-500 rounded"></div>
              <span className="text-sm">Route 66 pathway</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-white transform rotate-45"></div>
              </div>
              <span className="text-sm">Hidden gems & secret spots</span>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 mb-1">
              <Clock className="h-3 w-3" />
              <span className="font-medium text-sm">Travel Tip</span>
            </div>
            <p className="text-xs text-blue-700">
              Click on any marker to learn more about that location. Purple markers show hidden gems that most travelers miss!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteInfo;
