
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { TemperatureExtractor } from './services/TemperatureExtractor';
import TemperatureDisplay from './TemperatureDisplay';
import WeatherIcon from './WeatherIcon';

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
  console.log('🌤️ SimpleWeatherDisplay: Enhanced rendering start', {
    cityName,
    weather,
    segmentDate: segmentDate?.toISOString(),
    isSharedView,
    isPDFExport
  });

  // Extract temperatures using the enhanced TemperatureExtractor
  const temperatures = React.useMemo(() => {
    console.log('🌡️ SimpleWeatherDisplay: Extracting temperatures for', cityName);
    const extracted = TemperatureExtractor.extractTemperatures(weather, cityName);
    console.log('🌡️ SimpleWeatherDisplay: Extracted temperatures:', extracted);
    return extracted;
  }, [weather, cityName]);

  // Enhanced badge logic using explicit source validation
  const getBadgeConfig = React.useMemo(() => {
    console.log('🏷️ SimpleWeatherDisplay: Enhanced badge logic for', cityName, {
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      dateMatchSource: weather.dateMatchInfo?.source
    });

    // ENHANCED STEP 3: Use explicit source for accurate badge display
    if (weather.source === 'live_forecast') {
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    } else if (weather.source === 'historical_fallback') {
      return {
        text: '📊 Seasonal Average',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        explanation: 'Based on historical weather patterns'
      };
    }

    // Fallback logic for legacy data without explicit source
    if (weather.isActualForecast === true && 
        (weather.dateMatchInfo?.source === 'api-forecast' || 
         weather.dateMatchInfo?.source === 'enhanced-fallback')) {
      console.log('🏷️ Legacy fallback: Live forecast detected', { cityName, source: weather.dateMatchInfo?.source });
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    } else {
      console.log('🏷️ Legacy fallback: Historical data detected', { cityName, isActualForecast: weather.isActualForecast });
      return {
        text: '📊 Seasonal Average',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        explanation: 'Based on historical weather patterns'
      };
    }
  }, [weather, cityName]);

  // Determine what to display based on available temperature data
  const displayConfig = React.useMemo(() => {
    const hasValidCurrent = temperatures.isValid && !isNaN(temperatures.current);
    const hasValidRange = temperatures.isValid && (!isNaN(temperatures.high) || !isNaN(temperatures.low));
    
    console.log('🌤️ SimpleWeatherDisplay: Display configuration:', {
      cityName,
      hasValidCurrent,
      hasValidRange,
      temperatures,
      badgeConfig: getBadgeConfig,
      weather: {
        description: weather.description,
        icon: weather.icon,
        source: weather.source,
        isActualForecast: weather.isActualForecast
      }
    });

    return {
      hasValidCurrent,
      hasValidRange,
      showCurrent: hasValidCurrent && !hasValidRange,
      showRange: hasValidRange
    };
  }, [temperatures, cityName, weather, getBadgeConfig]);

  if (!temperatures.isValid) {
    console.warn('❌ SimpleWeatherDisplay: No valid temperature data available for', cityName);
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <div className="text-yellow-800 font-medium mb-2">
          Weather information unavailable
        </div>
        <div className="text-sm text-yellow-600">
          Unable to extract temperature data for {cityName}
        </div>
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2 bg-gray-100 text-gray-800`}>
          <span>❓</span>
          <span>Weather Unavailable</span>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 text-xs text-red-500">
            Debug: {JSON.stringify(weather, null, 2)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      {/* Weather Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {weather.icon && (
            <WeatherIcon iconCode={weather.icon} className="w-8 h-8" />
          )}
          <div>
            <h4 className="font-medium text-blue-900">
              {weather.description || 'Weather Forecast'}
            </h4>
            {segmentDate && (
              <div className="text-sm text-blue-600">
                {segmentDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Forecast Type Badge with explicit source validation */}
        <div className={`text-xs px-2 py-1 rounded ${getBadgeConfig.bgColor} ${getBadgeConfig.textColor}`}>
          {getBadgeConfig.text}
        </div>
      </div>

      {/* Temperature Display */}
      <div className="mb-3">
        {displayConfig.showCurrent && (
          <TemperatureDisplay
            type="current"
            currentTemp={temperatures.current}
          />
        )}
        
        {displayConfig.showRange && (
          <TemperatureDisplay
            type="range"
            highTemp={temperatures.high}
            lowTemp={temperatures.low}
          />
        )}
      </div>

      {/* Additional Weather Info */}
      {(weather.humidity || weather.windSpeed || weather.precipitationChance) && (
        <div className="grid grid-cols-3 gap-2 text-sm text-blue-700">
          {weather.humidity && (
            <div className="text-center">
              <div className="font-medium">{weather.humidity}%</div>
              <div className="text-xs text-blue-600">Humidity</div>
            </div>
          )}
          
          {weather.windSpeed && (
            <div className="text-center">
              <div className="font-medium">{Math.round(weather.windSpeed)} mph</div>
              <div className="text-xs text-blue-600">Wind</div>
            </div>
          )}
          
          {weather.precipitationChance !== undefined && (
            <div className="text-center">
              <div className="font-medium">{weather.precipitationChance}%</div>
              <div className="text-xs text-blue-600">Rain</div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Data Source Info */}
      <div className="mt-3 text-xs text-blue-500 text-center">
        {getBadgeConfig.explanation}
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
