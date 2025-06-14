
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
  // PHASE 1 FIX: Enhanced live forecast detection
  const isLiveForecast = React.useMemo(() => {
    const hasLiveProperties = weather.isActualForecast === true && weather.source === 'live_forecast';
    console.log('🎯 PHASE 1 FIX: Enhanced live forecast detection for', cityName, {
      isActualForecast: weather.isActualForecast,
      source: weather.source,
      hasLiveProperties,
      temperature: weather.temperature,
      description: weather.description
    });
    return hasLiveProperties;
  }, [weather.isActualForecast, weather.source, cityName]);

  const weatherTypeInfo = WeatherTypeDetector.detectWeatherType(weather);
  const sourceLabel = isLiveForecast ? 'Live Weather Forecast' : 'Historical Weather Data';
  
  console.log('🎯 PHASE 1 FIX: SimpleWeatherDisplay rendering with enhanced detection:', {
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
          
          {/* PHASE 1 FIX: Enhanced live forecast indicator */}
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
      
      {/* PHASE 1 FIX: Enhanced data quality indicator */}
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
