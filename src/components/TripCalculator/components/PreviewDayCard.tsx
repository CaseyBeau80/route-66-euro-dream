
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { MapPin, Clock, Star, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { DateNormalizationService } from './weather/DateNormalizationService';
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
  // CRITICAL FIX: Use DateNormalizationService for consistent date calculation
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return undefined;
    
    console.log('🗓️ CRITICAL FIX: PreviewDayCard date calculation:', {
      tripStartDate: tripStartDate.toISOString(),
      tripStartDateLocal: tripStartDate.toLocaleDateString(),
      segmentDay: segment.day,
      dayIndex,
      oldMethod: 'addDays(tripStartDate, dayIndex) - INCORRECT',
      newMethod: 'DateNormalizationService.calculateSegmentDate - CORRECT'
    });
    
    // Use the centralized date calculation service
    const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
    
    console.log('🗓️ CRITICAL FIX: PreviewDayCard calculated date:', {
      segmentDay: segment.day,
      calculatedDate: calculatedDate.toISOString(),
      calculatedDateLocal: calculatedDate.toLocaleDateString(),
      verification: segment.day === 1 ? {
        day1Check: 'Day 1 should match trip start date exactly',
        tripStartLocal: tripStartDate.toLocaleDateString(),
        calculatedLocal: calculatedDate.toLocaleDateString(),
        matches: tripStartDate.toLocaleDateString() === calculatedDate.toLocaleDateString()
      } : null
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
          
          {/* Distance and time info */}
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {Math.round(segment.distance)} mi
            </div>
            <div className="text-sm text-gray-500">
              {formatTime(segment.distance / 55)} drive time
            </div>
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

        {/* Weather Widget */}
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
