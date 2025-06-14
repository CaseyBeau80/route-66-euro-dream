
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
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const SegmentWeatherWidget: React.FC<SegmentWeatherWidgetProps> = ({ 
  segment, 
  tripStartDate,
  cardIndex = 0,
  tripId,
  sectionKey = 'weather',
  forceExpanded = false,
  isCollapsible = false,
  isSharedView = false,
  isPDFExport = false
}) => {
  console.log(`🔧 PLAN: SegmentWeatherWidget enhanced implementation for Day ${segment.day} - ${segment.endCity}`, {
    isSharedView,
    isPDFExport,
    hasValidStartDate: !!tripStartDate,
    segmentDay: segment.day,
    planImplementation: 'enhanced_widget_flow'
  });

  // Use the focused API key hook
  const { hasApiKey, refreshApiKey } = useWeatherApiKey(segment.endCity);
  
  // Calculate segment date using normalized service
  const segmentDate = React.useMemo(() => {
    console.log(`🔧 PLAN: Enhanced date calculation for Day ${segment.day} - ${segment.endCity}`, {
      tripStartDate: tripStartDate ? (tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString()) : 'NULL',
      segmentDay: segment.day,
      isSharedView,
      planImplementation: 'enhanced_date_calculation'
    });

    if (!tripStartDate) {
      console.log(`🔧 PLAN: No tripStartDate for Day ${segment.day} - ${segment.endCity}`);
      return null;
    }
    
    const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
    
    console.log(`🔧 PLAN: Date result for Day ${segment.day} - ${segment.endCity}`, {
      calculatedDate: calculatedDate?.toISOString(),
      isValid: calculatedDate instanceof Date && !isNaN(calculatedDate.getTime()),
      isSharedView,
      planImplementation: 'date_validation'
    });
    
    return calculatedDate;
  }, [tripStartDate, segment.day, segment.endCity]);

  // Use weather state and handlers
  const weatherState = useSegmentWeatherState(segment.endCity, segment.day);
  
  const weatherHandlers = useSegmentWeather({
    segmentEndCity: segment.endCity,
    hasApiKey,
    segmentDate,
    weather: weatherState.weather,
    loading: weatherState.loading,
    error: weatherState.error,
    retryCount: weatherState.retryCount,
    setWeather: weatherState.setWeather,
    setLoading: weatherState.setLoading,
    setError: weatherState.setError,
    setRetryCount: weatherState.incrementRetry
  });

  // PLAN IMPLEMENTATION: Enhanced shared view weather fetching
  React.useEffect(() => {
    if (isSharedView && hasApiKey && segmentDate && !weatherState.weather && !weatherState.loading) {
      console.log(`🔧 PLAN: Enhanced shared view weather fetch for Day ${segment.day} - ${segment.endCity}`, {
        hasApiKey,
        hasSegmentDate: !!segmentDate,
        hasWeather: !!weatherState.weather,
        isLoading: weatherState.loading,
        planImplementation: 'enhanced_shared_view_fetch'
      });
      weatherHandlers.handleRetry();
    }
  }, [isSharedView, hasApiKey, segmentDate, weatherState.weather, weatherState.loading, segment.endCity, segment.day]);

  const handleApiKeySet = React.useCallback(() => {
    console.log(`🔧 PLAN: Enhanced handleApiKeySet for Day ${segment.day} - ${segment.endCity}`);
    refreshApiKey();
    weatherHandlers.handleApiKeySet();
  }, [refreshApiKey, weatherHandlers, segment.endCity, segment.day]);

  // PLAN IMPLEMENTATION: Enhanced weather ready marking with debug info
  React.useEffect(() => {
    if (weatherState.weather && !weatherState.loading && segmentDate) {
      console.log(`🔧 PLAN: Enhanced weather ready marking for Day ${segment.day} - ${segment.endCity}`, {
        weatherData: {
          temperature: weatherState.weather.temperature,
          highTemp: weatherState.weather.highTemp,
          lowTemp: weatherState.weather.lowTemp,
          isActualForecast: weatherState.weather.isActualForecast,
          source: weatherState.weather.source
        },
        isSharedView,
        sectionKey,
        planImplementation: 'enhanced_ready_marking'
      });

      const element = document.querySelector(`[data-segment-day="${segment.day}"]`);
      if (element) {
        element.setAttribute('data-weather-loaded', 'true');
        
        if (sectionKey === 'pdf-export' || isSharedView) {
          element.setAttribute('data-pdf-weather-ready', 'true');
          element.setAttribute('data-weather-date', DateNormalizationService.toDateString(segmentDate));
        }
      }
    }
  }, [weatherState.weather, weatherState.loading, segment.day, sectionKey, segmentDate, segment.endCity, isSharedView]);

  const containerClass = isCollapsible ? 'bg-gray-50 rounded-lg p-3' : '';

  console.log(`🔧 PLAN: Enhanced rendering SegmentWeatherWidget for Day ${segment.day} - ${segment.endCity}`, {
    hasWeather: !!weatherState.weather,
    loading: weatherState.loading,
    hasApiKey,
    hasSegmentDate: !!segmentDate,
    isSharedView,
    error: weatherState.error,
    planImplementation: 'enhanced_final_render'
  });

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
          isSharedView={isSharedView}
          isPDFExport={isPDFExport}
        />
      </div>
    </WeatherErrorBoundary>
  );
};

export default SegmentWeatherWidget;
