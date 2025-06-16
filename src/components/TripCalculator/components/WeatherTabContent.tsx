
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from './SegmentWeatherWidget';
import ErrorBoundary from './ErrorBoundary';
import { Cloud } from 'lucide-react';
import { UnifiedDateService } from '../services/UnifiedDateService';

interface WeatherTabContentProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  tripId?: string;
  isVisible: boolean;
}

const WeatherTabContent: React.FC<WeatherTabContentProps> = ({
  segments,
  tripStartDate,
  tripId,
  isVisible
}) => {
  console.log('🌤️ UNIFIED WeatherTabContent render:', {
    isVisible,
    segmentsCount: segments.length,
    tripStartDate: tripStartDate?.toISOString(),
    tripStartDateLocal: tripStartDate?.toLocaleDateString(),
    tripId,
    service: 'UnifiedDateService - CONSISTENT WEATHER TAB'
  });

  if (!isVisible) {
    return null;
  }

  // If no trip start date is provided, show a message
  if (!tripStartDate) {
    console.log('⚠️ UNIFIED WeatherTabContent: No trip start date provided');
    return (
      <div className="space-y-4">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
            Weather Forecast for Each Day
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
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-3">
        <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
          Unified Weather Forecast for Each Day
        </h4>
      </div>
      
      {segments.map((segment, index) => {
        // UNIFIED: Calculate the date for this segment using UnifiedDateService
        const segmentDate = UnifiedDateService.calculateSegmentDate(tripStartDate, segment.day);
        
        console.log(`🌤️ UNIFIED: Rendering weather for Day ${segment.day}:`, { 
          endCity: segment.endCity,
          tripStartDate: tripStartDate.toISOString(),
          tripStartDateLocal: tripStartDate.toLocaleDateString(),
          segmentDate: segmentDate.toISOString(),
          segmentDateLocal: segmentDate.toLocaleDateString(),
          verification: segment.day === 1 ? {
            day1Check: 'Day 1 should match trip start exactly',
            matches: UnifiedDateService.isSameDate(tripStartDate, segmentDate)
          } : null,
          service: 'UnifiedDateService'
        });

        return (
          <ErrorBoundary key={`unified-weather-day-${segment.day}-${segment.endCity}`} context={`UnifiedWeatherTab-Day-${segment.day}`}>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="mb-3">
                <h5 className="text-lg font-semibold text-gray-800 mb-1">
                  Day {segment.day}: {segment.endCity}
                </h5>
                <p className="text-sm text-gray-600">
                  {segmentDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  {UnifiedDateService.isToday(segmentDate) && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      TODAY ✨
                    </span>
                  )}
                </p>
              </div>
              
              <SegmentWeatherWidget 
                segment={segment}
                tripStartDate={tripStartDate}
                cardIndex={index}
                tripId={tripId}
                sectionKey="unified-weather-tab"
                forceExpanded={true}
                isCollapsible={false}
              />
            </div>
          </ErrorBoundary>
        );
      })}
    </div>
  );
};

export default WeatherTabContent;
