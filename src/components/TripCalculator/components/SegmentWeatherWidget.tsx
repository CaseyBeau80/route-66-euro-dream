
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useSegmentWeatherState } from './weather/hooks/useSegmentWeatherState';
import { useSegmentWeather } from './weather/hooks/useSegmentWeather';
import { useWeatherApiKey } from './weather/hooks/useWeatherApiKey';
import SegmentWeatherContent from './weather/SegmentWeatherContent';
import WeatherErrorBoundary from './weather/WeatherErrorBoundary';
import { DateNormalizationService } from './weather/DateNormalizationService';
import { WeatherDebugService } from './weather/services/WeatherDebugService';

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
  // Use the new focused API key hook
  const { hasApiKey, refreshApiKey } = useWeatherApiKey(segment.endCity);
  
  // Calculate segment date
  const segmentDate = React.useMemo(() => {
    WeatherDebugService.logDateCalculation(
      segment.endCity,
      tripStartDate,
      segment.day,
      null
    );

    if (!tripStartDate) {
      return null;
    }
    
    const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
    
    WeatherDebugService.logDateCalculation(
      segment.endCity,
      tripStartDate,
      segment.day,
      calculatedDate
    );
    
    return calculatedDate;
  }, [tripStartDate, segment.day, segment.endCity]);

  // Use weather state and handlers
  const weatherState = useSegmentWeatherState(segment.endCity, segment.day);
  const weatherHandlers = useSegmentWeather({
    segmentEndCity: segment.endCity,
    hasApiKey,
    segmentDate,
    ...weatherState
  });

  // 🎯 NEW: Add segment render attempt logging
  React.useEffect(() => {
    WeatherDebugService.logSegmentRenderAttempt(segment.endCity, segment.day, {
      weather: weatherState.weather,
      loading: weatherState.loading,
      error: weatherState.error,
      segmentDate,
      hasApiKey,
      sectionKey
    });
  }, [segment.endCity, segment.day, weatherState.weather, weatherState.loading, weatherState.error, segmentDate, hasApiKey, sectionKey]);

  // Debug logging for component state
  WeatherDebugService.logComponentRender('SegmentWeatherWidget', segment.endCity, {
    hasApiKey,
    loading: weatherState.loading,
    hasWeather: !!weatherState.weather,
    error: weatherState.error,
    retryCount: weatherState.retryCount,
    segmentDate: segmentDate?.toISOString(),
    sectionKey
  });

  const handleApiKeySet = React.useCallback(() => {
    WeatherDebugService.logWeatherFlow(`SegmentWeatherWidget.handleApiKeySet [${segment.endCity}]`, {
      day: segment.day,
      previousApiKeyStatus: hasApiKey
    });
    
    refreshApiKey();
    weatherHandlers.handleApiKeySet();
  }, [refreshApiKey, weatherHandlers, segment.endCity, segment.day, hasApiKey]);

  // Mark weather as ready for rendering
  React.useEffect(() => {
    if (weatherState.weather && !weatherState.loading && segmentDate) {
      // 🎯 NEW: Add weather state set logging
      WeatherDebugService.logWeatherStateSet(segment.endCity, weatherState.weather);
      
      const element = document.querySelector(`[data-segment-day="${segment.day}"]`);
      if (element) {
        element.setAttribute('data-weather-loaded', 'true');
        
        if (sectionKey === 'pdf-export') {
          element.setAttribute('data-pdf-weather-ready', 'true');
          element.setAttribute('data-weather-date', DateNormalizationService.toDateString(segmentDate));
        }
      }
    }
  }, [weatherState.weather, weatherState.loading, segment.day, sectionKey, segmentDate, segment.endCity]);

  const containerClass = isCollapsible ? 'bg-gray-50 rounded-lg p-3' : '';

  return (
    <WeatherErrorBoundary 
      segmentEndCity={segment.endCity}
      fallbackMessage={`Weather service error for ${segment.endCity} Day ${segment.day}`}
    >
      <div className={`space-y-3 ${containerClass}`} data-segment-day={segment.day}>
        <SegmentWeatherContent
          hasApiKey={hasApiKey}
          loading={weatherState.loading}
          weather={weatherState.weather}
          error={weatherState.error}
          retryCount={weatherState.retryCount}
          segmentEndCity={segment.endCity}
          segmentDate={segmentDate}
          onApiKeySet={handleApiKeySet}
          onTimeout={weatherHandlers.handleTimeout}
          onRetry={weatherHandlers.handleRetry}
          isSharedView={sectionKey === 'shared-view'}
          isPDFExport={sectionKey === 'pdf-export'}
        />
      </div>
    </WeatherErrorBoundary>
  );
};

export default SegmentWeatherWidget;
