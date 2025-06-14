
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import SimpleTemperatureDisplay from './SimpleTemperatureDisplay';

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
  // ULTIMATE FIX: Force complete re-computation on every render
  const currentTimestamp = Date.now();
  
  // ULTIMATE FIX: Calculate live forecast status with timestamp-based cache busting
  const isLiveForecast = React.useMemo(() => {
    const result = WeatherUtilityService.isLiveForecast(weather, segmentDate);
    console.log('🚨 ULTIMATE FIX: Live forecast calculation with timestamp:', {
      cityName,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      isLiveForecast: result,
      timestamp: currentTimestamp,
      ultimateFix: true
    });
    return result;
  }, [weather.source, weather.isActualForecast, segmentDate?.getTime(), currentTimestamp]);

  // ULTIMATE FIX: Calculate source label with timestamp-based cache busting
  const sourceLabel = React.useMemo(() => {
    const label = WeatherUtilityService.getWeatherSourceLabel(weather, segmentDate);
    console.log('🚨 ULTIMATE FIX: Source label calculation with timestamp:', {
      cityName,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      isLiveForecast,
      calculatedLabel: label,
      timestamp: currentTimestamp,
      ultimateFix: true
    });
    return label;
  }, [weather.source, weather.isActualForecast, isLiveForecast, segmentDate?.getTime(), currentTimestamp]);

  // ULTIMATE FIX: Render key with all critical data to force complete re-render
  const ultimateRenderKey = `${weather.source}-${weather.isActualForecast}-${weather.temperature}-${isLiveForecast}-${sourceLabel}-${currentTimestamp}`;

  console.log('🚨 ULTIMATE FIX: SimpleWeatherDisplay rendering with forced reactivity:', {
    cityName,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    isLiveForecast,
    sourceLabel,
    temperature: weather.temperature,
    highTemp: weather.highTemp,
    lowTemp: weather.lowTemp,
    description: weather.description,
    segmentDate: segmentDate.toISOString(),
    ultimateRenderKey,
    timestamp: currentTimestamp,
    ultimateFix: true
  });

  return (
    <div className="space-y-3" key={ultimateRenderKey}>
      {/* Weather Icon and Description */}
      <div className="flex items-center gap-3">
        <div className="text-3xl">
          {weather.icon?.includes('01') ? '☀️' :
           weather.icon?.includes('02') ? '⛅' :
           weather.icon?.includes('03') ? '☁️' :
           weather.icon?.includes('04') ? '☁️' :
           weather.icon?.includes('09') ? '🌧️' :
           weather.icon?.includes('10') ? '🌦️' :
           weather.icon?.includes('11') ? '⛈️' :
           weather.icon?.includes('13') ? '❄️' :
           weather.icon?.includes('50') ? '🌫️' : '🌤️'}
        </div>
        <div className="flex-1">
          <div className="text-lg font-semibold text-gray-800 capitalize">
            {weather.description}
          </div>
          <div className="text-sm text-gray-600" key={`label-ultimate-${ultimateRenderKey}`}>
            {sourceLabel}
          </div>
        </div>
      </div>

      {/* Temperature Display */}
      <SimpleTemperatureDisplay 
        weather={weather}
        isSharedView={isSharedView}
        segmentDate={segmentDate}
        key={`temp-ultimate-${ultimateRenderKey}`}
      />

      {/* Additional Weather Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {weather.humidity && (
          <div className="flex items-center gap-1">
            <span className="text-blue-500">💧</span>
            <span className="text-gray-600">Humidity: {weather.humidity}%</span>
          </div>
        )}
        {weather.windSpeed !== undefined && (
          <div className="flex items-center gap-1">
            <span className="text-gray-500">💨</span>
            <span className="text-gray-600">Wind: {weather.windSpeed} mph</span>
          </div>
        )}
        {weather.precipitationChance !== undefined && weather.precipitationChance > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-blue-500">🌧️</span>
            <span className="text-gray-600">Rain: {weather.precipitationChance}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
