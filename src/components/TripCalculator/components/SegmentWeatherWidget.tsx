
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useWeatherApiKey } from './weather/hooks/useWeatherApiKey';
import { useSimpleWeatherState } from './weather/hooks/useSimpleWeatherState';
import { useWeatherDataFetcher } from './weather/hooks/useWeatherDataFetcher';
import { DateNormalizationService } from './weather/DateNormalizationService';
import SegmentWeatherContent from './weather/SegmentWeatherContent';
import { WeatherTypeDetector } from './weather/utils/WeatherTypeDetector';

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
  // Calculate segment date once and memoize it
  const segmentDate = React.useMemo(() => {
    try {
      const calculatedDate = new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
      return DateNormalizationService.normalizeSegmentDate(calculatedDate);
    } catch (error) {
      console.error('❌ SegmentWeatherWidget: Error calculating segment date:', error);
      return null;
    }
  }, [tripStartDate, segment.day]);

  // API key management
  const { hasApiKey } = useWeatherApiKey(segment.endCity);

  // Weather state management
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);

  // Weather data fetcher
  const weatherActions = useWeatherDataFetcher({
    segmentEndCity: segment.endCity,
    segmentDay: segment.day,
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

  return (
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
  );
});

SegmentWeatherWidget.displayName = 'SegmentWeatherWidget';

export default SegmentWeatherWidget;
