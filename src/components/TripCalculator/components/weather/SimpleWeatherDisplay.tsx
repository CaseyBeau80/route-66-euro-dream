
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import { DateNormalizationService } from './DateNormalizationService';

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
  console.log('🔥 SIMPLE WEATHER DISPLAY: Component rendering for', cityName, {
    weather: {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      temperature: weather.temperature
    },
    segmentDate: segmentDate.toISOString(),
    componentName: 'SimpleWeatherDisplay'
  });

  // ULTIMATE FIX: Direct weather data property check without any date logic
  const isLiveWeather = weather.source === 'live_forecast' && weather.isActualForecast === true;
  
  console.log('🔥 SIMPLE WEATHER DISPLAY: Direct live weather check for', cityName, {
    source: weather.source,
    isActualForecast: weather.isActualForecast,
    isLiveWeather,
    explanation: isLiveWeather ? 'SHOULD_SHOW_GREEN_LIVE' : 'SHOULD_SHOW_YELLOW_HISTORICAL'
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

  // Temperature display logic
  const temperatureDisplay = React.useMemo(() => {
    const hasValidCurrent = !!(weather.temperature && !isNaN(weather.temperature));
    const hasValidHigh = !!(weather.highTemp && !isNaN(weather.highTemp));
    const hasValidLow = !!(weather.lowTemp && !isNaN(weather.lowTemp));
    
    const shouldShowRange = hasValidHigh && hasValidLow && weather.highTemp !== weather.lowTemp;
    const shouldShowCurrent = hasValidCurrent && (!shouldShowRange || weather.temperature !== weather.highTemp);

    if (shouldShowCurrent) {
      return `${Math.round(weather.temperature)}°F`;
    } else if (shouldShowRange) {
      return `${Math.round(weather.highTemp)}°F / ${Math.round(weather.lowTemp)}°F`;
    } else if (hasValidCurrent) {
      return `${Math.round(weather.temperature)}°F`;
    } else {
      return 'N/A';
    }
  }, [weather, cityName]);

  const weatherIcon = getWeatherIcon(weather.icon);
  const formattedDate = format(segmentDate, 'EEEE, MMM d');

  // ULTIMATE FIX: Use direct weather data properties for styling
  const containerStyles = isLiveWeather
    ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
    : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200';

  const sourceLabel = isLiveWeather
    ? '🟢 Live Weather Forecast'
    : '🟡 Historical Weather Data';

  const sourceColor = isLiveWeather
    ? '#059669' // Green-600
    : '#d97706'; // Amber-600

  const badgeText = isLiveWeather
    ? '✨ Live forecast'
    : '📊 Historical estimate';

  console.log('🔥 SIMPLE WEATHER DISPLAY: Final rendering styles for', cityName, {
    isLiveWeather,
    containerStyles,
    sourceLabel,
    badgeText,
    sourceColor,
    shouldAppearGreen: isLiveWeather,
    componentRendering: 'SimpleWeatherDisplay'
  });

  return (
    <div className={`${containerStyles} rounded-lg p-4 border`}>
      {/* Weather Source Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span 
          className="text-xs font-medium"
          style={{ color: sourceColor }}
        >
          {sourceLabel}
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
              {temperatureDisplay}
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {weather.description}
            </div>
          </div>
        </div>

        <div className="text-right text-sm text-gray-600">
          <div>💧 {weather.precipitationChance}%</div>
          <div>💨 {weather.windSpeed} mph</div>
        </div>
      </div>

      {/* Weather Status Badge */}
      <div className="mt-2 text-center">
        <span 
          className={`inline-block text-xs px-2 py-1 rounded-full font-medium border ${
            isLiveWeather 
              ? 'bg-green-100 text-green-700 border-green-200'
              : 'bg-amber-100 text-amber-700 border-amber-200'
          }`}
        >
          {badgeText}
        </span>
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
