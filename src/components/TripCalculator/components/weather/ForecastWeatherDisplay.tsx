
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { getHistoricalWeatherData } from './SeasonalWeatherService';
import { DateNormalizationService } from './DateNormalizationService';
import HistoricalWeatherDisplay from './HistoricalWeatherDisplay';
import LiveWeatherDisplay from './LiveWeatherDisplay';

interface ForecastWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate?: Date | null;
}

const ForecastWeatherDisplay: React.FC<ForecastWeatherDisplayProps> = ({ 
  weather, 
  segmentDate 
}) => {
  // CRITICAL: Always use the exact segmentDate passed in
  const normalizedSegmentDate = segmentDate ? DateNormalizationService.normalizeSegmentDate(segmentDate) : null;
  
  // Calculate days from now for display purposes only - no offset calculations
  const daysFromNow = normalizedSegmentDate 
    ? Math.ceil((normalizedSegmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    : null;

  // Simplified date alignment logging
  if (process.env.NODE_ENV === 'development' && normalizedSegmentDate) {
    console.log(`🗓️ ForecastWeatherDisplay for ${weather.cityName}:`, {
      segmentDate: DateNormalizationService.toDateString(normalizedSegmentDate),
      daysFromNow,
      isActualForecast: weather.isActualForecast
    });
  }

  // Simplified weather data logging
  console.log('🌤️ ForecastWeatherDisplay render:', {
    cityName: weather.cityName,
    isActualForecast: weather.isActualForecast,
    hasValidTemps: !!(weather.highTemp && weather.lowTemp),
    daysFromNow
  });

  // Check if we should show historical data - simplified logic
  const shouldShowHistorical = !weather.isActualForecast || 
                              (daysFromNow && daysFromNow > 5) || 
                              weather.description === 'Forecast not available';

  // Get historical data if needed - use exact normalized segment date
  let displayData = weather;
  if (shouldShowHistorical && normalizedSegmentDate) {
    console.log(`📊 Using historical data for ${weather.cityName}`);
    
    // Check if we need fresh historical data
    if (!weather.lowTemp || !weather.highTemp || weather.lowTemp === weather.highTemp) {
      const historicalData = getHistoricalWeatherData(weather.cityName, normalizedSegmentDate);
      displayData = {
        ...weather,
        lowTemp: historicalData.low,
        highTemp: historicalData.high,
        description: historicalData.condition,
        humidity: historicalData.humidity,
        windSpeed: historicalData.windSpeed,
        precipitationChance: historicalData.precipitationChance
      };
    }
  }

  if (shouldShowHistorical && normalizedSegmentDate) {
    return (
      <HistoricalWeatherDisplay
        weather={displayData}
        segmentDate={normalizedSegmentDate}
        daysFromNow={daysFromNow}
      />
    );
  }

  // For actual forecasts or current weather within 5 days
  return (
    <LiveWeatherDisplay
      weather={weather}
      segmentDate={normalizedSegmentDate}
      daysFromNow={daysFromNow}
    />
  );
};

export default ForecastWeatherDisplay;
