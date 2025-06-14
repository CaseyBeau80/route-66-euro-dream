
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { useWeatherCard } from './hooks/useWeatherCard';
import SegmentWeatherContent from './SegmentWeatherContent';

interface WeatherCardProps {
  segment: DailySegment;
  tripStartDate: Date | null;
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
  forceExpanded?: boolean;
  isCollapsible?: boolean;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ 
  segment, 
  tripStartDate,
  cardIndex,
  isSharedView = false,
  isPDFExport = false
}) => {
  console.log(`🎯 [WEATHER DEBUG] WeatherCard rendered for Day ${segment.day}:`, {
    component: 'WeatherCard',
    segmentDay: segment.day,
    segmentEndCity: segment.endCity,
    cardIndex,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString(),
    isSharedView,
    isPDFExport
  });

  const {
    hasApiKey,
    weatherState: { weather, loading, error, retryCount },
    segmentDate,
    fetchWeather
  } = useWeatherCard({ segment, tripStartDate });

  console.log(`🎯 [WEATHER DEBUG] WeatherCard state for ${segment.endCity}:`, {
    hasApiKey,
    hasWeather: !!weather,
    loading,
    hasError: !!error,
    hasSegmentDate: !!segmentDate,
    isSharedView,
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    retryCount
  });

  // Enhanced retry function that resets error state
  const handleRetry = React.useCallback(() => {
    console.log(`🔄 WeatherCard: Retrying weather fetch for ${segment.endCity}`);
    fetchWeather();
  }, [fetchWeather, segment.endCity]);

  // Enhanced API key callback that triggers fresh fetch
  const handleApiKeySet = React.useCallback(() => {
    console.log(`🔑 WeatherCard: API key set, fetching weather for ${segment.endCity}`);
    fetchWeather();
  }, [fetchWeather, segment.endCity]);

  // Timeout handler for loading states
  const handleTimeout = React.useCallback(() => {
    console.log(`⏰ WeatherCard: Timeout triggered for ${segment.endCity}`);
    // This could trigger fallback weather in the future
  }, [segment.endCity]);

  return (
    <div className="weather-card">
      <SegmentWeatherContent
        hasApiKey={hasApiKey}
        loading={loading}
        weather={weather}
        error={error}
        retryCount={retryCount}
        segmentEndCity={segment.endCity}
        segmentDate={segmentDate}
        onApiKeySet={handleApiKeySet}
        onTimeout={handleTimeout}
        onRetry={handleRetry}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    </div>
  );
};

export default WeatherCard;
