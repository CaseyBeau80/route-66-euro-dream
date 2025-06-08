
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import DaySegmentCard from './DaySegmentCard';
import ErrorBoundary from './ErrorBoundary';
import { Cloud } from 'lucide-react';

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
  console.log('🌤️ WeatherTabContent render:', {
    isVisible,
    segmentsCount: segments.length,
    tripStartDate: tripStartDate?.toISOString(),
    tripId
  });

  if (!isVisible) {
    return null;
  }

  // If no trip start date is provided, show a message
  if (!tripStartDate) {
    console.log('⚠️ WeatherTabContent: No trip start date provided');
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
          Weather Forecast for Each Day
        </h4>
      </div>
      
      {segments.map((segment, index) => {
        console.log(`🌤️ Rendering weather segment ${index + 1}:`, { 
          day: segment.day, 
          endCity: segment.endCity,
          tripStartDate: tripStartDate.toISOString()
        });
        return (
          <ErrorBoundary key={`weather-segment-${segment.day}-${segment.endCity}-${index}`} context={`WeatherTab-Segment-${index}`}>
            <DaySegmentCard 
              segment={segment}
              tripStartDate={tripStartDate}
              cardIndex={index}
              tripId={tripId}
              sectionKey="weather-tab"
            />
          </ErrorBoundary>
        );
      })}
    </div>
  );
};

export default WeatherTabContent;
