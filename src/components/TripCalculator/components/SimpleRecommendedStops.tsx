
import React from 'react';
import { MapPin, Star, Camera } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useRecommendedStops } from '../hooks/useRecommendedStops';

interface SimpleRecommendedStopsProps {
  segment: DailySegment;
  maxStops?: number;
}

const SimpleRecommendedStops: React.FC<SimpleRecommendedStopsProps> = ({
  segment,
  maxStops = 3
}) => {
  console.log('🎯 SimpleRecommendedStops render START:', {
    segmentDay: segment.day,
    endCity: segment.endCity,
    maxStops
  });

  const { recommendedStops, isLoading, error } = useRecommendedStops(segment, maxStops);

  console.log('🎯 SimpleRecommendedStops hook result:', {
    isLoading,
    hasError: !!error,
    stopsCount: recommendedStops?.length || 0,
    stops: recommendedStops?.map(s => s.name) || []
  });

  // Loading state
  if (isLoading) {
    console.log('🎯 SimpleRecommendedStops showing LOADING state');
    return (
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="text-sm">Finding recommended stops...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.log('🎯 SimpleRecommendedStops showing ERROR state:', error);
    return (
      <div className="bg-red-50 rounded-lg border border-red-200 p-4">
        <div className="text-sm text-red-600">
          <div className="font-medium">Error loading stops:</div>
          <div className="text-xs mt-1">{error}</div>
        </div>
      </div>
    );
  }

  // No stops found
  if (!recommendedStops || recommendedStops.length === 0) {
    console.log('🎯 SimpleRecommendedStops showing NO STOPS state');
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="text-sm text-gray-600 text-center">
          No recommended stops found for this route segment.
        </div>
      </div>
    );
  }

  // Success state with stops
  console.log('🎯 SimpleRecommendedStops showing SUCCESS state with', recommendedStops.length, 'stops');

  const getIcon = (category: string) => {
    switch (category) {
      case 'destination_city': return <Star className="h-4 w-4" />;
      case 'route66_waypoint': return <MapPin className="h-4 w-4" />;
      case 'attraction': return <Camera className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
      <div className="mb-3 text-sm text-blue-700 font-semibold flex items-center gap-2">
        ✨ Recommended Route 66 Stops ({recommendedStops.length})
      </div>
      
      <div className="space-y-3">
        {recommendedStops.map((stop, index) => {
          console.log('🎯 Rendering stop:', stop.name, 'at index', index);
          return (
            <div 
              key={`${stop.id}-${index}`}
              className="bg-white rounded-lg border border-blue-200 p-3"
            >
              <div className="flex items-start gap-3">
                <div className="text-blue-600 mt-0.5">
                  {getIcon(stop.category)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-sm">
                    {stop.name}
                  </div>
                  
                  <div className="text-gray-600 text-xs mt-1">
                    📍 {stop.city}, {stop.state}
                  </div>
                  
                  {stop.originalStop?.description && (
                    <div className="text-gray-600 text-xs mt-2 line-clamp-2">
                      {stop.originalStop.description}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {stop.category.replace('_', ' ')}
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
                
                {(stop.originalStop?.image_url || stop.originalStop?.thumbnail_url) && (
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={stop.originalStop.image_url || stop.originalStop.thumbnail_url}
                      alt={stop.name}
                      className="w-full h-full object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-3">
        Showing {recommendedStops.length} recommended stops
      </div>
    </div>
  );
};

export default SimpleRecommendedStops;
