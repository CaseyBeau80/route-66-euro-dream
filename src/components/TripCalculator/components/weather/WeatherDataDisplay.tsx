
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
  // ENHANCED DEBUG for June 12 rendering issue
  console.log(`🌦 WeatherDataDisplay RENDER DEBUG for ${cityName}:`, {
    hasWeather: !!weather,
    weather,
    isJune12: segmentDate?.toDateString().includes('Jun 12')
  });

  if (!weather) {
    console.log(`❌ WeatherDataDisplay: No weather data for ${cityName}`);
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

  // RESILIENT temperature extraction with better fallbacks
  const getDisplayTemp = (value: any): number | null => {
    if (typeof value === 'number' && !isNaN(value)) return Math.round(value);
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) return Math.round(parsed);
    }
    return null;
  };

  const highTemp = getDisplayTemp(weather.highTemp);
  const lowTemp = getDisplayTemp(weather.lowTemp);
  const avgTemp = getDisplayTemp(weather.temperature);

  // SMART temperature display logic
  let displayHighTemp: number;
  let displayLowTemp: number;
  let displayAvgTemp: number;

  if (highTemp !== null && lowTemp !== null) {
    displayHighTemp = highTemp;
    displayLowTemp = lowTemp;
    displayAvgTemp = Math.round((highTemp + lowTemp) / 2);
  } else if (avgTemp !== null) {
    displayAvgTemp = avgTemp;
    displayHighTemp = avgTemp + 5;
    displayLowTemp = avgTemp - 5;
  } else if (highTemp !== null) {
    displayHighTemp = highTemp;
    displayLowTemp = highTemp - 10;
    displayAvgTemp = Math.round((highTemp + displayLowTemp) / 2);
  } else if (lowTemp !== null) {
    displayLowTemp = lowTemp;
    displayHighTemp = lowTemp + 10;
    displayAvgTemp = Math.round((displayHighTemp + lowTemp) / 2);
  } else {
    // Fallback temperatures
    displayAvgTemp = 72;
    displayHighTemp = 77;
    displayLowTemp = 67;
  }

  // RESILIENT field extraction
  const description = weather.description || 'Weather forecast available';
  const weatherIcon = weather.icon || '🌤️';
  const humidity = Math.round(weather.humidity || 50);
  const windSpeed = Math.round(weather.windSpeed || 5);
  const precipitationChance = Math.round(weather.precipitationChance || 10);

  console.log(`✅ DISPLAYING weather for ${cityName}:`, {
    temps: { high: displayHighTemp, low: displayLowTemp, avg: displayAvgTemp },
    description,
    icon: weatherIcon,
    isActualForecast: weather.isActualForecast,
    hasPartialData: !!(weather.temperature || weather.highTemp || weather.lowTemp || weather.description)
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

      {/* Add partial data indicator for debugging */}
      {(!weather.temperature && !weather.highTemp && !weather.lowTemp) && (
        <div className="mt-2 text-xs rounded p-2 text-orange-600 bg-orange-50 border border-orange-200">
          ⚠️ Forecast available but temperature data is incomplete. Check back shortly.
        </div>
      )}

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
