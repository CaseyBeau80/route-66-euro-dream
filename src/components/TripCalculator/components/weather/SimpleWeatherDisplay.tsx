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
  console.log('🔧 FIXED: SimpleWeatherDisplay for', cityName, {
    temperature: weather.temperature,
    isActualForecast: weather.isActualForecast,
    source: weather.source,
    dateMatchSource: weather.dateMatchInfo?.source,
    hasTemperature: !!weather.temperature
  });

  // Extract temperatures with memoization to prevent recalculation
  const temperatures = React.useMemo(() => {
    const extracted = TemperatureExtractor.extractTemperatures(weather, cityName);
    console.log('🌡️ SimpleWeatherDisplay: Extracted temperatures:', extracted);
    return extracted;
  }, [weather.temperature, weather.highTemp, weather.lowTemp, weather.matchedForecastDay, cityName]);

  // Memoize weather type detection
  const weatherType = React.useMemo(() => {
    const type = WeatherTypeDetector.detectWeatherType(weather);
    WeatherTypeDetector.validateWeatherTypeConsistency(weather, `SimpleWeatherDisplay-${cityName}`);
    return type;
  }, [weather.source, weather.isActualForecast, weather.dateMatchInfo?.source, cityName]);
  const footerMessage = React.useMemo(() => WeatherTypeDetector.getFooterMessage(weather), [weather.source, weather.isActualForecast]);

  // Check if we have any displayable data
  if (!temperatures.isValid) {
    console.warn('❌ SimpleWeatherDisplay: No valid temperature data for', cityName);
    return <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <div className="text-yellow-800 font-medium mb-2">
          Weather information unavailable
        </div>
        <div className="text-sm text-yellow-600">
          Unable to display weather data for {cityName}
        </div>
      </div>;
  }

  // Determine what to show
  const showRange = !isNaN(temperatures.high) || !isNaN(temperatures.low);
  const showCurrent = !isNaN(temperatures.current) && !showRange;
  console.log('🔧 FIXED: Using centralized WeatherTypeDetector for display decision:', {
    cityName,
    showRange,
    showCurrent,
    weatherType,
    temperatures,
    weatherSource: weather.source,
    dateMatchSource: weather.dateMatchInfo?.source
  });
  return;
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return prevProps.weather.temperature === nextProps.weather.temperature && prevProps.weather.highTemp === nextProps.weather.highTemp && prevProps.weather.lowTemp === nextProps.weather.lowTemp && prevProps.weather.source === nextProps.weather.source && prevProps.weather.isActualForecast === nextProps.weather.isActualForecast && prevProps.weather.dateMatchInfo?.source === nextProps.weather.dateMatchInfo?.source && prevProps.cityName === nextProps.cityName && prevProps.segmentDate?.getTime() === nextProps.segmentDate?.getTime();
});
SimpleWeatherDisplay.displayName = 'SimpleWeatherDisplay';
export default SimpleWeatherDisplay;