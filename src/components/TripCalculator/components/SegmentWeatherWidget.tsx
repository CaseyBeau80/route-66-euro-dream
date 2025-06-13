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
  // PLAN IMPLEMENTATION: Enhanced component instantiation logging
  console.log(`🔧 PLAN: SegmentWeatherWidget INSTANTIATED for Day ${segment.day} - ${segment.endCity}`, {
    segment: {
      day: segment.day,
      endCity: segment.endCity,
      title: segment.title
    },
    tripStartDate: tripStartDate ? (tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString()) : 'NULL',
    cardIndex,
    tripId,
    sectionKey,
    isSharedView,
    isPDFExport,
    timestamp: new Date().toISOString(),
    componentMount: true,
    isDay1: segment.day === 1
  });

  // PLAN IMPLEMENTATION: Day 1 specific instantiation check
  if (segment.day === 1) {
    console.log('🔧 PLAN: *** DAY 1 WIDGET INSTANTIATED ***', {
      endCity: segment.endCity,
      tripStartDate: tripStartDate ? (tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString()) : 'NULL',
      sectionKey,
      isSharedView,
      isPDFExport,
      timestamp: new Date().toISOString()
    });
  }

  // Use the new focused API key hook
  const { hasApiKey, refreshApiKey } = useWeatherApiKey(segment.endCity);
  
  // PLAN IMPLEMENTATION: Enhanced API key status logging
  console.log(`🔧 PLAN: API Key Status for Day ${segment.day} - ${segment.endCity}`, {
    hasApiKey,
    isDay1: segment.day === 1,
    timestamp: new Date().toISOString()
  });

  // PLAN IMPLEMENTATION: Calculate segment date using normalized service
  const segmentDate = React.useMemo(() => {
    console.log(`🔧 PLAN: Calculating segment date for Day ${segment.day} - ${segment.endCity}`, {
      tripStartDate: tripStartDate ? (tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString()) : 'NULL',
      segmentDay: segment.day,
      hasTripStartDate: !!tripStartDate,
      tripStartDateType: typeof tripStartDate,
      isDay1: segment.day === 1
    });

    // PLAN IMPLEMENTATION: Day 1 specific date calculation logging
    if (segment.day === 1) {
      console.log('🔧 PLAN: *** DAY 1 DATE CALCULATION START ***', {
        tripStartDate: tripStartDate ? (tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString()) : 'NULL',
        segmentDay: segment.day,
        endCity: segment.endCity
      });
    }

    WeatherDebugService.logDateCalculation(
      segment.endCity,
      tripStartDate,
      segment.day,
      null
    );

    if (!tripStartDate) {
      console.log(`🔧 PLAN: No tripStartDate for Day ${segment.day} - ${segment.endCity} - EARLY RETURN NULL`);
      
      // PLAN IMPLEMENTATION: Day 1 specific no date logging
      if (segment.day === 1) {
        console.error('🔧 PLAN: *** DAY 1 NO TRIP START DATE - CRITICAL ERROR ***', {
          endCity: segment.endCity,
          tripStartDate,
          receivedType: typeof tripStartDate
        });
      }
      return null;
    }
    
    // PLAN IMPLEMENTATION: Use normalized date calculation service
    const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
    
    console.log(`🔧 PLAN: Date calculation result for Day ${segment.day} - ${segment.endCity}`, {
      calculatedDate: calculatedDate?.toISOString(),
      isValid: calculatedDate instanceof Date && !isNaN(calculatedDate.getTime()),
      isDay1: segment.day === 1,
      calculationMethod: 'DateNormalizationService.calculateSegmentDate'
    });

    // PLAN IMPLEMENTATION: Day 1 specific date calculation result
    if (segment.day === 1) {
      console.log('🔧 PLAN: *** DAY 1 DATE CALCULATION RESULT ***', {
        success: !!calculatedDate,
        calculatedDate: calculatedDate?.toISOString(),
        isValidDate: calculatedDate instanceof Date && !isNaN(calculatedDate.getTime()),
        endCity: segment.endCity,
        usedNormalizedService: true
      });
    }
    
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
  
  // PLAN IMPLEMENTATION: Enhanced weather state initialization logging
  console.log(`🔧 PLAN: Weather state initialized for Day ${segment.day} - ${segment.endCity}`, {
    weather: weatherState.weather,
    loading: weatherState.loading,
    error: weatherState.error,
    retryCount: weatherState.retryCount,
    hasWeatherData: !!weatherState.weather,
    isDay1: segment.day === 1,
    timestamp: new Date().toISOString()
  });

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

  // PLAN IMPLEMENTATION: Enhanced weather handlers initialization logging
  console.log(`🔧 PLAN: Weather handlers initialized for Day ${segment.day} - ${segment.endCity}`, {
    hasHandlers: !!weatherHandlers,
    handlerMethods: Object.keys(weatherHandlers),
    isDay1: segment.day === 1,
    timestamp: new Date().toISOString()
  });

  // PLAN IMPLEMENTATION: Enhanced segment render attempt logging
  React.useEffect(() => {
    console.log(`🔧 PLAN: SegmentWeatherWidget render effect for Day ${segment.day} - ${segment.endCity}`, {
      weather: weatherState.weather,
      loading: weatherState.loading,
      error: weatherState.error,
      segmentDate: segmentDate?.toISOString(),
      hasApiKey,
      sectionKey,
      shouldTriggerWeatherFetch: hasApiKey && segmentDate && !weatherState.weather && !weatherState.loading,
      isDay1: segment.day === 1,
      normalizedDateUsed: true
    });

    // PLAN IMPLEMENTATION: Day 1 specific render effect
    if (segment.day === 1) {
      console.log('🔧 PLAN: *** DAY 1 RENDER EFFECT TRIGGERED ***', {
        endCity: segment.endCity,
        conditions: {
          hasApiKey,
          hasSegmentDate: !!segmentDate,
          hasWeather: !!weatherState.weather,
          loading: weatherState.loading
        },
        shouldFetch: hasApiKey && segmentDate && !weatherState.weather && !weatherState.loading,
        sectionKey,
        normalizedDateCalculation: true
      });
    }

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
    console.log(`🔧 PLAN: handleApiKeySet called for Day ${segment.day} - ${segment.endCity}`, {
      previousApiKeyStatus: hasApiKey,
      isDay1: segment.day === 1,
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
      console.log(`🔧 PLAN: Weather ready for rendering Day ${segment.day} - ${segment.endCity}`, {
        weatherData: {
          temperature: weatherState.weather.temperature,
          highTemp: weatherState.weather.highTemp,
          lowTemp: weatherState.weather.lowTemp,
          isActualForecast: weatherState.weather.isActualForecast
        },
        segmentDate: segmentDate.toISOString(),
        sectionKey,
        isDay1: segment.day === 1,
        timestamp: new Date().toISOString()
      });

      // PLAN IMPLEMENTATION: Day 1 specific weather ready logging
      if (segment.day === 1) {
        console.log('🔧 PLAN: *** DAY 1 WEATHER DATA READY FOR RENDERING ***', {
          endCity: segment.endCity,
          temperature: weatherState.weather.temperature,
          isActualForecast: weatherState.weather.isActualForecast,
          sectionKey
        });
      }

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

  // PLAN IMPLEMENTATION: Enhanced component render decision logging
  console.log(`🔧 PLAN: SegmentWeatherWidget rendering for Day ${segment.day} - ${segment.endCity}`, {
    willRender: true,
    containerClass: isCollapsible ? 'bg-gray-50 rounded-lg p-3' : '',
    isDay1: segment.day === 1,
    timestamp: new Date().toISOString()
  });

  const containerClass = isCollapsible ? 'bg-gray-50 rounded-lg p-3' : '';

  // PLAN IMPLEMENTATION: Day 1 specific content rendering confirmation (before JSX)
  if (segment.day === 1) {
    console.log('🔧 PLAN: *** DAY 1 CONTENT RENDERING CONFIRMED ***', {
      endCity: segment.endCity,
      hasApiKey,
      loading: weatherState.loading,
      hasWeather: !!weatherState.weather,
      hasSegmentDate: !!segmentDate
    });
  }

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
