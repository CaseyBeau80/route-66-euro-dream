
import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { RecommendedStop, StopRecommendationService } from '../services/recommendations/StopRecommendationService';

interface RecommendedStopsDisplayProps {
  stops: RecommendedStop[];
  maxDisplay?: number;
  showLocation?: boolean;
  compact?: boolean;
}

const RecommendedStopsDisplay: React.FC<RecommendedStopsDisplayProps> = ({
  stops,
  maxDisplay = 3,
  showLocation = true,
  compact = false
}) => {
  console.log('🎯 RecommendedStopsDisplay: Rendering with stops:', {
    stopsCount: stops?.length || 0,
    maxDisplay,
    stops: stops?.map(s => ({ name: s.name, city: s.city, category: s.category })) || []
  });

  if (!stops || stops.length === 0) {
    console.log('⚠️ RecommendedStopsDisplay: No stops to display');
    return null;
  }

  const displayStops = stops.slice(0, maxDisplay);

  if (compact) {
    return (
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          Recommended Stops ({displayStops.length})
        </h5>
        <div className="space-y-1">
          {displayStops.map((stop, index) => {
            const formatted = StopRecommendationService.formatStopForDisplay(stop);
            return (
              <div key={stop.id} className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">{formatted.icon}</span>
                  <span className="font-medium text-gray-800 truncate">
                    {formatted.name}
                  </span>
                </div>
                {showLocation && (
                  <div className="text-xs text-gray-500 ml-6 truncate">
                    {formatted.location}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-800 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-blue-600" />
        Recommended Stops ({displayStops.length})
      </h4>
      <div className="space-y-3">
        {displayStops.map((stop, index) => {
          const formatted = StopRecommendationService.formatStopForDisplay(stop);
          console.log(`🎯 Rendering stop ${index + 1}:`, formatted);
          return (
            <div 
              key={stop.id} 
              className="p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{formatted.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium text-gray-800 truncate">
                      {formatted.name}
                    </h5>
                    <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  </div>
                  {showLocation && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatted.location}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded">
                      {formatted.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      Score: {stop.relevanceScore}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedStopsDisplay;
