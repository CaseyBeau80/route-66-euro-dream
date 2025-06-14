
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
  console.log(`🎯 SIMPLIFIED: WeatherCard rendered for Day ${segment.day} - ${segment.endCity}`);

  const {
    hasApiKey,
    weatherState: { weather, loading, error, retryCount },
    segmentDate,
    fetchWeather
  } = useWeatherCard({ segment, tripStartDate });

  // CRITICAL FIX: All callbacks are now memoized with stable dependencies
  const handleRetry = React.useCallback(() => {
    console.log(`🔄 SIMPLIFIED: Retrying weather fetch for ${segment.endCity}`);
    fetchWeather();
  }, [fetchWeather]);

  const handleApiKeySet = React.useCallback(() => {
    console.log(`🔑 SIMPLIFIED: API key set, fetching weather for ${segment.endCity}`);
    fetchWeather();
  }, [fetchWeather]);

  const handleTimeout = React.useCallback(() => {
    console.log(`⏰ SIMPLIFIED: Timeout triggered for ${segment.endCity}`);
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
