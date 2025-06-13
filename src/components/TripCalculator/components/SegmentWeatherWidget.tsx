
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useWeatherApiKey } from './weather/hooks/useWeatherApiKey';
import { useSimpleWeatherState } from './weather/hooks/useSimpleWeatherState';
import { useWeatherDataFetcher } from './weather/hooks/useWeatherDataFetcher';
import { DateNormalizationService } from './weather/DateNormalizationService';
import SegmentWeatherContent from './weather/SegmentWeatherContent';
import { WeatherTypeDetector } from './weather/utils/WeatherTypeDetector';
import PerformanceCircuitBreaker from './PerformanceCircuitBreaker';

interface SegmentWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate: Date;
  cardIndex: number;
  tripId?: string;
  sectionKey: string;
  forceExpanded?: boolean;
  isCollapsible?: boolean;
}

const SegmentWeatherWidget: React.FC<SegmentWeatherWidgetProps> = React.memo(({
  segment,
  tripStartDate,
  cardIndex,
  tripId,
  sectionKey,
  forceExpanded = false,
  isCollapsible = true
}) => {
  // 🚨 CRASH PREVENTION: Early validation
  React.useEffect(() => {
    if (!segment || !segment.endCity) {
      console.error('🚨 SegmentWeatherWidget: Invalid segment data', segment);
    }
    if (!tripStartDate || isNaN(tripStartDate.getTime())) {
      console.error('🚨 SegmentWeatherWidget: Invalid tripStartDate', tripStartDate);
    }
  }, [segment, tripStartDate]);

  // Calculate segment date once and memoize it
  const segmentDate = React.useMemo(() => {
    try {
      if (!tripStartDate || !segment?.day) {
        console.warn('🚨 SegmentWeatherWidget: Missing required data for date calculation');
        return null;
      }
      
      const calculatedDate = new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
      return DateNormalizationService.normalizeSegmentDate(calculatedDate);
    } catch (error) {
      console.error('❌ SegmentWeatherWidget: Error calculating segment date:', error);
      return null;
    }
  }, [tripStartDate, segment?.day]);

  // API key management with error protection
  const { hasApiKey } = useWeatherApiKey(segment?.endCity || 'Unknown');

  // Weather state management
  const weatherState = useSimpleWeatherState(segment?.endCity || 'Unknown', segment?.day || 0);

  // Weather data fetcher with timeout protection
  const weatherActions = useWeatherDataFetcher({
    segmentEndCity: segment?.endCity || 'Unknown',
    segmentDay: segment?.day || 0,
    tripStartDate,
    hasApiKey,
    actions: weatherState
  });

  // Memoize weather type detection to prevent recalculation
  const weatherType = React.useMemo(() => {
    if (!weatherState.weather || !segmentDate) {
      return { isLiveForecast: false, displayLabel: 'Weather Information' };
    }
    return WeatherTypeDetector.detectWeatherType(weatherState.weather, segmentDate);
  }, [weatherState.weather, segmentDate]);

  // 🚨 CRASH PREVENTION: Safety check before render
  if (!segment || !segment.endCity || !tripStartDate) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        ⚠️ Weather widget: Missing required data
      </div>
    );
  }

  return (
    <PerformanceCircuitBreaker 
      componentName={`SegmentWeather-${segment.endCity}-Day${segment.day}`}
      maxErrors={1}
    >
      <div className="">
        <SegmentWeatherContent
          hasApiKey={hasApiKey}
          loading={weatherState.loading}
          weather={weatherState.weather}
          error={weatherState.error}
          retryCount={weatherState.retryCount}
          segmentEndCity={segment.endCity}
          segmentDate={segmentDate}
          onApiKeySet={weatherActions.handleApiKeySet}
          onTimeout={weatherActions.handleTimeout}
          onRetry={weatherActions.handleRetry}
          isSharedView={sectionKey.includes('shared')}
          isPDFExport={sectionKey.includes('pdf')}
        />
      </div>
    </PerformanceCircuitBreaker>
  );
});

SegmentWeatherWidget.displayName = 'SegmentWeatherWidget';

export default SegmentWeatherWidget;
