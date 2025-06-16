
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import WeatherIcon from './WeatherIcon';
import { WeatherTypeDetector } from './utils/WeatherTypeDetector';

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
  console.log('🔥 ULTIMATE SIMPLE DISPLAY: Component rendering for', cityName, {
    weather: {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      temperature: weather.temperature
    },
    segmentDate: segmentDate.toISOString(),
    componentName: 'SimpleWeatherDisplay',
    ultimateFix: true
  });

  // CRITICAL FIX: Use strict source-based weather determination
  const isLiveWeather = weather.source === 'live_forecast' && weather.isActualForecast === true;
  
  console.log('🔥 ULTIMATE SIMPLE DISPLAY: Strict source-based weather determination for', cityName, {
    source: weather.source,
    isActualForecast: weather.isActualForecast,
    isLiveWeather,
    explanation: isLiveWeather ? 'WILL_SHOW_GREEN_LIVE' : 'WILL_SHOW_AMBER_HISTORICAL',
    strictDetermination: true,
    ultimateFix: true
  });

  // CRITICAL FIX: Strict styling based on source
  const containerStyles = isLiveWeather
    ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
    : "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200";

  const sourceLabel = isLiveWeather
    ? "🟢 Live Weather Forecast"
    : "📊 Historical Weather Data";

  const badgeText = isLiveWeather
    ? "✨ Live forecast"
    : "📊 Historical data";

  const sourceColor = isLiveWeather ? "#059669" : "#d97706";

  console.log('🔥 ULTIMATE SIMPLE DISPLAY: Final rendering styles for', cityName, {
    isLiveWeather,
    containerStyles,
    sourceLabel,
    badgeText,
    sourceColor,
    shouldAppearGreen: isLiveWeather,
    shouldAppearAmber: !isLiveWeather,
    componentRendering: 'SimpleWeatherDisplay',
    ultimateFix: true
  });

  return (
    <div className={`${containerStyles} border rounded-lg p-4 space-y-3`}>
      {/* Header with date and source */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">
          {format(segmentDate, 'EEEE, MMMM d')}
        </div>
        <div className="flex items-center gap-1">
          <span 
            className="text-xs px-2 py-1 rounded-full text-white font-medium"
            style={{ backgroundColor: sourceColor }}
          >
            {badgeText}
          </span>
        </div>
      </div>

      {/* Weather content */}
      <div className="flex items-center gap-3">
        <WeatherIcon iconCode={weather.icon} className="w-12 h-12" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-gray-800">
              {weather.temperature || weather.highTemp}°F
            </span>
            {weather.highTemp && weather.lowTemp && weather.highTemp !== weather.lowTemp && (
              <span className="text-sm text-gray-600">
                H: {weather.highTemp}° L: {weather.lowTemp}°
              </span>
            )}
          </div>
          <div className="text-sm text-gray-700 capitalize mb-1">
            {weather.description}
          </div>
          <div className="text-xs font-medium" style={{ color: sourceColor }}>
            {sourceLabel}
          </div>
        </div>
      </div>

      {/* Weather details */}
      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 pt-2 border-t border-gray-200">
        <div className="text-center">
          <div className="font-medium">Humidity</div>
          <div>{weather.humidity}%</div>
        </div>
        <div className="text-center">
          <div className="font-medium">Wind</div>
          <div>{weather.windSpeed} mph</div>
        </div>
        <div className="text-center">
          <div className="font-medium">Rain</div>
          <div>{weather.precipitationChance}%</div>
        </div>
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
