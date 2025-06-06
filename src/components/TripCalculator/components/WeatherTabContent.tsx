
import React from 'react';
import { Cloud } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import CollapsibleWeatherCard from './weather/CollapsibleWeatherCard';
import ErrorBoundary from './ErrorBoundary';

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
  if (!isVisible) {
    return null;
  }

  if (!tripStartDate) {
    return (
      <div className="space-y-4">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
            Daily Weather Forecast
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
          Daily Weather Forecast
        </h4>
      </div>

      {segments.map((segment, index) => {
        console.log(`🌤️ Rendering weather segment ${index + 1}:`, { day: segment.day, endCity: segment.endCity });
        return (
          <ErrorBoundary key={`weather-segment-${segment.day}-${segment.endCity}-${index}`} context={`WeatherTab-Segment-${index}`}>
            <CollapsibleWeatherCard
              segment={segment}
              tripStartDate={tripStartDate}
              cardIndex={index}
              tripId={tripId}
              sectionKey="weather-tab"
              defaultExpanded={false}
            />
          </ErrorBoundary>
        );
      })}
    </div>
  );
};

export default WeatherTabContent;
