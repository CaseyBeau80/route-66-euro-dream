
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
  console.log('🎯 [DEBUG] RecommendedStopsDisplay rendering:', {
    stopsCount: stops?.length || 0,
    maxDisplay,
    showLocation,
    compact,
    actualStops: stops?.map(s => ({ 
      name: s.name, 
      city: s.city, 
      category: s.category, 
      type: s.type 
    })) || []
  });

  // Validate and filter stops
  if (!stops || stops.length === 0) {
    console.log('⚠️ [DEBUG] No stops provided to display component');
    return (
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          Route 66 Attractions (0)
        </h5>
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border">
          <p className="font-medium mb-1">🔍 Searching for Route 66 attractions...</p>
          <p className="text-xs">Looking for classic diners, roadside attractions, museums, and hidden gems.</p>
        </div>
      </div>
    );
  }

  // Filter valid stops with enhanced validation
  const validStops = stops.filter(stop => {
    const isValid = stop && 
      stop.name && 
      stop.name.trim().length > 0 &&
      stop.category &&
      stop.city &&
      !stop.name.toLowerCase().includes('destination') &&
      stop.name !== stop.city; // Exclude stops that are just city names
    
    if (!isValid) {
      console.log(`⚠️ [DEBUG] Filtering out invalid stop:`, stop);
    }
    
    return isValid;
  }).slice(0, maxDisplay);

  console.log(`🎯 [DEBUG] Valid stops after filtering: ${validStops.length}`, 
    validStops.map(s => `${s.name} (${s.category}) in ${s.city}`)
  );

  if (validStops.length === 0) {
    console.log('⚠️ [DEBUG] No valid stops after filtering');
    return (
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          Route 66 Attractions (0)
        </h5>
        <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="font-medium mb-1">⚠️ No valid attractions found</p>
          <p className="text-xs">The attraction data could not be properly processed for this segment.</p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          Route 66 Attractions ({validStops.length})
        </h5>
        <div className="space-y-1">
          {validStops.map((stop, index) => {
            const formatted = StopRecommendationService.formatStopForDisplay(stop);
            console.log(`🎯 [DEBUG] Rendering compact stop ${index + 1}:`, formatted);
            return (
              <div key={`${stop.id}-${index}`} className="text-sm">
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
        Route 66 Attractions ({validStops.length})
      </h4>
      <div className="space-y-3">
        {validStops.map((stop, index) => {
          const formatted = StopRecommendationService.formatStopForDisplay(stop);
          console.log(`🎯 [DEBUG] Rendering full stop ${index + 1}:`, formatted);
          return (
            <div 
              key={`${stop.id}-${index}`}
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
