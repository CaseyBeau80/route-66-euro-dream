
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
  // CRITICAL FIX: Generate unique render key to force re-render
  const [renderKey] = React.useState(() => `weather-${cityName}-${Date.now()}`);
  
  // Validate weather data first
  const validation = React.useMemo(() => {
    return WeatherDataValidator.validateWeatherData(weather, cityName, segmentDate);
  }, [weather, cityName, segmentDate]);

  // Use validated weather data
  const validatedWeather = validation.normalizedWeather;

  // CRITICAL FIX: Simplified and explicit live weather detection
  const isLiveForecast = React.useMemo(() => {
    const isLive = validatedWeather.source === 'live_forecast' && validatedWeather.isActualForecast === true;
    
    console.log('🚨 CRITICAL FIX: Live weather detection in EnhancedWeatherDisplay:', {
      cityName,
      source: validatedWeather.source,
      isActualForecast: validatedWeather.isActualForecast,
      isLive,
      renderKey,
      timestamp: new Date().toISOString()
    });
    
    return isLive;
  }, [validatedWeather.source, validatedWeather.isActualForecast, cityName, renderKey]);

  // CRITICAL FIX: Force display config to update based on live detection
  const displayConfig = React.useMemo(() => {
    console.log('🚨 CRITICAL FIX: Creating display config for:', {
      cityName,
      isLiveForecast,
      renderKey
    });

    if (isLiveForecast) {
      return {
        sourceLabel: '🟢 Live Weather Forecast',
        sourceColor: 'text-green-600',
        badgeText: '✨ Current live forecast',
        badgeStyle: 'bg-green-100 text-green-700 border-green-200',
        backgroundStyle: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
        borderStyle: 'border-green-200'
      };
    } else {
      return {
        sourceLabel: '🟡 Historical Weather Data',
        sourceColor: 'text-amber-600',
        badgeText: '📊 Based on historical patterns',
        badgeStyle: 'bg-amber-100 text-amber-700 border-amber-200',
        backgroundStyle: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
        borderStyle: 'border-amber-200'
      };
    }
  }, [isLiveForecast, cityName, renderKey]);

  console.log('🚨 CRITICAL FIX: EnhancedWeatherDisplay FINAL RENDER STATE:', {
    cityName,
    isLiveForecast,
    displayConfig: {
      sourceLabel: displayConfig.sourceLabel,
      backgroundStyle: displayConfig.backgroundStyle,
      badgeStyle: displayConfig.badgeStyle
    },
    weatherData: {
      source: validatedWeather.source,
      isActualForecast: validatedWeather.isActualForecast,
      temperature: validatedWeather.temperature
    },
    renderKey,
    forceKey
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
      key={renderKey}
      className={`${displayConfig.backgroundStyle} rounded-lg p-4 border ${displayConfig.borderStyle} relative`}
    >
      {/* CRITICAL DEBUG: Show exact state */}
      <div className="absolute top-0 right-0 bg-black bg-opacity-95 text-white p-2 text-xs rounded-bl z-50 max-w-xs">
        <div className="font-bold mb-1">🚨 CRITICAL FIX: {cityName}</div>
        <div className={`mb-1 font-bold ${isLiveForecast ? 'text-green-400' : 'text-yellow-400'}`}>
          {isLiveForecast ? '🟢 LIVE DETECTED' : '🟡 HISTORICAL DETECTED'}
        </div>
        <div>Source: {validatedWeather.source}</div>
        <div>ActualForecast: {String(validatedWeather.isActualForecast)}</div>
        <div>isLiveForecast: {String(isLiveForecast)}</div>
        <div>Label: {displayConfig.sourceLabel}</div>
        <div>Background: {isLiveForecast ? 'GREEN' : 'AMBER'}</div>
        <div>Key: {renderKey}</div>
      </div>

      {/* Weather Source Indicator - FORCED STYLING */}
      <div className="flex items-center justify-between mb-2">
        <span 
          className={`text-xs font-medium ${displayConfig.sourceColor}`}
          style={{ 
            color: isLiveForecast ? '#059669' : '#d97706' // Force colors
          }}
        >
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

      {/* Weather Status Badge - FORCED STYLING */}
      <div className="mt-2 text-center">
        <span 
          className={`inline-block text-xs px-2 py-1 rounded-full font-medium border ${displayConfig.badgeStyle}`}
          style={{
            backgroundColor: isLiveForecast ? '#dcfce7' : '#fef3c7',
            color: isLiveForecast ? '#166534' : '#92400e',
            borderColor: isLiveForecast ? '#bbf7d0' : '#fde68a'
          }}
        >
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
