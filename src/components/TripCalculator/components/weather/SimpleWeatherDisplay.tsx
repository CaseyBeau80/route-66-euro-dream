
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
  // CRITICAL FIX: Force re-computation on every render to prevent stale data
  const [renderCount, setRenderCount] = React.useState(0);

  // CRITICAL FIX: Use direct calculation instead of memoization to prevent stale closures
  const isLiveForecast = WeatherUtilityService.isLiveForecast(weather, segmentDate);
  const sourceLabel = WeatherUtilityService.getWeatherSourceLabel(weather, segmentDate);

  // CRITICAL FIX: Force component update when weather properties change
  React.useEffect(() => {
    console.log('🔄 CRITICAL FIX: SimpleWeatherDisplay - Force update effect:', {
      cityName,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      isLiveForecast,
      sourceLabel,
      renderCount,
      triggerReason: 'weather_properties_changed',
      criticalFix: true
    });
    
    setRenderCount(prev => prev + 1);
  }, [weather.source, weather.isActualForecast, weather.temperature, weather.cityName, cityName]);

  // CRITICAL FIX: Dynamic key that changes when weather source/forecast status changes
  const weatherKey = `${weather.source}-${weather.isActualForecast}-${cityName}-${renderCount}`;

  console.log('🎯 CRITICAL FIX: SimpleWeatherDisplay rendering with direct calculation:', {
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
    weatherKey,
    renderCount,
    criticalFix: true,
    directCalculation: true
  });

  return (
    <div className="space-y-3" key={weatherKey}>
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
          <div className="text-sm text-gray-600" key={`label-${weatherKey}`}>
            {sourceLabel}
          </div>
        </div>
      </div>

      {/* Temperature Display */}
      <SimpleTemperatureDisplay 
        weather={weather}
        isSharedView={isSharedView}
        segmentDate={segmentDate}
        key={`temp-${weatherKey}`}
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
