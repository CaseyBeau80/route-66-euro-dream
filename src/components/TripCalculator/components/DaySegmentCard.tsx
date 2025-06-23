
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { Clock, MapPin } from 'lucide-react';
import { useStableSegment } from '../hooks/useStableSegments';
import { DriveTimeStyleCalculator } from '../services/planning/DriveTimeStyleCalculator';
import DaySegmentCardHeader from './DaySegmentCardHeader';
import DaySegmentCardContent from './DaySegmentCardContent';
import SegmentWeatherWidget from './SegmentWeatherWidget';
import ErrorBoundary from './ErrorBoundary';

interface DaySegmentCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
  showWeather?: boolean;
  forceShowAttractions?: boolean;
}

const DaySegmentCard: React.FC<DaySegmentCardProps> = ({
  segment,
  tripStartDate,
  cardIndex = 0,
  tripId,
  sectionKey = 'default',
  showWeather = true,
  forceShowAttractions = false
}) => {
  const stableSegment = useStableSegment(segment);
  const driveTimeStyle = DriveTimeStyleCalculator.getStyle(stableSegment?.driveTimeHours || 0);
  
  console.log('🗂️ DaySegmentCard render - FIXED attractions logic:', {
    day: stableSegment?.day,
    endCity: stableSegment?.endCity,
    sectionKey,
    showWeather,
    forceShowAttractions,
    attractions: {
      attractionsCount: stableSegment?.attractions?.length || 0,
      recommendedStopsCount: stableSegment?.recommendedStops?.length || 0,
      stopsCount: stableSegment?.stops?.length || 0,
      hasAttractions: !!(stableSegment?.attractions?.length || stableSegment?.recommendedStops?.length || stableSegment?.stops?.length)
    },
    fixApplied: 'ENSURE_ATTRACTIONS_VISIBLE'
  });

  if (!stableSegment) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">
          Error: Unable to render day segment card - invalid segment data
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary context={`DaySegmentCard-Day${stableSegment.day}`}>
      <div className="bg-white rounded-xl shadow-md border border-route66-border hover:shadow-lg transition-shadow duration-300">
        {/* Header */}
        <DaySegmentCardHeader 
          segment={stableSegment} 
          tripStartDate={tripStartDate}
          cardIndex={cardIndex}
        />

        {/* Weather Section - Only show if showWeather is true */}
        {showWeather && (
          <div className="px-6 py-4 bg-route66-background-alt border-t border-route66-border">
            <ErrorBoundary context={`DaySegmentCardWeather-Day${stableSegment.day}`}>
              <SegmentWeatherWidget
                segment={stableSegment}
                tripStartDate={tripStartDate}
                cardIndex={cardIndex}
                tripId={tripId}
                sectionKey={sectionKey}
                forceExpanded={false}
                isCollapsible={true}
              />
            </ErrorBoundary>
          </div>
        )}

        {/* Main Content with Route & Attractions */}
        <div className="px-6 py-4">
          <DaySegmentCardContent
            segment={stableSegment}
            tripStartDate={tripStartDate}
            driveTimeStyle={driveTimeStyle}
            cardIndex={cardIndex}
            tripId={tripId}
            sectionKey={sectionKey}
            forceShowAttractions={forceShowAttractions}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DaySegmentCard;
