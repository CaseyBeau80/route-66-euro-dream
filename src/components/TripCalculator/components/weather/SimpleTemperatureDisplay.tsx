
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherLabelService } from './services/WeatherLabelService';

interface SimpleTemperatureDisplayProps {
  weather: ForecastWeatherData;
  isSharedView?: boolean;
  segmentDate?: Date;
}

const SimpleTemperatureDisplay: React.FC<SimpleTemperatureDisplayProps> = ({
  weather,
  isSharedView = false,
  segmentDate
}) => {
  const isLiveForecast = WeatherLabelService.isLiveWeatherData(weather);
  
  console.log('🌡️ SimpleTemperatureDisplay - removed current temp display:', {
    cityName: weather.cityName,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    isLiveForecast,
    onlyShowingHighLow: true
  });

  const getTemperatureLabel = (temp: number): string => {
    if (temp >= 90) return 'Hot';
    if (temp >= 80) return 'Warm';
    if (temp >= 70) return 'Pleasant';
    if (temp >= 60) return 'Cool';
    if (temp >= 50) return 'Chilly';
    return 'Cold';
  };

  const highTemp = weather.highTemp || weather.temperature;
  const lowTemp = weather.lowTemp || weather.temperature;
  const highTempLabel = getTemperatureLabel(highTemp);

  return (
    <div className="temperature-display">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Only show high/low temperatures, no current temperature */}
          {highTemp && lowTemp && highTemp !== lowTemp ? (
            <span className="text-lg font-bold text-gray-800">
              {Math.round(highTemp)}° / {Math.round(lowTemp)}°F
            </span>
          ) : (
            <span className="text-lg font-bold text-gray-800">
              {Math.round(highTemp || lowTemp || 0)}°F
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-600">
            {highTempLabel}
          </div>
          {isLiveForecast && (
            <div className="text-xs text-green-600 font-medium">
              ✓ Live Forecast
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleTemperatureDisplay;
