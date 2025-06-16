
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

  // CRITICAL FIX: Use the validation result's isLiveForecast directly
  const isLiveForecast = validation.isLiveForecast;

  console.log('🚨 CRITICAL FIX: EnhancedWeatherDisplay using validation result for', cityName, {
    originalWeatherSource: weather.source,
    originalIsActualForecast: weather.isActualForecast,
    validationIsLiveForecast: validation.isLiveForecast,
    normalizedSource: validatedWeather.source,
    normalizedIsActualForecast: validatedWeather.isActualForecast,
    finalIsLiveForecast: isLiveForecast,
    temperature: validatedWeather.temperature,
    criticalFix: true,
    shouldBeGreen: isLiveForecast ? 'YES_GREEN' : 'NO_AMBER'
  });

  // CRITICAL FIX: Force green styling when validation confirms live weather
  const styles = React.useMemo(() => {
    if (isLiveForecast) {
      console.log('🟢 CRITICAL FIX: Forcing GREEN styling for validated live weather:', cityName);
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
      console.log('🟡 CRITICAL FIX: Using AMBER styling for historical weather:', cityName);
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
      {/* Debug Overlay - shows validation-based detection */}
      {showDebug && (
        <div className="absolute top-0 right-0 bg-black bg-opacity-95 text-white p-2 text-xs rounded-bl z-50 max-w-xs">
          <div className="font-bold mb-1">🔧 CRITICAL FIX: {cityName}</div>
          <div className={`mb-1 font-bold ${isLiveForecast ? 'text-green-400' : 'text-yellow-400'}`}>
            {isLiveForecast ? '🟢 VALIDATION: LIVE' : '🟡 VALIDATION: HISTORICAL'}
          </div>
          <div>Orig Source: {weather.source}</div>
          <div>Orig ActualForecast: {String(weather.isActualForecast)}</div>
          <div>Valid Source: {validatedWeather.source}</div>
          <div>Valid ActualForecast: {String(validatedWeather.isActualForecast)}</div>
          <div>Validation isLive: {String(validation.isLiveForecast)}</div>
          <div className="font-bold mt-1">
            Style: {isLiveForecast ? 'GREEN' : 'AMBER'}
          </div>
        </div>
      )}

      {/* Header with city and date */}
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold" style={{ color: styles.textColor }}>
          {cityName}
        </h5>
        <span className={`text-xs px-2 py-1 rounded ${styles.badgeClasses}`}>
          {formattedDate}
        </span>
      </div>
      
      {/* Weather icon and temperature */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl">
          {weatherIcon}
        </div>
        <div>
          <div className="text-3xl font-bold" style={{ color: styles.textColor }}>
            {Math.round(validatedWeather.temperature)}°F
          </div>
          <div className="text-sm capitalize" style={{ color: styles.textColor }}>
            {validatedWeather.description}
          </div>
        </div>
      </div>

      {/* Temperature range if available */}
      {validatedWeather.highTemp && validatedWeather.lowTemp && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: styles.textColor }}>
              {Math.round(validatedWeather.highTemp)}°F
            </div>
            <div className="text-xs" style={{ color: styles.textColor }}>High</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: styles.textColor }}>
              {Math.round(validatedWeather.lowTemp)}°F
            </div>
            <div className="text-xs" style={{ color: styles.textColor }}>Low</div>
          </div>
        </div>
      )}
      
      {/* Weather details */}
      <div className="flex justify-between text-sm mb-3" style={{ color: styles.textColor }}>
        <span>💧 {validatedWeather.precipitationChance || 0}%</span>
        <span>💨 {Math.round(validatedWeather.windSpeed || 0)} mph</span>
        <span>💦 {validatedWeather.humidity || 0}%</span>
      </div>

      {/* Source indicator */}
      <div className={`text-xs px-2 py-1 rounded text-center ${styles.badgeClasses}`}>
        <span style={{ color: styles.sourceColor }}>
          {styles.sourceLabel}
        </span>
        <div className="mt-1 text-xs opacity-80">
          {styles.badgeText}
        </div>
      </div>
    </div>
  );
};

export default EnhancedWeatherDisplay;
