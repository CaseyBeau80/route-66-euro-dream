
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
  console.log('🌤️ SimpleWeatherDisplay: ENHANCED rendering with strict source validation', {
    cityName,
    weather: {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      dateMatchSource: weather.dateMatchInfo?.source,
      temperature: weather.temperature
    },
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

  // Determine what to display based on available temperature data
  const displayConfig = React.useMemo(() => {
    const hasValidCurrent = temperatures.isValid && !isNaN(temperatures.current);
    const hasValidRange = temperatures.isValid && (!isNaN(temperatures.high) || !isNaN(temperatures.low));
    
    console.log('🌤️ SimpleWeatherDisplay: Display configuration:', {
      cityName,
      hasValidCurrent,
      hasValidRange,
      temperatures
    });

    return {
      hasValidCurrent,
      hasValidRange,
      showCurrent: hasValidCurrent && !hasValidRange,
      showRange: hasValidRange
    };
  }, [temperatures, cityName]);

  // ENHANCED: Get dynamic footer message with strict source validation
  const getFooterMessage = React.useMemo(() => {
    const dateMatchSource = weather.dateMatchInfo?.source;
    const explicitSource = weather.source;
    const isActualForecast = weather.isActualForecast;

    console.log('🌤️ SimpleWeatherDisplay: ENHANCED footer message determination', {
      cityName,
      dateMatchSource,
      explicitSource,
      isActualForecast,
      timestamp: new Date().toISOString()
    });

    // ENHANCED STEP 1: Check for seasonal/historical sources (highest priority)
    if (dateMatchSource === 'seasonal-estimate' || dateMatchSource === 'historical_fallback') {
      console.log('🌤️ SimpleWeatherDisplay: HISTORICAL footer (dateMatchSource)', { cityName, dateMatchSource });
      return 'Historical weather patterns - live forecast not available for this date';
    }

    // ENHANCED STEP 2: Check explicit source and isActualForecast flag for historical data
    if (explicitSource === 'historical_fallback' || isActualForecast === false) {
      console.log('🌤️ SimpleWeatherDisplay: HISTORICAL footer (explicit)', { cityName, explicitSource, isActualForecast });
      return 'Historical weather patterns - live forecast not available';
    }

    // ENHANCED STEP 3: Check for confirmed live forecast sources
    if (dateMatchSource === 'api-forecast' || dateMatchSource === 'enhanced-fallback') {
      console.log('🌤️ SimpleWeatherDisplay: LIVE footer (dateMatchSource)', { cityName, dateMatchSource });
      return 'Real-time weather forecast from API';
    }

    // ENHANCED STEP 4: Strict validation for live forecasts
    if (explicitSource === 'live_forecast' && isActualForecast === true) {
      console.log('🌤️ SimpleWeatherDisplay: LIVE footer (strict validation)', { cityName, explicitSource, isActualForecast });
      return 'Real-time weather forecast from API';
    }

    // ENHANCED STEP 5: Default to historical for uncertain cases
    console.warn('🌤️ SimpleWeatherDisplay: UNCERTAIN footer (defaulting to historical)', { 
      cityName, 
      dateMatchSource, 
      explicitSource, 
      isActualForecast 
    });
    return 'Weather forecast - source validation needed';
  }, [weather.dateMatchInfo?.source, weather.source, weather.isActualForecast, cityName]);

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
        
        {/* ENHANCED Weather Badge with Strict Source Detection */}
        <WeatherBadge
          source={weather.source}
          isActualForecast={weather.isActualForecast}
          dateMatchSource={weather.dateMatchInfo?.source}
          cityName={cityName}
        />
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

      {/* ENHANCED Dynamic Data Source Footer */}
      <div className="mt-3 text-xs text-blue-500 text-center">
        {getFooterMessage}
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
