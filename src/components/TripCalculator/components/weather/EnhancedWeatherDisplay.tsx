
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import { WeatherDataValidator } from './WeatherDataValidator';

interface EnhancedWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate: Date;
  cityName: string;
  isSharedView?: boolean;
  isPDFExport?: boolean;
  forceKey?: string;
  showDebug?: boolean;
}

const EnhancedWeatherDisplay: React.FC<EnhancedWeatherDisplayProps> = ({
  weather,
  segmentDate,
  cityName,
  isSharedView = false,
  isPDFExport = false,
  forceKey,
  showDebug = true
}) => {
  // Validate weather data and get the definitive live/historical determination
  const validation = React.useMemo(() => {
    return WeatherDataValidator.validateWeatherData(weather, cityName, segmentDate);
  }, [weather, cityName, segmentDate]);

  // Use the validation result as the single source of truth
  const isLiveForecast = validation.isLiveForecast;
  const validatedWeather = validation.normalizedWeather;

  console.log('🔧 FIXED: EnhancedWeatherDisplay - Using validation as single source of truth:', {
    cityName,
    originalSource: weather.source,
    originalIsActualForecast: weather.isActualForecast,
    validationIsLiveForecast: validation.isLiveForecast,
    finalIsLiveForecast: isLiveForecast,
    temperature: validatedWeather.temperature,
    fixedLogic: true
  });

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '🌨️', '13n': '🌨️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '⛅';
  };

  const weatherIcon = getWeatherIcon(validatedWeather.icon);
  const formattedDate = format(segmentDate, 'EEEE, MMM d');

  // CRITICAL: Use validation result to determine styling and labels
  if (isLiveForecast) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-4 relative">
        {/* Debug info */}
        {showDebug && (
          <div className="absolute top-0 right-0 bg-green-800 text-white p-2 text-xs rounded-bl z-50 max-w-xs">
            <div className="font-bold mb-1">🟢 LIVE WEATHER: {cityName}</div>
            <div className="text-green-200">Source: {weather.source}</div>
            <div className="text-green-200">Actual: {String(weather.isActualForecast)}</div>
            <div className="text-green-200">Validation: LIVE</div>
            <div className="text-green-200">Temp: {validatedWeather.temperature}°F</div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-green-800">
            🟢 Live Weather Forecast
          </span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>

        {/* Weather content */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{weatherIcon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(validatedWeather.temperature)}°F
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {validatedWeather.description}
              </div>
            </div>
          </div>

          <div className="text-right">
            {validatedWeather.highTemp && validatedWeather.lowTemp && (
              <div className="text-sm text-gray-600">
                H: {Math.round(validatedWeather.highTemp)}° L: {Math.round(validatedWeather.lowTemp)}°
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              💧 {validatedWeather.precipitationChance}% • 💨 {validatedWeather.windSpeed} mph
            </div>
          </div>
        </div>

        {/* Live status badge */}
        <div className="mt-2 text-center">
          <span className="inline-block text-xs px-2 py-1 rounded-full font-medium border bg-green-100 text-green-800 border-green-300">
            ✨ Current live forecast
          </span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-lg p-4 relative">
        {/* Debug info */}
        {showDebug && (
          <div className="absolute top-0 right-0 bg-amber-800 text-white p-2 text-xs rounded-bl z-50 max-w-xs">
            <div className="font-bold mb-1">🟡 HISTORICAL: {cityName}</div>
            <div className="text-amber-200">Source: {weather.source}</div>
            <div className="text-amber-200">Actual: {String(weather.isActualForecast)}</div>
            <div className="text-amber-200">Validation: HISTORICAL</div>
            <div className="text-amber-200">Temp: {validatedWeather.temperature}°F</div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-amber-800">
            🟡 Historical Weather Data
          </span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>

        {/* Weather content */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{weatherIcon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(validatedWeather.temperature)}°F
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {validatedWeather.description}
              </div>
            </div>
          </div>

          <div className="text-right">
            {validatedWeather.highTemp && validatedWeather.lowTemp && (
              <div className="text-sm text-gray-600">
                H: {Math.round(validatedWeather.highTemp)}° L: {Math.round(validatedWeather.lowTemp)}°
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              💧 {validatedWeather.precipitationChance}% • 💨 {validatedWeather.windSpeed} mph
            </div>
          </div>
        </div>

        {/* Historical status badge */}
        <div className="mt-2 text-center">
          <span className="inline-block text-xs px-2 py-1 rounded-full font-medium border bg-amber-100 text-amber-800 border-amber-300">
            📊 Based on historical patterns
          </span>
        </div>
      </div>
    );
  }
};

export default EnhancedWeatherDisplay;
