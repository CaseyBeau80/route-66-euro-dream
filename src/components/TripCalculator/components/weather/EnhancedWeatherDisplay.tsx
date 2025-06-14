
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import { WeatherDataValidator } from './WeatherDataValidator';
import { WeatherLabelService } from './services/WeatherLabelService';

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

  // CRITICAL FIX: Use centralized weather label service
  const isLiveForecast = WeatherLabelService.isLiveWeatherData(validatedWeather);
  const sourceLabel = WeatherLabelService.getWeatherSourceLabel(validatedWeather);

  console.log('🚨 CENTRALIZED FIX: EnhancedWeatherDisplay using WeatherLabelService for', cityName, {
    originalWeatherSource: weather.source,
    originalIsActualForecast: weather.isActualForecast,
    validatedSource: validatedWeather.source,
    validatedIsActualForecast: validatedWeather.isActualForecast,
    centralizedIsLiveForecast: isLiveForecast,
    centralizedSourceLabel: sourceLabel,
    temperature: validatedWeather.temperature,
    centralizedService: true
  });

  // CRITICAL FIX: Force styling based on centralized detection
  const styles = React.useMemo(() => {
    if (isLiveForecast) {
      console.log('🟢 CENTRALIZED FIX: Forcing GREEN styling for validated live weather:', cityName);
      return {
        sourceLabel: '🟢 Live Weather Forecast',
        sourceColor: '#059669', // Green-600
        badgeText: '✨ Current live forecast',
        badgeClasses: 'bg-green-100 text-green-700 border-green-200',
        containerClasses: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
        backgroundColor: '#dcfce7', // Green-100
        borderColor: '#bbf7d0', // Green-200
        textColor: '#166534', // Green-800
        isLive: true
      };
    } else {
      console.log('🟡 CENTRALIZED FIX: Using AMBER styling for historical weather:', cityName);
      return {
        sourceLabel: '🟡 Historical Weather Data',
        sourceColor: '#d97706', // Amber-600
        badgeText: '📊 Based on historical patterns',
        badgeClasses: 'bg-amber-100 text-amber-700 border-amber-200',
        containerClasses: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
        backgroundColor: '#fef3c7', // Amber-100
        borderColor: '#fde68a', // Amber-200
        textColor: '#92400e', // Amber-800
        isLive: false
      };
    }
  }, [isLiveForecast, cityName]);

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
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor
      }}
    >
      {/* Debug Overlay - shows centralized detection */}
      {showDebug && (
        <div className="absolute top-0 right-0 bg-black bg-opacity-95 text-white p-2 text-xs rounded-bl z-50 max-w-xs">
          <div className="font-bold mb-1">🔧 CENTRALIZED: {cityName}</div>
          <div className={`mb-1 font-bold ${isLiveForecast ? 'text-green-400' : 'text-yellow-400'}`}>
            {isLiveForecast ? '🟢 CENTRALIZED: LIVE' : '🟡 CENTRALIZED: HISTORICAL'}
          </div>
          <div>Orig Source: {weather.source}</div>
          <div>Orig ActualForecast: {String(weather.isActualForecast)}</div>
          <div>Valid Source: {validatedWeather.source}</div>
          <div>Valid ActualForecast: {String(validatedWeather.isActualForecast)}</div>
          <div>Centralized isLive: {String(isLiveForecast)}</div>
          <div className={isLiveForecast ? 'text-green-400' : 'text-yellow-400'}>
            Final Styling: {isLiveForecast ? 'GREEN FORCED' : 'AMBER'}
          </div>
          <div>Temp: {validatedWeather.temperature}°F</div>
        </div>
      )}

      {/* Weather Source Indicator - with centralized colors */}
      <div className="flex items-center justify-between mb-2">
        <span 
          className="text-xs font-medium"
          style={{ 
            color: styles.sourceColor
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

      {/* Weather Status Badge - with centralized styling */}
      <div className="mt-2 text-center">
        <span 
          className="inline-block text-xs px-2 py-1 rounded-full font-medium border"
          style={{
            backgroundColor: styles.backgroundColor,
            color: styles.textColor,
            borderColor: styles.borderColor
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
