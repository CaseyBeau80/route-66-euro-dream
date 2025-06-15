
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
  console.log('🎯 RecommendedStopsDisplay: Rendering component:', {
    stopsCount: stops?.length || 0,
    maxDisplay,
    showLocation,
    compact,
    stops: stops?.map(s => ({ name: s.name, city: s.city, category: s.category, type: s.type })) || []
  });

  if (!stops || stops.length === 0) {
    console.log('⚠️ RecommendedStopsDisplay: No stops to display');
    return (
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          Recommended Stops (0)
        </h5>
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border">
          <p className="font-medium mb-1">No Route 66 attractions found for this segment</p>
          <p className="text-xs">We're looking for classic diners, roadside attractions, museums, and hidden gems along your route.</p>
        </div>
      </div>
    );
  }

  const displayStops = stops.slice(0, maxDisplay);
  console.log('🎯 RecommendedStopsDisplay: Will display stops:', displayStops.map(s => `${s.name} (${s.type})`));

  if (compact) {
    return (
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          Route 66 Attractions ({displayStops.length})
        </h5>
        <div className="space-y-1">
          {displayStops.map((stop, index) => {
            const formatted = StopRecommendationService.formatStopForDisplay(stop);
            console.log(`🎯 RecommendedStopsDisplay: Rendering compact stop ${index + 1}:`, formatted);
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
                    {formatted.location} • {formatted.category}
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
        Route 66 Attractions ({displayStops.length})
      </h4>
      <div className="space-y-3">
        {displayStops.map((stop, index) => {
          const formatted = StopRecommendationService.formatStopForDisplay(stop);
          console.log(`🎯 RecommendedStopsDisplay: Rendering full stop ${index + 1}:`, formatted);
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
      {stops.length > maxDisplay && (
        <div className="text-xs text-gray-500 text-center">
          + {stops.length - maxDisplay} more attraction{stops.length - maxDisplay !== 1 ? 's' : ''} available
        </div>
      )}
    </div>
  );
};

export default RecommendedStopsDisplay;
