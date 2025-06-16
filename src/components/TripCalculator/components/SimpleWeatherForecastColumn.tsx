
import React from 'react';
import { Cloud } from 'lucide-react';
import { format } from 'date-fns';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useStableSegments } from '../hooks/useStableSegments';
import { UnifiedDateService } from '../services/UnifiedDateService';
import EnhancedWeatherWidget from './weather/EnhancedWeatherWidget';
import TestWeatherComponent from './weather/TestWeatherComponent';
import ErrorBoundary from './ErrorBoundary';

interface SimpleWeatherForecastColumnProps {
  segments: DailySegment[];
  tripStartDate?: Date | string;
  tripId?: string;
}

const SimpleWeatherForecastColumn: React.FC<SimpleWeatherForecastColumnProps> = ({
  segments,
  tripStartDate,
  tripId
}) => {
  console.log('🚀 SimpleWeatherForecastColumn UNIFIED RENDER:', {
    segments: segments?.length || 0,
    tripStartDate: tripStartDate ? (tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString()) : 'NULL',
    tripId,
    timestamp: new Date().toISOString(),
    usingUnifiedDateService: true
  });

  const stableSegments = useStableSegments(segments);

  // Validate and convert tripStartDate to Date object using UnifiedDateService
  const validTripStartDate = React.useMemo(() => {
    if (!tripStartDate) {
      console.log('🗓️ SimpleWeatherForecastColumn: No tripStartDate provided');
      return null;
    }
    
    try {
      if (tripStartDate instanceof Date) {
        if (isNaN(tripStartDate.getTime())) {
          console.error('❌ SimpleWeatherForecastColumn: Invalid Date object', tripStartDate);
          return null;
        }
        // Normalize using UnifiedDateService
        return UnifiedDateService.normalizeToLocalMidnight(tripStartDate);
      } else if (typeof tripStartDate === 'string') {
        const parsed = new Date(tripStartDate);
        if (isNaN(parsed.getTime())) {
          console.error('❌ SimpleWeatherForecastColumn: Invalid date string', tripStartDate);
          return null;
        }
        // Normalize using UnifiedDateService
        return UnifiedDateService.normalizeToLocalMidnight(parsed);
      } else {
        console.error('❌ SimpleWeatherForecastColumn: Invalid tripStartDate type', { tripStartDate, type: typeof tripStartDate });
        return null;
      }
    } catch (error) {
      console.error('❌ SimpleWeatherForecastColumn: Error validating tripStartDate:', error);
      return null;
    }
  }, [tripStartDate]);

  if (!validTripStartDate) {
    return (
      <>
        {/* Column Label */}
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

  return (
    <>
      {/* Column Label */}
      <div className="mb-3">
        <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
          Unified Weather Forecast
        </h4>
      </div>
      
      {/* Test Component in Development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4">
          <TestWeatherComponent />
        </div>
      )}
      
      {/* Day Cards */}
      <div className="space-y-4">
        {stableSegments.map((segment, index) => {
          let segmentDate: Date | null = null;
          
          try {
            // Use UnifiedDateService for all date calculations
            segmentDate = UnifiedDateService.calculateSegmentDate(validTripStartDate, segment.day);
            
            console.log('🗓️ UNIFIED: SimpleWeatherForecastColumn segment date calculation:', {
              segment: segment.day,
              tripStartDate: validTripStartDate.toISOString(),
              tripStartDateLocal: validTripStartDate.toLocaleDateString(),
              calculatedDate: segmentDate?.toISOString(),
              calculatedDateLocal: segmentDate?.toLocaleDateString(),
              cityName: segment.endCity,
              usingUnifiedService: true
            });
            
            if (!segmentDate || isNaN(segmentDate.getTime())) {
              console.error('❌ Invalid calculated date for segment', { 
                segment: segment.day, 
                startDate: validTripStartDate.toISOString() 
              });
              segmentDate = null;
            }
          } catch (error) {
            console.error('❌ Error calculating segment date:', error);
            segmentDate = null;
          }
          
          return (
            <ErrorBoundary key={`unified-weather-segment-${segment.day}-${index}`} context={`UnifiedWeatherColumn-Segment-${index}`}>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow min-h-[200px]">
                {/* Header */}
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
                
                {/* Unified Weather Content */}
                <div className="p-4">
                  <EnhancedWeatherWidget
                    segment={segment}
                    tripStartDate={validTripStartDate}
                    isSharedView={false}
                    isPDFExport={false}
                    forceRefresh={false}
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

export default SimpleWeatherForecastColumn;
