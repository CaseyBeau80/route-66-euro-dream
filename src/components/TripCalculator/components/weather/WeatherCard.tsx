
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { useWeatherCard } from './hooks/useWeatherCard';
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

  const [retryCount, setRetryCount] = React.useState(0);

  const handleApiKeySet = React.useCallback(() => {
    console.log('🔑 SIMPLIFIED: API key set, triggering weather fetch for', segment.endCity);
    if (segmentDate) {
      fetchWeather(isSharedView);
    }
  }, [fetchWeather, segmentDate, isSharedView, segment.endCity]);

  const handleTimeout = React.useCallback(() => {
    console.log('⏰ SIMPLIFIED: Weather fetch timeout for', segment.endCity);
    weatherState.setError('Weather fetch timed out');
    weatherState.setLoading(false);
  }, [weatherState, segment.endCity]);

  const handleRetry = React.useCallback(() => {
    console.log('🔄 SIMPLIFIED: Manual retry triggered for', segment.endCity, {
      retryCount: retryCount + 1,
      hasApiKey
    });
    setRetryCount(prev => prev + 1);
    if (segmentDate) {
      fetchWeather(isSharedView);
    }
  }, [fetchWeather, segmentDate, retryCount, isSharedView, hasApiKey, segment.endCity]);

  console.log('🔧 SIMPLIFIED: WeatherCard render for', segment.endCity, {
    hasApiKey,
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
      hasApiKey={hasApiKey}
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
