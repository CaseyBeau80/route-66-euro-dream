
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
  console.log('🌤️ WeatherDataDisplay FORCED RENDER for', cityName, ':', {
    hasWeather: !!weather,
    segmentDate: segmentDate?.toISOString(),
    weather: weather
  });

  // CRITICAL: If no weather object, show fallback
  if (!weather) {
    console.log(`❌ WeatherDataDisplay: No weather object for ${cityName}`);
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

  // ULTRA-AGGRESSIVE: Always render if we have ANY weather object
  console.log(`✅ FORCING WEATHER RENDER for ${cityName} - weather object exists`);

  const forecastLabel = React.useMemo(() => {
    if (!segmentDate) return 'Weather Information';
    const formattedDate = format(segmentDate, 'EEEE, MMM d');
    return formattedDate;
  }, [segmentDate, cityName]);

  // Determine if this is live forecast or fallback
  const isLiveForecast = weather.isActualForecast === true;
  const bgClass = isLiveForecast ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200';
  const textClass = isLiveForecast ? 'text-blue-800' : 'text-yellow-800';
  const labelClass = isLiveForecast ? 'text-blue-600 bg-blue-100' : 'text-yellow-700 bg-yellow-100';

  // ULTRA-AGGRESSIVE: Extract ANY available temperature data
  const getTemperatureDisplay = () => {
    // Try to get temperatures in order of preference
    let highTemp = weather.highTemp || weather.temperature || 75;
    let lowTemp = weather.lowTemp || weather.temperature || 55;
    
    // If we only have one temperature, create a range
    if (weather.temperature && !weather.highTemp && !weather.lowTemp) {
      highTemp = weather.temperature + 10;
      lowTemp = weather.temperature - 10;
    }

    return {
      high: Math.round(highTemp),
      low: Math.round(lowTemp),
      hasValidTemps: !!(weather.temperature || weather.highTemp || weather.lowTemp)
    };
  };

  const temps = getTemperatureDisplay();
  const displayDescription = weather.description || 'Weather conditions';

  return (
    <div className={`rounded border p-3 ${bgClass}`}>
      <div className="flex items-center justify-between mb-3">
        <h5 className={`font-semibold ${textClass}`}>{cityName}</h5>
        <span className={`text-xs px-2 py-1 rounded ${labelClass}`}>
          {forecastLabel}
        </span>
      </div>
      
      {/* Temperature Display */}
      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div className="text-center">
          <div className={`text-lg font-bold ${textClass}`}>
            {temps.low}°F
          </div>
          <div className={`text-xs ${isLiveForecast ? 'text-blue-600' : 'text-yellow-600'}`}>
            Low
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${textClass}`}>
            {temps.high}°F
          </div>
          <div className={`text-xs ${isLiveForecast ? 'text-blue-600' : 'text-yellow-600'}`}>
            High
          </div>
        </div>
      </div>
      
      {/* Description and Details */}
      <div className={`pt-3 border-t ${isLiveForecast ? 'border-blue-200' : 'border-yellow-200'}`}>
        <div className={`text-sm mb-2 capitalize ${isLiveForecast ? 'text-blue-700' : 'text-yellow-700'}`}>
          {displayDescription}
        </div>
        
        <div className={`flex justify-between text-xs ${isLiveForecast ? 'text-blue-600' : 'text-yellow-600'}`}>
          <span>💧 {weather.precipitationChance || 0}%</span>
          <span>💨 {Math.round(weather.windSpeed || 0)} mph</span>
          <span>💦 {weather.humidity || 0}%</span>
        </div>
      </div>

      <div className={`mt-2 text-xs rounded p-2 ${isLiveForecast ? 'text-blue-500 bg-blue-100' : 'text-yellow-600 bg-yellow-100'}`}>
        {isLiveForecast ? (
          <>✅ Live forecast for {forecastLabel}</>
        ) : (
          `📊 Weather data for {forecastLabel}`
        )}
        {!temps.hasValidTemps && (
          <span className="ml-2 text-gray-500">(Estimated)</span>
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
