
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
  // Validate weather data first
  const validation = React.useMemo(() => {
    return WeatherDataValidator.validateWeatherData(weather, cityName, segmentDate);
  }, [weather, cityName, segmentDate]);

  // Use validated weather data
  const validatedWeather = validation.normalizedWeather;

  // SIMPLIFIED: Direct live weather detection without complex memoization
  const isLiveForecast = validatedWeather.source === 'live_forecast' && validatedWeather.isActualForecast === true;

  console.log('🟢 SIMPLIFIED: EnhancedWeatherDisplay live detection:', {
    cityName,
    source: validatedWeather.source,
    isActualForecast: validatedWeather.isActualForecast,
    isLiveForecast,
    directCheck: true
  });

  // SIMPLIFIED: Direct styling based on live detection
  const styles = React.useMemo(() => {
    if (isLiveForecast) {
      return {
        sourceLabel: '🟢 Live Weather Forecast',
        sourceColor: 'text-green-600',
        badgeText: '✨ Current live forecast',
        badgeClasses: 'bg-green-100 text-green-700 border-green-200',
        containerClasses: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
        isLive: true
      };
    } else {
      return {
        sourceLabel: '🟡 Historical Weather Data',
        sourceColor: 'text-amber-600',
        badgeText: '📊 Based on historical patterns',
        badgeClasses: 'bg-amber-100 text-amber-700 border-amber-200',
        containerClasses: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
        isLive: false
      };
    }
  }, [isLiveForecast]);

  console.log('🟢 SIMPLIFIED: Final styling for', cityName, {
    isLiveForecast,
    sourceLabel: styles.sourceLabel,
    isLive: styles.isLive,
    containerClasses: styles.containerClasses
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
      className={`${styles.containerClasses} rounded-lg p-4 border relative`}
      style={{
        backgroundColor: isLiveForecast ? '#dcfce7' : '#fef3c7',
        borderColor: isLiveForecast ? '#bbf7d0' : '#fde68a'
      }}
    >
      {/* Simplified Debug Overlay */}
      {showDebug && (
        <div className="absolute top-0 right-0 bg-black bg-opacity-95 text-white p-2 text-xs rounded-bl z-50 max-w-xs">
          <div className="font-bold mb-1">🟢 SIMPLIFIED: {cityName}</div>
          <div className={`mb-1 font-bold ${isLiveForecast ? 'text-green-400' : 'text-yellow-400'}`}>
            {isLiveForecast ? '🟢 LIVE DETECTED' : '🟡 HISTORICAL DETECTED'}
          </div>
          <div>Source: {validatedWeather.source}</div>
          <div>ActualForecast: {String(validatedWeather.isActualForecast)}</div>
          <div>isLiveForecast: {String(isLiveForecast)}</div>
          <div>Styling: {isLiveForecast ? 'GREEN' : 'AMBER'}</div>
        </div>
      )}

      {/* Weather Source Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span 
          className={`text-xs font-medium ${styles.sourceColor}`}
          style={{ 
            color: isLiveForecast ? '#059669' : '#d97706'
          }}
        >
          {styles.sourceLabel}
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
        <span 
          className={`inline-block text-xs px-2 py-1 rounded-full font-medium border ${styles.badgeClasses}`}
          style={{
            backgroundColor: isLiveForecast ? '#dcfce7' : '#fef3c7',
            color: isLiveForecast ? '#166534' : '#92400e',
            borderColor: isLiveForecast ? '#bbf7d0' : '#fde68a'
          }}
        >
          {styles.badgeText}
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
