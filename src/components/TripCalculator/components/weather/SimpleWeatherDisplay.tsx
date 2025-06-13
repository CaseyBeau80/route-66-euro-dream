
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { TemperatureExtractor } from './services/TemperatureExtractor';
import TemperatureDisplay from './TemperatureDisplay';
import WeatherIcon from './WeatherIcon';
import WeatherBadge from './components/WeatherBadge';
import WeatherInfo from './components/WeatherInfo';
import { WeatherTypeDetector } from './utils/WeatherTypeDetector';

interface SimpleWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate?: Date | null;
  cityName: string;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const SimpleWeatherDisplay: React.FC<SimpleWeatherDisplayProps> = React.memo(({
  weather,
  segmentDate,
  cityName,
  isSharedView = false,
  isPDFExport = false
}) => {
  console.log('🔧 SimpleWeatherDisplay ENHANCED FOR TEMPERATURE DISPLAY:', cityName, {
    temperature: weather.temperature,
    highTemp: weather.highTemp,
    lowTemp: weather.lowTemp,
    isActualForecast: weather.isActualForecast,
    source: weather.source,
    dateMatchSource: weather.dateMatchInfo?.source,
    hasTemperature: !!weather.temperature,
    isSharedView,
    matchedForecastDay: weather.matchedForecastDay
  });

  // Extract temperatures with enhanced logic for shared views
  const temperatures = React.useMemo(() => {
    const extracted = TemperatureExtractor.extractTemperatures(weather, cityName);
    console.log('🌡️ SimpleWeatherDisplay: Extracted temperatures for shared view:', {
      cityName,
      isSharedView,
      extracted,
      originalWeather: {
        temperature: weather.temperature,
        highTemp: weather.highTemp,
        lowTemp: weather.lowTemp
      }
    });
    return extracted;
  }, [weather.temperature, weather.highTemp, weather.lowTemp, weather.matchedForecastDay, cityName]);

  // Memoize weather type detection
  const weatherType = React.useMemo(() => {
    const type = WeatherTypeDetector.detectWeatherType(weather);
    WeatherTypeDetector.validateWeatherTypeConsistency(weather, `SimpleWeatherDisplay-${cityName}`);
    return type;
  }, [weather.source, weather.isActualForecast, weather.dateMatchInfo?.source, cityName]);

  const footerMessage = React.useMemo(() => 
    WeatherTypeDetector.getFooterMessage(weather), 
    [weather.source, weather.isActualForecast]
  );

  // Enhanced validation for shared views
  if (!temperatures.isValid) {
    console.warn('❌ SimpleWeatherDisplay: No valid temperature data for shared view:', cityName, {
      temperatures,
      weather,
      isSharedView
    });
    
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <div className="text-yellow-800 font-medium mb-2">
          Weather information unavailable
        </div>
        <div className="text-sm text-yellow-600">
          Unable to display temperature data for {cityName}
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-yellow-500 mt-2">
            Debug: current={temperatures.current}, high={temperatures.high}, low={temperatures.low}
          </div>
        )}
      </div>
    );
  }

  // Determine what to show - prioritize range for shared views
  const showRange = (!isNaN(temperatures.high) || !isNaN(temperatures.low)) && isSharedView;
  const showCurrent = !isNaN(temperatures.current) && !showRange;

  console.log('🔧 SimpleWeatherDisplay: Display decision for shared view:', {
    cityName,
    showRange,
    showCurrent,
    weatherType,
    temperatures,
    isSharedView,
    weatherSource: weather.source,
    dateMatchSource: weather.dateMatchInfo?.source
  });

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
              {weather.description || weatherType.displayLabel}
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
        
        <WeatherBadge
          source={weather.source || 'historical_fallback'}
          isActualForecast={weather.isActualForecast}
          dateMatchSource={weather.dateMatchInfo?.source}
          cityName={cityName}
        />
      </div>

      {/* Enhanced Temperature Display for Shared Views */}
      <div className="mb-3">
        {showCurrent && (
          <TemperatureDisplay
            type="current"
            currentTemp={temperatures.current}
          />
        )}
        
        {showRange && (
          <TemperatureDisplay
            type="range"
            highTemp={temperatures.high}
            lowTemp={temperatures.low}
          />
        )}

        {/* Fallback: show both if available */}
        {!showCurrent && !showRange && temperatures.isValid && (
          <div className="space-y-2">
            {!isNaN(temperatures.current) && (
              <TemperatureDisplay
                type="current"
                currentTemp={temperatures.current}
              />
            )}
            {(!isNaN(temperatures.high) || !isNaN(temperatures.low)) && (
              <TemperatureDisplay
                type="range"
                highTemp={temperatures.high}
                lowTemp={temperatures.low}
              />
            )}
          </div>
        )}
      </div>

      {/* Additional Weather Info */}
      <WeatherInfo
        humidity={weather.humidity}
        windSpeed={weather.windSpeed}
        precipitationChance={weather.precipitationChance}
      />

      {/* Footer message */}
      <div className="mt-3 text-xs text-blue-500 text-center">
        {footerMessage}
      </div>

      {/* Enhanced debug info for shared views */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500 text-center border-t pt-2">
          <div>Debug: temp={weather.temperature}, source={weather.source}, isLive={weather.isActualForecast}</div>
          <div>Extracted: current={temperatures.current}, high={temperatures.high}, low={temperatures.low}</div>
          <div>Display: showRange={showRange}, showCurrent={showCurrent}, isSharedView={isSharedView}</div>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.weather.temperature === nextProps.weather.temperature &&
    prevProps.weather.highTemp === nextProps.weather.highTemp &&
    prevProps.weather.lowTemp === nextProps.weather.lowTemp &&
    prevProps.weather.source === nextProps.weather.source &&
    prevProps.weather.isActualForecast === nextProps.weather.isActualForecast &&
    prevProps.weather.dateMatchInfo?.source === nextProps.weather.dateMatchInfo?.source &&
    prevProps.cityName === nextProps.cityName &&
    prevProps.segmentDate?.getTime() === nextProps.segmentDate?.getTime() &&
    prevProps.isSharedView === nextProps.isSharedView
  );
});

SimpleWeatherDisplay.displayName = 'SimpleWeatherDisplay';

export default SimpleWeatherDisplay;
