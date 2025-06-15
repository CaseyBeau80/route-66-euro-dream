
import React from 'react';
import { MapPin, Star } from 'lucide-react';
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

  if (displayStops.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">No Route 66 attractions found for this segment</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Route 66 Attractions ({displayStops.length})
      </h4>
      
      <div className={`space-y-${compact ? '2' : '3'}`}>
        {displayStops.map((stop, index) => {
          const formatted = StopDisplayFormatter.formatStopForDisplay(stop);
          
          return (
            <div
              key={`recommended-${stop.id}-${index}`}
              className={`bg-white rounded-lg border border-route66-border p-${compact ? '3' : '4'} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">
                  {formatted.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-travel font-semibold text-route66-text-primary text-sm truncate">
                        {formatted.name}
                      </h5>
                      
                      {showLocation && (
                        <p className="text-xs text-route66-text-secondary mt-1">
                          📍 {formatted.location}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-route66-vintage-brown">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{stop.relevanceScore.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-route66-vintage-beige text-route66-vintage-brown rounded text-xs font-medium">
                      {formatted.category}
                    </span>
                    
                    {stop.originalStop.featured && (
                      <span className="px-2 py-1 bg-route66-orange text-white rounded text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  {/* Rich content from original stop */}
                  {stop.originalStop.description && !compact && (
                    <p className="text-xs text-route66-text-secondary mt-2 line-clamp-2">
                      {stop.originalStop.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Additional metadata */}
              {!compact && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Type: {stop.type}</span>
                    <span>Relevance: {(stop.relevanceScore / 100 * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {stops.length > maxDisplay && (
        <div className="text-center">
          <p className="text-xs text-route66-text-secondary">
            + {stops.length - maxDisplay} more Route 66 attractions available
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendedStopsDisplay;
