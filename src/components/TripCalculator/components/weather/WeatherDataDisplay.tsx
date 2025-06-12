
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
  console.log('🌤️ WeatherDataDisplay RENDER for', cityName, ':', {
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

  // SIMPLIFIED temperature extraction
  const getTemperatureDisplay = () => {
    console.log(`🌡️ SIMPLIFIED TEMPERATURE EXTRACTION for ${cityName}:`, {
      weather,
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      matchedForecastDay: weather.matchedForecastDay
    });

    let high = 75; // Default high
    let low = 55;  // Default low

    // Try to get temperatures from various sources
    if (weather.highTemp !== undefined && weather.lowTemp !== undefined) {
      high = Math.round(weather.highTemp);
      low = Math.round(weather.lowTemp);
      console.log(`✅ Got temps from direct properties: ${low}°-${high}°`);
    } else if (weather.matchedForecastDay?.temperature) {
      const temp = weather.matchedForecastDay.temperature;
      if (typeof temp === 'object' && temp.high !== undefined && temp.low !== undefined) {
        high = Math.round(temp.high);
        low = Math.round(temp.low);
        console.log(`✅ Got temps from forecast day object: ${low}°-${high}°`);
      } else if (typeof temp === 'number') {
        const baseTemp = Math.round(temp);
        high = baseTemp + 8;
        low = baseTemp - 8;
        console.log(`✅ Got single temp from forecast day: ${baseTemp}° -> ${low}°-${high}°`);
      }
    } else if (weather.temperature !== undefined) {
      const baseTemp = Math.round(weather.temperature);
      high = baseTemp + 8;
      low = baseTemp - 8;
      console.log(`✅ Got single temp from main property: ${baseTemp}° -> ${low}°-${high}°`);
    } else {
      console.log(`⚠️ Using fallback temperatures for ${cityName}: ${low}°-${high}°`);
    }

    return { high, low };
  };

  const temps = getTemperatureDisplay();
  
  console.log(`✅ FINAL TEMPERATURE DISPLAY for ${cityName}:`, temps);

  // Get description
  const displayDescription = weather.matchedForecastDay?.description || weather.description || 'Clear conditions';
  
  // Get other weather data
  const displayHumidity = weather.humidity !== undefined ? weather.humidity : 50;
  const displayWindSpeed = weather.windSpeed !== undefined ? Math.round(weather.windSpeed) : 5;
  const displayPrecipChance = weather.precipitationChance !== undefined ? weather.precipitationChance : 10;

  console.log(`📊 COMPLETE DISPLAY DATA for ${cityName}:`, {
    temps,
    displayDescription,
    displayHumidity,
    displayWindSpeed,
    displayPrecipChance,
    isLiveForecast
  });

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
          <span>💧 {displayPrecipChance}%</span>
          <span>💨 {displayWindSpeed} mph</span>
          <span>💦 {displayHumidity}%</span>
        </div>
      </div>

      <div className={`mt-2 text-xs rounded p-2 ${isLiveForecast ? 'text-blue-500 bg-blue-100' : 'text-yellow-600 bg-yellow-100'}`}>
        {isLiveForecast ? (
          <>✅ Live forecast for {forecastLabel}</>
        ) : (
          `📊 Weather data for ${forecastLabel}`
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
