
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import { WeatherDataValidator } from './WeatherDataValidator';
import WeatherDebugOverlay from './WeatherDebugOverlay';

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
  showDebug = process.env.NODE_ENV === 'development'
}) => {
  // Force re-render timestamp
  const [renderTimestamp] = React.useState(() => Date.now());
  
  // Validate weather data
  const validation = React.useMemo(() => {
    return WeatherDataValidator.validateWeatherData(weather, cityName, segmentDate);
  }, [weather, cityName, segmentDate]);

  // Use validated weather data
  const validatedWeather = validation.normalizedWeather;
  const isLiveForecast = validation.isLiveForecast;

  console.log('🚀 EnhancedWeatherDisplay FORCED RENDER:', {
    cityName,
    forceKey,
    renderTimestamp,
    isLiveForecast,
    validation: {
      isValid: validation.isValid,
      errors: validation.validationErrors
    },
    weatherData: {
      source: validatedWeather.source,
      isActualForecast: validatedWeather.isActualForecast,
      temperature: validatedWeather.temperature
    }
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
  
  // Determine display configuration based on validation
  const displayConfig = isLiveForecast ? {
    sourceLabel: '🟢 Live Weather Forecast',
    sourceColor: 'text-green-600',
    badgeText: '✨ Current live forecast',
    badgeStyle: 'bg-green-100 text-green-700',
    backgroundStyle: 'bg-gradient-to-br from-green-50 to-green-100',
    borderStyle: 'border-green-200'
  } : {
    sourceLabel: '🟡 Historical Weather Data',
    sourceColor: 'text-amber-600',
    badgeText: '📊 Based on historical patterns',
    badgeStyle: 'bg-amber-100 text-amber-700',
    backgroundStyle: 'bg-gradient-to-br from-blue-50 to-blue-100',
    borderStyle: 'border-blue-200'
  };

  return (
    <div 
      key={`weather-${cityName}-${forceKey}-${renderTimestamp}`}
      className={`${displayConfig.backgroundStyle} rounded-lg p-4 border ${displayConfig.borderStyle} relative`}
    >
      {/* Debug overlay */}
      <WeatherDebugOverlay
        weather={validatedWeather}
        cityName={cityName}
        segmentDate={segmentDate}
        isVisible={showDebug}
      />

      {/* Weather Source Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium ${displayConfig.sourceColor}`}>
          {displayConfig.sourceLabel}
        </span>
        <span className="text-xs text-gray-500">
          {formattedDate}
        </span>
      </div>

      {/* Main Weather Display */}
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

      {/* Weather Status Badge */}
      <div className="mt-2 text-center">
        <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${displayConfig.badgeStyle}`}>
          {displayConfig.badgeText}
        </span>
      </div>

      {/* Validation errors (dev only) */}
      {showDebug && validation.validationErrors.length > 0 && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
          Validation errors: {validation.validationErrors.join(', ')}
        </div>
      )}
    </div>
  );
};

export default EnhancedWeatherDisplay;
