
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

  // CRITICAL DEBUG: Log the complete weather object structure
  console.log('🔍 COMPLETE WEATHER OBJECT DEBUG for', cityName, ':', {
    weatherObject: weather,
    weatherKeys: weather ? Object.keys(weather) : [],
    temperature: weather?.temperature,
    highTemp: weather?.highTemp,
    lowTemp: weather?.lowTemp,
    description: weather?.description,
    icon: weather?.icon,
    humidity: weather?.humidity,
    windSpeed: weather?.windSpeed,
    precipitationChance: weather?.precipitationChance,
    isActualForecast: weather?.isActualForecast,
    matchedForecastDay: weather?.matchedForecastDay,
    dateMatchInfo: weather?.dateMatchInfo
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

  // CRITICAL FIX: Enhanced temperature extraction with detailed logging
  const getTemperatureDisplay = () => {
    console.log(`🌡️ TEMPERATURE EXTRACTION DEBUG for ${cityName}:`, {
      weather,
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      temperatureType: typeof weather.temperature,
      highTempType: typeof weather.highTemp,
      lowTempType: typeof weather.lowTemp,
      matchedForecastDay: weather.matchedForecastDay,
      forecastDayTemp: weather.matchedForecastDay?.temperature
    });

    // Try to extract from matchedForecastDay first if available
    if (weather.matchedForecastDay?.temperature) {
      const forecastTemp = weather.matchedForecastDay.temperature;
      console.log(`🎯 Using matchedForecastDay temperature for ${cityName}:`, forecastTemp);
      
      if (typeof forecastTemp === 'object' && forecastTemp.high !== undefined && forecastTemp.low !== undefined) {
        return {
          high: Math.round(forecastTemp.high),
          low: Math.round(forecastTemp.low),
          hasValidTemps: true,
          source: 'forecast-day-object'
        };
      } else if (typeof forecastTemp === 'number') {
        const temp = Math.round(forecastTemp);
        return {
          high: temp + 8,
          low: temp - 8,
          hasValidTemps: true,
          source: 'forecast-day-single'
        };
      }
    }

    // Try direct weather object properties
    const hasTemp = weather.temperature !== undefined && weather.temperature !== null;
    const hasHighTemp = weather.highTemp !== undefined && weather.highTemp !== null;
    const hasLowTemp = weather.lowTemp !== undefined && weather.lowTemp !== null;
    
    console.log(`🔍 Direct weather properties for ${cityName}:`, {
      hasTemp,
      hasHighTemp,
      hasLowTemp,
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp
    });

    if (hasHighTemp && hasLowTemp) {
      return {
        high: Math.round(weather.highTemp),
        low: Math.round(weather.lowTemp),
        hasValidTemps: true,
        source: 'direct-high-low'
      };
    } else if (hasTemp) {
      const temp = Math.round(weather.temperature);
      return {
        high: temp + 8,
        low: temp - 8,
        hasValidTemps: true,
        source: 'direct-single'
      };
    } else if (hasHighTemp) {
      const high = Math.round(weather.highTemp);
      return {
        high,
        low: high - 15,
        hasValidTemps: true,
        source: 'high-only'
      };
    } else if (hasLowTemp) {
      const low = Math.round(weather.lowTemp);
      return {
        high: low + 15,
        low,
        hasValidTemps: true,
        source: 'low-only'
      };
    }

    // Fallback to reasonable defaults
    console.warn(`⚠️ No temperature data found for ${cityName}, using fallback temperatures`);
    return {
      high: 75,
      low: 55,
      hasValidTemps: false,
      source: 'fallback'
    };
  };

  const temps = getTemperatureDisplay();
  
  console.log(`✅ FINAL TEMPERATURE DISPLAY for ${cityName}:`, temps);

  // Enhanced description handling
  const getDescriptionDisplay = () => {
    if (weather.matchedForecastDay?.description) {
      return weather.matchedForecastDay.description;
    }
    if (weather.description) {
      return weather.description;
    }
    // Fallback based on temperature if available
    if (temps.hasValidTemps) {
      const avgTemp = (temps.high + temps.low) / 2;
      if (avgTemp >= 80) return 'Warm conditions';
      if (avgTemp >= 65) return 'Pleasant conditions';
      if (avgTemp >= 45) return 'Cool conditions';
      return 'Cold conditions';
    }
    return 'Weather conditions';
  };

  const displayDescription = getDescriptionDisplay();

  // Enhanced other weather data
  const displayHumidity = weather.humidity !== undefined ? weather.humidity : 50;
  const displayWindSpeed = weather.windSpeed !== undefined ? Math.round(weather.windSpeed) : 5;
  const displayPrecipChance = weather.precipitationChance !== undefined ? weather.precipitationChance : 10;

  console.log(`📊 COMPLETE DISPLAY DATA for ${cityName}:`, {
    temps,
    displayDescription,
    displayHumidity,
    displayWindSpeed,
    displayPrecipChance,
    isLiveForecast,
    willRender: true
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
        {!temps.hasValidTemps && (
          <span className="ml-2 text-gray-500">(Estimated)</span>
        )}
        <span className="ml-2 text-gray-600">({temps.source})</span>
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
