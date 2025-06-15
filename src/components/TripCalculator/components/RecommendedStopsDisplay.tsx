
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
  console.log('🎯 [ATTRACTION-FOCUSED] RecommendedStopsDisplay render:', {
    stopsCount: stops?.length || 0,
    maxDisplay,
    timestamp: new Date().toISOString(),
    actualStops: stops?.map(s => ({ 
      id: s.id,
      name: s.name, 
      city: s.city, 
      state: s.state,
      category: s.category, 
      type: s.type,
      score: s.relevanceScore
    })) || []
  });

  // CRITICAL: Validate and filter stops - ONLY include real attractions
  if (!stops || stops.length === 0) {
    console.log('⚠️ [ATTRACTION-FOCUSED] NO STOPS provided to display component');
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

  // ULTRA-STRICT validation - filter out ANYTHING that looks generic
  const validStops = stops.filter(stop => {
    const isValid = stop && 
      stop.name && 
      stop.name.trim().length > 0 &&
      stop.category &&
      stop.city &&
      stop.state &&
      // CRITICAL: Exclude generic location names
      !stop.name.toLowerCase().includes('destination') &&
      !stop.name.toLowerCase().includes('attractions in') &&
      !stop.name.toLowerCase().includes('points of interest') &&
      !stop.name.toLowerCase().includes('tourist attractions') &&
      !stop.name.toLowerCase().includes('things to do') &&
      // Make sure it's not just the city name
      stop.name.toLowerCase() !== stop.city.toLowerCase() &&
      // Make sure it has some substance
      stop.name.length > 3;
    
    console.log(`🔍 [ATTRACTION-FOCUSED] ULTRA-STRICT validation for: ${stop?.name}`, {
      hasName: !!stop?.name,
      hasCategory: !!stop?.category,
      hasCity: !!stop?.city,
      hasState: !!stop?.state,
      isNotGeneric: !stop?.name?.toLowerCase().includes('destination'),
      isNotJustCityName: stop?.name?.toLowerCase() !== stop?.city?.toLowerCase(),
      hasSubstance: (stop?.name?.length || 0) > 3,
      isValid,
      stopDetails: stop
    });
    
    return isValid;
  }).slice(0, maxDisplay);

  console.log(`🎯 [ATTRACTION-FOCUSED] Valid attractions after ULTRA-STRICT filtering: ${validStops.length}`, 
    validStops.map(s => ({ 
      id: s.id, 
      name: s.name, 
      category: s.category, 
      location: `${s.city}, ${s.state}`,
      score: s.relevanceScore
    }))
  );

  if (validStops.length === 0) {
    console.log('⚠️ [ATTRACTION-FOCUSED] NO VALID attractions after ultra-strict filtering');
    return (
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          Route 66 Attractions (0)
        </h5>
        <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="font-medium mb-1">⚠️ No specific attractions found</p>
          <p className="text-xs">We're still looking for classic Route 66 attractions like diners, roadside landmarks, and museums in this area.</p>
          <div className="text-xs mt-2 text-gray-400">
            Raw stops received: {stops.length} • Valid after filtering: {validStops.length}
          </div>
        </div>
      </div>
    );
  }

  // PRIORITY: Render all valid attractions with enhanced formatting
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-800 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-blue-600" />
        Route 66 Attractions ({validStops.length})
      </h4>
      <div className="space-y-3">
        {validStops.map((stop, index) => {
          const formatted = StopRecommendationService.formatStopForDisplay(stop);
          
          console.log(`🎯 [ATTRACTION-FOCUSED] PRIORITY rendering attraction ${index + 1}:`, {
            original: stop,
            formatted,
            timestamp: new Date().toISOString()
          });
          
          return (
            <div 
              key={`attraction-${stop.id}-${index}-${Date.now()}`}
              className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5 flex-shrink-0">{formatted.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-semibold text-gray-800 text-base">
                      {formatted.name}
                    </h5>
                    <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  </div>
                  {showLocation && (
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {formatted.location}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded font-medium">
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
        <div className="text-xs text-gray-500 text-center italic">
          + {stops.length - maxDisplay} more attraction{stops.length - maxDisplay !== 1 ? 's' : ''} available
        </div>
      )}
    </div>
  );
};

export default RecommendedStopsDisplay;
