
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { useSegmentWeatherState } from './weather/hooks/useSegmentWeatherState';
import { useSegmentWeather } from './weather/hooks/useSegmentWeather';
import SegmentWeatherContent from './weather/SegmentWeatherContent';

interface SegmentWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date | string;
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
  
  // Force refresh of API key status to ensure we check localStorage
  React.useEffect(() => {
    weatherService.getApiKey(); // This will refresh the internal state
  }, [weatherService]);
  
  const hasApiKey = weatherService.hasApiKey();

  console.log(`🌤️ SegmentWeatherWidget: Rendering for ${segment.endCity} (Day ${segment.day})`, {
    tripStartDate: tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate,
    tripStartDateType: typeof tripStartDate,
    hasApiKey,
    sectionKey,
    forceExpanded,
    apiKeyDebug: weatherService.getDebugInfo()
  });

  // Calculate the actual date for this segment
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) {
      console.log('🌤️ SegmentWeatherWidget: No tripStartDate provided');
      return null;
    }
    
    try {
      let validStartDate: Date;
      
      if (tripStartDate instanceof Date) {
        if (isNaN(tripStartDate.getTime())) {
          console.error('❌ SegmentWeatherWidget: Invalid Date object provided', tripStartDate);
          return null;
        }
        validStartDate = new Date(tripStartDate);
      } else if (typeof tripStartDate === 'string') {
        validStartDate = new Date(tripStartDate);
        if (isNaN(validStartDate.getTime())) {
          console.error('❌ SegmentWeatherWidget: Invalid date string provided', tripStartDate);
          return null;
        }
      } else {
        console.error('❌ SegmentWeatherWidget: tripStartDate is not a Date or string', { tripStartDate, type: typeof tripStartDate });
        return null;
      }
      
      const calculatedDate = new Date(validStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
      
      if (isNaN(calculatedDate.getTime())) {
        console.error('❌ SegmentWeatherWidget: Calculated date is invalid', { 
          validStartDate: validStartDate.toISOString(), 
          segmentDay: segment.day, 
          calculatedDate 
        });
        return null;
      }
      
      // Check if date is within forecast range (5 days from now)
      const daysFromNow = Math.ceil((calculatedDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      const isWithinForecastRange = daysFromNow >= 0 && daysFromNow <= 5;
      
      console.log('✅ SegmentWeatherWidget: Valid segment date calculated', {
        startDate: validStartDate.toISOString(),
        segmentDay: segment.day,
        calculatedDate: calculatedDate.toISOString(),
        daysFromNow,
        isWithinForecastRange,
        canGetForecast: hasApiKey && isWithinForecastRange
      });
      
      return calculatedDate;
      
    } catch (error) {
      console.error('❌ SegmentWeatherWidget: Error calculating segment date:', error, { tripStartDate, segmentDay: segment.day });
      return null;
    }
  }, [tripStartDate, segment.day, hasApiKey]);

  const weatherState = useSegmentWeatherState(segment.endCity, segment.day);
  const weatherHandlers = useSegmentWeather({
    segmentEndCity: segment.endCity,
    hasApiKey,
    segmentDate,
    ...weatherState
  });

  // Mark this element with weather loaded attribute for PDF export
  React.useEffect(() => {
    if (weatherState.weather && !weatherState.loading) {
      // This helps the PDF export system know when weather data is ready
      const element = document.querySelector(`[data-segment-day="${segment.day}"]`);
      if (element) {
        element.setAttribute('data-weather-loaded', 'true');
      }
    }
  }, [weatherState.weather, weatherState.loading, segment.day]);

  const containerClass = isCollapsible ? 'bg-gray-50 rounded-lg p-3' : '';

  return (
    <div className={`space-y-3 ${containerClass}`} data-segment-day={segment.day}>
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
        isSharedView={sectionKey === 'shared-view'}
      />
    </div>
  );
};

export default SegmentWeatherWidget;
