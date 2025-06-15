
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
  console.log('🎯 [FIXED] RecommendedStopsDisplay FORCED render:', {
    stopsCount: stops?.length || 0,
    maxDisplay,
    timestamp: new Date().toISOString(),
    actualStops: stops?.map(s => ({ 
      id: s.id,
      name: s.name, 
      city: s.city, 
      state: s.state,
      category: s.category, 
      type: s.type 
    })) || []
  });

  // CRITICAL: Validate and filter stops with DETAILED logging
  if (!stops || stops.length === 0) {
    console.log('⚠️ [FIXED] NO STOPS provided to display component');
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

  // ENHANCED validation - filter out invalid stops
  const validStops = stops.filter(stop => {
    const isValid = stop && 
      stop.name && 
      stop.name.trim().length > 0 &&
      stop.category &&
      stop.city &&
      stop.state &&
      !stop.name.toLowerCase().includes('destination') &&
      stop.name !== stop.city; // Exclude stops that are just city names
    
    console.log(`🔍 [FIXED] Validating stop: ${stop?.name}`, {
      hasName: !!stop?.name,
      hasCategory: !!stop?.category,
      hasCity: !!stop?.city,
      hasState: !!stop?.state,
      isValid,
      stopDetails: stop
    });
    
    return isValid;
  }).slice(0, maxDisplay);

  console.log(`🎯 [FIXED] Valid stops after ENHANCED filtering: ${validStops.length}`, 
    validStops.map(s => ({ 
      id: s.id, 
      name: s.name, 
      category: s.category, 
      location: `${s.city}, ${s.state}` 
    }))
  );

  if (validStops.length === 0) {
    console.log('⚠️ [FIXED] NO VALID stops after filtering');
    return (
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          Route 66 Attractions (0)
        </h5>
        <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="font-medium mb-1">⚠️ No valid attractions found</p>
          <p className="text-xs">The attraction data could not be properly processed for this segment.</p>
          <div className="text-xs mt-2 text-gray-400">
            Raw stops received: {stops.length}
          </div>
        </div>
      </div>
    );
  }

  // FORCE render all valid stops with detailed logging
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-800 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-blue-600" />
        Route 66 Attractions ({validStops.length})
      </h4>
      <div className="space-y-3">
        {validStops.map((stop, index) => {
          const formatted = StopRecommendationService.formatStopForDisplay(stop);
          
          console.log(`🎯 [FIXED] FORCE rendering stop ${index + 1}:`, {
            original: stop,
            formatted,
            timestamp: new Date().toISOString()
          });
          
          return (
            <div 
              key={`${stop.id}-${index}-${Date.now()}`} // Force unique key
              className="p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{formatted.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium text-gray-800">
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
                      Score: {stop.relevanceScore.toFixed(1)}
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
