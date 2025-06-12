
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDataNormalizer, NormalizedWeatherData } from './services/WeatherDataNormalizer';
import { WeatherPersistenceService } from './services/WeatherPersistenceService';
import { format } from 'date-fns';

interface SimpleWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate?: Date | null;
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
  console.log('🌤️ SimpleWeatherDisplay ENHANCED RENDER:', {
    cityName,
    weather,
    segmentDate: segmentDate?.toISOString()
  });

  // Normalize weather data for consistent display
  const normalizedWeather = React.useMemo(() => {
    const normalized = WeatherDataNormalizer.normalizeWeatherData(weather, cityName, segmentDate);
    
    // Store in persistence service if we have a valid date
    if (normalized && segmentDate) {
      WeatherPersistenceService.storeWeatherData(cityName, segmentDate, normalized);
    }
    
    return normalized;
  }, [weather, cityName, segmentDate]);

  if (!normalizedWeather) {
    console.warn('❌ SimpleWeatherDisplay: Failed to normalize weather data');
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-700 text-center">
          <span className="text-red-600">⚠️</span>
          <strong className="ml-2">Weather Data Error</strong>
          <p className="text-sm mt-1">Unable to display weather information for {cityName}</p>
        </div>
      </div>
    );
  }

  const dateLabel = segmentDate ? format(segmentDate, 'EEEE, MMM d') : 'Weather';

  console.log('✅ SimpleWeatherDisplay NORMALIZED DATA:', {
    cityName,
    temperature: normalizedWeather.temperature,
    highTemp: normalizedWeather.highTemp,
    lowTemp: normalizedWeather.lowTemp,
    source: normalizedWeather.source,
    isValid: normalizedWeather.isValid
  });

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-blue-800">{cityName}</h5>
        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
          {dateLabel}
        </span>
      </div>
      
      {/* Main Temperature Display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-blue-800 mb-1">
          {normalizedWeather.temperature}°F
        </div>
        <div className="text-sm text-blue-600 capitalize">
          {normalizedWeather.description}
        </div>
      </div>
      
      {/* Temperature Range */}
      <div className="flex justify-between items-center mb-3 px-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-700">{normalizedWeather.lowTemp}°</div>
          <div className="text-xs text-blue-600">Low</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-700">{normalizedWeather.highTemp}°</div>
          <div className="text-xs text-blue-600">High</div>
        </div>
      </div>
      
      {/* Weather Details */}
      <div className="flex justify-between text-xs text-blue-600 border-t border-blue-200 pt-2">
        <span>💧 {normalizedWeather.precipitationChance}%</span>
        <span>💨 {normalizedWeather.windSpeed} mph</span>
        <span>💦 {normalizedWeather.humidity}%</span>
      </div>

      {/* Data Source */}
      <div className="mt-2 text-xs text-center">
        <span className={`px-2 py-1 rounded ${normalizedWeather.isActualForecast ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {normalizedWeather.isActualForecast ? '📡 Live forecast' : '📊 Seasonal estimate'}
        </span>
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
