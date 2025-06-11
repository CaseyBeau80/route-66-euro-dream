
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { useSegmentWeatherState } from './weather/hooks/useSegmentWeatherState';
import { useSegmentWeather } from './weather/hooks/useSegmentWeather';
import SegmentWeatherContent from './weather/SegmentWeatherContent';
import WeatherErrorBoundary from './weather/WeatherErrorBoundary';
import { DateNormalizationService } from './weather/DateNormalizationService';
import { WeatherDataDebugger } from './weather/WeatherDataDebugger';

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
  
  // Enhanced weather service initialization with debugging
  React.useEffect(() => {
    WeatherDataDebugger.debugWeatherFlow(
      `SegmentWeatherWidget.mount [${segment.endCity}] [Day ${segment.day}]`,
      {
        sectionKey,
        tripStartDate: typeof tripStartDate === 'string' ? tripStartDate : tripStartDate?.toISOString(),
        cardIndex,
        tripId
      }
    );

    if (!weatherService) {
      console.error('❌ CRITICAL: EnhancedWeatherService is null/undefined');
      return;
    }

    try {
      weatherService.refreshApiKey();
      const apiKeyStatus = weatherService.hasApiKey();
      
      WeatherDataDebugger.debugWeatherFlow(
        `SegmentWeatherWidget.apiKeyCheck [${segment.endCity}]`,
        {
          hasApiKey: apiKeyStatus,
          weatherServiceExists: !!weatherService,
          environmentCheck: !!import.meta.env.VITE_OPENWEATHER_API_KEY,
          envLength: import.meta.env.VITE_OPENWEATHER_API_KEY?.length || 0
        }
      );
      
      setHasApiKey(apiKeyStatus);
    } catch (error) {
      console.error('❌ Error checking API key for', segment.endCity, ':', error);
      setHasApiKey(false);
    }
  }, [weatherService, segment.endCity, segment.day, sectionKey, tripStartDate]);

  // Enhanced date calculation with comprehensive debugging
  const segmentDate = React.useMemo(() => {
    WeatherDataDebugger.debugDateCalculation(
      `SegmentWeatherWidget.calculateDate [${segment.endCity}]`,
      tripStartDate,
      segment.day,
      null
    );

    if (!tripStartDate) {
      console.log(`❌ No trip start date provided for ${segment.endCity} Day ${segment.day}`);
      return null;
    }
    
    const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
    
    WeatherDataDebugger.debugDateCalculation(
      `SegmentWeatherWidget.calculateDate.result [${segment.endCity}]`,
      tripStartDate,
      segment.day,
      calculatedDate
    );
    
    return calculatedDate;
  }, [tripStartDate, segment.day, segment.endCity]);

  // Enhanced development mode debugging
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && segmentDate) {
      const daysFromNow = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      
      WeatherDataDebugger.debugWeatherFlow(
        `SegmentWeatherWidget.developmentDebug [${segment.endCity}] [Day ${segment.day}]`,
        {
          segmentDate: segmentDate.toISOString(),
          segmentDateString: DateNormalizationService.toDateString(segmentDate),
          daysFromNow,
          isWithinForecastRange: daysFromNow >= 0 && daysFromNow <= 5,
          sectionKey,
          isDaySevenDebug: segment.day === 7
        }
      );

      // Special debugging for Day 7
      if (segment.day === 7) {
        console.log(`🔍 DAY 7 SPECIFIC DEBUG for ${segment.endCity}:`, {
          tripStartDate: typeof tripStartDate === 'string' ? tripStartDate : tripStartDate?.toISOString(),
          calculatedSegmentDate: segmentDate.toISOString(),
          expectedDate: '2025-06-17',
          actualDateString: DateNormalizationService.toDateString(segmentDate),
          daysFromNow,
          isWithinApiRange: daysFromNow >= 0 && daysFromNow <= 5,
          hasApiKey,
          componentPath: 'SegmentWeatherWidget'
        });
      }
    }
  }, [segmentDate, segment.endCity, segment.day, sectionKey, hasApiKey, tripStartDate]);

  const weatherState = useSegmentWeatherState(segment.endCity, segment.day);
  const weatherHandlers = useSegmentWeather({
    segmentEndCity: segment.endCity,
    hasApiKey,
    segmentDate,
    ...weatherState
  });

  // Enhanced weather data validation for display
  React.useEffect(() => {
    if (weatherState.weather && segmentDate) {
      WeatherDataDebugger.debugWeatherFlow(
        `SegmentWeatherWidget.weatherDataValidation [${segment.endCity}] [Day ${segment.day}]`,
        {
          hasWeather: true,
          isActualForecast: weatherState.weather.isActualForecast,
          hasDateMatchInfo: !!weatherState.weather.dateMatchInfo,
          dateMatchSource: weatherState.weather.dateMatchInfo?.source,
          matchType: weatherState.weather.dateMatchInfo?.matchType,
          confidence: weatherState.weather.dateMatchInfo?.confidence,
          hasValidTemps: !!(weatherState.weather.highTemp && weatherState.weather.lowTemp),
          segmentDateString: DateNormalizationService.toDateString(segmentDate),
          sectionKey,
          isDaySevenValidation: segment.day === 7
        }
      );

      // Special validation for PDF exports
      if (sectionKey === 'pdf-export' && weatherState.weather.dateMatchInfo) {
        const { requestedDate, matchedDate, matchType } = weatherState.weather.dateMatchInfo;
        const expectedDateString = DateNormalizationService.toDateString(segmentDate);
        
        if (requestedDate !== expectedDateString && matchType !== 'seasonal-estimate') {
          console.warn(`⚠️ PDF EXPORT: Date mismatch detected for ${segment.endCity} Day ${segment.day}`, {
            expected: expectedDateString,
            requested: requestedDate,
            matched: matchedDate,
            matchType
          });
        }
      }
    }
  }, [weatherState.weather, segment.endCity, segment.day, segmentDate, sectionKey]);

  const handleApiKeySet = React.useCallback(() => {
    WeatherDataDebugger.debugWeatherFlow(
      `SegmentWeatherWidget.handleApiKeySet [${segment.endCity}] [Day ${segment.day}]`,
      { previousApiKeyStatus: hasApiKey }
    );
    
    weatherService.refreshApiKey();
    setHasApiKey(weatherService.hasApiKey());
    weatherHandlers.handleApiKeySet();
  }, [weatherService, weatherHandlers, segment.endCity, segment.day, hasApiKey]);

  // Mark weather as ready for rendering
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

  // Final debug log for current state
  WeatherDataDebugger.debugComponentState(
    'SegmentWeatherWidget',
    segment.endCity,
    {
      hasApiKey,
      loading: weatherState.loading,
      hasWeather: !!weatherState.weather,
      error: weatherState.error,
      retryCount: weatherState.retryCount,
      segmentDate,
      isDaySevenCheck: segment.day === 7
    }
  );

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
