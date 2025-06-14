
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface WeatherDebugOverlayProps {
  weather: ForecastWeatherData;
  cityName: string;
  segmentDate: Date;
  isVisible?: boolean;
}

const WeatherDebugOverlay: React.FC<WeatherDebugOverlayProps> = ({
  weather,
  cityName,
  segmentDate,
  isVisible = false
}) => {
  if (!isVisible) return null;

  const debugData = {
    source: weather.source,
    isActualForecast: weather.isActualForecast,
    temperature: weather.temperature,
    cityName: weather.cityName,
    description: weather.description,
    timestamp: new Date().toISOString()
  };

  const isLiveForecast = weather.source === 'live_forecast' && weather.isActualForecast === true;

  return (
    <div className="absolute top-0 right-0 bg-black bg-opacity-90 text-white p-2 text-xs rounded-bl z-50 max-w-xs">
      <div className="font-bold mb-1">🔍 Debug: {cityName}</div>
      <div className={`mb-1 ${isLiveForecast ? 'text-green-400' : 'text-yellow-400'}`}>
        {isLiveForecast ? '🟢 LIVE' : '🟡 HISTORICAL'}
      </div>
      <div>Source: {debugData.source}</div>
      <div>Forecast: {String(debugData.isActualForecast)}</div>
      <div>Temp: {debugData.temperature}°F</div>
      <div>Date: {segmentDate.toLocaleDateString()}</div>
      <div>Time: {debugData.timestamp.split('T')[1]?.split('.')[0]}</div>
    </div>
  );
};

export default WeatherDebugOverlay;
