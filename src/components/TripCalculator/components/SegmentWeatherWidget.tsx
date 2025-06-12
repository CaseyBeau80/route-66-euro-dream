
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
  // 🚨 FORCE LOG: Component instantiation
  console.log(`🚨 FORCE LOG: SegmentWeatherWidget INSTANTIATED for Day ${segment.day} - ${segment.endCity}`, {
    segment: {
      day: segment.day,
      endCity: segment.endCity,
      title: segment.title
    },
    tripStartDate: tripStartDate ? (tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString()) : 'NULL',
    cardIndex,
    tripId,
    sectionKey,
    timestamp: new Date().toISOString(),
    componentMount: true
  });

  // Use the new focused API key hook
  const { hasApiKey, refreshApiKey } = useWeatherApiKey(segment.endCity);
  
  // 🚨 FORCE LOG: API key status
  console.log(`🚨 FORCE LOG: API Key Status for Day ${segment.day} - ${segment.endCity}`, {
    hasApiKey,
    timestamp: new Date().toISOString()
  });

  // Calculate segment date
  const segmentDate = React.useMemo(() => {
    console.log(`🚨 FORCE LOG: Calculating segment date for Day ${segment.day} - ${segment.endCity}`, {
      tripStartDate: tripStartDate ? (tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString()) : 'NULL',
      segmentDay: segment.day,
      hasTripStartDate: !!tripStartDate,
      tripStartDateType: typeof tripStartDate
    });

    WeatherDebugService.logDateCalculation(
      segment.endCity,
      tripStartDate,
      segment.day,
      null
    );

    if (!tripStartDate) {
      console.log(`🚨 FORCE LOG: No tripStartDate for Day ${segment.day} - ${segment.endCity} - EARLY RETURN NULL`);
      return null;
    }
    
    const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
    
    console.log(`🚨 FORCE LOG: Date calculation result for Day ${segment.day} - ${segment.endCity}`, {
      calculatedDate: calculatedDate?.toISOString(),
      isValid: calculatedDate instanceof Date && !isNaN(calculatedDate.getTime())
    });
    
    WeatherDebugService.logDateCalculation(
      segment.endCity,
      tripStartDate,
      segment.day,
      calculatedDate
    );
    
    return calculatedDate;
  }, [tripStartDate, segment.day, segment.endCity]);

  // 🚨 FORCE LOG: Segment date result
  console.log(`🚨 FORCE LOG: Final segmentDate for Day ${segment.day} - ${segment.endCity}`, {
    segmentDate: segmentDate?.toISOString(),
    hasSegmentDate: !!segmentDate,
    timestamp: new Date().toISOString()
  });

  // Use weather state and handlers
  const weatherState = useSegmentWeatherState(segment.endCity, segment.day);
  
  // 🚨 FORCE LOG: Weather state initialization
  console.log(`🚨 FORCE LOG: Weather state initialized for Day ${segment.day} - ${segment.endCity}`, {
    weather: weatherState.weather,
    loading: weatherState.loading,
    error: weatherState.error,
    retryCount: weatherState.retryCount,
    hasWeatherData: !!weatherState.weather,
    timestamp: new Date().toISOString()
  });

  const weatherHandlers = useSegmentWeather({
    segmentEndCity: segment.endCity,
    hasApiKey,
    segmentDate,
    ...weatherState
  });

  // 🚨 FORCE LOG: Weather handlers initialization
  console.log(`🚨 FORCE LOG: Weather handlers initialized for Day ${segment.day} - ${segment.endCity}`, {
    hasHandlers: !!weatherHandlers,
    handlerMethods: Object.keys(weatherHandlers),
    timestamp: new Date().toISOString()
  });

  // 🎯 NEW: Add segment render attempt logging
  React.useEffect(() => {
    console.log(`🚨 FORCE LOG: SegmentWeatherWidget render effect for Day ${segment.day} - ${segment.endCity}`, {
      weather: weatherState.weather,
      loading: weatherState.loading,
      error: weatherState.error,
      segmentDate: segmentDate?.toISOString(),
      hasApiKey,
      sectionKey,
      shouldTriggerWeatherFetch: hasApiKey && segmentDate && !weatherState.weather && !weatherState.loading
    });

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
    console.log(`🚨 FORCE LOG: handleApiKeySet called for Day ${segment.day} - ${segment.endCity}`, {
      previousApiKeyStatus: hasApiKey,
      timestamp: new Date().toISOString()
    });

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
      console.log(`🚨 FORCE LOG: Weather ready for rendering Day ${segment.day} - ${segment.endCity}`, {
        weatherData: {
          temperature: weatherState.weather.temperature,
          highTemp: weatherState.weather.highTemp,
          lowTemp: weatherState.weather.lowTemp,
          isActualForecast: weatherState.weather.isActualForecast
        },
        segmentDate: segmentDate.toISOString(),
        sectionKey,
        timestamp: new Date().toISOString()
      });

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

  // 🚨 FORCE LOG: Component render decision
  console.log(`🚨 FORCE LOG: SegmentWeatherWidget rendering for Day ${segment.day} - ${segment.endCity}`, {
    willRender: true,
    containerClass: isCollapsible ? 'bg-gray-50 rounded-lg p-3' : '',
    timestamp: new Date().toISOString()
  });

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
