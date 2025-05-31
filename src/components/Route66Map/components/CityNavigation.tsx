
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Map, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { extractCityName } from '@/utils/cityUrlUtils';

const CityNavigation: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  const { waypoints, isLoading } = useSupabaseRoute66();

  const handleMainToggle = () => {
    console.log('🗺️ Main navigation toggle clicked, current state:', isExpanded);
    setIsExpanded(!isExpanded);
  };

  // Filter for major stops only and group by state
  const majorCities = waypoints.filter(waypoint => waypoint.is_major_stop);
  
  console.log('🗺️ Major cities data:', majorCities.map(city => ({ name: city.name, state: city.state })));
  
  // Group cities by state
  const citiesByState = majorCities.reduce((acc, city) => {
    const state = city.state;
    if (!acc[state]) {
      acc[state] = [];
    }
    acc[state].push(city);
    return acc;
  }, {} as Record<string, typeof majorCities>);

  console.log('🗺️ Cities grouped by state:', Object.keys(citiesByState));

  // Get all unique states from the actual data and sort them by Route 66 order
  const stateOrder = ['IL', 'MO', 'OK', 'TX', 'NM', 'AZ', 'CA', 'Illinois', 'Missouri', 'Oklahoma', 'Texas', 'New Mexico', 'Arizona', 'California'];
  const availableStates = Object.keys(citiesByState);
  const sortedStates = stateOrder.filter(state => availableStates.includes(state));
  
  // If no states match the expected order, just use the available states
  const finalStates = sortedStates.length > 0 ? sortedStates : availableStates;

  console.log('🗺️ Available states:', availableStates);
  console.log('🗺️ Final sorted states:', finalStates);

  const toggleStateExpansion = (state: string) => {
    console.log('🏛️ State toggle clicked:', state, 'currently expanded:', expandedStates.has(state));
    const newExpandedStates = new Set(expandedStates);
    if (newExpandedStates.has(state)) {
      newExpandedStates.delete(state);
    } else {
      newExpandedStates.add(state);
    }
    setExpandedStates(newExpandedStates);
    console.log('🏛️ New expanded states:', Array.from(newExpandedStates));
  };

  const handleCityClick = (waypoint: any) => {
    console.log('🏛️ City clicked (navigation disabled):', waypoint.name);
    // Navigation removed - cities in navigation panel no longer navigate to city pages
  };

  if (isLoading) {
    console.log('🗺️ CityNavigation: Still loading waypoints...');
    return null;
  }

  console.log('🗺️ CityNavigation render:', {
    isExpanded,
    expandedStates: Array.from(expandedStates),
    majorCitiesCount: majorCities.length,
    statesCount: finalStates.length,
    finalStates
  });

  return (
    <Card className="absolute top-4 right-4 z-10 w-80 bg-white shadow-lg border border-amber-300">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-amber-50 transition-colors"
        onClick={handleMainToggle}
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
          <div className="space-y-1">
            {finalStates.map((state) => {
              const cities = citiesByState[state];
              const isStateExpanded = expandedStates.has(state);
              
              return (
                <div key={state}>
                  <button
                    className="w-full flex items-center justify-between p-2 hover:bg-amber-100 rounded-md transition-colors"
                    onClick={() => toggleStateExpansion(state)}
                  >
                    <div className="flex items-center gap-2">
                      {isStateExpanded ? (
                        <ChevronDown className="w-4 h-4 text-amber-700" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-amber-700" />
                      )}
                      <span className="font-semibold text-amber-800 text-left">{state}</span>
                    </div>
                    <span className="text-xs text-amber-600 bg-amber-200 px-2 py-1 rounded-full">
                      {cities.length}
                    </span>
                  </button>
                  
                  {isStateExpanded && (
                    <div className="pl-6 space-y-1 pb-2">
                      {cities.map((city) => {
                        const cityName = extractCityName(city.name);
                        return (
                          <Button
                            key={city.id}
                            variant="ghost"
                            className="w-full justify-start hover:bg-amber-50 text-left p-2 h-auto cursor-default"
                            onClick={() => handleCityClick(city)}
                          >
                            <div className="text-left">
                              <div className="font-medium text-amber-800 text-sm">{cityName}</div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CityNavigation;
