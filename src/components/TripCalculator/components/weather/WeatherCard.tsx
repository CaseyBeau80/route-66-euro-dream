
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { useWeatherCard } from './hooks/useWeatherCard';
import WeatherDataDisplay from './WeatherDataDisplay';
import WeatherLoadingDisplay from './WeatherLoadingDisplay';

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
    weatherState: { weather, loading, error },
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
    isActualForecast: weather?.isActualForecast
  });

  // Show loading state while fetching
  if (loading) {
    console.log(`🎯 [WEATHER DEBUG] WeatherCard returning loading state for ${segment.endCity}:`, {
      component: 'WeatherCard -> loading-state'
    });
    
    return (
      <WeatherLoadingDisplay 
        cityName={segment.endCity}
        isSharedView={isSharedView}
      />
    );
  }

  // CRITICAL: Always try to render weather data, even in shared views
  console.log(`🎯 [WEATHER DEBUG] WeatherCard rendering data display for ${segment.endCity}:`, {
    component: 'WeatherCard -> data-display',
    hasWeather: !!weather,
    isSharedView,
    weatherType: weather ? `${weather.source}_${weather.isActualForecast}` : 'none'
  });

  return (
    <WeatherDataDisplay
      weather={weather}
      segmentDate={segmentDate}
      cityName={segment.endCity}
      error={error}
      onRetry={fetchWeather}
      isSharedView={isSharedView}
      isPDFExport={isPDFExport}
    />
  );
};

export default WeatherCard;
