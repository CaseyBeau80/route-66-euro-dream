
import React from 'react';
import { Cloud } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { useSegmentWeatherState } from './weather/hooks/useSegmentWeatherState';
import { useSegmentWeather } from './weather/hooks/useSegmentWeather';
import SegmentWeatherContent from './weather/SegmentWeatherContent';

interface SegmentWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
  forceExpanded?: boolean;
}

const SegmentWeatherWidget: React.FC<SegmentWeatherWidgetProps> = ({ 
  segment, 
  tripStartDate,
  cardIndex = 0,
  tripId,
  sectionKey = 'weather',
  forceExpanded = false
}) => {
  const weatherService = EnhancedWeatherService.getInstance();
  const hasApiKey = weatherService.hasApiKey();

  // Calculate the actual date for this segment
  const segmentDate = tripStartDate 
    ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000) 
    : null;
  
  const daysFromNow = segmentDate 
    ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) 
    : null;

  console.log(`🌤️ SegmentWeatherWidget: Integrated rendering for ${segment.endCity} (Day ${segment.day})`, {
    hasApiKey,
    segmentDate: segmentDate?.toISOString(),
    daysFromNow,
    forceExpanded
  });

  const weatherState = useSegmentWeatherState(segment.endCity, segment.day);
  const weatherHandlers = useSegmentWeather({
    segmentEndCity: segment.endCity,
    hasApiKey,
    segmentDate,
    ...weatherState
  });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Cloud className="h-5 w-5 text-blue-600" />
          <h4 className="font-travel font-bold text-route66-vintage-brown">
            Weather in {segment.endCity}
          </h4>
        </div>
        
        <SegmentWeatherContent
          hasApiKey={hasApiKey}
          loading={weatherState.loading}
          weather={weatherState.weather}
          error={weatherState.error}
          retryCount={weatherState.retryCount}
          segmentEndCity={segment.endCity}
          segmentDate={segmentDate}
          onApiKeySet={weatherHandlers.handleApiKeySet}
          onTimeout={weatherHandlers.handleTimeout}
          onRetry={weatherHandlers.handleRetry}
        />
      </div>
    </div>
  );
};

export default SegmentWeatherWidget;
