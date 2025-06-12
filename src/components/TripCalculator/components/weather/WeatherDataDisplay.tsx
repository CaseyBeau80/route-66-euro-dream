
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import FallbackWeatherDisplay from './FallbackWeatherDisplay';

interface WeatherDataDisplayProps {
  weather: ForecastWeatherData | null;
  segmentDate?: Date | null;
  cityName: string;
  error?: string | null;
  onRetry?: () => void;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const WeatherDataDisplay: React.FC<WeatherDataDisplayProps> = ({ 
  weather, 
  segmentDate,
  cityName,
  error,
  onRetry,
  isSharedView = false,
  isPDFExport = false
}) => {
  console.log(`🌦 WeatherDataDisplay ENHANCED RENDERING for ${cityName}:`, {
    hasWeather: !!weather,
    hasSegmentDate: !!segmentDate,
    weatherData: weather ? {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description,
      isActualForecast: weather.isActualForecast
    } : null
  });

  if (!weather) {
    return (
      <FallbackWeatherDisplay
        cityName={cityName}
        segmentDate={segmentDate}
        onRetry={onRetry}
        error={error || 'No weather data available'}
        showRetryButton={!isSharedView && !isPDFExport}
      />
    );
  }

  // ENHANCED: More robust temperature extraction with better fallbacks
  const getTemperature = (value: any): number => {
    if (typeof value === 'number' && !isNaN(value)) return Math.round(value);
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) return Math.round(parsed);
    }
    if (value && typeof value === 'object') {
      if (typeof value.high === 'number') return Math.round(value.high);
      if (typeof value.low === 'number') return Math.round(value.low);
      if (typeof value.temp === 'number') return Math.round(value.temp);
    }
    return 0; // Return 0 instead of default temperature
  };

  // Extract weather data with enhanced fallbacks
  const highTemp = getTemperature(weather.highTemp) || 
                   getTemperature(weather.temperature) || 
                   getTemperature((weather as any).temp_max) || 
                   getTemperature((weather as any).main?.temp_max) || 
                   75;
                   
  const lowTemp = getTemperature(weather.lowTemp) || 
                  (getTemperature(weather.temperature) - 10) || 
                  getTemperature((weather as any).temp_min) || 
                  getTemperature((weather as any).main?.temp_min) || 
                  65;

  const description = weather.description || 
                     (weather as any).weather?.[0]?.description || 
                     'Weather forecast available';
                     
  const weatherIcon = weather.icon || 
                     (weather as any).weather?.[0]?.icon || 
                     '🌤️';
                     
  const humidity = Math.round(weather.humidity || 
                             (weather as any).main?.humidity || 50);
                             
  const windSpeed = Math.round(weather.windSpeed || 
                              (weather as any).wind?.speed || 5);
                              
  const precipitationChance = Math.round(weather.precipitationChance || 
                                        (weather as any).pop * 100 || 10);

  console.log(`✅ ENHANCED WEATHER DISPLAY for ${cityName}:`, {
    high: highTemp,
    low: lowTemp,
    description,
    isActualForecast: weather.isActualForecast,
    hasValidTemps: highTemp > 0 && lowTemp > 0
  });

  const forecastLabel = segmentDate ? format(segmentDate, 'EEEE, MMM d') : 'Weather Information';
  const isLiveForecast = weather.isActualForecast === true;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-3">
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-blue-800">{cityName}</h5>
        <span className="text-xs px-2 py-1 rounded text-blue-600 bg-blue-100">
          {forecastLabel}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-800">
            {lowTemp}°F
          </div>
          <div className="text-xs text-blue-600">
            Low
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-800">
            {highTemp}°F
          </div>
          <div className="text-xs text-blue-600">
            High
          </div>
        </div>
      </div>
      
      <div className="pt-3 border-t border-blue-200">
        <div className="text-sm mb-2 capitalize text-blue-700 flex items-center">
          <span className="mr-2">{weatherIcon}</span>
          {description}
        </div>
        
        <div className="flex justify-between text-xs text-blue-600">
          <span>💧 {precipitationChance}%</span>
          <span>💨 {windSpeed} mph</span>
          <span>💦 {humidity}%</span>
        </div>
      </div>

      <div className="mt-2 text-xs rounded p-2 text-blue-500 bg-blue-100">
        {isLiveForecast ? (
          <>✅ Live weather forecast</>
        ) : (
          <>📊 Weather estimate</>
        )}
      </div>

      {error && onRetry && !isSharedView && !isPDFExport && (
        <div className="mt-2">
          <button
            onClick={onRetry}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Retry weather fetch
          </button>
        </div>
      )}
    </div>
  );
};

export default WeatherDataDisplay;
