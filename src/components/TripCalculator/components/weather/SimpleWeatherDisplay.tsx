
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherTypeDetector } from './utils/WeatherTypeDetector';
import SimpleTemperatureDisplay from './SimpleTemperatureDisplay';

interface SimpleWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate?: Date | null;
  cityName: string;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const SimpleWeatherDisplay: React.FC<SimpleWeatherDisplayProps> = ({
  weather,
  segmentDate,
  cityName,
  isSharedView = false,
  isPDFExport = false
}) => {
  // PLAN IMPLEMENTATION: Strict live forecast detection
  const isLiveForecast = React.useMemo(() => {
    if (!segmentDate) return false;
    
    // Calculate days from today
    const today = new Date();
    const daysFromToday = Math.ceil((segmentDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    
    // PLAN REQUIREMENT: Live forecast ONLY if ALL conditions are met:
    // 1. Within 0-7 day range
    // 2. weather.source === 'live_forecast'  
    // 3. weather.isActualForecast === true
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;
    const hasCorrectSource = weather.source === 'live_forecast';
    const isActualForecast = weather.isActualForecast === true;
    
    const isActuallyLive = isWithinForecastRange && hasCorrectSource && isActualForecast;
    
    console.log('🎯 PLAN: Strict live forecast detection for', cityName, {
      daysFromToday,
      isWithinForecastRange,
      weatherSource: weather.source,
      hasCorrectSource,
      isActualForecast: weather.isActualForecast,
      isActuallyLive,
      segmentDate: segmentDate.toISOString(),
      allConditionsMet: isWithinForecastRange && hasCorrectSource && isActualForecast
    });
    
    return isActuallyLive;
  }, [weather.source, weather.isActualForecast, segmentDate, cityName]);

  const weatherTypeInfo = WeatherTypeDetector.detectWeatherType(weather);
  
  // PLAN IMPLEMENTATION: Correct source labeling
  const sourceLabel = React.useMemo(() => {
    if (isLiveForecast) {
      return 'Live Weather Forecast';
    }
    return 'Historical Weather Data';
  }, [isLiveForecast]);
  
  console.log('🎯 PLAN: SimpleWeatherDisplay rendering with strict detection:', {
    cityName,
    isLiveForecast,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    sourceLabel,
    temperature: weather.temperature,
    description: weather.description
  });

  return (
    <div className={`rounded p-4 ${
      isLiveForecast 
        ? 'bg-green-50 border border-green-200' 
        : 'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">
            🌤️ Weather for {cityName}
          </h4>
          
          {/* PLAN IMPLEMENTATION: Only show live indicator for actual live forecasts */}
          {isLiveForecast && (
            <div className="mb-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                🔴 Live Forecast
              </span>
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-2 capitalize">{weather.description}</p>
          <SimpleTemperatureDisplay weather={weather} isSharedView={isSharedView} />
          
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500">
              Source: {sourceLabel}
            </p>
            {!isLiveForecast && (
              <p className="text-xs text-amber-600">
                💡 Based on historical weather patterns
              </p>
            )}
          </div>
        </div>
        
        <div className="text-4xl">
          {weather.icon ? (
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-16 h-16"
              onError={(e) => {
                console.warn('Weather icon failed to load:', weather.icon);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <span>🌤️</span>
          )}
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
        <div>💧 {weather.humidity}% humidity</div>
        <div>💨 {weather.windSpeed} mph wind</div>
        <div>☔ {weather.precipitationChance}% rain</div>
      </div>
      
      {/* PLAN IMPLEMENTATION: Correct data quality indicator */}
      {!isPDFExport && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <span className={`px-2 py-1 rounded ${
              isLiveForecast ? 'bg-green-100 text-green-700' :
              weatherTypeInfo.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {isLiveForecast ? 'Live Data' : `${weatherTypeInfo.confidence} confidence`}
            </span>
            <span className="text-gray-500">
              {isLiveForecast ? 'Real-time' : weatherTypeInfo.dataQuality} quality
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleWeatherDisplay;
