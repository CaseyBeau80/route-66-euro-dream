
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
  const weatherTypeInfo = WeatherTypeDetector.detectWeatherType(weather);
  const sourceLabel = WeatherTypeDetector.getWeatherSourceLabel(weather);
  const isHighQuality = WeatherTypeDetector.isHighQualityWeather(weather);

  console.log('🎯 PLAN: SimpleWeatherDisplay rendering enhanced display:', {
    cityName,
    weatherType: weatherTypeInfo.type,
    isHighQuality,
    confidence: weatherTypeInfo.confidence,
    dataQuality: weatherTypeInfo.dataQuality
  });

  return (
    <div className={`rounded p-4 ${
      isHighQuality 
        ? 'bg-green-50 border border-green-200' 
        : 'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">
            🌤️ Weather for {cityName}
          </h4>
          <p className="text-sm text-gray-600 mb-2 capitalize">{weather.description}</p>
          <SimpleTemperatureDisplay weather={weather} isSharedView={isSharedView} />
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500">
              Source: {sourceLabel}
            </p>
            {!isHighQuality && (
              <p className="text-xs text-amber-600">
                💡 {weatherTypeInfo.description}
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
      
      {/* Data quality indicator for debugging */}
      {!isPDFExport && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <span className={`px-2 py-1 rounded ${
              weatherTypeInfo.confidence === 'high' ? 'bg-green-100 text-green-700' :
              weatherTypeInfo.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {weatherTypeInfo.confidence} confidence
            </span>
            <span className="text-gray-500">
              {weatherTypeInfo.dataQuality} quality
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleWeatherDisplay;
