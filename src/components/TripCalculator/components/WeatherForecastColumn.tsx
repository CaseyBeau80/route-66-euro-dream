
import React from 'react';
import { Cloud } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useStableSegments } from '../hooks/useStableSegments';
import SegmentWeatherWidget from './SegmentWeatherWidget';
import ErrorBoundary from './ErrorBoundary';

interface WeatherForecastColumnProps {
  segments: DailySegment[];
  tripStartDate?: Date | string;
  tripId?: string;
}

const WeatherForecastColumn: React.FC<WeatherForecastColumnProps> = ({
  segments,
  tripStartDate,
  tripId
}) => {
  // 🚨 FORCE LOG: WeatherForecastColumn component entry
  console.log('🚨 FORCE LOG: WeatherForecastColumn COMPONENT ENTRY', {
    segments: segments?.length || 0,
    tripStartDate: tripStartDate ? (tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString()) : 'NULL',
    tripId,
    timestamp: new Date().toISOString()
  });

  const stableSegments = useStableSegments(segments);

  // 🚨 FORCE LOG: Stable segments result
  console.log('🚨 FORCE LOG: STABLE SEGMENTS RESULT', {
    originalCount: segments?.length || 0,
    stableCount: stableSegments?.length || 0,
    stableSegments: stableSegments?.map((s, i) => ({ index: i, day: s.day, endCity: s.endCity })) || []
  });

  // 🚨 PLAN IMPLEMENTATION: Explicit segment enumeration logging
  console.log('🔍 [PLAN] WeatherForecastColumn - SEGMENT ENUMERATION:', {
    rawSegments: segments?.map((s, i) => ({ index: i, day: s.day, endCity: s.endCity })) || [],
    stableSegments: stableSegments?.map((s, i) => ({ index: i, day: s.day, endCity: s.endCity })) || [],
    segmentCount: stableSegments.length,
    tripStartDate: tripStartDate ? (tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString()) : 'NULL',
    tripId
  });

  // 🚨 PLAN IMPLEMENTATION: Day 1 specific logging
  const day1Segment = stableSegments.find(s => s.day === 1);
  if (day1Segment) {
    console.log('🎯 [PLAN] DAY 1 SEGMENT FOUND in WeatherForecastColumn:', {
      day: day1Segment.day,
      endCity: day1Segment.endCity,
      title: day1Segment.title,
      hasSegment: true,
      segmentData: day1Segment
    });
  } else {
    console.error('❌ [PLAN] DAY 1 SEGMENT MISSING from WeatherForecastColumn segments!', {
      availableDays: stableSegments.map(s => s.day),
      segmentCount: stableSegments.length
    });
  }

  // Validate and convert tripStartDate to Date object
  const validTripStartDate = React.useMemo(() => {
    // 🚨 PLAN IMPLEMENTATION: Trip date propagation validation
    console.log('🗓️ [PLAN] Trip date validation in WeatherForecastColumn:', {
      originalTripStartDate: tripStartDate,
      tripStartDateType: typeof tripStartDate,
      isDate: tripStartDate instanceof Date,
      isString: typeof tripStartDate === 'string'
    });

    if (!tripStartDate) {
      console.log('🗓️ [PLAN] No tripStartDate provided to WeatherForecastColumn');
      return null;
    }
    
    try {
      if (tripStartDate instanceof Date) {
        if (isNaN(tripStartDate.getTime())) {
          console.error('❌ WeatherForecastColumn: Invalid Date object provided', tripStartDate);
          return null;
        }
        console.log('✅ [PLAN] Valid Date object confirmed in WeatherForecastColumn:', tripStartDate.toISOString());
        return tripStartDate;
      } else if (typeof tripStartDate === 'string') {
        const parsed = new Date(tripStartDate);
        if (isNaN(parsed.getTime())) {
          console.error('❌ WeatherForecastColumn: Invalid date string provided', tripStartDate);
          return null;
        }
        console.log('✅ [PLAN] Valid date string converted in WeatherForecastColumn:', parsed.toISOString());
        return parsed;
      } else {
        console.error('❌ WeatherForecastColumn: tripStartDate is not a Date or string', { tripStartDate, type: typeof tripStartDate });
        return null;
      }
    } catch (error) {
      console.error('❌ WeatherForecastColumn: Error validating tripStartDate:', error, tripStartDate);
      return null;
    }
  }, [tripStartDate]);

  console.log('🌤️ WeatherForecastColumn render:', {
    segmentsCount: stableSegments.length,
    tripStartDate: validTripStartDate?.toISOString(),
    originalTripStartDate: tripStartDate
  });

  if (!validTripStartDate) {
    // 🚨 FORCE LOG: Early return due to no valid trip start date
    console.log('🚨 FORCE LOG: WeatherForecastColumn EARLY RETURN - No valid trip start date', {
      originalTripStartDate: tripStartDate,
      validTripStartDate,
      timestamp: new Date().toISOString()
    });
    
    return (
      <>
        {/* Subtle Column Label */}
        <div className="mb-3">
          <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
            Weather Forecast
          </h4>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 text-center min-h-[200px] flex flex-col justify-center">
          <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h5 className="text-lg font-semibold text-gray-600 mb-2">
            Weather Forecast
          </h5>
          <p className="text-gray-500 text-sm">
            Set a trip start date to see weather forecasts for your journey
          </p>
        </div>
      </>
    );
  }

  // 🚨 FORCE LOG: About to enter the segments map loop
  console.log('🚨 FORCE LOG: ENTERING SEGMENTS MAP LOOP', {
    segmentCount: stableSegments.length,
    validTripStartDate: validTripStartDate.toISOString(),
    segments: stableSegments.map(s => ({ day: s.day, endCity: s.endCity })),
    timestamp: new Date().toISOString()
  });

  return (
    <>
      {/* Subtle Column Label */}
      <div className="mb-3">
        <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
          Weather Forecast
        </h4>
      </div>
      
      {/* Day Cards */}
      <div className="space-y-4">
        {stableSegments.map((segment, index) => {
          // 🚨 FORCE LOG: INSIDE MAP LOOP - Processing each segment
          console.log(`🚨 FORCE LOG: MAP LOOP ITERATION ${index + 1}/${stableSegments.length}`, {
            segmentIndex: index,
            day: segment.day,
            endCity: segment.endCity,
            isDay1: segment.day === 1,
            timestamp: new Date().toISOString()
          });

          // 🚨 PLAN IMPLEMENTATION: Segment visibility confirmation
          console.log(`🔍 [PLAN] Processing segment ${index + 1}/${stableSegments.length} - Day ${segment.day}:`, {
            segmentIndex: index,
            day: segment.day,
            endCity: segment.endCity,
            willRender: true,
            isDay1: segment.day === 1
          });

          let segmentDate: Date | null = null;
          
          try {
            segmentDate = addDays(validTripStartDate, segment.day - 1);
            
            // 🚨 PLAN IMPLEMENTATION: Day 1 specific date calculation logging
            if (segment.day === 1) {
              console.log('🗓️ [PLAN] DAY 1 DATE CALCULATION:', {
                tripStartDate: validTripStartDate.toISOString(),
                segmentDay: segment.day,
                calculatedDate: segmentDate.toISOString(),
                daysToAdd: segment.day - 1,
                isValid: !isNaN(segmentDate.getTime())
              });
            }
            
            if (isNaN(segmentDate.getTime())) {
              console.error('❌ WeatherForecastColumn: Invalid calculated date for segment', { 
                segment: segment.day, 
                startDate: validTripStartDate.toISOString() 
              });
              segmentDate = null;
            }
          } catch (error) {
            console.error('❌ WeatherForecastColumn: Error calculating segment date:', error, { 
              segment: segment.day, 
              startDate: validTripStartDate 
            });
            segmentDate = null;
          }
          
          // 🚨 PLAN IMPLEMENTATION: Segment data integrity verification
          if (segment.day === 1) {
            console.log('🔍 [PLAN] DAY 1 SEGMENT DATA INTEGRITY CHECK:', {
              hasSegment: !!segment,
              hasEndCity: !!segment.endCity,
              hasValidDate: !!segmentDate,
              segmentTitle: segment.title,
              allSegmentKeys: Object.keys(segment),
              segmentComplete: !!(segment && segment.endCity && segmentDate)
            });
          }

          // 🚨 PLAN IMPLEMENTATION: SegmentWeatherWidget instantiation logging before JSX
          if (segment.day === 1) {
            console.log('🚀 [PLAN] About to render SegmentWeatherWidget for DAY 1:', {
              segment: { day: segment.day, endCity: segment.endCity },
              tripStartDate: validTripStartDate.toISOString(),
              segmentDate: segmentDate?.toISOString(),
              cardIndex: index,
              tripId,
              sectionKey: 'weather-column'
            });
          }

          // 🚨 FORCE LOG: About to render SegmentWeatherWidget for ANY segment
          console.log(`🚨 FORCE LOG: About to render SegmentWeatherWidget for Day ${segment.day}`, {
            segment: { day: segment.day, endCity: segment.endCity },
            tripStartDate: validTripStartDate.toISOString(),
            segmentDate: segmentDate?.toISOString(),
            cardIndex: index,
            tripId,
            sectionKey: 'weather-column',
            timestamp: new Date().toISOString()
          });
          
          return (
            <ErrorBoundary key={`weather-segment-${segment.day}-${index}`} context={`WeatherForecastColumn-Segment-${index}`}>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow min-h-[200px]">
                {/* Consistent Header Format: Day X • City Name */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-route66-primary bg-route66-accent-light px-2 py-1 rounded">
                        Day {segment.day}
                      </span>
                      <span className="text-gray-300">•</span>
                      <h5 className="text-sm font-semibold text-route66-text-primary">
                        {segment.endCity}
                      </h5>
                    </div>
                    {segmentDate && (
                      <span className="text-xs text-gray-500">
                        {format(segmentDate, 'EEE, MMM d')}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Weather Content */}
                <div className="p-4">
                  <SegmentWeatherWidget
                    segment={segment}
                    tripStartDate={validTripStartDate}
                    cardIndex={index}
                    tripId={tripId}
                    sectionKey="weather-column"
                    forceExpanded={true}
                  />
                </div>
              </div>
            </ErrorBoundary>
          );
        })}
      </div>
    </>
  );
};

export default WeatherForecastColumn;
