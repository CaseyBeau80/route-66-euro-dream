
import React from 'react';
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
  isCollapsible?: boolean;
}

const SegmentWeatherWidget: React.FC<SegmentWeatherWidgetProps> = ({ 
  segment, 
  tripStartDate,
  cardIndex = 0,
  tripId,
  sectionKey = 'weather',
  forceExpanded = false,
  isCollapsible = false
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

  console.log(`🌤️ SegmentWeatherWidget: Rendering for ${segment.endCity} (Day ${segment.day})`, {
    hasApiKey,
    segmentDate: segmentDate?.toISOString(),
    daysFromNow,
    forceExpanded,
    isCollapsible,
    sectionKey
  });

  const weatherState = useSegmentWeatherState(segment.endCity, segment.day);
  const weatherHandlers = useSegmentWeather({
    segmentEndCity: segment.endCity,
    hasApiKey,
    segmentDate,
    ...weatherState
  });

  return (
    <div className={`space-y-3 ${isCollapsible ? 'bg-gray-50 rounded-lg p-3' : ''}`}>
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
  );
};

export default SegmentWeatherWidget;
