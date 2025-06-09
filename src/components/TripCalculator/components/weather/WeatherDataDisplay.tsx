
import React from 'react';
import ForecastWeatherDisplay from './ForecastWeatherDisplay';
import CurrentWeatherDisplay from './CurrentWeatherDisplay';
import DismissibleSeasonalWarning from './DismissibleSeasonalWarning';
import WeatherDateMatchDebug from './WeatherDateMatchDebug';
import { validateWeatherData, getWeatherDisplayType } from './WeatherValidationService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface WeatherDataDisplayProps {
  weather: any;
  segmentDate: Date | null;
  segmentEndCity: string;
  isSharedView?: boolean;
  error?: string | null;
  retryCount?: number;
}

const WeatherDataDisplay: React.FC<WeatherDataDisplayProps> = ({
  weather,
  segmentDate,
  segmentEndCity,
  isSharedView = false,
  error = null,
  retryCount = 0
}) => {
  console.log(`🎨 WeatherDataDisplay: Rendering for ${segmentEndCity}:`, {
    hasWeather: !!weather,
    error,
    retryCount,
    segmentDate: segmentDate?.toISOString(),
    isSharedView,
    dateMatchInfo: weather?.dateMatchInfo
  });

  // Show debug info in development or when there are date matching issues
  const showDebugInfo = process.env.NODE_ENV === 'development' || 
                       (weather?.dateMatchInfo?.matchType !== 'exact' && weather?.isActualForecast);

  // Validate weather data first
  const validation = validateWeatherData(weather, segmentEndCity);
  const displayType = getWeatherDisplayType(validation, error, retryCount);
  
  console.log(`🎯 WeatherDataDisplay: Display decision for ${segmentEndCity}:`, {
    validation,
    displayType,
    error,
    retryCount,
    dateMatchInfo: weather?.dateMatchInfo
  });

  // Handle each display type with consistent messaging
  switch (displayType) {
    case 'live-forecast':
      if (weather?.isActualForecast !== undefined) {
        const forecastWeather = weather as ForecastWeatherData;
        return (
          <div className="space-y-2">
            <DismissibleSeasonalWarning
              message={`Live forecast from OpenWeatherMap for ${segmentDate?.toLocaleDateString()}`}
              type="forecast-unavailable"
              isSharedView={isSharedView}
            />
            <ForecastWeatherDisplay weather={forecastWeather} segmentDate={segmentDate} />
            <WeatherDateMatchDebug
              weather={forecastWeather}
              segmentDate={segmentDate}
              segmentEndCity={segmentEndCity}
              isVisible={showDebugInfo}
            />
          </div>
        );
      }
      // Fallback to current weather if not forecast structure
      return <CurrentWeatherDisplay weather={weather} segmentDate={segmentDate} />;

    case 'seasonal-estimate':
      if (weather?.isActualForecast !== undefined) {
        const forecastWeather = weather as ForecastWeatherData;
        return (
          <div className="space-y-2">
            <DismissibleSeasonalWarning
              message="Based on historical weather patterns"
              type="seasonal"
              isSharedView={isSharedView}
            />
            <ForecastWeatherDisplay weather={forecastWeather} segmentDate={segmentDate} />
            <WeatherDateMatchDebug
              weather={forecastWeather}
              segmentDate={segmentDate}
              segmentEndCity={segmentEndCity}
              isVisible={showDebugInfo}
            />
          </div>
        );
      }
      break;

    case 'service-unavailable':
      console.log(`❌ WeatherDataDisplay: Service unavailable for ${segmentEndCity} - suppressing all forecast data`);
      return (
        <div className="space-y-2">
          <DismissibleSeasonalWarning
            message={error || "Weather service temporarily unavailable"}
            type="forecast-unavailable"
            isSharedView={isSharedView}
          />
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-gray-400 text-2xl mb-2">🌤️</div>
            <p className="text-sm text-gray-600">
              Weather information temporarily unavailable
            </p>
          </div>
        </div>
      );

    case 'loading':
    default:
      return (
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="animate-pulse text-gray-500 text-sm">
            Loading weather information...
          </div>
        </div>
      );
  }

  // Fallback - should not reach here with proper validation
  console.warn(`⚠️ WeatherDataDisplay: Reached fallback for ${segmentEndCity}`);
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-gray-400 text-2xl mb-2">🌤️</div>
      <p className="text-sm text-gray-600">
        Weather information unavailable
      </p>
    </div>
  );
};

export default WeatherDataDisplay;
