
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { DateNormalizationService } from './DateNormalizationService';
import { format } from 'date-fns';
import { validateWeatherData, getWeatherDisplayType } from './WeatherValidationService';

interface WeatherDataDisplayProps {
  weather: ForecastWeatherData;
  segmentDate?: Date | null;
  cityName: string;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

// Helper function to determine display strategy
const getDisplayStrategy = (weather: any, segmentDate: Date | null, cityName: string) => {
  // **PRIORITY FIX**: Always prioritize live forecasts when available
  if (weather?.isActualForecast === true) {
    console.warn('[Weather Display Decision] Using LIVE FORECAST', {
      cityName,
      segmentDate: segmentDate?.toISOString(),
      isActualForecast: weather.isActualForecast,
      hasHighTemp: !!weather.highTemp,
      hasLowTemp: !!weather.lowTemp,
      strategy: 'forecast'
    });
    return 'forecast';
  }

  // Run validation for other cases
  const validationResult = validateWeatherData(weather, cityName, segmentDate);
  
  console.warn('[Weather Display Decision] Validation result', {
    cityName,
    segmentDate: segmentDate?.toISOString(),
    isActualForecast: weather?.isActualForecast,
    validation: validationResult,
    forecastDate: weather?.forecastDate,
    strategy: validationResult?.dataQuality === 'unavailable' ? 'historical' : 'forecast'
  });

  // If validation indicates historical data or unavailable
  if (validationResult?.dataQuality === 'unavailable') {
    return 'historical';
  }

  return 'forecast';
};

const WeatherDataDisplay: React.FC<WeatherDataDisplayProps> = ({ 
  weather, 
  segmentDate,
  cityName,
  isSharedView = false,
  isPDFExport = false
}) => {
  console.log('🌤️ WeatherDataDisplay render:', {
    cityName,
    segmentDate: segmentDate?.toISOString(),
    hasWeather: !!weather,
    isActualForecast: weather?.isActualForecast,
    isSharedView,
    isPDFExport
  });

  if (!weather) {
    return (
      <div className="bg-gray-50 rounded border border-gray-200 p-3 text-center">
        <div className="text-sm text-gray-500 mb-2">
          📊 Weather data unavailable
        </div>
        <div className="text-xs text-gray-400">
          Unable to fetch weather information
        </div>
      </div>
    );
  }

  // Determine display strategy using updated logic
  const displayStrategy = getDisplayStrategy(weather, segmentDate, cityName);

  // Generate accurate forecast label based on segment date
  const forecastLabel = segmentDate 
    ? `${format(segmentDate, 'EEEE, MMM d')}`
    : 'Weather Information';

  const isHistorical = displayStrategy === 'historical' || !weather.isActualForecast;
  const bgClass = isHistorical ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200';
  const textClass = isHistorical ? 'text-yellow-800' : 'text-blue-800';
  const labelClass = isHistorical ? 'text-yellow-700 bg-yellow-100' : 'text-blue-600 bg-blue-100';

  return (
    <div className={`rounded border p-3 ${bgClass}`}>
      <div className="flex items-center justify-between mb-3">
        <h5 className={`font-semibold ${textClass}`}>{cityName}</h5>
        <span className={`text-xs px-2 py-1 rounded ${labelClass}`}>
          {forecastLabel}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-center">
          <div className={`text-lg font-bold ${textClass}`}>
            {Math.round((weather.highTemp || weather.temperature || 0))}°F
          </div>
          <div className={`text-xs ${isHistorical ? 'text-yellow-600' : 'text-blue-600'}`}>
            {isHistorical ? 'Avg High' : 'High'}
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${textClass}`}>
            {Math.round((weather.lowTemp || weather.temperature || 0))}°F
          </div>
          <div className={`text-xs ${isHistorical ? 'text-yellow-600' : 'text-blue-600'}`}>
            {isHistorical ? 'Avg Low' : 'Low'}
          </div>
        </div>
      </div>
      
      <div className={`mt-3 pt-3 border-t ${isHistorical ? 'border-yellow-200' : 'border-blue-200'}`}>
        <div className={`text-sm mb-2 capitalize ${isHistorical ? 'text-yellow-700' : 'text-blue-700'}`}>
          {weather.description}
        </div>
        <div className={`flex justify-between text-xs ${isHistorical ? 'text-yellow-600' : 'text-blue-600'}`}>
          <span>💧 {weather.precipitationChance || 0}%</span>
          <span>💨 {Math.round(weather.windSpeed || 0)} mph</span>
          <span>💦 {weather.humidity || 0}%</span>
        </div>
      </div>

      <div className={`mt-2 text-xs rounded p-2 ${isHistorical ? 'text-yellow-600 bg-yellow-100' : 'text-blue-500 bg-blue-100'}`}>
        {isHistorical ? '📊 Historical seasonal averages' : '✅ Live forecast data'}
      </div>
    </div>
  );
};

export default WeatherDataDisplay;
