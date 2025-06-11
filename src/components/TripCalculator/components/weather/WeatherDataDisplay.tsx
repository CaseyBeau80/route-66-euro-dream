
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import { DateNormalizationService } from './DateNormalizationService';
import { validateWeatherData, getWeatherDisplayType } from './WeatherValidationService';
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
  console.log('🌤️ IMPROVED WeatherDataDisplay render:', {
    cityName,
    segmentDate: segmentDate?.toISOString(),
    hasWeather: !!weather,
    isActualForecast: weather?.isActualForecast,
    hasError: !!error,
    temperature: weather?.temperature,
    highTemp: weather?.highTemp,
    lowTemp: weather?.lowTemp,
    weatherSource: weather?.dateMatchInfo?.source,
    weatherMatchType: weather?.dateMatchInfo?.matchType
  });

  if (error || !weather) {
    return (
      <FallbackWeatherDisplay
        cityName={cityName}
        segmentDate={segmentDate}
        onRetry={onRetry}
        error={error || undefined}
        showRetryButton={!isSharedView && !isPDFExport}
      />
    );
  }

  // FIXED: Use improved validation
  const validation = validateWeatherData(weather, cityName, segmentDate);
  const displayType = getWeatherDisplayType(validation, error, 0, weather);
  
  console.log(`🎯 IMPROVED Display decision for ${cityName}:`, {
    displayType,
    validation,
    canShowLiveForecast: validation.canShowLiveForecast,
    hasCompleteData: validation.hasCompleteData,
    dataQuality: validation.dataQuality
  });

  const forecastLabel = React.useMemo(() => {
    if (!segmentDate) return 'Weather Information';
    const formattedDate = format(segmentDate, 'EEEE, MMM d');
    
    console.log(`🎯 WEATHER LABEL for ${cityName}:`, {
      segmentDate: segmentDate.toISOString(),
      segmentDateString: DateNormalizationService.toDateString(segmentDate),
      formattedDisplay: formattedDate
    });
    
    return formattedDate;
  }, [segmentDate, cityName]);

  const isLiveForecast = displayType === 'live-forecast';
  const isSeasonalEstimate = displayType === 'seasonal-estimate';
  
  const bgClass = isLiveForecast ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200';
  const textClass = isLiveForecast ? 'text-blue-800' : 'text-yellow-800';
  const labelClass = isLiveForecast ? 'text-blue-600 bg-blue-100' : 'text-yellow-700 bg-yellow-100';

  // FIXED: More robust temperature extraction
  const getTemperatureValues = () => {
    let highTemp = 0;
    let lowTemp = 0;

    if (weather.highTemp !== undefined && weather.lowTemp !== undefined) {
      highTemp = weather.highTemp;
      lowTemp = weather.lowTemp;
    } else if (weather.temperature !== undefined) {
      // Use single temperature as both high and low with small variation
      highTemp = weather.temperature + 5;
      lowTemp = weather.temperature - 5;
    }

    console.log(`🌡️ Temperature extraction for ${cityName}:`, {
      originalHighTemp: weather.highTemp,
      originalLowTemp: weather.lowTemp,
      originalTemperature: weather.temperature,
      calculatedHighTemp: highTemp,
      calculatedLowTemp: lowTemp
    });

    return { highTemp, lowTemp };
  };

  const { highTemp, lowTemp } = getTemperatureValues();

  // FIXED: Show weather even if temperatures are not perfect
  if (highTemp === 0 && lowTemp === 0 && !weather.temperature) {
    console.warn(`❌ No valid temperatures for ${cityName}, showing fallback`);
    return (
      <FallbackWeatherDisplay
        cityName={cityName}
        segmentDate={segmentDate}
        onRetry={onRetry}
        error="Invalid temperature data"
        showRetryButton={!isSharedView && !isPDFExport}
      />
    );
  }

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
            {Math.round(lowTemp || weather.temperature || 0)}°F
          </div>
          <div className={`text-xs ${isLiveForecast ? 'text-blue-600' : 'text-yellow-600'}`}>
            {isLiveForecast ? 'Low' : 'Avg Low'}
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${textClass}`}>
            {Math.round(highTemp || weather.temperature || 0)}°F
          </div>
          <div className={`text-xs ${isLiveForecast ? 'text-blue-600' : 'text-yellow-600'}`}>
            {isLiveForecast ? 'High' : 'Avg High'}
          </div>
        </div>
      </div>
      
      <div className={`mt-3 pt-3 border-t ${isLiveForecast ? 'border-blue-200' : 'border-yellow-200'}`}>
        <div className={`text-sm mb-2 capitalize ${isLiveForecast ? 'text-blue-700' : 'text-yellow-700'}`}>
          {weather.description || 'Weather information'}
        </div>
        <div className={`flex justify-between text-xs ${isLiveForecast ? 'text-blue-600' : 'text-yellow-600'}`}>
          <span>💧 {weather.precipitationChance || 0}%</span>
          <span>💨 {Math.round(weather.windSpeed || 0)} mph</span>
          <span>💦 {weather.humidity || 0}%</span>
        </div>
      </div>

      <div className={`mt-2 text-xs rounded p-2 ${isLiveForecast ? 'text-blue-500 bg-blue-100' : 'text-yellow-600 bg-yellow-100'}`}>
        {isLiveForecast ? (
          <>✅ Live forecast for {forecastLabel} 
          {validation.dataQuality === 'excellent' ? ' (exact match)' : 
           validation.dataQuality === 'good' ? ' (forecast data)' : ' (live data)'}
          </>
        ) : (
          `📊 Weather data for ${forecastLabel}`
        )}
      </div>

      {validation.warnings.length > 0 && !isSharedView && !isPDFExport && (
        <div className="mt-2 text-xs text-gray-600">
          {validation.warnings.slice(0, 1).map((warning, index) => (
            <div key={index}>ℹ️ {warning}</div>
          ))}
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
