
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
    // Safe access to day property with fallback
    const segmentDay = stableSegment?.day ?? (segment?.day ?? 'Unknown');
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

  // Memoized drive time styling to prevent recalculation
  const driveTimeStyle = React.useMemo(() => {
    if (!stableSegment.driveTimeCategory) return { 
      bg: 'bg-gray-100', 
      text: 'text-gray-700', 
      border: 'border-gray-300' 
    };
    
    try {
      switch (stableSegment.driveTimeCategory.category) {
        case 'short':
          return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
        case 'optimal':
          return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
        case 'long':
          return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' };
        case 'extreme':
          return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
        default:
          return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
      }
    } catch (error) {
      console.error('❌ Error getting drive time style:', error);
      return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
    }
  }, [stableSegment.driveTimeCategory]);

  // Memoized drive time formatting
  const formattedDriveTime = React.useMemo(() => {
    try {
      const hours = stableSegment.driveTimeHours;
      if (typeof hours !== 'number' || isNaN(hours) || hours < 0) {
        return '0h';
      }
      
      if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes}m`;
      }
      const wholeHours = Math.floor(hours);
      const minutes = Math.round((hours - wholeHours) * 60);
      return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
    } catch (error) {
      console.error('❌ Error formatting drive time:', error);
      return '0h';
    }
  }, [stableSegment.driveTimeHours]);

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
          />
        </EnhancedCollapsibleCard>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default DaySegmentCard;
