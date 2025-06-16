
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { DataValidationService } from '../services/validation/DataValidationService';
import { useStableSegment } from '../hooks/useStableSegments';
import { useStableDate } from '../hooks/useStableDate';
import DaySegmentCardHeader from './DaySegmentCardHeader';
import DaySegmentCardStats from './DaySegmentCardStats';
import DaySegmentCardContent from './DaySegmentCardContent';
import EnhancedCollapsibleCard from './EnhancedCollapsibleCard';
import ErrorBoundary from './ErrorBoundary';
import { GoogleDistanceMatrixService } from '../services/GoogleDistanceMatrixService';

interface DaySegmentCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
}

const DaySegmentCard: React.FC<DaySegmentCardProps> = ({ 
  segment, 
  tripStartDate,
  cardIndex = 0,
  tripId,
  sectionKey = 'itinerary'
}) => {
  // Use stable segment to prevent cascading re-renders
  const stableSegment = useStableSegment(segment);
  
  // Early return for invalid segments with proper type checking
  if (!stableSegment || !DataValidationService.validateDailySegment(stableSegment, 'DaySegmentCard.segment')) {
    const segmentDay = stableSegment?.day ?? (segment?.day ?? 'Unknown');
    console.log(`🚨 DaySegmentCard INVALID SEGMENT for Day ${segmentDay}`);
    return (
      <ErrorBoundary context="DaySegmentCard-Invalid">
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-sm text-red-600">
            Invalid segment data for Day {segmentDay}
          </p>
        </div>
      </ErrorBoundary>
    );
  }
  
  // Use stable date calculation
  const segmentDate = useStableDate(tripStartDate, stableSegment.day);
  
  // Use Google Distance Matrix API data directly from segment
  const apiDriveTimeHours = stableSegment.driveTimeHours || 0;
  const apiDistance = stableSegment.distance || 0;

  console.log(`🗓️ DaySegmentCard Day ${stableSegment.day} with Google API data:`, {
    title: stableSegment.title,
    apiDistance,
    apiDriveTimeHours,
    formattedTime: GoogleDistanceMatrixService.formatDuration(apiDriveTimeHours)
  });

  // Memoized drive time styling based on actual API data
  const driveTimeStyle = React.useMemo(() => {
    try {
      if (apiDriveTimeHours <= 4) {
        return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
      } else if (apiDriveTimeHours <= 6) {
        return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
      } else if (apiDriveTimeHours <= 8) {
        return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' };
      } else {
        return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
      }
    } catch (error) {
      console.error('❌ Error getting drive time style:', error);
      return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
    }
  }, [apiDriveTimeHours]);

  // Card header content with error handling
  const cardHeader = React.useMemo(() => (
    <div className="space-y-3">
      <DaySegmentCardHeader 
        segment={stableSegment}
        segmentDate={segmentDate}
        driveTimeStyle={driveTimeStyle}
      />
      
      <DaySegmentCardStats 
        segment={stableSegment}
      />
    </div>
  ), [stableSegment, segmentDate, driveTimeStyle]);

  console.log(`🚗 DaySegmentCard Final Render Day ${stableSegment.day}:`, {
    willRenderCard: true,
    hasCardHeader: !!cardHeader,
    apiDistance,
    apiDriveTimeHours,
    usingGoogleAPI: true
  });

  return (
    <ErrorBoundary context={`DaySegmentCard-Day${stableSegment.day}`}>
      <TooltipProvider>
        <EnhancedCollapsibleCard
          title={cardHeader}
          defaultExpanded={false}
          className="border border-route66-border shadow-sm hover:shadow-md transition-shadow rounded-lg"
          headerClassName="border-b border-gray-200"
          contentClassName="pt-0"
          cardIndex={cardIndex}
          tripId={tripId}
          sectionKey={sectionKey}
        >
          <DaySegmentCardContent 
            segment={stableSegment}
            tripStartDate={tripStartDate}
            driveTimeStyle={driveTimeStyle}
            cardIndex={cardIndex}
            tripId={tripId}
            sectionKey={sectionKey}
          />
        </EnhancedCollapsibleCard>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default DaySegmentCard;
