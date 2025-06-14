
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
  showDebug = true
}) => {
  // Force re-render timestamp
  const [renderTimestamp] = React.useState(() => Date.now());
  
  // Validate weather data first
  const validation = React.useMemo(() => {
    return WeatherDataValidator.validateWeatherData(weather, cityName, segmentDate);
  }, [weather, cityName, segmentDate]);

  // Use validated weather data
  const validatedWeather = validation.normalizedWeather;

  // FIXED: Explicit live weather detection with immediate application
  const isLiveForecast = React.useMemo(() => {
    const hasLiveSource = validatedWeather.source === 'live_forecast';
    const hasLiveFlag = validatedWeather.isActualForecast === true;
    const result = hasLiveSource && hasLiveFlag;
    
    console.log('🔧 FIXED: Explicit live weather detection in EnhancedWeatherDisplay:', {
      cityName,
      hasLiveSource,
      hasLiveFlag,
      finalResult: result,
      weatherSource: validatedWeather.source,
      isActualForecast: validatedWeather.isActualForecast,
      temperature: validatedWeather.temperature,
      isSharedView,
      renderTimestamp
    });
    
    return result;
  }, [validatedWeather, cityName, isSharedView, renderTimestamp]);

  // FIXED: Display configuration that directly uses the detection result
  const displayConfig = React.useMemo(() => {
    const config = isLiveForecast ? {
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

    console.log('🔧 FIXED: Display config applied:', {
      cityName,
      isLiveForecast,
      sourceLabel: config.sourceLabel,
      badgeText: config.badgeText,
      weatherSource: validatedWeather.source,
      isActualForecast: validatedWeather.isActualForecast,
      renderTimestamp
    });

    return config;
  }, [isLiveForecast, cityName, validatedWeather, renderTimestamp]);

  console.log('🔧 FIXED: EnhancedWeatherDisplay FINAL RENDER:', {
    cityName,
    forceKey,
    renderTimestamp,
    isLiveForecast,
    isSharedView,
    displayConfig: {
      sourceLabel: displayConfig.sourceLabel,
      backgroundStyle: displayConfig.backgroundStyle
    },
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

  return (
    <div 
      key={`fixed-weather-${cityName}-${forceKey}-${renderTimestamp}`}
      className={`${displayConfig.backgroundStyle} rounded-lg p-4 border ${displayConfig.borderStyle} relative`}
    >
      {/* Enhanced debug overlay - ALWAYS show for troubleshooting */}
      <div className="absolute top-0 right-0 bg-black bg-opacity-90 text-white p-2 text-xs rounded-bl z-50 max-w-xs">
        <div className="font-bold mb-1">🔍 FIXED: {cityName}</div>
        <div className={`mb-1 font-bold ${isLiveForecast ? 'text-green-400' : 'text-yellow-400'}`}>
          {isLiveForecast ? '🟢 LIVE FORECAST' : '🟡 HISTORICAL DATA'}
        </div>
        <div>Source: {validatedWeather.source}</div>
        <div>ActualForecast: {String(validatedWeather.isActualForecast)}</div>
        <div>Detection: {String(isLiveForecast)}</div>
        <div>Temp: {validatedWeather.temperature}°F</div>
        <div>Shared: {String(isSharedView)}</div>
        <div>Config: {isLiveForecast ? 'GREEN' : 'AMBER'}</div>
        <div>Time: {new Date().toISOString().split('T')[1]?.split('.')[0]}</div>
      </div>

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
