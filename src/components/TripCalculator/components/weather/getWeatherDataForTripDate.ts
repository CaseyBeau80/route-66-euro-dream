
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { getHistoricalWeatherData } from './SeasonalWeatherService';
import { GeocodingService } from '../../services/GeocodingService';

export interface WeatherDisplayData {
  lowTemp: number;
  highTemp: number;
  icon: string;
  description: string;
  source: 'forecast' | 'historical' | 'seasonal';
  isAvailable: boolean;
  humidity: number;
  windSpeed: number;
  cityName: string;
  isActualForecast?: boolean;
}

/**
 * Central utility for handling weather data selection and formatting
 * Chooses between forecast and historical data based on trip date
 * Generates display-ready objects for [Low] [Icon] [High] layout
 */
export const getWeatherDataForTripDate = async (
  cityName: string,
  tripDate: Date,
  coordinates?: { lat: number; lng: number }
): Promise<WeatherDisplayData | null> => {
  const daysFromNow = Math.ceil((tripDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  console.log(`🌤️ getWeatherDataForTripDate: ${cityName} for ${tripDate.toDateString()}, ${daysFromNow} days from now`);

  const weatherService = EnhancedWeatherService.getInstance();
  
  if (!weatherService.hasApiKey()) {
    console.warn('❌ No weather API key available');
    return null;
  }

  // Get coordinates if not provided
  let coords = coordinates;
  if (!coords) {
    coords = GeocodingService.getCoordinatesForCity(cityName);
    if (!coords) {
      console.warn(`❌ No coordinates found for ${cityName}`);
      return null;
    }
  }

  try {
    // For dates within 5 days, try to get actual forecast
    if (daysFromNow >= 0 && daysFromNow <= 5) {
      console.log(`🔮 Attempting forecast for ${cityName} (${daysFromNow} days ahead)`);
      
      const forecastData: ForecastWeatherData | null = await weatherService.getWeatherForDate(
        coords.lat,
        coords.lng,
        cityName,
        tripDate
      );
      
      if (forecastData && forecastData.isActualForecast && forecastData.highTemp && forecastData.lowTemp) {
        console.log(`✅ Got actual forecast for ${cityName}:`, forecastData);
        return {
          lowTemp: forecastData.lowTemp,
          highTemp: forecastData.highTemp,
          icon: forecastData.icon,
          description: forecastData.description,
          source: 'forecast',
          isAvailable: true,
          humidity: forecastData.humidity,
          windSpeed: forecastData.windSpeed,
          cityName: forecastData.cityName,
          isActualForecast: true
        };
      }
    }
    
    // For dates beyond 5 days or if forecast failed, use historical data
    console.log(`📊 Using historical data for ${cityName} (${daysFromNow} days ahead)`);
    const historicalData = getHistoricalWeatherData(cityName, tripDate);
    
    return {
      lowTemp: historicalData.low,
      highTemp: historicalData.high,
      icon: '🌡️', // Thermometer emoji for historical data
      description: historicalData.condition,
      source: 'historical',
      isAvailable: true,
      humidity: historicalData.humidity,
      windSpeed: historicalData.windSpeed,
      cityName: cityName,
      isActualForecast: false // This is key - marking it as NOT a forecast
    };
    
  } catch (error) {
    console.error('❌ Error getting weather data:', error);
    
    // Fallback to historical data
    console.log(`📊 Fallback to historical data for ${cityName}`);
    const historicalData = getHistoricalWeatherData(cityName, tripDate);
    
    return {
      lowTemp: historicalData.low,
      highTemp: historicalData.high,
      icon: '🌡️',
      description: historicalData.condition,
      source: 'historical',
      isAvailable: true,
      humidity: historicalData.humidity,
      windSpeed: historicalData.windSpeed,
      cityName: cityName,
      isActualForecast: false // This is key - marking it as NOT a forecast
    };
  }
};
