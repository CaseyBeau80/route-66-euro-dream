
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';

interface SimpleWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate: Date;
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
  const isLiveForecast = weather.source === 'live_forecast' && weather.isActualForecast === true;
  
  console.log('🌤️ IMPROVED: SimpleWeatherDisplay with enhanced validation:', {
    cityName,
    segmentDate: segmentDate.toISOString(),
    segmentDateLocal: segmentDate.toLocaleDateString(),
    normalizedToday: new Date().toISOString().split('T')[0] + 'T05:00:00.000Z',
    normalizedSegmentDate: segmentDate.toISOString(),
    daysFromToday: Math.ceil((segmentDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)),
    isWithinReliableRange: Math.ceil((segmentDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)) <= 7,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    finalIsLiveWeather: isLiveForecast,
    temperature: weather.temperature,
    description: weather.description,
    improvedValidation: true,
    validationResult: isLiveForecast ? 'LIVE_FORECAST' : 'ESTIMATED_FORECAST',
    shouldShowLive: isLiveForecast ? 'YES' : 'NO'
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

  const weatherIcon = getWeatherIcon(weather.icon);
  const formattedDate = format(segmentDate, 'EEEE, MMM d');

  // Determine styling based on forecast type
  const styles = isLiveForecast ? {
    containerClasses: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    badgeClasses: 'bg-green-100 text-green-700 border-green-200',
    badgeText: '🟢 Live forecast',
    sourceLabel: 'Live Weather Forecast'
  } : {
    containerClasses: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200', 
    badgeClasses: 'bg-amber-100 text-amber-700 border-amber-200',
    badgeText: '📊 Historical estimate',
    sourceLabel: 'Historical Weather Data'
  };

  // Determine what temperature info to show
  const hasValidHigh = weather.highTemp && !isNaN(weather.highTemp);
  const hasValidLow = weather.lowTemp && !isNaN(weather.lowTemp);
  const hasValidCurrent = weather.temperature && !isNaN(weather.temperature);
  
  const shouldShowRange = hasValidHigh && hasValidLow && weather.highTemp !== weather.lowTemp;
  const shouldShowCurrent = hasValidCurrent && !shouldShowRange;

  console.log('🌡️ TEMPERATURE DISPLAY: Decision logic:', {
    cityName,
    hasValidHigh,
    hasValidLow, 
    hasValidCurrent,
    shouldShowRange,
    shouldShowCurrent,
    temperatures: {
      current: weather.temperature,
      high: weather.highTemp,
      low: weather.lowTemp
    }
  });

  return (
    <div className={`${styles.containerClasses} rounded-lg p-4 border`}>
      {/* Header with date and source */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-600">
          {styles.sourceLabel}
        </span>
        <span className="text-xs text-gray-500">
          {formattedDate}
        </span>
      </div>

      {/* Main weather display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{weatherIcon}</div>
          <div>
            {/* Temperature Display */}
            {shouldShowRange ? (
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(weather.lowTemp!)}°-{Math.round(weather.highTemp!)}°F
              </div>
            ) : shouldShowCurrent ? (
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(weather.temperature)}°F
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-800">
                Weather Available
              </div>
            )}
            
            <div className="text-sm text-gray-600 capitalize">
              {weather.description}
            </div>
          </div>
        </div>

        {/* Weather details */}
        <div className="text-right text-xs text-gray-600">
          {weather.humidity && (
            <div>💧 {weather.humidity}%</div>
          )}
          {weather.windSpeed && (
            <div>💨 {weather.windSpeed} mph</div>
          )}
          {weather.precipitationChance && weather.precipitationChance > 0 && (
            <div>🌧️ {weather.precipitationChance}%</div>
          )}
        </div>
      </div>

      {/* Source badge */}
      <div className="mt-3 flex justify-center">
        <span className={`px-2 py-1 rounded text-xs border ${styles.badgeClasses}`}>
          {styles.badgeText}
        </span>
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
