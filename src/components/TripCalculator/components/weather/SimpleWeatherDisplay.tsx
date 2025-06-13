
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDataNormalizer } from './services/WeatherDataNormalizer';
import TemperatureDisplay from './TemperatureDisplay';
import WeatherIcon from './WeatherIcon';
import WeatherStats from './WeatherStats';
import WeatherStatusBadge from './WeatherStatusBadge';

interface SimpleWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate?: Date | null;
  cityName: string;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const SimpleWeatherDisplay: React.FC<SimpleWeatherDisplayProps> = ({
  weather,
  segmentDate,
  cityName,
  isSharedView = false,
  isPDFExport = false
}) => {
  console.log('🌤️ SimpleWeatherDisplay rendering:', {
    cityName,
    weather,
    hasTemperature: weather.temperature !== undefined,
    hasHighTemp: weather.highTemp !== undefined,
    hasLowTemp: weather.lowTemp !== undefined
  });

  // Normalize weather data
  const normalizedWeather = WeatherDataNormalizer.normalizeWeatherData(weather, cityName, segmentDate);

  if (!normalizedWeather) {
    console.log('❌ SimpleWeatherDisplay: No valid normalized weather data');
    return (
      <div className="bg-gray-50 rounded p-4 text-center">
        <div className="text-sm text-gray-500">Weather data unavailable</div>
      </div>
    );
  }

  console.log('✅ SimpleWeatherDisplay: Using normalized weather:', normalizedWeather);

  return (
    <div className="space-y-3">
      {/* Weather Status Badge */}
      <WeatherStatusBadge 
        type={normalizedWeather.isActualForecast ? "forecast" : "seasonal"} 
      />
      
      {/* Main Weather Display */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Weather Icon and Description */}
        <div className="text-center p-4 bg-gradient-to-b from-blue-50 to-white">
          <WeatherIcon 
            iconCode={normalizedWeather.icon} 
            description={normalizedWeather.description}
            className="h-16 w-16 mx-auto mb-2"
          />
          <div className="font-medium text-gray-800 capitalize mb-1">
            {normalizedWeather.description}
          </div>
          {segmentDate && (
            <div className="text-xs text-gray-600">
              {segmentDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          )}
        </div>

        {/* Temperature Display - FIXED */}
        <div className="p-4">
          <TemperatureDisplay
            type="range"
            highTemp={normalizedWeather.highTemp}
            lowTemp={normalizedWeather.lowTemp}
          />
        </div>

        {/* Weather Stats */}
        <div className="px-4 pb-4">
          <WeatherStats
            humidity={normalizedWeather.humidity}
            windSpeed={normalizedWeather.windSpeed}
            precipitationChance={normalizedWeather.precipitationChance}
            layout="card"
          />
        </div>
      </div>

      {/* Data Source Info */}
      <div className="text-xs text-center text-gray-500">
        {normalizedWeather.isActualForecast 
          ? `📡 Live forecast from ${normalizedWeather.source}` 
          : `📊 ${normalizedWeather.source} data`
        }
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
