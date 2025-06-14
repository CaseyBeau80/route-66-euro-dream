
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
  // ENHANCED DEBUG: Force component re-render on every prop change
  const renderKey = React.useMemo(() => {
    return `${cityName}-${segmentDate.toISOString()}-${weather.source}-${weather.isActualForecast}-${Date.now()}`;
  }, [cityName, segmentDate, weather.source, weather.isActualForecast]);

  console.log('🔍 ENHANCED DEBUG: SimpleWeatherDisplay rendering with renderKey:', renderKey);
  console.log('🔍 ENHANCED DEBUG: SimpleWeatherDisplay FULL PROPS ANALYSIS:', {
    cityName,
    segmentDate: segmentDate.toISOString(),
    weather: {
      temperature: weather.temperature,
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      description: weather.description,
      icon: weather.icon
    },
    displayContext: {
      isSharedView,
      isPDFExport
    },
    renderingTimestamp: new Date().toISOString()
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
  
  // ENHANCED DEBUG: Multiple validation checks for live weather
  const sourceCheck = weather.source === 'live_forecast';
  const actualCheck = weather.isActualForecast === true;
  const isLiveForecast = sourceCheck && actualCheck;
  
  console.log('🔍 ENHANCED DEBUG: Live weather validation breakdown:', {
    renderKey,
    cityName,
    sourceValue: weather.source,
    sourceType: typeof weather.source,
    sourceCheck,
    actualValue: weather.isActualForecast,
    actualType: typeof weather.isActualForecast,
    actualCheck,
    finalIsLive: isLiveForecast,
    validationTimestamp: new Date().toISOString()
  });
  
  // ENHANCED DEBUG: Create source label with full debugging
  const sourceLabel = isLiveForecast ? '🟢 Live Weather Forecast' : '🟡 Historical Weather Data';
  const sourceColor = isLiveForecast ? 'text-green-600' : 'text-amber-600';

  console.log('🔍 ENHANCED DEBUG: Source label determination:', {
    renderKey,
    cityName,
    isLiveForecast,
    sourceLabel,
    sourceColor,
    labelingTimestamp: new Date().toISOString()
  });

  // ENHANCED DEBUG: Add visible debug info in development
  const showDebugInfo = !isPDFExport && (process.env.NODE_ENV === 'development' || window.location.search.includes('debug=true'));

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200" key={renderKey}>
      {/* ENHANCED DEBUG: Visible debug panel */}
      {showDebugInfo && (
        <div className="mb-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
          <div className="font-mono">
            <div>🔍 DEBUG: {renderKey}</div>
            <div>Source: {weather.source} ({typeof weather.source})</div>
            <div>Actual: {String(weather.isActualForecast)} ({typeof weather.isActualForecast})</div>
            <div>IsLive: {String(isLiveForecast)}</div>
            <div>Label: {sourceLabel}</div>
          </div>
        </div>
      )}

      {/* Weather Source Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium ${sourceColor}`}>
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
              {Math.round(weather.temperature)}°F
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {weather.description}
            </div>
          </div>
        </div>

        <div className="text-right">
          {weather.highTemp && weather.lowTemp && (
            <div className="text-sm text-gray-600">
              H: {Math.round(weather.highTemp)}° L: {Math.round(weather.lowTemp)}°
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            💧 {weather.precipitationChance}% • 💨 {weather.windSpeed} mph
          </div>
        </div>
      </div>

      {/* ENHANCED: Live Forecast Badge with debug info */}
      {isLiveForecast && (
        <div className="mt-2 text-center">
          <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
            ✨ Current live forecast
            {showDebugInfo && <span className="ml-1">🔍</span>}
          </span>
        </div>
      )}

      {/* ENHANCED: Historical Data Notice with debug info */}
      {!isLiveForecast && (
        <div className="mt-2 text-center">
          <span className="inline-block bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
            📊 Based on historical patterns
            {showDebugInfo && <span className="ml-1">🔍</span>}
          </span>
        </div>
      )}
    </div>
  );
};

export default SimpleWeatherDisplay;
