
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherLabelService } from './services/WeatherLabelService';

interface SimpleWeatherDisplayProps {
  weather: ForecastWeatherData;
  isSharedView?: boolean;
  segmentDate?: Date;
  cityName?: string;
  isPDFExport?: boolean;
}

const SimpleWeatherDisplay: React.FC<SimpleWeatherDisplayProps> = ({
  weather,
  isSharedView = false,
  segmentDate,
  cityName,
  isPDFExport = false
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

  // Use high/low temps if available, otherwise fall back to main temperature
  const highTemp = weather.highTemp || weather.temperature;
  const lowTemp = weather.lowTemp || weather.temperature;
  const hasRange = highTemp && lowTemp && highTemp !== lowTemp;

  const highTempLabel = getTemperatureLabel(highTemp);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🌤️</div>
          <div>
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
            <div className="text-sm text-gray-600">
              {weather.cityName || cityName}
            </div>
          </div>
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

export default SimpleWeatherDisplay;
