
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

  // CRITICAL FIX: Add detailed forecast object logging
  console.log('📦 WeatherDataDisplay forecast object for', cityName, ':', {
    fullWeatherObject: weather,
    temperature: weather?.temperature,
    highTemp: weather?.highTemp,
    lowTemp: weather?.lowTemp,
    description: weather?.description,
    icon: weather?.icon,
    humidity: weather?.humidity,
    windSpeed: weather?.windSpeed,
    precipitationChance: weather?.precipitationChance,
    isActualForecast: weather?.isActualForecast,
    hasValidTemperature: weather?.temperature !== undefined || weather?.highTemp !== undefined || weather?.lowTemp !== undefined
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

  // CRITICAL FIX: ALWAYS render if we have ANY weather object - tolerate partial data
  console.log(`✅ FAULT-TOLERANT RENDER for ${cityName} - weather object exists`);

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

  // CRITICAL FIX: Fail-forward temperature handling - show something rather than nothing
  const getTemperatureDisplay = () => {
    // Check if we have any temperature data at all
    const hasTemp = weather.temperature !== undefined;
    const hasHighTemp = weather.highTemp !== undefined;
    const hasLowTemp = weather.lowTemp !== undefined;
    
    console.log(`🌡️ Temperature analysis for ${cityName}:`, {
      hasTemp,
      hasHighTemp,
      hasLowTemp,
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp
    });

    if (hasTemp && hasHighTemp && hasLowTemp) {
      // All temperature data available
      return {
        high: Math.round(weather.highTemp),
        low: Math.round(weather.lowTemp),
        hasValidTemps: true,
        source: 'complete'
      };
    } else if (hasHighTemp && hasLowTemp) {
      // High/Low available
      return {
        high: Math.round(weather.highTemp),
        low: Math.round(weather.lowTemp),
        hasValidTemps: true,
        source: 'high-low'
      };
    } else if (hasTemp) {
      // Only single temperature - create reasonable range
      const temp = Math.round(weather.temperature);
      return {
        high: temp + 8,
        low: temp - 8,
        hasValidTemps: true,
        source: 'single-temp'
      };
    } else {
      // No temperature data - provide reasonable defaults
      console.log(`⚠️ No temperature data for ${cityName}, using fallback`);
      return {
        high: 75,
        low: 55,
        hasValidTemps: false,
        source: 'fallback'
      };
    }
  };

  const temps = getTemperatureDisplay();
  
  // CRITICAL FIX: Fail-forward description handling
  const getDescriptionDisplay = () => {
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

  // CRITICAL FIX: Fail-forward for other weather data
  const displayHumidity = weather.humidity !== undefined ? weather.humidity : 50;
  const displayWindSpeed = weather.windSpeed !== undefined ? Math.round(weather.windSpeed) : 5;
  const displayPrecipChance = weather.precipitationChance !== undefined ? weather.precipitationChance : 10;

  console.log(`✅ FAULT-TOLERANT DISPLAY DATA for ${cityName}:`, {
    temps,
    displayDescription,
    displayHumidity,
    displayWindSpeed,
    displayPrecipChance,
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
      
      {/* FAULT-TOLERANT Temperature Display */}
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
      
      {/* FAULT-TOLERANT Description and Details */}
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
        {temps.source === 'fallback' && (
          <span className="ml-2 text-orange-600">(Fallback data)</span>
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
