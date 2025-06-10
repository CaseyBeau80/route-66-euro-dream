
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { useSegmentWeatherState } from './weather/hooks/useSegmentWeatherState';
import { useSegmentWeather } from './weather/hooks/useSegmentWeather';
import SegmentWeatherContent from './weather/SegmentWeatherContent';
import WeatherErrorBoundary from './weather/WeatherErrorBoundary';
import { DateNormalizationService } from './weather/DateNormalizationService';

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
  
  const [hasApiKey, setHasApiKey] = React.useState(false);
  
  // ENHANCED DEBUGGING: Check weather service status
  React.useEffect(() => {
    console.log('🔍 WEATHER DEBUG - SegmentWeatherWidget mounted:', {
      segment: segment.endCity,
      day: segment.day,
      sectionKey,
      tripStartDate: tripStartDate ? (typeof tripStartDate === 'string' ? tripStartDate : tripStartDate.toISOString()) : 'NO_DATE'
    });

    // Check if weather service exists
    if (!weatherService) {
      console.error('❌ WEATHER DEBUG - EnhancedWeatherService is null/undefined');
      return;
    }

    console.log('🔍 WEATHER DEBUG - Weather service status:', {
      weatherServiceExists: !!weatherService,
      weatherServiceType: typeof weatherService,
      weatherServiceMethods: Object.getOwnPropertyNames(Object.getPrototypeOf(weatherService))
    });

    try {
      weatherService.refreshApiKey();
      const apiKeyStatus = weatherService.hasApiKey();
      console.log('🔍 WEATHER DEBUG - API Key status:', {
        hasApiKey: apiKeyStatus,
        environmentCheck: !!import.meta.env.VITE_OPENWEATHER_API_KEY,
        envLength: import.meta.env.VITE_OPENWEATHER_API_KEY?.length || 0
      });
      setHasApiKey(apiKeyStatus);
    } catch (error) {
      console.error('❌ WEATHER DEBUG - Error checking API key:', error);
      setHasApiKey(false);
    }
  }, [weatherService, segment.endCity, sectionKey]);

  // Enhanced debugging for trip start date issues
  React.useEffect(() => {
    console.log(`🔍 DEBUGGING SegmentWeatherWidget for ${segment.endCity}:`, {
      tripStartDateProvided: !!tripStartDate,
      tripStartDateType: typeof tripStartDate,
      tripStartDateValue: tripStartDate,
      tripStartDateString: tripStartDate ? tripStartDate.toString() : 'null',
      segmentDay: segment.day,
      sectionKey
    });
  }, [tripStartDate, segment.endCity, segment.day, sectionKey]);

  // Use centralized date calculation for consistent results
  const segmentDate = React.useMemo(() => {
    console.log(`🗓️ Calculating segment date for ${segment.endCity}:`, {
      tripStartDate,
      segmentDay: segment.day,
      hasStartDate: !!tripStartDate
    });

    if (!tripStartDate) {
      console.log(`❌ No trip start date provided for ${segment.endCity}`);
      return null;
    }
    
    const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
    
    console.log(`✅ Segment date calculated for ${segment.endCity} (Day ${segment.day}):`, {
      tripStartDate: typeof tripStartDate === 'string' ? tripStartDate : tripStartDate.toISOString(),
      segmentDay: segment.day,
      calculatedDate: calculatedDate?.toISOString(),
      calculatedDateString: calculatedDate ? DateNormalizationService.toDateString(calculatedDate) : 'null',
      sectionKey
    });
    
    return calculatedDate;
  }, [tripStartDate, segment.day, segment.endCity, sectionKey]);

  // Enhanced logging for debug mode
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && segmentDate) {
      console.log(`🐛 DEBUG MODE - Weather data for ${segment.endCity}:`, {
        segmentDate: segmentDate.toISOString(),
        segmentDateString: DateNormalizationService.toDateString(segmentDate),
        segmentDay: segment.day,
        daysFromNow: Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
        isWithinForecastRange: Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) <= 5,
        sectionKey
      });
    }
  }, [segmentDate, segment.endCity, segment.day, sectionKey]);

  const weatherState = useSegmentWeatherState(segment.endCity, segment.day);
  const weatherHandlers = useSegmentWeather({
    segmentEndCity: segment.endCity,
    hasApiKey,
    segmentDate,
    ...weatherState
  });

  // Enhanced weather data validation for consistent display
  React.useEffect(() => {
    if (weatherState.weather && segmentDate) {
      console.log(`🔍 Weather data analysis for ${segment.endCity}:`, {
        hasWeather: true,
        isActualForecast: weatherState.weather.isActualForecast,
        hasDateMatchInfo: !!weatherState.weather.dateMatchInfo,
        dateMatchSource: weatherState.weather.dateMatchInfo?.source,
        matchType: weatherState.weather.dateMatchInfo?.matchType,
        hasValidTemps: !!(weatherState.weather.highTemp && weatherState.weather.lowTemp),
        segmentDateString: DateNormalizationService.toDateString(segmentDate),
        sectionKey,
        isPDFExport: sectionKey === 'pdf-export'
      });

      // Validate date alignment for PDF exports
      if (sectionKey === 'pdf-export' && weatherState.weather.dateMatchInfo) {
        const { requestedDate, matchedDate, matchType } = weatherState.weather.dateMatchInfo;
        const expectedDateString = DateNormalizationService.toDateString(segmentDate);
        if (requestedDate !== expectedDateString && matchType !== 'seasonal-estimate') {
          console.warn(`⚠️ PDF EXPORT: Date mismatch detected for ${segment.endCity}`, {
            requested: expectedDateString,
            matched: matchedDate,
            matchType
          });
        }
      }
    }
  }, [weatherState.weather, segment.endCity, segmentDate, sectionKey]);

  const handleApiKeySet = React.useCallback(() => {
    console.log('🔑 WEATHER DEBUG - handleApiKeySet called for', segment.endCity);
    weatherService.refreshApiKey();
    setHasApiKey(weatherService.hasApiKey());
    weatherHandlers.handleApiKeySet();
  }, [weatherService, weatherHandlers, segment.endCity]);

  // Mark weather as ready for PDF export
  React.useEffect(() => {
    if (weatherState.weather && !weatherState.loading && segmentDate) {
      const element = document.querySelector(`[data-segment-day="${segment.day}"]`);
      if (element) {
        element.setAttribute('data-weather-loaded', 'true');
        
        if (sectionKey === 'pdf-export') {
          element.setAttribute('data-pdf-weather-ready', 'true');
          element.setAttribute('data-weather-date', DateNormalizationService.toDateString(segmentDate));
        }
      }
    }
  }, [weatherState.weather, weatherState.loading, segment.day, sectionKey, segmentDate]);

  // Add debug logging for when no date is available
  if (!segmentDate) {
    console.log(`⚠️ SegmentWeatherWidget: No segment date available for ${segment.endCity}`, {
      tripStartDateProvided: !!tripStartDate,
      tripStartDateValue: tripStartDate,
      segmentDay: segment.day,
      willShowFallback: true
    });
  }

  // CRITICAL DEBUG: Log the weather state and API key status
  console.log(`🔍 WEATHER DEBUG - Current state for ${segment.endCity}:`, {
    hasApiKey,
    loading: weatherState.loading,
    hasWeather: !!weatherState.weather,
    error: weatherState.error,
    retryCount: weatherState.retryCount,
    segmentDate: segmentDate?.toISOString()
  });

  const containerClass = isCollapsible ? 'bg-gray-50 rounded-lg p-3' : '';

  return (
    <WeatherErrorBoundary 
      segmentEndCity={segment.endCity}
      fallbackMessage={`Weather service error for ${segment.endCity}`}
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
