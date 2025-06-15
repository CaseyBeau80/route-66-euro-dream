
import React from 'react';
import { MapPin, Star, Camera, Clock, ExternalLink } from 'lucide-react';
import { RecommendedStop } from '../services/recommendations/RecommendedStopTypes';
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
  const displayStops = stops.slice(0, maxDisplay);

  console.log('🎯 [ENHANCED] RecommendedStopsDisplay rendering:', {
    totalStops: stops.length,
    displayStops: displayStops.length,
    stopsWithRichData: displayStops.filter(s => s.originalStop.description || s.originalStop.image_url).length
  });

  if (displayStops.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">No Route 66 attractions found for this segment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`space-y-${compact ? '2' : '3'}`}>
        {displayStops.map((stop, index) => {
          const formatted = StopDisplayFormatter.formatStopForDisplay(stop);
          const hasImage = !!(stop.originalStop.image_url || stop.originalStop.thumbnail_url);
          const hasDescription = !!stop.originalStop.description;
          const hasWebsite = !!stop.originalStop.website;
          
          return (
            <div
              key={`recommended-${stop.id}-${index}`}
              className={`bg-white rounded-lg border border-blue-200 p-${compact ? '3' : '4'} hover:shadow-lg transition-all duration-200 hover:border-blue-300`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0 mt-1">
                  {formatted.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-800 text-base leading-tight">
                        {formatted.name}
                      </h5>
                      
                      {showLocation && (
                        <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {formatted.location}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{stop.relevanceScore.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {formatted.category}
                    </span>
                    
                    {stop.originalStop.featured && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </span>
                    )}

                    {hasImage && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <Camera className="h-3 w-3" />
                        Photos
                      </span>
                    )}

                    {hasWebsite && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Website
                      </span>
                    )}
                  </div>
                  
                  {/* Rich description content */}
                  {hasDescription && !compact && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {stop.originalStop.description}
                      </p>
                    </div>
                  )}

                  {/* Enhanced metadata */}
                  {!compact && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {stop.type} • {stop.category}
                        </span>
                        <span>Relevance: {Math.round(stop.relevanceScore)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {stops.length > maxDisplay && (
        <div className="text-center mt-3">
          <p className="text-xs text-blue-600 bg-blue-50 rounded-full px-3 py-1 inline-block">
            + {stops.length - maxDisplay} more Route 66 attractions available
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendedStopsDisplay;
