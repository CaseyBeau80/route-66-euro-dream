
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
  
  console.log('🗓️ DaySegmentCard render with integrated weather:', stableSegment.title);

  // PREVIEW FORM LOGIC: Calculate drive time using preview form logic
  const getPreviewFormDriveTime = (): string => {
    const miles = stableSegment.approximateMiles || stableSegment.distance || 0;
    const hours = miles / 60; // Same calculation as preview form
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes > 0) {
      return `${wholeHours}h ${minutes}m`;
    }
    return `${wholeHours}h`;
  };

  const drivingTimeHours = (stableSegment.approximateMiles || stableSegment.distance || 0) / 60;

  // Memoized drive time styling to prevent recalculation
  const driveTimeStyle = React.useMemo(() => {
    try {
      if (drivingTimeHours <= 4) {
        return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
      } else if (drivingTimeHours <= 6) {
        return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
      } else if (drivingTimeHours <= 8) {
        return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' };
      } else {
        return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
      }
    } catch (error) {
      console.error('❌ Error getting drive time style:', error);
      return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
    }
  }, [drivingTimeHours]);

  const formattedDriveTime = React.useMemo(() => {
    return getPreviewFormDriveTime();
  }, [stableSegment.approximateMiles, stableSegment.distance]);

  // Memoized segment distance
  const segmentDistance = React.useMemo(() => {
    return stableSegment.distance || stableSegment.approximateMiles;
  }, [stableSegment.distance, stableSegment.approximateMiles]);

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
        formattedDriveTime={formattedDriveTime}
        segmentDistance={segmentDistance}
        driveTimeStyle={driveTimeStyle}
      />
    </div>
  ), [stableSegment, segmentDate, driveTimeStyle, formattedDriveTime, segmentDistance]);

  console.log(`🚗 PREVIEW FORM: DaySegmentCard final render for Day ${stableSegment.day}`, {
    willRenderCard: true,
    hasCardHeader: !!cardHeader,
    previewFormDriveTime: formattedDriveTime,
    actualDriveTimeHours: drivingTimeHours,
    approximateMiles: stableSegment.approximateMiles,
    distance: stableSegment.distance
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
