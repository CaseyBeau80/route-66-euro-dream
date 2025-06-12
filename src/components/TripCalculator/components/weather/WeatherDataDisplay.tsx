
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
  // COMPREHENSIVE DEBUG LOGGING
  console.log(`🌤️ WeatherDataDisplay RENDER DEBUG for ${cityName}:`, {
    hasWeather: !!weather,
    rawWeatherData: weather,
    detailedAnalysis: weather ? {
      temperature: { value: weather.temperature, type: typeof weather.temperature, isNumber: typeof weather.temperature === 'number' },
      highTemp: { value: weather.highTemp, type: typeof weather.highTemp, isNumber: typeof weather.highTemp === 'number' },
      lowTemp: { value: weather.lowTemp, type: typeof weather.lowTemp, isNumber: typeof weather.lowTemp === 'number' },
      description: { value: weather.description, type: typeof weather.description, hasLength: weather.description?.length > 0 },
      icon: { value: weather.icon, type: typeof weather.icon },
      isActualForecast: weather.isActualForecast,
      cityName: weather.cityName,
      allKeys: Object.keys(weather)
    } : null
  });

  if (!weather) {
    console.log(`❌ WeatherDataDisplay: No weather data for ${cityName} - showing fallback`);
    return (
      <FallbackWeatherDisplay
        cityName={cityName}
        segmentDate={segmentDate}
        onRetry={onRetry}
        error={error || 'No weather data'}
        showRetryButton={!isSharedView && !isPDFExport}
      />
    );
  }

  // AGGRESSIVE DATA EXTRACTION with smart fallbacks
  const extractTemp = (value: any): number => {
    if (typeof value === 'number' && !isNaN(value)) return Math.round(value);
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) return Math.round(parsed);
    }
    return 0;
  };

  // Extract temperatures with fallback logic
  let displayHighTemp: number;
  let displayLowTemp: number;
  let displayAvgTemp: number;

  const highTemp = extractTemp(weather.highTemp);
  const lowTemp = extractTemp(weather.lowTemp);
  const avgTemp = extractTemp(weather.temperature);

  // Smart temperature assignment
  if (highTemp > 0 && lowTemp > 0) {
    displayHighTemp = highTemp;
    displayLowTemp = lowTemp;
    displayAvgTemp = Math.round((highTemp + lowTemp) / 2);
  } else if (avgTemp > 0) {
    displayAvgTemp = avgTemp;
    displayHighTemp = avgTemp + 5;
    displayLowTemp = avgTemp - 5;
  } else if (highTemp > 0) {
    displayHighTemp = highTemp;
    displayLowTemp = highTemp - 10;
    displayAvgTemp = Math.round((highTemp + displayLowTemp) / 2);
  } else if (lowTemp > 0) {
    displayLowTemp = lowTemp;
    displayHighTemp = lowTemp + 10;
    displayAvgTemp = Math.round((displayHighTemp + lowTemp) / 2);
  } else {
    // Ultimate fallback
    displayAvgTemp = 72;
    displayHighTemp = 77;
    displayLowTemp = 67;
  }

  // Get description with fallbacks
  const description = weather.description || 'Weather forecast';
  
  // Get icon with fallback
  const weatherIcon = weather.icon || '🌤️';

  console.log(`✅ DISPLAYING weather for ${cityName}:`, {
    temps: { high: displayHighTemp, low: displayLowTemp, avg: displayAvgTemp },
    description,
    icon: weatherIcon,
    isActualForecast: weather.isActualForecast,
    originalData: {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description,
      icon: weather.icon
    }
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
            {displayLowTemp}°F
          </div>
          <div className="text-xs text-blue-600">
            Low
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-800">
            {displayHighTemp}°F
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
          <span>💧 {Math.round(weather.precipitationChance || 0)}%</span>
          <span>💨 {Math.round(weather.windSpeed || 0)} mph</span>
          <span>💦 {Math.round(weather.humidity || 50)}%</span>
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
