
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { TemperatureExtractor } from './services/TemperatureExtractor';
import WeatherHeader from './components/WeatherHeader';
import TemperatureDisplayManager from './components/TemperatureDisplayManager';
import WeatherInfo from './components/WeatherInfo';
import WeatherFooter from './components/WeatherFooter';

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
  console.log('🔧 SimpleWeatherDisplay REFACTORED VERSION RENDERING:', cityName, {
    temperature: weather.temperature,
    highTemp: weather.highTemp,
    lowTemp: weather.lowTemp,
    isSharedView,
    isPDFExport
  });

  // Extract temperatures
  const temperatures = React.useMemo(() => {
    const extracted = TemperatureExtractor.extractTemperatures(weather, cityName);
    console.log('🌡️ SimpleWeatherDisplay: Temperature extraction:', {
      cityName,
      isSharedView,
      extracted
    });
    return extracted;
  }, [weather.temperature, weather.highTemp, weather.lowTemp, weather.matchedForecastDay, cityName]);

  // Validation for temperature data
  if (!temperatures.isValid) {
    console.warn('❌ SimpleWeatherDisplay: No valid temperature data:', cityName);
    
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <div className="text-yellow-800 font-medium mb-2">
          Weather information unavailable
        </div>
        <div className="text-sm text-yellow-600">
          Unable to display temperature data for {cityName}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <WeatherHeader
        weather={weather}
        segmentDate={segmentDate}
        cityName={cityName}
      />

      <div className="mb-3">
        <TemperatureDisplayManager
          temperatures={temperatures}
          isSharedView={isSharedView}
        />
      </div>

      <WeatherInfo
        humidity={weather.humidity}
        windSpeed={weather.windSpeed}
        precipitationChance={weather.precipitationChance}
      />

      <WeatherFooter
        weather={weather}
        temperatures={temperatures}
        isSharedView={isSharedView}
      />
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
    prevProps.cityName === nextProps.cityName &&
    prevProps.segmentDate?.getTime() === nextProps.segmentDate?.getTime() &&
    prevProps.isSharedView === nextProps.isSharedView
  );
});

SimpleWeatherDisplay.displayName = 'SimpleWeatherDisplay';

export default SimpleWeatherDisplay;
