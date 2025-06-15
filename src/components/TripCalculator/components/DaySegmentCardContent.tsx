
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
  // Get recommended stops for this segment
  const { recommendedStops, isLoading: isLoadingStops, hasStops, error } = useRecommendedStops(segment, 3);
  
  const maxAttractions = AttractionLimitingService.getMaxAttractions();
  const context = `DaySegmentCardContent-Day${segment.day}-${sectionKey}`;
  
  console.log('🔍 [CRITICAL-FINAL] DaySegmentCardContent render - FINAL DISPLAY DECISION:', {
    segmentDay: segment.day,
    route: `${segment.startCity} → ${segment.endCity}`,
    recommendedStopsCount: recommendedStops.length,
    hasStops,
    isLoadingStops,
    error,
    CRITICAL_DISPLAY_LOGIC: {
      isLoading: isLoadingStops,
      hasError: !!error,
      hasRecommendedStops: hasStops && recommendedStops.length > 0,
      willShowEnhancedStops: !isLoadingStops && !error && hasStops && recommendedStops.length > 0,
      willShowFallback: !isLoadingStops && !error && (!hasStops || recommendedStops.length === 0)
    },
    enhancedStopsData: recommendedStops.map(stop => ({
      id: stop.id,
      name: stop.name,
      category: stop.category,
      city: stop.city,
      state: stop.state,
      score: stop.relevanceScore,
      hasDescription: !!stop.originalStop.description,
      hasImage: !!(stop.originalStop.image_url || stop.originalStop.thumbnail_url),
      featured: stop.originalStop.featured
    }))
  });

  return (
    <div className="space-y-4">
      {/* Drive Time Message - Compact */}
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

      {/* Route & Stops Content - SIMPLIFIED AND FIXED LOGIC */}
      <div className="space-y-4">
        {/* LOADING STATE */}
        {isLoadingStops && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              Searching for Route 66 attractions and hidden gems...
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!isLoadingStops && error && (
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-4">
            <div className="text-sm text-red-600">
              <div className="font-medium">Error loading Route 66 attractions:</div>
              <div className="text-xs mt-1">{error}</div>
            </div>
          </div>
        )}

        {/* SUCCESS: SHOW ENHANCED RECOMMENDED STOPS */}
        {!isLoadingStops && !error && hasStops && recommendedStops.length > 0 && (
          <ErrorBoundary context={`RecommendedStops-Day${segment.day}`}>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
              <div className="mb-2 text-xs text-blue-600 font-medium">
                ✨ Found {recommendedStops.length} enhanced Route 66 attractions
              </div>
              <RecommendedStopsDisplay 
                stops={recommendedStops}
                maxDisplay={3}
                showLocation={true}
                compact={false}
              />
            </div>
          </ErrorBoundary>
        )}

        {/* FALLBACK: NO ENHANCED STOPS FOUND */}
        {!isLoadingStops && !error && (!hasStops || recommendedStops.length === 0) && (
          <ErrorBoundary context={`SegmentNearbyAttractions-Day${segment.day}`}>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-2">
                ⚠️ Enhanced system found no attractions - using basic fallback:
              </div>
              <SegmentNearbyAttractions 
                segment={segment} 
                maxAttractions={maxAttractions}
              />
            </div>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default DaySegmentCardContent;
