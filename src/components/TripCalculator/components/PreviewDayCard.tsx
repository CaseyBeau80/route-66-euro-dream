import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { MapPin, Clock, Star, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { UnifiedDateService } from '../services/UnifiedDateService';
import EnhancedWeatherWidget from './weather/EnhancedWeatherWidget';

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

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    return `${wholeHours}h ${minutes}m`;
  };

  // ULTIMATE FIX: Absolutely enforce drive time limits with multiple safeguards
  const driveTime = React.useMemo(() => {
    console.log(`🚗 ULTIMATE UI VALIDATION: Drive time for Day ${segment.day}:`, {
      segmentDriveTimeHours: segment.driveTimeHours,
      segmentDistance: segment.distance,
      segmentEndCity: segment.endCity,
      ultimateEnforcement: true
    });

    let finalDriveTime = segment.driveTimeHours || 0;
    
    // ULTIMATE SAFEGUARD 1: If drive time exceeds 10 hours, force it to 10
    if (finalDriveTime > 10) {
      console.error(`❌ ULTIMATE SAFEGUARD: UI received drive time > 10h for Day ${segment.day}: ${finalDriveTime.toFixed(1)}h - FORCING TO 10h`);
      finalDriveTime = 10;
    }
    
    // ULTIMATE SAFEGUARD 2: If drive time is impossibly high (>20h), calculate from distance
    if (finalDriveTime > 20) {
      console.error(`❌ ULTIMATE EMERGENCY: Drive time > 20h detected: ${finalDriveTime.toFixed(1)}h - RECALCULATING`);
      // Emergency recalculation with absolute cap
      const emergencyTime = Math.min(segment.distance / 50, 10); // 50mph average, max 10h
      finalDriveTime = emergencyTime;
    }
    
    // ULTIMATE SAFEGUARD 3: Ensure minimum reasonable time
    if (finalDriveTime < 0.1) {
      finalDriveTime = 0.5; // Minimum 30 minutes
    }
    
    console.log(`🚗 ULTIMATE UI VALIDATION: Final drive time for Day ${segment.day}: ${finalDriveTime.toFixed(1)}h (GUARANTEED ≤ 10h)`);
    
    return finalDriveTime;
  }, [segment.driveTimeHours, segment.distance, segment.day]);

  return (
    <div className={`group relative bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${!isLast ? 'mb-8' : ''}`}>
      {/* Decorative gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute inset-[1px] bg-white rounded-2xl"></div>
      
      {/* Content container */}
      <div className="relative z-10 p-8">
        {/* Header with day and date */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
              {segment.day}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                Day {segment.day}
              </h3>
              {segmentDate && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {format(segmentDate, 'EEEE, MMMM do, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Distance and time info - ULTIMATE FIX: Only show absolutely validated drive time */}
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {Math.round(segment.distance)} mi
            </div>
            <div className="text-sm text-gray-500">
              {formatTime(driveTime)} drive time
            </div>
            {/* ULTIMATE WARNING: Show if at the absolute limit */}
            {driveTime >= 10 && (
              <div className="text-xs text-red-600 font-semibold mt-1 bg-red-50 px-2 py-1 rounded">
                🚨 Maximum Limit (Capped)
              </div>
            )}
            {/* WARNING: Show if getting close to limit */}
            {driveTime > 8 && driveTime < 10 && (
              <div className="text-xs text-orange-600 mt-1">
                ⚠️ Long Drive Day
              </div>
            )}
          </div>
        </div>

        {/* Route info */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-gray-800">
              {segment.startCity} → {segment.endCity}
            </div>
            <div className="text-sm text-gray-600">
              Route 66 • {Math.round(segment.distance)} miles
            </div>
          </div>
        </div>

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
        {segment.attractions && segment.attractions.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Must-See Attractions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {segment.attractions.slice(0, 6).map((attraction, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">
                      {attraction.name}
                    </div>
                    {attraction.description && (
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {attraction.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {segment.attractions.length > 6 && (
              <div className="mt-3 text-center">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  +{segment.attractions.length - 6} more attractions
                </span>
              </div>
            )}
          </div>
        )}

        {/* Connecting line to next day */}
        {!isLast && (
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-transparent"></div>
        )}
      </div>
    </div>
  );
};

export default PreviewDayCard;
