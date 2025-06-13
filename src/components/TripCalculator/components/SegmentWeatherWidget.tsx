
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

const SegmentWeatherWidget: React.FC<SegmentWeatherWidgetProps> = ({
  segment,
  tripStartDate,
  cardIndex,
  tripId,
  sectionKey,
  forceExpanded = false,
  isCollapsible = true
}) => {
  console.log('🚨 [PLAN] SegmentWeatherWidget INSTANTIATED for Day', segment.day, '-', segment.endCity, {
    segment: { day: segment.day, endCity: segment.endCity, title: segment.title },
    tripStartDate: tripStartDate.toISOString(),
    cardIndex,
    tripId,
    sectionKey,
    timestamp: new Date().toISOString(),
    componentMount: true,
    isDay1: segment.day === 1
  });

  // Calculate segment date
  const segmentDate = React.useMemo(() => {
    try {
      const calculatedDate = new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
      const normalizedDate = DateNormalizationService.normalizeSegmentDate(calculatedDate);
      
      console.log('🚨 [PLAN] Final segmentDate for Day', segment.day, '-', segment.endCity, {
        segmentDate: normalizedDate.toISOString(),
        hasSegmentDate: !isNaN(normalizedDate.getTime()),
        isDay1: segment.day === 1,
        timestamp: new Date().toISOString()
      });
      
      return normalizedDate;
    } catch (error) {
      console.error('❌ SegmentWeatherWidget: Error calculating segment date:', error);
      return null;
    }
  }, [tripStartDate, segment.day, segment.endCity]);

  // API key management
  const { hasApiKey, refreshApiKey } = useWeatherApiKey(segment.endCity);

  // Weather state management - fix the call to match the hook signature
  const weatherState = useSimpleWeatherState(
    segment.endCity,
    segment.day
  );

  // Weather data fetcher - fix the call to match expected arguments
  const weatherActions = useWeatherDataFetcher({
    segmentEndCity: segment.endCity,
    segmentDay: segment.day,
    tripStartDate,
    hasApiKey,
    actions: weatherState
  });

  console.log('🚨 [PLAN] Weather handlers initialized for Day', segment.day, '-', segment.endCity, {
    hasHandlers: !!(weatherActions.handleApiKeySet && weatherActions.handleTimeout && weatherActions.handleRetry),
    handlerMethods: ['handleApiKeySet', 'handleTimeout', 'handleRetry'],
    isDay1: segment.day === 1,
    timestamp: new Date().toISOString()
  });

  console.log('🎨 SegmentWeatherWidget [' + segment.endCity + '] render:', {
    hasApiKey,
    loading: weatherState.loading,
    hasWeather: !!weatherState.weather,
    error: weatherState.error,
    retryCount: weatherState.retryCount,
    segmentDate: segmentDate?.toISOString(),
    sectionKey
  });

  console.log('🚨 [PLAN] SegmentWeatherWidget rendering for Day', segment.day, '-', segment.endCity, {
    willRender: true,
    containerClass: '',
    isDay1: segment.day === 1,
    timestamp: new Date().toISOString()
  });

  // FIXED: Use centralized WeatherTypeDetector for ALL weather type decisions
  const weatherType = weatherState.weather && segmentDate 
    ? WeatherTypeDetector.detectWeatherType(weatherState.weather, segmentDate)
    : { isLiveForecast: false, displayLabel: 'Weather Information' };

  console.log('🔧 FIXED: SegmentWeatherWidget using centralized weather type detection for', segment.endCity, {
    weatherType,
    weatherSource: weatherState.weather?.source,
    isActualForecast: weatherState.weather?.isActualForecast,
    segmentDate: segmentDate?.toISOString(),
    daysFromToday: segmentDate ? Math.floor((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : 'unknown'
  });

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
};

export default SegmentWeatherWidget;
