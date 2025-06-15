
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { AttractionLimitingService } from '../services/attractions/AttractionLimitingService';
import { useRecommendedStops } from '../hooks/useRecommendedStops';
import SegmentNearbyAttractions from './SegmentNearbyAttractions';
import RecommendedStopsDisplay from './RecommendedStopsDisplay';
import ErrorBoundary from './ErrorBoundary';

interface DaySegmentCardContentProps {
  segment: DailySegment;
  tripStartDate?: Date;
  driveTimeStyle: {
    bg: string;
    text: string;
    border: string;
  };
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
}

const DaySegmentCardContent: React.FC<DaySegmentCardContentProps> = ({
  segment,
  tripStartDate,
  driveTimeStyle,
  cardIndex = 0,
  tripId,
  sectionKey = 'itinerary'
}) => {
  // Get enhanced recommended stops - ALWAYS try this first
  const { recommendedStops, isLoading, hasStops, error } = useRecommendedStops(segment, 3);
  
  console.log('🔥 [FINAL-DEBUG] DaySegmentCardContent render state:', {
    segmentDay: segment.day,
    route: `${segment.startCity} → ${segment.endCity}`,
    isLoading,
    hasError: !!error,
    hasStops,
    stopsCount: recommendedStops.length,
    recommendedStops: recommendedStops.map(stop => ({
      name: stop.name,
      city: stop.city,
      category: stop.category,
      hasDescription: !!stop.originalStop?.description,
      hasImage: !!(stop.originalStop?.image_url || stop.originalStop?.thumbnail_url),
      hasWebsite: !!stop.originalStop?.website
    }))
  });

  return (
    <div className="space-y-4">
      {/* Drive Time Warning */}
      {segment.driveTimeCategory && segment.driveTimeHours > 6 && (
        <div className={`p-3 rounded-lg border text-sm ${driveTimeStyle.bg} ${driveTimeStyle.border}`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className={`h-4 w-4 mt-0.5 ${driveTimeStyle.text}`} />
            <div>
              <div className={`font-medium text-sm ${driveTimeStyle.text}`}>
                {segment.driveTimeCategory.category.charAt(0).toUpperCase() + segment.driveTimeCategory.category.slice(1)} Drive Day
              </div>
              <div className={`text-xs mt-1 ${driveTimeStyle.text}`}>
                {segment.driveTimeCategory.message}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMPLIFIED: Show recommended stops if we have them, otherwise show fallback */}
      <div className="space-y-4">
        {/* Show loading state ONLY when loading */}
        {isLoading && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              Loading Route 66 attractions...
            </div>
          </div>
        )}

        {/* Show error state if there's an error AND not loading */}
        {error && !isLoading && (
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-4">
            <div className="text-sm text-red-600">
              <div className="font-medium">Error loading attractions:</div>
              <div className="text-xs mt-1">{error}</div>
            </div>
          </div>
        )}

        {/* MAIN DISPLAY: Show recommended stops if we have any AND not loading */}
        {!isLoading && recommendedStops.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
            <div className="mb-3 text-sm text-blue-700 font-semibold flex items-center gap-2">
              ✨ Route 66 Attractions ({recommendedStops.length})
            </div>
            <ErrorBoundary context={`RecommendedStops-Day${segment.day}`}>
              <RecommendedStopsDisplay 
                stops={recommendedStops}
                maxDisplay={3}
                showLocation={true}
                compact={false}
              />
            </ErrorBoundary>
          </div>
        )}

        {/* FALLBACK: Show legacy system ONLY if no recommended stops AND not loading AND no error */}
        {!isLoading && !error && recommendedStops.length === 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-4">
            <div className="mb-3 text-sm text-gray-600 font-medium">
              🏛️ Nearby Attractions (Fallback)
            </div>
            <ErrorBoundary context={`FallbackAttractions-Day${segment.day}`}>
              <SegmentNearbyAttractions 
                segment={segment} 
                maxAttractions={AttractionLimitingService.getMaxAttractions()}
              />
            </ErrorBoundary>
          </div>
        )}
      </div>
    </div>
  );
};

export default DaySegmentCardContent;
