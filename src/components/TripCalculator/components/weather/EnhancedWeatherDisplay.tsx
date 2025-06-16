
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import { WeatherDataValidator } from './WeatherDataValidator';
import { UnifiedStylingService } from './services/UnifiedStylingService';

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
  // Use unified validation
  const validationResult = React.useMemo(() => {
    return WeatherDataValidator.validateWeatherData(weather, cityName, segmentDate);
  }, [weather, cityName, segmentDate]);

  const { validation, normalizedWeather, isLiveForecast } = validationResult;

  // Use unified styling
  const styles = UnifiedStylingService.getWeatherStyles(validation.styleTheme);

  console.log('🎨 UNIFIED: EnhancedWeatherDisplay using unified styling for', cityName, {
    validation: validation.isLiveForecast ? 'LIVE' : 'HISTORICAL',
    styleTheme: validation.styleTheme,
    shouldBeGreen: isLiveForecast ? 'YES_GREEN' : 'NO_AMBER'
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

  const weatherIcon = getWeatherIcon(normalizedWeather.icon);
  const formattedDate = format(segmentDate, 'EEEE, MMM d');

  return (
    <div 
      className={`${styles.containerClasses} rounded-lg p-4 border relative`}
      style={{
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor
      }}
    >
      {/* Debug Overlay - shows unified validation result */}
      {showDebug && (
        <div className="absolute top-0 right-0 bg-black bg-opacity-95 text-white p-2 text-xs rounded-bl z-50 max-w-xs">
          <div className="font-bold mb-1">🎯 UNIFIED: {cityName}</div>
          <div className={`mb-1 font-bold ${isLiveForecast ? 'text-green-400' : 'text-yellow-400'}`}>
            {isLiveForecast ? '🟢 UNIFIED: LIVE' : '🟡 UNIFIED: HISTORICAL'}
          </div>
          <div>Source: {normalizedWeather.source}</div>
          <div>ActualForecast: {String(normalizedWeather.isActualForecast)}</div>
          <div>Confidence: {validation.confidence}</div>
          <div className="font-bold mt-1">
            Theme: {validation.styleTheme.toUpperCase()}
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
            {Math.round(normalizedWeather.temperature)}°F
          </div>
          <div className="text-sm capitalize" style={{ color: styles.textColor }}>
            {normalizedWeather.description}
          </div>
        </div>
      </div>

      {/* Temperature range if available */}
      {normalizedWeather.highTemp && normalizedWeather.lowTemp && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: styles.textColor }}>
              {Math.round(normalizedWeather.highTemp)}°F
            </div>
            <div className="text-xs" style={{ color: styles.textColor }}>High</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: styles.textColor }}>
              {Math.round(normalizedWeather.lowTemp)}°F
            </div>
            <div className="text-xs" style={{ color: styles.textColor }}>Low</div>
          </div>
        </div>
      )}
      
      {/* Weather details */}
      <div className="flex justify-between text-sm mb-3" style={{ color: styles.textColor }}>
        <span>💧 {normalizedWeather.precipitationChance || 0}%</span>
        <span>💨 {Math.round(normalizedWeather.windSpeed || 0)} mph</span>
        <span>💦 {normalizedWeather.humidity || 0}%</span>
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
