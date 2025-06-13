
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { TemperatureExtractor } from './services/TemperatureExtractor';
import TemperatureDisplay from './TemperatureDisplay';
import WeatherIcon from './WeatherIcon';
import WeatherBadge from './components/WeatherBadge';
import WeatherInfo from './components/WeatherInfo';

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
  console.log('🔧 ENHANCED: SimpleWeatherDisplay for', cityName, {
    completeWeatherObject: weather,
    isActualForecast: weather.isActualForecast,
    source: weather.source,
    dateMatchSource: weather.dateMatchInfo?.source,
    temperature: weather.temperature,
    timestamp: new Date().toISOString()
  });

  // Extract temperatures using the enhanced TemperatureExtractor
  const temperatures = React.useMemo(() => {
    const extracted = TemperatureExtractor.extractTemperatures(weather, cityName);
    console.log('🌡️ SimpleWeatherDisplay: Extracted temperatures:', extracted);
    return extracted;
  }, [weather, cityName]);

  // Determine what to display based on available temperature data
  const displayConfig = React.useMemo(() => {
    const hasValidCurrent = temperatures.isValid && !isNaN(temperatures.current);
    const hasValidRange = temperatures.isValid && (!isNaN(temperatures.high) || !isNaN(temperatures.low));
    
    return {
      hasValidCurrent,
      hasValidRange,
      showCurrent: hasValidCurrent && !hasValidRange,
      showRange: hasValidRange
    };
  }, [temperatures]);

  // ENHANCED: More robust source determination with defensive fallbacks
  const weatherBadgeProps = React.useMemo(() => {
    // Start with a sensible default
    let determinedSource: 'live_forecast' | 'historical_fallback' | 'seasonal' = 'historical_fallback';
    
    // Primary source determination (most reliable)
    if (weather.source) {
      determinedSource = weather.source;
    }
    // Secondary: Check dateMatchInfo source
    else if (weather.dateMatchInfo?.source) {
      if (weather.dateMatchInfo.source === 'live_forecast' || weather.dateMatchInfo.source === 'api-forecast') {
        determinedSource = 'live_forecast';
      } else if (weather.dateMatchInfo.source === 'seasonal-estimate') {
        determinedSource = 'seasonal';
      }
    }
    // Tertiary: Use isActualForecast flag
    else if (weather.isActualForecast === true) {
      determinedSource = 'live_forecast';
    }
    
    const props = {
      source: determinedSource,
      isActualForecast: weather.isActualForecast,
      dateMatchSource: weather.dateMatchInfo?.source,
      cityName: cityName
    };
    
    console.log('🔧 ENHANCED: WeatherBadge props for', cityName, {
      originalSource: weather.source,
      originalIsActualForecast: weather.isActualForecast,
      originalDateMatchSource: weather.dateMatchInfo?.source,
      determinedSource,
      finalProps: props
    });
    
    return props;
  }, [weather.source, weather.isActualForecast, weather.dateMatchInfo?.source, cityName]);

  // ENHANCED: More reliable footer message with multiple fallback checks
  const getFooterMessage = React.useMemo(() => {
    // Check multiple indicators for live forecast
    const isLive = weather.isActualForecast === true || 
                   weather.source === 'live_forecast' || 
                   weather.dateMatchInfo?.source === 'live_forecast' ||
                   weather.dateMatchInfo?.source === 'api-forecast';
    
    console.log('🔧 ENHANCED: Footer message for', cityName, {
      isActualForecast: weather.isActualForecast,
      source: weather.source,
      dateMatchSource: weather.dateMatchInfo?.source,
      isLiveCheck: isLive,
      decision: isLive ? 'LIVE' : 'HISTORICAL'
    });

    if (isLive) {
      return 'Real-time weather forecast from API';
    }

    return 'Historical weather patterns - live forecast not available for this date';
  }, [weather.isActualForecast, weather.source, weather.dateMatchInfo?.source, cityName]);

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
        
        {/* Enhanced Weather Badge with defensive props */}
        <WeatherBadge {...weatherBadgeProps} />
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
      <WeatherInfo
        humidity={weather.humidity}
        windSpeed={weather.windSpeed}
        precipitationChance={weather.precipitationChance}
      />

      {/* Enhanced footer message with multiple fallback checks */}
      <div className="mt-3 text-xs text-blue-500 text-center">
        {getFooterMessage}
      </div>

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500 text-center border-t pt-2">
          Debug: isActualForecast={String(weather.isActualForecast)}, source={weather.source}, dateMatchSource={weather.dateMatchInfo?.source}
        </div>
      )}
    </div>
  );
};

export default SimpleWeatherDisplay;
