
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { useWeatherCard } from './hooks/useWeatherCard';
import WeatherDebugLogger from './debug/WeatherDebugLogger';
import ErrorBoundary from '../ErrorBoundary';
import WeatherCardHeader from './components/WeatherCardHeader';
import WeatherCardContent from './components/WeatherCardContent';
import {
  NoDateState,
  NoApiKeyState,
  LoadingState,
  ErrorState
} from './components/WeatherCardStates';

interface WeatherCardProps {
  segment: DailySegment;
  tripStartDate: Date | null;
  cardIndex: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  segment,
  tripStartDate,
  cardIndex
}) => {
  console.log(`🎯 [WEATHER DEBUG] WeatherCard rendered for Day ${segment.day}:`, {
    component: 'WeatherCard',
    segmentDay: segment.day,
    segmentEndCity: segment.endCity,
    cardIndex,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString()
  });

  const { hasApiKey, weatherState, segmentDate } = useWeatherCard({
    segment,
    tripStartDate
  });

  // No trip date provided
  if (!tripStartDate || !segmentDate) {
    console.log(`🎯 [WEATHER DEBUG] WeatherCard returning no-date state for ${segment.endCity}:`, {
      component: 'WeatherCard -> no-date-state',
      reason: !tripStartDate ? 'no tripStartDate' : 'no segmentDate'
    });

    return <NoDateState />;
  }

  // No API key
  if (!hasApiKey) {
    console.log(`🎯 [WEATHER DEBUG] WeatherCard returning no-API-key state for ${segment.endCity}:`, {
      component: 'WeatherCard -> no-api-key-state'
    });

    return <NoApiKeyState />;
  }

  // Loading state
  if (weatherState.loading) {
    console.log(`🎯 [WEATHER DEBUG] WeatherCard returning loading state for ${segment.endCity}:`, {
      component: 'WeatherCard -> loading-state'
    });

    return <LoadingState />;
  }

  // Error state
  if (weatherState.error && weatherState.retryCount > 2) {
    console.log(`🎯 [WEATHER DEBUG] WeatherCard returning error state for ${segment.endCity}:`, {
      component: 'WeatherCard -> error-state',
      error: weatherState.error,
      retryCount: weatherState.retryCount
    });

    return <ErrorState error={weatherState.error} />;
  }

  console.log(`🎯 [WEATHER DEBUG] WeatherCard rendering main content for ${segment.endCity}:`, {
    component: 'WeatherCard -> main-content',
    hasWeather: !!weatherState.weather,
    segmentDate: segmentDate.toISOString()
  });

  return (
    <ErrorBoundary context={`WeatherCard-${segment.day}`}>
      <WeatherDebugLogger
        componentName="WeatherCard"
        segmentDay={segment.day}
        segmentEndCity={segment.endCity}
        data={{
          hasApiKey,
          hasWeather: !!weatherState.weather,
          loading: weatherState.loading,
          error: weatherState.error,
          segmentDate: segmentDate.toISOString()
        }}
      />
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow min-h-[200px]">
        <WeatherCardHeader segment={segment} segmentDate={segmentDate} />
        <WeatherCardContent
          weather={weatherState.weather}
          segmentDate={segmentDate}
          cityName={segment.endCity}
        />
      </div>
    </ErrorBoundary>
  );
};

export default WeatherCard;
