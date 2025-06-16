
import React from 'react';
import { format } from 'date-fns';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { UnifiedWeatherValidator } from './services/UnifiedWeatherValidator';
import { UnifiedStylingService } from './services/UnifiedStylingService';
import WeatherIcon from './WeatherIcon';

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
  showDebug = false
}) => {
  // PLAN IMPLEMENTATION: Use enhanced unified validation WITH segment date
  const validation = UnifiedWeatherValidator.validateWeatherData(weather, segmentDate);
  const styles = UnifiedStylingService.getWeatherStyles(validation.styleTheme);

  console.log('🎨 PLAN: EnhancedWeatherDisplay using ENHANCED date-based validation:', {
    cityName,
    segmentDate: segmentDate.toLocaleDateString(),
    validation: validation.isLiveForecast ? 'LIVE' : 'HISTORICAL',
    styleTheme: validation.styleTheme,
    displayLabel: validation.displayLabel,
    dateBasedDecision: validation.dateBasedDecision,
    daysFromToday: validation.daysFromToday,
    forecastRangeCheck: validation.forecastRangeCheck,
    weatherData: {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp
    },
    planImplementation: 'ENHANCED_DATE_BASED_VALIDATION',
    forceKey
  });

  const formatTime = (hours?: number): string => {
    if (!hours) return 'N/A';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const getTemperatureDisplay = (): string => {
    if (weather.temperature) {
      return `${Math.round(weather.temperature)}°F`;
    }
    if (weather.highTemp && weather.lowTemp) {
      return `${Math.round(weather.lowTemp)}° - ${Math.round(weather.highTemp)}°F`;
    }
    if (weather.highTemp) {
      return `High: ${Math.round(weather.highTemp)}°F`;
    }
    return 'Temperature not available';
  };

  return (
    <div 
      key={`enhanced-weather-${cityName}-${forceKey}`}
      className={`rounded-lg border p-4 shadow-sm transition-all duration-200 ${styles.containerClasses}`}
      style={{ backgroundColor: styles.backgroundColor, borderColor: styles.borderColor }}
    >
      {/* Weather Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {weather.icon && (
            <WeatherIcon iconCode={weather.icon} className="w-10 h-10" />
          )}
          <div>
            <h4 className="font-semibold text-lg" style={{ color: styles.textColor }}>
              {weather.description || 'Weather Forecast'}
            </h4>
            <div className="text-sm opacity-75" style={{ color: styles.textColor }}>
              {format(segmentDate, 'EEEE, MMMM d, yyyy')}
            </div>
          </div>
        </div>
        
        {/* PLAN IMPLEMENTATION: Enhanced Badge with date-based validation */}
        <div className="flex flex-col items-end gap-1">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles.badgeClasses}`}>
            {validation.badgeText}
            {showDebug && validation.dateBasedDecision && (
              <span className="ml-1 opacity-75">
                ({validation.daysFromToday}d)
              </span>
            )}
          </span>
          {showDebug && (
            <div className="text-xs opacity-60" style={{ color: styles.textColor }}>
              {validation.dateBasedDecision ? 'Date-based' : 'Object-based'}
            </div>
          )}
        </div>
      </div>

      {/* Temperature Display */}
      <div className="mb-4">
        <div className="text-3xl font-bold mb-1" style={{ color: styles.textColor }}>
          {getTemperatureDisplay()}
        </div>
        <div className="text-sm opacity-75" style={{ color: styles.textColor }}>
          {weather.description || 'Conditions'}
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {weather.humidity !== undefined && (
          <div className="text-center p-2 bg-white bg-opacity-50 rounded">
            <div className="font-semibold" style={{ color: styles.textColor }}>
              {weather.humidity}%
            </div>
            <div className="text-xs opacity-75" style={{ color: styles.textColor }}>
              Humidity
            </div>
          </div>
        )}
        
        {weather.windSpeed !== undefined && (
          <div className="text-center p-2 bg-white bg-opacity-50 rounded">
            <div className="font-semibold" style={{ color: styles.textColor }}>
              {Math.round(weather.windSpeed)} mph
            </div>
            <div className="text-xs opacity-75" style={{ color: styles.textColor }}>
              Wind Speed
            </div>
          </div>
        )}
        
        {weather.precipitationChance !== undefined && (
          <div className="text-center p-2 bg-white bg-opacity-50 rounded">
            <div className="font-semibold" style={{ color: styles.textColor }}>
              {weather.precipitationChance}%
            </div>
            <div className="text-xs opacity-75" style={{ color: styles.textColor }}>
              Rain Chance
            </div>
          </div>
        )}
      </div>

      {/* PLAN IMPLEMENTATION: Enhanced Source Information with debug details */}
      <div className="pt-3 border-t border-white border-opacity-25">
        <div className="flex items-center justify-between text-xs" style={{ color: styles.sourceColor }}>
          <span>{validation.displayLabel}</span>
          {showDebug && (
            <div className="flex gap-2 font-mono opacity-75">
              <span>{weather.source || 'unknown'}</span>
              <span>|</span>
              <span>{validation.confidence}</span>
              {validation.dateBasedDecision && (
                <>
                  <span>|</span>
                  <span>range: {validation.forecastRangeCheck ? 'YES' : 'NO'}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedWeatherDisplay;
