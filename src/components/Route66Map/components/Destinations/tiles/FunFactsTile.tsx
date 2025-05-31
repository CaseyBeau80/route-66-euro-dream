
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import type { Route66Waypoint } from '../../../types/supabaseTypes';

interface FunFactsTileProps {
  destination: Route66Waypoint;
}

const FunFactsTile: React.FC<FunFactsTileProps> = ({ destination }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cityName = destination.name.split(',')[0].split(' - ')[0].trim();

  const generateFunFacts = (destination: Route66Waypoint) => {
    const facts = [
      `${cityName} is stop #${destination.sequence_order} along historic Route 66`,
      `Located in ${destination.state}, this ${destination.is_major_stop ? 'major destination' : 'historic waypoint'} has welcomed travelers since Route 66's heyday`,
      `The coordinates ${destination.latitude.toFixed(4)}°N, ${Math.abs(destination.longitude).toFixed(4)}°W mark this special place on America's Mother Road`
    ];

    if (destination.highway_designation) {
      facts.push(`Originally designated as ${destination.highway_designation} before becoming part of Route 66`);
    }

    return facts;
  };

  const facts = generateFunFacts(destination);

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300 hover:shadow-lg transition-all duration-200">
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-sm font-bold text-green-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Fun Facts
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
          <div className="space-y-2">
            {facts.map((fact, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-xs text-green-700 leading-relaxed">{fact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default FunFactsTile;
