
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

  const getTemperatureLabel = (temp: number): string => {
    if (temp >= 90) return 'Hot';
    if (temp >= 80) return 'Warm';
    if (temp >= 70) return 'Pleasant';
    if (temp >= 60) return 'Cool';
    if (temp >= 50) return 'Chilly';
    return 'Cold';
  };

  // Always show high/low range when available
  const highTemp = weather.highTemp || weather.temperature;
  const lowTemp = weather.lowTemp || weather.temperature;
  const hasRange = highTemp && lowTemp && highTemp !== lowTemp;
  const highTempLabel = getTemperatureLabel(highTemp);

  return (
    <div className="temperature-display">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-800">
            {highTemp}°F
          </span>
          {hasRange && (
            <span className="text-lg text-gray-600">
              / {lowTemp}°F
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
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
