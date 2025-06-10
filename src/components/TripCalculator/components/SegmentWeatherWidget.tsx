
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
  
  React.useEffect(() => {
    weatherService.refreshApiKey();
    const apiKeyStatus = weatherService.hasApiKey();
    setHasApiKey(apiKeyStatus);
  }, [weatherService, segment.endCity, sectionKey]);

  // Normalize segment date using centralized service
  const normalizedSegmentDate = React.useMemo(() => {
    const normalized = DateNormalizationService.normalizeSegmentDateFromTrip(tripStartDate, segment.day);
    
    if (normalized) {
      console.log(`✅ SegmentWeatherWidget: Normalized date for ${segment.endCity} (Day ${segment.day}):`, {
        segmentDateString: normalized.segmentDateString,
        daysFromNow: normalized.daysFromNow,
        isWithinForecastRange: normalized.isWithinForecastRange,
        season: normalized.season,
        sectionKey
      });
    } else {
      console.log(`⚠️ SegmentWeatherWidget: Could not normalize date for ${segment.endCity}`);
    }
    
    return normalized;
  }, [tripStartDate, segment.day, segment.endCity, sectionKey]);

  const weatherState = useSegmentWeatherState(segment.endCity, segment.day);
  const weatherHandlers = useSegmentWeather({
    segmentEndCity: segment.endCity,
    hasApiKey,
    segmentDate: normalizedSegmentDate?.segmentDate || null,
    ...weatherState
  });

  // Enhanced weather data validation for consistent display
  React.useEffect(() => {
    if (weatherState.weather && normalizedSegmentDate) {
      console.log(`🔍 Weather data analysis for ${segment.endCity}:`, {
        hasWeather: true,
        isActualForecast: weatherState.weather.isActualForecast,
        hasDateMatchInfo: !!weatherState.weather.dateMatchInfo,
        dateMatchSource: weatherState.weather.dateMatchInfo?.source,
        matchType: weatherState.weather.dateMatchInfo?.matchType,
        hasValidTemps: !!(weatherState.weather.highTemp && weatherState.weather.lowTemp),
        segmentDateString: normalizedSegmentDate.segmentDateString,
        sectionKey,
        isPDFExport: sectionKey === 'pdf-export'
      });

      // Validate date alignment for PDF exports
      if (sectionKey === 'pdf-export' && weatherState.weather.dateMatchInfo) {
        const { requestedDate, matchedDate, matchType } = weatherState.weather.dateMatchInfo;
        if (requestedDate !== normalizedSegmentDate.segmentDateString && matchType !== 'seasonal-estimate') {
          console.warn(`⚠️ PDF EXPORT: Date mismatch detected for ${segment.endCity}`, {
            requested: normalizedSegmentDate.segmentDateString,
            matched: matchedDate,
            matchType
          });
        }
      }
    }
  }, [weatherState.weather, segment.endCity, normalizedSegmentDate, sectionKey]);

  const handleApiKeySet = React.useCallback(() => {
    weatherService.refreshApiKey();
    setHasApiKey(weatherService.hasApiKey());
    weatherHandlers.handleApiKeySet();
  }, [weatherService, weatherHandlers]);

  // Mark weather as ready for PDF export
  React.useEffect(() => {
    if (weatherState.weather && !weatherState.loading && normalizedSegmentDate) {
      const element = document.querySelector(`[data-segment-day="${segment.day}"]`);
      if (element) {
        element.setAttribute('data-weather-loaded', 'true');
        
        if (sectionKey === 'pdf-export') {
          element.setAttribute('data-pdf-weather-ready', 'true');
          element.setAttribute('data-weather-date', normalizedSegmentDate.segmentDateString);
        }
      }
    }
  }, [weatherState.weather, weatherState.loading, segment.day, sectionKey, normalizedSegmentDate]);

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
          segmentDate={normalizedSegmentDate?.segmentDate || null}
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
