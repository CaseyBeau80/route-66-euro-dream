
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
  
  console.log('🔍 [FIXED-DISPLAY] DaySegmentCardContent render with corrected logic:', {
    segmentDay: segment.day,
    route: `${segment.startCity} → ${segment.endCity}`,
    recommendedStopsCount: recommendedStops.length,
    hasStops,
    isLoadingStops,
    error,
    willShowRecommendedStops: hasStops && recommendedStops.length > 0,
    willShowLegacyAttractions: !hasStops && !isLoadingStops,
    stopDetails: recommendedStops.map(stop => ({
      id: stop.id,
      name: stop.name,
      category: stop.category,
      city: stop.city,
      state: stop.state,
      score: stop.relevanceScore
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

      {/* Route & Stops Content - FIXED LOGIC */}
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

        {/* SUCCESS: SHOW RECOMMENDED STOPS WITH RICH DATA */}
        {!isLoadingStops && !error && hasStops && recommendedStops.length > 0 && (
          <ErrorBoundary context={`RecommendedStops-Day${segment.day}`}>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
              <RecommendedStopsDisplay 
                stops={recommendedStops}
                maxDisplay={3}
                showLocation={true}
                compact={false}
              />
            </div>
          </ErrorBoundary>
        )}

        {/* FALLBACK: NO RECOMMENDED STOPS FOUND */}
        {!isLoadingStops && !error && !hasStops && (
          <div className="space-y-4">
            {/* Show "no attractions found" message */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-500">
                <div className="font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <span>🔍</span>
                  Route 66 Attractions
                </div>
                <p className="mb-2">No classic Route 66 attractions found between {segment.startCity} and {segment.endCity}</p>
                <div className="text-xs bg-yellow-50 border border-yellow-200 rounded p-2 text-yellow-700">
                  <p className="font-medium">We're looking for:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Classic diners and drive-ins</li>
                    <li>• Roadside attractions and museums</li>
                    <li>• Hidden gems and local favorites</li>
                    <li>• Historic Route 66 landmarks</li>
                  </ul>
                </div>
                <div className="text-xs mt-2 text-gray-400">
                  Debug: Day {segment.day} • {segment.startCity} → {segment.endCity} • Database query returned {recommendedStops.length} stops
                </div>
              </div>
            </div>

            {/* Legacy Attractions as absolute fallback */}
            <ErrorBoundary context={`SegmentNearbyAttractions-Day${segment.day}`}>
              <SegmentNearbyAttractions 
                segment={segment} 
                maxAttractions={maxAttractions}
              />
            </ErrorBoundary>
          </div>
        )}
      </div>
    </div>
  );
};

export default DaySegmentCardContent;
