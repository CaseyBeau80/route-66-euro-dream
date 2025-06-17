
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { Clock } from 'lucide-react';
import { UnifiedDateService } from '../services/UnifiedDateService';
import EnhancedWeatherWidget from './weather/EnhancedWeatherWidget';
import PreviewDayHeader from './preview/PreviewDayHeader';
import PreviewDayDistance from './preview/PreviewDayDistance';
import PreviewDayRoute from './preview/PreviewDayRoute';
import PreviewDayAttractions from './preview/PreviewDayAttractions';

interface PreviewDayCardProps {
  segment: DailySegment;
  dayIndex: number;
  tripStartDate?: Date;
  isLast: boolean;
}

const PreviewDayCard: React.FC<PreviewDayCardProps> = ({
  segment,
  dayIndex,
  tripStartDate,
  isLast
}) => {
  // UNIFIED: Use UnifiedDateService for consistent date calculation
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return undefined;
    
    console.log('🗓️ UNIFIED: PreviewDayCard date calculation:', {
      tripStartDate: tripStartDate.toISOString(),
      tripStartDateLocal: tripStartDate.toLocaleDateString(),
      segmentDay: segment.day,
      dayIndex,
      service: 'UnifiedDateService - CONSISTENT',
      previousIssue: 'Multiple date services causing inconsistency - FIXED'
    });
    
    // Use the unified date calculation service
    const calculatedDate = UnifiedDateService.calculateSegmentDate(tripStartDate, segment.day);
    
    console.log('🗓️ UNIFIED: PreviewDayCard calculated date:', {
      segmentDay: segment.day,
      calculatedDate: calculatedDate.toISOString(),
      calculatedDateLocal: calculatedDate.toLocaleDateString(),
      verification: segment.day === 1 ? {
        day1Check: 'Day 1 should match trip start date exactly',
        tripStartLocal: tripStartDate.toLocaleDateString(),
        calculatedLocal: calculatedDate.toLocaleDateString(),
        matches: UnifiedDateService.isSameDate(tripStartDate, calculatedDate)
      } : null,
      usingUnifiedService: true
    });
    
    return calculatedDate;
  }, [tripStartDate, segment.day, dayIndex]);

  // V2 FIX: Trust the segment drive time - it's already been validated and enforced
  const driveTime = React.useMemo(() => {
    console.log(`✅ V2 UI: Using pre-validated drive time for Day ${segment.day}:`, {
      segmentDriveTimeHours: segment.driveTimeHours,
      segmentDistance: segment.distance,
      segmentEndCity: segment.endCity,
      alreadyValidated: true,
      source: 'TripPlanningServiceV2 - Pre-validated'
    });

    // Use the segment's drive time directly - it's already been validated
    const validatedDriveTime = segment.driveTimeHours;
    
    console.log(`✅ V2 UI: Using validated drive time for Day ${segment.day}: ${validatedDriveTime.toFixed(1)}h`);
    
    return validatedDriveTime;
  }, [segment.driveTimeHours, segment.day]);

  return (
    <div className={`group relative bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${!isLast ? 'mb-8' : ''}`}>
      {/* Decorative gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute inset-[1px] bg-white rounded-2xl"></div>
      
      {/* Content container */}
      <div className="relative z-10 p-8">
        {/* Header with day and date */}
        <div className="flex items-center justify-between mb-6">
          <PreviewDayHeader day={segment.day} segmentDate={segmentDate} />
          <PreviewDayDistance distance={segment.distance} driveTime={driveTime} />
        </div>

        {/* Route info */}
        <PreviewDayRoute 
          startCity={segment.startCity} 
          endCity={segment.endCity} 
          distance={segment.distance} 
        />

        {/* Drive time warning if present */}
        {segment.driveTimeWarning && (
          <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-700">
                <strong>Drive Time Notice:</strong> {segment.driveTimeWarning}
              </div>
            </div>
          </div>
        )}

        {/* Unified Weather Widget */}
        {tripStartDate && segmentDate && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Weather in {segment.endCity}
            </h4>
            <EnhancedWeatherWidget
              segment={segment}
              tripStartDate={tripStartDate}
              isSharedView={false}
              isPDFExport={false}
              forceRefresh={false}
            />
          </div>
        )}

        {/* Attractions */}
        <PreviewDayAttractions segment={segment} />

        {/* Connecting line to next day */}
        {!isLast && (
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-transparent"></div>
        )}
      </div>
    </div>
  );
};

export default PreviewDayCard;
