
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock, MapPin, Route, AlertTriangle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useUnits } from '@/contexts/UnitContext';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { DataValidationService } from '../services/validation/DataValidationService';
import { useStableSegment } from '../hooks/useStableSegments';
import { useStableDate } from '../hooks/useStableDate';
import SegmentStats from './SegmentStats';
import SegmentRouteProgression from './SegmentRouteProgression';
import SegmentRecommendedStops from './SegmentRecommendedStops';
import EnhancedCollapsibleCard from './EnhancedCollapsibleCard';
import DebugStopSelection from './DebugStopSelection';
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
  const { formatDistance } = useUnits();
  
  // Use stable segment to prevent cascading re-renders
  const stableSegment = useStableSegment(segment);
  
  // Early return for invalid segments
  if (!DataValidationService.validateDailySegment(stableSegment, 'DaySegmentCard.segment')) {
    const segmentDay = typeof stableSegment === 'object' && stableSegment && 'day' in stableSegment ? stableSegment.day : 'Unknown';
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
  
  console.log('🗓️ DaySegmentCard render:', stableSegment.title, 'FORCE COLLAPSED');

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
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <Badge variant="outline" className="text-xs font-medium border-route66-border">
              Day {stableSegment.day}
            </Badge>
            {segmentDate && (
              <div className="flex items-center gap-1 text-xs text-route66-text-secondary">
                <Calendar className="h-3 w-3" />
                {format(segmentDate, 'EEE, MMM d')}
              </div>
            )}
          </div>
          <div className="font-route66 text-lg text-route66-text-primary font-semibold truncate">
            {stableSegment.startCity} → {stableSegment.endCity}
          </div>
        </div>
        
        {/* Right-aligned tags */}
        <div className="flex items-center gap-2 ml-4">
          {stableSegment.routeSection && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge 
                    variant="outline" 
                    className="text-xs border-route66-accent-light text-route66-text-secondary"
                  >
                    {stableSegment.routeSection}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Route section on historic Route 66</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Drive Time Status Pill */}
          {stableSegment.driveTimeCategory && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${driveTimeStyle.bg} ${driveTimeStyle.text} ${driveTimeStyle.border}`}>
                    <Clock className="h-3 w-3" />
                    <span className="capitalize">{stableSegment.driveTimeCategory.category}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{stableSegment.driveTimeCategory.message}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Compact Stats Row */}
      <div className="flex items-center gap-4 text-sm text-route66-text-secondary">
        <div className="flex items-center gap-1">
          <Route className="h-4 w-4" />
          <span>{formatDistance(segmentDistance)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span className={stableSegment.driveTimeHours > 7 ? driveTimeStyle.text : ''}>
            {formattedDriveTime} driving
          </span>
        </div>
        {stableSegment.driveTimeHours > 7 && (
          <div className="flex items-center gap-1 text-orange-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium">Long Drive Day</span>
          </div>
        )}
      </div>
    </div>
  ), [stableSegment, segmentDate, driveTimeStyle, formatDistance, segmentDistance, formattedDriveTime]);

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
          <div className="space-y-4">
            {/* Drive Time Message - Compact */}
            {stableSegment.driveTimeCategory && stableSegment.driveTimeHours > 6 && (
              <div className={`p-3 rounded-lg border text-sm ${driveTimeStyle.bg} ${driveTimeStyle.border}`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 ${driveTimeStyle.text}`} />
                  <div>
                    <div className={`font-medium text-sm ${driveTimeStyle.text}`}>
                      {stableSegment.driveTimeCategory.category.charAt(0).toUpperCase() + stableSegment.driveTimeCategory.category.slice(1)} Drive Day
                    </div>
                    <div className={`text-xs mt-1 ${driveTimeStyle.text}`}>
                      {stableSegment.driveTimeCategory.message}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommended Stops */}
            <ErrorBoundary context={`SegmentRecommendedStops-Day${stableSegment.day}`}>
              <SegmentRecommendedStops segment={stableSegment} />
            </ErrorBoundary>

            {/* Debug Component - Only in Development */}
            {process.env.NODE_ENV === 'development' && (
              <ErrorBoundary context={`DebugStopSelection-Day${stableSegment.day}`}>
                <DebugStopSelection segment={stableSegment} />
              </ErrorBoundary>
            )}

            {/* Route Progression */}
            <ErrorBoundary context={`SegmentRouteProgression-Day${stableSegment.day}`}>
              <SegmentRouteProgression segment={stableSegment} />
            </ErrorBoundary>
          </div>
        </EnhancedCollapsibleCard>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default DaySegmentCard;
