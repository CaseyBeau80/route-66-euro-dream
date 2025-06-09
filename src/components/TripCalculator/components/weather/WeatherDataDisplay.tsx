
import React from 'react';
import ForecastWeatherDisplay from './ForecastWeatherDisplay';
import CurrentWeatherDisplay from './CurrentWeatherDisplay';
import DismissibleSeasonalWarning from './DismissibleSeasonalWarning';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface WeatherDataDisplayProps {
  weather: any;
  segmentDate: Date | null;
  segmentEndCity: string;
  isSharedView?: boolean;
}

const WeatherDataDisplay: React.FC<WeatherDataDisplayProps> = ({
  weather,
  segmentDate,
  segmentEndCity,
  isSharedView = false
}) => {
  // Check if this is forecast data (matching PDF export logic)
  if (weather?.isActualForecast !== undefined) {
    const forecastWeather = weather as ForecastWeatherData;
    
    // Show live forecast data if we have actual forecast with valid temperatures
    if (forecastWeather.isActualForecast && 
        forecastWeather.highTemp !== undefined && 
        forecastWeather.lowTemp !== undefined &&
        forecastWeather.highTemp > 0 && 
        forecastWeather.lowTemp > 0) {
      
      console.log(`🔮 Showing live forecast for ${segmentEndCity}:`, {
        high: forecastWeather.highTemp,
        low: forecastWeather.lowTemp,
        description: forecastWeather.description
      });
      
      return (
        <div className="space-y-2">
          <DismissibleSeasonalWarning
            message={`Powered by OpenWeatherMap for ${segmentDate?.toLocaleDateString()}`}
            type="forecast-unavailable"
            isSharedView={isSharedView}
          />
          <ForecastWeatherDisplay weather={forecastWeather} segmentDate={segmentDate} />
        </div>
      );
    }
    
    // If forecast data exists but is marked as not actual forecast, show seasonal with warning
    if (!forecastWeather.isActualForecast) {
      console.log(`📊 Forecast service returned seasonal data for ${segmentEndCity}`);
      return (
        <div className="space-y-2">
          <DismissibleSeasonalWarning
            message="Based on historical weather patterns"
            type="seasonal"
            isSharedView={isSharedView}
          />
          <ForecastWeatherDisplay weather={forecastWeather} segmentDate={segmentDate} />
        </div>
      );
    }
  } else {
    // Regular weather data (current weather)
    return <CurrentWeatherDisplay weather={weather} segmentDate={segmentDate} />;
  }

  return null;
};

export default WeatherDataDisplay;
