
import React from 'react';
import ForecastWeatherDisplay from './ForecastWeatherDisplay';
import CurrentWeatherDisplay from './CurrentWeatherDisplay';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface WeatherDataDisplayProps {
  weather: any;
  segmentDate: Date | null;
  segmentEndCity: string;
}

const WeatherDataDisplay: React.FC<WeatherDataDisplayProps> = ({
  weather,
  segmentDate,
  segmentEndCity
}) => {
  // Check if this is actual forecast data with real weather information
  if (weather.isActualForecast !== undefined) {
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
          <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
            <strong>🔮 Live Forecast:</strong> Powered by OpenWeatherMap for {segmentDate?.toLocaleDateString()}
          </div>
          <ForecastWeatherDisplay weather={forecastWeather} segmentDate={segmentDate} />
        </div>
      );
    }
    
    // If forecast data exists but is marked as not actual forecast, show seasonal with note
    if (!forecastWeather.isActualForecast) {
      console.log(`📊 Forecast service returned seasonal data for ${segmentEndCity}`);
      return (
        <div className="space-y-2">
          <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            <strong>📊 Seasonal Estimate:</strong> Based on historical weather patterns
          </div>
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
