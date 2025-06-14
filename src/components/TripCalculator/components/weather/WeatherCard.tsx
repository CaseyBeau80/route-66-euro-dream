
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { useWeatherCard } from './hooks/useWeatherCard';
import { ShareWeatherConfigService } from '../../services/weather/ShareWeatherConfigService';
import SegmentWeatherContent from './SegmentWeatherContent';

interface WeatherCardProps {
  segment: DailySegment;
  tripStartDate?: Date | null;
  isSharedView?: boolean;
  isPDFExport?: boolean;
  cardIndex?: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  segment,
  tripStartDate,
  isSharedView = false,
  isPDFExport = false,
  cardIndex
}) => {
  const { hasApiKey, weatherState, segmentDate, fetchWeather } = useWeatherCard({
    segment,
    tripStartDate
  });

  // FIXED: Enhanced API key detection for shared views
  const effectiveHasApiKey = React.useMemo(() => {
    if (isSharedView || isPDFExport) {
      const sharedConfig = ShareWeatherConfigService.getShareWeatherConfig();
      console.log('🔑 FIXED: WeatherCard shared view API key check for', segment.endCity, {
        originalHasApiKey: hasApiKey,
        sharedConfigHasApiKey: sharedConfig.hasApiKey,
        canFetchLiveWeather: sharedConfig.canFetchLiveWeather,
        usingSharedConfig: true
      });
      return sharedConfig.hasApiKey;
    }
    return hasApiKey;
  }, [hasApiKey, isSharedView, isPDFExport, segment.endCity]);

  const [retryCount, setRetryCount] = React.useState(0);

  const handleApiKeySet = React.useCallback(() => {
    console.log('🔑 FIXED: API key set, triggering weather fetch for', segment.endCity);
    if (segmentDate) {
      fetchWeather(isSharedView);
    }
  }, [fetchWeather, segmentDate, isSharedView, segment.endCity]);

  const handleTimeout = React.useCallback(() => {
    console.log('⏰ FIXED: Weather fetch timeout for', segment.endCity);
    weatherState.setError('Weather fetch timed out');
    weatherState.setLoading(false);
  }, [weatherState, segment.endCity]);

  const handleRetry = React.useCallback(() => {
    console.log('🔄 FIXED: Manual retry triggered for', segment.endCity, {
      retryCount: retryCount + 1,
      hasEffectiveApiKey: effectiveHasApiKey
    });
    setRetryCount(prev => prev + 1);
    if (segmentDate) {
      fetchWeather(isSharedView);
    }
  }, [fetchWeather, segmentDate, retryCount, isSharedView, effectiveHasApiKey, segment.endCity]);

  console.log('🔧 FIXED: WeatherCard render for', segment.endCity, {
    hasApiKey: hasApiKey,
    effectiveHasApiKey: effectiveHasApiKey,
    isSharedView,
    hasWeather: !!weatherState.weather,
    loading: weatherState.loading,
    error: weatherState.error,
    hasSegmentDate: !!segmentDate,
    retryCount,
    cardIndex
  });

  return (
    <SegmentWeatherContent
      hasApiKey={effectiveHasApiKey}
      loading={weatherState.loading}
      weather={weatherState.weather}
      error={weatherState.error}
      retryCount={retryCount}
      segmentEndCity={segment.endCity}
      segmentDate={segmentDate}
      onApiKeySet={handleApiKeySet}
      onTimeout={handleTimeout}
      onRetry={handleRetry}
      isSharedView={isSharedView}
      isPDFExport={isPDFExport}
    />
  );
};

export default WeatherCard;
