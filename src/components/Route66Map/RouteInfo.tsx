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
    <div className="mt-6 space-y-4">
      {/* Route Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5 text-red-600" />
            Route 66 Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">2,448</div>
              <div className="text-sm text-gray-600">Miles Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">States</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{route66Towns.length}</div>
              <div className="text-sm text-gray-600">Historic Towns</div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.values(stateToFullName).map((state) => (
              <Badge 
                key={state} 
                variant={selectedState === state ? "default" : "secondary"}
                className="text-xs"
              >
                {state}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Hidden Gems Legend */}
      <HiddenGemsLegend count={hiddenGemsCount} />

      {/* Legend Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-600" />
            Map Legend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              <span className="text-sm">Historic Route 66 towns</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-2 bg-orange-500 rounded"></div>
              <span className="text-sm">Route 66 pathway</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-white transform rotate-45"></div>
              </div>
              <span className="text-sm">Hidden gems & secret spots</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 mb-1">
              <Clock className="h-4 w-4" />
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
