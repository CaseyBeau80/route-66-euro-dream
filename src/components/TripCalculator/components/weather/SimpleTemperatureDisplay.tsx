
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherUtilityService } from './services/WeatherUtilityService';

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
  // CRITICAL FIX: Use direct calculation instead of memoization to prevent stale data
  const isLiveForecast = WeatherUtilityService.isLiveForecast(weather, segmentDate);

  // CRITICAL FIX: Force component key to change when weather source changes
  const temperatureKey = `${weather.cityName}-${weather.source}-${weather.isActualForecast}-${isLiveForecast}-temp-direct`;

  console.log('🌡️ CRITICAL FIX: SimpleTemperatureDisplay rendering with direct calculation:', {
    cityName: weather.cityName,
    high: weather.highTemp,
    low: weather.lowTemp,
    isLiveForecast,
    isSharedView,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    segmentDate: segmentDate?.toISOString(),
    temperatureKey,
    criticalFix: true,
    directCalculation: true
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
    <div className="temperature-display" key={temperatureKey}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-800">
            {highTemp}°F
          </span>
          {lowTemp && lowTemp !== highTemp && (
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
            <div className="text-xs text-green-600 font-medium" key={`live-${temperatureKey}`}>
              ✓ Live Forecast
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleTemperatureDisplay;
