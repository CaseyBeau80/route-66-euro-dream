
import React from 'react';
import { format, addDays } from 'date-fns';
import { Cloud } from 'lucide-react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { useWeatherApiKey } from './hooks/useWeatherApiKey';
import { useSimpleWeatherState } from './hooks/useSimpleWeatherState';
import { useWeatherDataFetcher } from './hooks/useWeatherDataFetcher';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import WeatherDebugLogger from './debug/WeatherDebugLogger';
import ErrorBoundary from '../ErrorBoundary';

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
  // 🎯 DEBUG: Log WeatherCard component entry
  console.log(`🎯 [WEATHER DEBUG] WeatherCard rendered for Day ${segment.day}:`, {
    component: 'WeatherCard',
    segmentDay: segment.day,
    segmentEndCity: segment.endCity,
    cardIndex,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString()
  });

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  // 🎯 DEBUG: Log API key and weather state
  console.log(`🎯 [WEATHER DEBUG] WeatherCard hooks initialized for ${segment.endCity}:`, {
    component: 'WeatherCard -> hooks',
    hasApiKey,
    weatherState: {
      hasWeather: !!weatherState.weather,
      loading: weatherState.loading,
      error: weatherState.error,
      retryCount: weatherState.retryCount
    }
  });

  const { fetchWeather } = useWeatherDataFetcher({
    segmentEndCity: segment.endCity,
    segmentDay: segment.day,
    tripStartDate,
    hasApiKey,
    actions: weatherState
  });

  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    try {
      return addDays(tripStartDate, segment.day - 1);
    } catch {
      return null;
    }
  }, [tripStartDate, segment.day]);

  // 🎯 DEBUG: Log calculated segment date
  console.log(`🎯 [WEATHER DEBUG] WeatherCard segment date calculated for ${segment.endCity}:`, {
    component: 'WeatherCard -> segmentDate',
    calculatedDate: segmentDate?.toISOString(),
    dayOffset: segment.day - 1
  });

  // No trip date provided
  if (!tripStartDate || !segmentDate) {
    console.log(`🎯 [WEATHER DEBUG] WeatherCard returning no-date state for ${segment.endCity}:`, {
      component: 'WeatherCard -> no-date-state',
      reason: !tripStartDate ? 'no tripStartDate' : 'no segmentDate'
    });

    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center min-h-[200px] flex flex-col justify-center">
        <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">
          Set a trip start date to see weather forecasts
        </p>
      </div>
    );
  }

  // No API key
  if (!hasApiKey) {
    console.log(`🎯 [WEATHER DEBUG] WeatherCard returning no-API-key state for ${segment.endCity}:`, {
      component: 'WeatherCard -> no-api-key-state'
    });

    return (
      <div className="bg-yellow-50 rounded-lg p-6 text-center min-h-[200px] flex flex-col justify-center border border-yellow-200">
        <Cloud className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-yellow-700 text-sm mb-2">
          Weather API key required
        </p>
        <p className="text-yellow-600 text-xs">
          Set your OpenWeatherMap API key to see forecasts
        </p>
      </div>
    );
  }

  // Loading state
  if (weatherState.loading) {
    console.log(`🎯 [WEATHER DEBUG] WeatherCard returning loading state for ${segment.endCity}:`, {
      component: 'WeatherCard -> loading-state'
    });

    return (
      <div className="bg-blue-50 rounded-lg p-6 text-center min-h-[200px] flex flex-col justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-blue-600 text-sm">Loading weather data...</p>
      </div>
    );
  }

  // Error state
  if (weatherState.error && weatherState.retryCount > 2) {
    console.log(`🎯 [WEATHER DEBUG] WeatherCard returning error state for ${segment.endCity}:`, {
      component: 'WeatherCard -> error-state',
      error: weatherState.error,
      retryCount: weatherState.retryCount
    });

    return (
      <div className="bg-red-50 rounded-lg p-6 text-center min-h-[200px] flex flex-col justify-center border border-red-200">
        <Cloud className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-700 text-sm mb-2">Weather unavailable</p>
        <p className="text-red-600 text-xs">{weatherState.error}</p>
      </div>
    );
  }

  // 🎯 DEBUG: Log successful render path
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
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-route66-primary bg-route66-accent-light px-2 py-1 rounded">
                Day {segment.day}
              </span>
              <span className="text-gray-300">•</span>
              <h5 className="text-sm font-semibold text-route66-text-primary">
                {segment.endCity}
              </h5>
            </div>
            <span className="text-xs text-gray-500">
              {format(segmentDate, 'EEE, MMM d')}
            </span>
          </div>
        </div>
        
        {/* Weather Content */}
        <div className="p-4">
          {weatherState.weather ? (
            <>
              {/* 🎯 DEBUG: Log weather display */}
              {(() => {
                console.log(`🎯 [WEATHER DEBUG] WeatherCard displaying weather for ${segment.endCity}:`, {
                  component: 'WeatherCard -> SimpleWeatherDisplay',
                  weatherData: {
                    temperature: weatherState.weather.temperature,
                    description: weatherState.weather.description,
                    isActualForecast: weatherState.weather.isActualForecast
                  }
                });
                return null;
              })()}
              <SimpleWeatherDisplay
                weather={weatherState.weather}
                segmentDate={segmentDate}
                cityName={segment.endCity}
              />
            </>
          ) : (
            <>
              {/* 🎯 DEBUG: Log no weather data */}
              {(() => {
                console.log(`🎯 [WEATHER DEBUG] WeatherCard showing no weather for ${segment.endCity}:`, {
                  component: 'WeatherCard -> no-weather-fallback'
                });
                return null;
              })()}
              <div className="text-center py-8">
                <Cloud className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Loading weather...</p>
              </div>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default WeatherCard;
