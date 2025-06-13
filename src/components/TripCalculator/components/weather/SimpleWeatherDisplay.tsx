
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { TemperatureExtractor } from './services/TemperatureExtractor';
import TemperatureDisplay from './TemperatureDisplay';
import WeatherIcon from './WeatherIcon';
import WeatherBadge from './components/WeatherBadge';
import WeatherInfo from './components/WeatherInfo';

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
  console.log('🔧 SIMPLIFIED: SimpleWeatherDisplay for', cityName, {
    temperature: weather.temperature,
    isActualForecast: weather.isActualForecast,
    source: weather.source,
    hasTemperature: !!weather.temperature
  });

  // Extract temperatures
  const temperatures = React.useMemo(() => {
    const extracted = TemperatureExtractor.extractTemperatures(weather, cityName);
    console.log('🌡️ SimpleWeatherDisplay: Extracted temperatures:', extracted);
    return extracted;
  }, [weather, cityName]);

  // Check if we have any displayable data
  if (!temperatures.isValid) {
    console.warn('❌ SimpleWeatherDisplay: No valid temperature data for', cityName);
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <div className="text-yellow-800 font-medium mb-2">
          Weather information unavailable
        </div>
        <div className="text-sm text-yellow-600">
          Unable to display weather data for {cityName}
        </div>
      </div>
    );
  }

  // Determine what to show
  const showRange = !isNaN(temperatures.high) || !isNaN(temperatures.low);
  const showCurrent = !isNaN(temperatures.current) && !showRange;

  // Simple footer message
  const isLive = weather.isActualForecast === true || weather.source === 'live_forecast';
  const footerMessage = isLive 
    ? 'Real-time weather forecast from API'
    : 'Historical weather patterns - live forecast not available';

  console.log('🔧 SIMPLIFIED: Display decision for', cityName, {
    showRange,
    showCurrent,
    isLive,
    temperatures
  });

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      {/* Weather Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {weather.icon && (
            <WeatherIcon iconCode={weather.icon} className="w-8 h-8" />
          )}
          <div>
            <h4 className="font-medium text-blue-900">
              {weather.description || 'Weather Forecast'}
            </h4>
            {segmentDate && (
              <div className="text-sm text-blue-600">
                {segmentDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            )}
          </div>
        </div>
        
        <WeatherBadge
          source={weather.source || 'historical_fallback'}
          isActualForecast={weather.isActualForecast}
          dateMatchSource={weather.dateMatchInfo?.source}
          cityName={cityName}
        />
      </div>

      {/* Temperature Display */}
      <div className="mb-3">
        {showCurrent && (
          <TemperatureDisplay
            type="current"
            currentTemp={temperatures.current}
          />
        )}
        
        {showRange && (
          <TemperatureDisplay
            type="range"
            highTemp={temperatures.high}
            lowTemp={temperatures.low}
          />
        )}
      </div>

      {/* Additional Weather Info */}
      <WeatherInfo
        humidity={weather.humidity}
        windSpeed={weather.windSpeed}
        precipitationChance={weather.precipitationChance}
      />

      {/* Footer message */}
      <div className="mt-3 text-xs text-blue-500 text-center">
        {footerMessage}
      </div>

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500 text-center border-t pt-2">
          Debug: temp={weather.temperature}, source={weather.source}, isLive={weather.isActualForecast}
        </div>
      )}
    </div>
  );
};

export default SimpleWeatherDisplay;
