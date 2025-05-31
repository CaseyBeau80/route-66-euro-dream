
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

  // Filter for major stops only and group by state
  const majorCities = waypoints.filter(waypoint => waypoint.is_major_stop);
  
  // Group cities by state
  const citiesByState = majorCities.reduce((acc, city) => {
    const state = city.state;
    if (!acc[state]) {
      acc[state] = [];
    }
    acc[state].push(city);
    return acc;
  }, {} as Record<string, typeof majorCities>);

  // Sort states by their appearance order along Route 66
  const stateOrder = ['Illinois', 'Missouri', 'Oklahoma', 'Texas', 'New Mexico', 'Arizona', 'California'];
  const sortedStates = stateOrder.filter(state => citiesByState[state]);

  const toggleStateExpansion = (state: string) => {
    const newExpandedStates = new Set(expandedStates);
    if (newExpandedStates.has(state)) {
      newExpandedStates.delete(state);
    } else {
      newExpandedStates.add(state);
    }
    setExpandedStates(newExpandedStates);
  };

  const handleCityClick = (waypoint: any) => {
    console.log('🏛️ City clicked (navigation disabled):', waypoint.name);
    // Navigation removed - cities in navigation panel no longer navigate to city pages
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
          <div className="space-y-1">
            {sortedStates.map((state) => {
              const cities = citiesByState[state];
              const isStateExpanded = expandedStates.has(state);
              
              return (
                <Collapsible key={state} open={isStateExpanded} onOpenChange={() => toggleStateExpansion(state)}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between w-full p-2 hover:bg-amber-100 rounded-md transition-colors">
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
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6">
                    <div className="space-y-1 pb-2">
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
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CityNavigation;
