
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';

interface UnifiedWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate: Date;
  cityName: string;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const UnifiedWeatherDisplay: React.FC<UnifiedWeatherDisplayProps> = ({
  weather,
  segmentDate,
  cityName,
  isSharedView = false,
  isPDFExport = false
}) => {
  console.log('🔥 UNIFIED DISPLAY: Rendering weather for', cityName, {
    source: weather.source,
    isActualForecast: weather.isActualForecast,
    temperature: weather.temperature,
    isLiveForecast: weather.source === 'live_forecast' && weather.isActualForecast === true
  });

  return (
    <SimpleWeatherDisplay
      weather={weather}
      segmentDate={segmentDate}
      cityName={cityName}
      isSharedView={isSharedView}
      isPDFExport={isPDFExport}
    />
  );
};

export default UnifiedWeatherDisplay;
