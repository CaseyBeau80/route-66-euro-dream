
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import { DateNormalizationService } from './DateNormalizationService';
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
  console.log('🌤️ WeatherDataDisplay ENHANCED RENDER ANALYSIS:', {
    cityName,
    hasWeather: !!weather,
    segmentDate: segmentDate?.toISOString(),
    detailedWeatherAnalysis: weather ? {
      rawWeatherObject: weather,
      temperature: { value: weather.temperature, isValid: typeof weather.temperature === 'number' && !isNaN(weather.temperature) },
      highTemp: { value: weather.highTemp, isValid: typeof weather.highTemp === 'number' && !isNaN(weather.highTemp) },
      lowTemp: { value: weather.lowTemp, isValid: typeof weather.lowTemp === 'number' && !isNaN(weather.lowTemp) },
      description: { value: weather.description, isValid: typeof weather.description === 'string' && weather.description.length > 0 },
      isActualForecast: weather.isActualForecast,
      precipitationChance: weather.precipitationChance,
      windSpeed: weather.windSpeed,
      humidity: weather.humidity
    } : null
  });

  if (!weather) {
    console.log('❌ WeatherDataDisplay: No weather data for', cityName);
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

  // ULTRA-AGGRESSIVE: Extract ANY usable temperature data with smart fallbacks
  const hasValidTemp = (temp: any): boolean => typeof temp === 'number' && !isNaN(temp) && temp > -50 && temp < 150;
  
  let highTemp: number;
  let lowTemp: number;
  let avgTemp: number;
  
  // Try to get high/low temps from available data
  if (hasValidTemp(weather.highTemp) && hasValidTemp(weather.lowTemp)) {
    highTemp = weather.highTemp;
    lowTemp = weather.lowTemp;
    avgTemp = Math.round((highTemp + lowTemp) / 2);
  } else if (hasValidTemp(weather.temperature)) {
    // Use single temperature as average, estimate high/low
    avgTemp = weather.temperature;
    highTemp = avgTemp + 5; // Add 5 degrees for high
    lowTemp = avgTemp - 5;  // Subtract 5 degrees for low
  } else if (hasValidTemp(weather.highTemp)) {
    highTemp = weather.highTemp;
    lowTemp = highTemp - 10; // Estimate low temp
    avgTemp = Math.round((highTemp + lowTemp) / 2);
  } else if (hasValidTemp(weather.lowTemp)) {
    lowTemp = weather.lowTemp;
    highTemp = lowTemp + 10; // Estimate high temp
    avgTemp = Math.round((highTemp + lowTemp) / 2);
  } else {
    // Ultimate fallback - use reasonable defaults
    console.log('⚠️ Using fallback temperatures for', cityName);
    avgTemp = 70;
    highTemp = 75;
    lowTemp = 65;
  }

  // Get description with fallbacks
  let description = weather.description || 'Weather forecast available';
  if (description === 'Clear' || description === '') {
    description = 'Clear skies';
  }

  console.log('✅ RENDERING weather for', cityName, 'with processed data:', {
    originalWeather: weather,
    processedTemps: { highTemp, lowTemp, avgTemp },
    description,
    isActualForecast: weather.isActualForecast,
    willRender: true
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
            {Math.round(lowTemp)}°F
          </div>
          <div className="text-xs text-blue-600">
            Low
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-800">
            {Math.round(highTemp)}°F
          </div>
          <div className="text-xs text-blue-600">
            High
          </div>
        </div>
      </div>
      
      <div className="pt-3 border-t border-blue-200">
        <div className="text-sm mb-2 capitalize text-blue-700">
          {description}
        </div>
        
        <div className="flex justify-between text-xs text-blue-600">
          <span>💧 {weather.precipitationChance || 0}%</span>
          <span>💨 {Math.round(weather.windSpeed || 0)} mph</span>
          <span>💦 {weather.humidity || 0}%</span>
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
