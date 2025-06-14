
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
  // PLAN: Memoized live forecast detection with proper dependencies
  const isLiveForecast = React.useMemo(() => {
    const result = WeatherUtilityService.isLiveForecast(weather, segmentDate);
    console.log('🎯 PLAN: SimpleWeatherDisplay - Live forecast detection (memoized):', {
      cityName,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      isLiveForecast: result,
      memoizedCalculation: true
    });
    return result;
  }, [weather.source, weather.isActualForecast, weather.cityName, segmentDate?.getTime()]);

  // PLAN: Memoized source label with proper dependencies
  const sourceLabel = React.useMemo(() => {
    const label = WeatherUtilityService.getWeatherSourceLabel(weather, segmentDate);
    console.log('🏷️ PLAN: SimpleWeatherDisplay - Source label (memoized):', {
      cityName,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      sourceLabel: label,
      memoizedCalculation: true
    });
    return label;
  }, [weather.source, weather.isActualForecast, weather.cityName, segmentDate?.getTime()]);

  // PLAN: Force component re-render when weather source changes
  const weatherKey = React.useMemo(() => {
    return `${weather.source}-${weather.isActualForecast}-${weather.cityName}-${segmentDate?.getTime()}`;
  }, [weather.source, weather.isActualForecast, weather.cityName, segmentDate?.getTime()]);

  // PLAN: Effect to log weather data changes and detect stale renders
  React.useEffect(() => {
    console.log('🔄 PLAN: SimpleWeatherDisplay - Weather data effect triggered:', {
      cityName,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      isLiveForecast,
      sourceLabel,
      weatherKey,
      triggerReason: 'weather_data_changed',
      planImplementation: true
    });
  }, [weather.source, weather.isActualForecast, isLiveForecast, sourceLabel, weatherKey, cityName]);

  console.log('🎯 PLAN: SimpleWeatherDisplay rendering with enhanced state management:', {
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
    planImplementation: true
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
