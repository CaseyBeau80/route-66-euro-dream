
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
  console.log('🌤️ FORCE LOG - WeatherDataDisplay render for', cityName, ':', {
    hasWeather: !!weather,
    segmentDate: segmentDate?.toISOString(),
    hasError: !!error,
    weather: weather ? {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description,
      isActualForecast: weather.isActualForecast,
      dateMatchInfo: weather.dateMatchInfo
    } : null
  });

  if (!weather) {
    console.log(`❌ FORCE LOG - WeatherDataDisplay: No weather object for ${cityName}`);
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

  // ULTRA-AGGRESSIVE: Extract ANY available data
  const hasAnyTemp = !!(weather.temperature || weather.highTemp || weather.lowTemp);
  const hasDescription = !!weather.description;
  
  console.log(`🔍 FORCE LOG - ULTRA AGGRESSIVE DATA CHECK for ${cityName}:`, {
    hasAnyTemp,
    hasDescription,
    temperature: weather.temperature,
    highTemp: weather.highTemp,
    lowTemp: weather.lowTemp,
    description: weather.description,
    willAttemptRender: hasAnyTemp || hasDescription
  });
  
  // If we don't have ANY displayable data, show fallback
  if (!hasAnyTemp && !hasDescription) {
    console.log(`❌ FORCE LOG - WeatherDataDisplay: No displayable data for ${cityName}`);
    return (
      <FallbackWeatherDisplay
        cityName={cityName}
        segmentDate={segmentDate}
        onRetry={onRetry}
        error="No temperature or weather description available"
        showRetryButton={!isSharedView && !isPDFExport}
      />
    );
  }

  const forecastLabel = React.useMemo(() => {
    if (!segmentDate) return 'Weather Information';
    const formattedDate = format(segmentDate, 'EEEE, MMM d');
    
    console.log(`🎯 FORCE LOG - WEATHER LABEL for ${cityName}:`, {
      segmentDate: segmentDate.toISOString(),
      segmentDateString: DateNormalizationService.toDateString(segmentDate),
      formattedDisplay: formattedDate
    });
    
    return formattedDate;
  }, [segmentDate, cityName]);

  // Determine if this is live forecast or fallback
  const isLiveForecast = weather.isActualForecast === true;
  const bgClass = isLiveForecast ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200';
  const textClass = isLiveForecast ? 'text-blue-800' : 'text-yellow-800';
  const labelClass = isLiveForecast ? 'text-blue-600 bg-blue-100' : 'text-yellow-700 bg-yellow-100';

  // ULTRA-AGGRESSIVE: Extract temperatures with maximum fallbacks
  const getTemperatureValues = () => {
    let highTemp = 0;
    let lowTemp = 0;
    let hasValidTemps = false;

    if (weather.highTemp !== undefined && weather.lowTemp !== undefined) {
      highTemp = weather.highTemp;
      lowTemp = weather.lowTemp;
      hasValidTemps = true;
    } else if (weather.temperature !== undefined) {
      // Use single temperature as both high and low with small variation
      highTemp = weather.temperature + 5;
      lowTemp = weather.temperature - 5;
      hasValidTemps = true;
    } else if (weather.highTemp !== undefined) {
      // Only high temp available
      highTemp = weather.highTemp;
      lowTemp = weather.highTemp - 10;
      hasValidTemps = true;
    } else if (weather.lowTemp !== undefined) {
      // Only low temp available
      lowTemp = weather.lowTemp;
      highTemp = weather.lowTemp + 10;
      hasValidTemps = true;
    } else {
      // No temperatures at all - use reasonable defaults
      console.warn(`⚠️ FORCE LOG - No temperature data found for ${cityName}, using defaults`);
      highTemp = 70;
      lowTemp = 50;
      hasValidTemps = false;
    }

    console.log(`🌡️ FORCE LOG - Temperature extraction for ${cityName}:`, {
      originalHighTemp: weather.highTemp,
      originalLowTemp: weather.lowTemp,
      originalTemperature: weather.temperature,
      calculatedHighTemp: highTemp,
      calculatedLowTemp: lowTemp,
      hasValidTemps
    });

    return { highTemp, lowTemp, hasValidTemps };
  };

  const { highTemp, lowTemp, hasValidTemps } = getTemperatureValues();
  const displayDescription = weather.description || 'Weather information';

  // FORCE RENDER: Always render if we reach this point
  console.log(`✅ FORCE LOG - RENDERING WEATHER DISPLAY for ${cityName}:`, {
    highTemp,
    lowTemp,
    description: displayDescription,
    isLiveForecast,
    hasValidTemps,
    forcingRender: true
  });

  return (
    <div className={`rounded border p-3 ${bgClass}`}>
      <div className="flex items-center justify-between mb-3">
        <h5 className={`font-semibold ${textClass}`}>{cityName}</h5>
        <span className={`text-xs px-2 py-1 rounded ${labelClass}`}>
          {forecastLabel}
        </span>
      </div>
      
      {/* Always show temperature section if we have ANY temp data */}
      {hasAnyTemp && (
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div className="text-center">
            <div className={`text-lg font-bold ${textClass}`}>
              {Math.round(lowTemp)}°F
            </div>
            <div className={`text-xs ${isLiveForecast ? 'text-blue-600' : 'text-yellow-600'}`}>
              {hasValidTemps ? (isLiveForecast ? 'Low' : 'Avg Low') : 'Est Low'}
            </div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${textClass}`}>
              {Math.round(highTemp)}°F
            </div>
            <div className={`text-xs ${isLiveForecast ? 'text-blue-600' : 'text-yellow-600'}`}>
              {hasValidTemps ? (isLiveForecast ? 'High' : 'Avg High') : 'Est High'}
            </div>
          </div>
        </div>
      )}
      
      {/* Always show description section */}
      <div className={`pt-3 border-t ${isLiveForecast ? 'border-blue-200' : 'border-yellow-200'}`}>
        <div className={`text-sm mb-2 capitalize ${isLiveForecast ? 'text-blue-700' : 'text-yellow-700'}`}>
          {displayDescription}
        </div>
        
        {/* Show additional data if available */}
        <div className={`flex justify-between text-xs ${isLiveForecast ? 'text-blue-600' : 'text-yellow-600'}`}>
          <span>💧 {weather.precipitationChance || 0}%</span>
          <span>💨 {Math.round(weather.windSpeed || 0)} mph</span>
          <span>💦 {weather.humidity || 0}%</span>
        </div>
      </div>

      <div className={`mt-2 text-xs rounded p-2 ${isLiveForecast ? 'text-blue-500 bg-blue-100' : 'text-yellow-600 bg-yellow-100'}`}>
        {isLiveForecast ? (
          <>✅ Weather forecast for {forecastLabel}</>
        ) : (
          `📊 Weather data for {forecastLabel}`
        )}
        {!hasValidTemps && (
          <span className="ml-2 text-gray-500">(Estimated temperatures)</span>
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
