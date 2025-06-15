
import React from 'react';
import { RecommendedStop } from '../services/recommendations/StopRecommendationService';
import { StopDisplayFormatter } from '../services/recommendations/StopDisplayFormatter';

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
  console.log('🔥 [FIXED-DISPLAY] RecommendedStopsDisplay rendering:', {
    inputStopsCount: stops.length,
    maxDisplay,
    targetDisplay: Math.min(maxDisplay, stops.length),
    showLocation,
    compact
  });

  if (!stops || stops.length === 0) {
    console.log('❌ [FIXED-DISPLAY] No stops to display');
    return (
      <div className="text-center p-3 text-gray-500 text-sm">
        No recommended stops found for this segment.
      </div>
    );
  }

  // FIXED: Ensure we display exactly the number requested (1-3)
  const displayStops = stops.slice(0, maxDisplay);
  console.log(`✅ [FIXED-DISPLAY] Will render exactly ${displayStops.length} stops out of ${stops.length} available`);

  return (
    <div className="space-y-3">
      {displayStops.map((stop, index) => {
        const formatted = StopDisplayFormatter.formatStopForDisplay(stop);
        
        console.log(`🔥 [FIXED-DISPLAY] Rendering stop ${index + 1}/${displayStops.length}:`, {
          name: formatted.name,
          location: formatted.location,
          category: formatted.category,
          score: stop.relevanceScore
        });

        return (
          <div 
            key={`${stop.id}-${index}`} 
            className={`flex items-start gap-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors ${
              compact ? 'p-2' : 'p-3'
            }`}
          >
            {/* Icon */}
            <div className="text-blue-600 mt-0.5 text-lg flex-shrink-0">
              {formatted.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Name */}
              <div className="font-medium text-gray-800 truncate">
                {formatted.name}
              </div>

              {/* Location */}
              {showLocation && (
                <div className="text-gray-600 text-sm mt-1">
                  📍 {formatted.location}
                </div>
              )}

              {/* Description */}
              {stop.originalStop?.description && (
                <div className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {stop.originalStop.description}
                </div>
              )}

              {/* Meta Information */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {formatted.category}
                </span>
                
                {stop.originalStop?.featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                    ⭐ Featured
                  </span>
                )}
                
                <span className="text-xs text-gray-500">
                  Score: {stop.relevanceScore}
                </span>
              </div>

              {/* Website Link */}
              {stop.originalStop?.website && (
                <div className="mt-2">
                  <a 
                    href={stop.originalStop.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs underline"
                  >
                    Visit Website →
                  </a>
                </div>
              )}
            </div>

            {/* Image */}
            {(stop.originalStop?.image_url || stop.originalStop?.thumbnail_url) && (
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={stop.originalStop.image_url || stop.originalStop.thumbnail_url}
                  alt={stop.name}
                  className="w-full h-full object-cover rounded border"
                  onError={(e) => {
                    console.log(`🖼️ [FIXED-DISPLAY] Image failed to load for ${stop.name}`);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Show count summary */}
      <div className="text-center text-xs text-gray-500 py-1">
        Showing {displayStops.length} of {stops.length} recommended stops
      </div>
    </div>
  );
};

export default RecommendedStopsDisplay;
