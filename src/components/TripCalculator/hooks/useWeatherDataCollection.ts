
import { useState, useEffect } from 'react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { TripDataSerializer } from '../services/TripDataSerializer';

export const useWeatherDataCollection = (
  tripPlan: TripPlan | null,
  tripStartDate?: Date
) => {
  const [weatherData, setWeatherData] = useState<Record<string, ForecastWeatherData>>({});
  const [isCollecting, setIsCollecting] = useState(false);

  useEffect(() => {
    // Reset weather data when trip plan changes
    if (!tripPlan) {
      setWeatherData({});
    }
  }, [tripPlan]);

  const addWeatherData = (cityName: string, day: number, weather: ForecastWeatherData) => {
    const key = TripDataSerializer.createWeatherDataKey(cityName, day);
    setWeatherData(prev => ({
      ...prev,
      [key]: weather
    }));
    
    console.log('📊 Weather data added for collection:', {
      city: cityName,
      day,
      key,
      source: weather.source,
      totalCollected: Object.keys(weatherData).length + 1
    });
  };

  const getWeatherData = (cityName: string, day: number): ForecastWeatherData | undefined => {
    const key = TripDataSerializer.createWeatherDataKey(cityName, day);
    return weatherData[key];
  };

  const collectAllWeatherData = async (): Promise<Record<string, ForecastWeatherData>> => {
    if (!tripPlan?.segments) {
      return {};
    }

    setIsCollecting(true);
    console.log('🔄 Starting weather data collection for all segments...');

    try {
      // Return currently collected weather data
      // In a real implementation, you might trigger additional weather fetching here
      console.log('✅ Weather data collection completed', {
        totalEntries: Object.keys(weatherData).length,
        segments: tripPlan.segments.length
      });

      return weatherData;
    } finally {
      setIsCollecting(false);
    }
  };

  return {
    weatherData,
    isCollecting,
    addWeatherData,
    getWeatherData,
    collectAllWeatherData
  };
};
