
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

  // Use centralized date calculation for consistent results
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) {
      console.log(`⚠️ SegmentWeatherWidget: No trip start date provided for ${segment.endCity}`);
      return null;
    }
    
    const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
    
    console.log(`✅ SegmentWeatherWidget: Calculated segment date for ${segment.endCity} (Day ${segment.day}):`, {
      tripStartDate: typeof tripStartDate === 'string' ? tripStartDate : tripStartDate.toISOString(),
      segmentDay: segment.day,
      calculatedDate: calculatedDate?.toISOString(),
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
    weatherService.refreshApiKey();
    setHasApiKey(weatherService.hasApiKey());
    weatherHandlers.handleApiKeySet();
  }, [weatherService, weatherHandlers]);

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
