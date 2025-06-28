
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

  // Sample fun facts for different cities - you can expand this data
  const getFunFacts = (city: string): string[] => {
    const facts: Record<string, string[]> = {
      'Chicago': [
        'The starting point of the historic Route 66',
        'Home to the first skyscraper in the world',
        'The Chicago River flows backwards'
      ],
      'Los Angeles': [
        'The western terminus of Route 66',
        'Has more cars than people',
        'Hollywood sign was originally an advertisement'
      ],
      'Santa Monica': [
        'End of the trail! Santa Monica Pier marks Route 66\'s end',
        'The pier has been featured in countless movies',
        'Home to the world\'s first solar-powered Ferris wheel'
      ]
    };
    
    return facts[city] || [
      `${city} is a historic stop along Route 66`,
      'This city has witnessed countless travelers on America\'s Main Street',
      'Part of the iconic Mother Road experience'
    ];
  };

  const funFacts = getFunFacts(cityName);

  return (
    <Card className="bg-gradient-to-br from-stone-100 to-stone-200 border-2 border-black hover:shadow-lg transition-all duration-200 hover:border-gray-800">
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-sm font-bold text-black flex items-center justify-between">
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
          <div className="space-y-3">
            {funFacts.map((fact, index) => (
              <div 
                key={index}
                className="bg-stone-50 rounded-lg p-3 border border-gray-400 hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg flex-shrink-0 mt-0.5">
                    💡
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {fact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-stone-200 border border-black rounded-lg p-2 text-center">
              <p className="text-xs text-gray-800 font-medium">
                🏛️ Discover more about {cityName} on Route 66
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default FunFactsTile;
