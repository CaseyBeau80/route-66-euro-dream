
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
  console.log('🔥 [FINAL-DISPLAY-DEBUG] RecommendedStopsDisplay rendering:', {
    stopsCount: stops.length,
    maxDisplay,
    showLocation,
    compact,
    stopsDetailed: stops.map(s => ({
      id: s.id,
      name: s.name,
      city: s.city,
      category: s.category,
      score: s.relevanceScore,
      hasOriginalStop: !!s.originalStop,
      originalStopKeys: s.originalStop ? Object.keys(s.originalStop) : [],
      hasDescription: !!s.originalStop?.description,
      hasImage: !!(s.originalStop?.image_url || s.originalStop?.thumbnail_url),
      hasWebsite: !!s.originalStop?.website,
      featured: s.originalStop?.featured,
      description: s.originalStop?.description ? s.originalStop.description.substring(0, 100) + '...' : 'No description'
    }))
  });

  if (!stops || stops.length === 0) {
    console.log('❌ [FINAL-DISPLAY-DEBUG] No stops to display');
    return (
      <div className="text-center p-3 text-gray-500 text-sm">
        No recommended stops found for this segment.
      </div>
    );
  }

  const displayStops = stops.slice(0, maxDisplay);
  console.log(`🔥 [FINAL-DISPLAY-DEBUG] Will render ${displayStops.length} stops`);

  return (
    <div className="space-y-3">
      {displayStops.map((stop, index) => {
        const formatted = StopDisplayFormatter.formatStopForDisplay(stop);
        
        console.log(`🔥 [FINAL-DISPLAY-DEBUG] Rendering stop ${index + 1}:`, {
          name: formatted.name,
          location: formatted.location,
          category: formatted.category,
          icon: formatted.icon,
          hasDescription: !!stop.originalStop?.description,
          hasImage: !!(stop.originalStop?.image_url || stop.originalStop?.thumbnail_url),
          hasWebsite: !!stop.originalStop?.website,
          descriptionLength: stop.originalStop?.description?.length || 0
        });

        return (
          <div 
            key={`${stop.id}-${index}`} 
            className={`flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors ${
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
                    console.log(`🖼️ [FINAL-DISPLAY-DEBUG] Image failed to load for ${stop.name}`);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Show count if there are more stops */}
      {stops.length > maxDisplay && (
        <div className="text-center text-sm text-gray-500 py-2">
          Showing {maxDisplay} of {stops.length} recommended stops
        </div>
      )}
    </div>
  );
};

export default RecommendedStopsDisplay;
