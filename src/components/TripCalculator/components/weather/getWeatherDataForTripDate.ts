
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { getHistoricalWeatherData } from './SeasonalWeatherService';
import { GeocodingService } from '../../services/GeocodingService';
import { DateNormalizationService } from './DateNormalizationService';

export interface WeatherDisplayData {
  lowTemp: number;
  highTemp: number;
  icon: string;
  description: string;
  source: 'forecast' | 'historical' | 'seasonal';
  isAvailable: boolean;
  humidity: number;
  windSpeed: number;
  precipitationChance?: number;
  cityName: string;
  isActualForecast?: boolean;
}

export const getWeatherDataForTripDate = async (
  cityName: string,
  tripDate: Date | string,
  coordinates?: { lat: number; lng: number }
): Promise<WeatherDisplayData | null> => {
  let exactSegmentDate: Date;
  try {
    if (tripDate instanceof Date) {
      if (isNaN(tripDate.getTime())) {
        console.error('❌ getWeatherDataForTripDate: Invalid Date object provided', tripDate);
        return null;
      }
      exactSegmentDate = DateNormalizationService.normalizeSegmentDate(tripDate);
    } else if (typeof tripDate === 'string') {
      const tempDate = new Date(tripDate);
      if (isNaN(tempDate.getTime())) {
        console.error('❌ getWeatherDataForTripDate: Invalid date string provided', tripDate);
        return null;
      }
      exactSegmentDate = DateNormalizationService.normalizeSegmentDate(tempDate);
    } else {
      console.error('❌ getWeatherDataForTripDate: tripDate is not a Date or string', { tripDate, type: typeof tripDate });
      return null;
    }
  } catch (error) {
    console.error('❌ getWeatherDataForTripDate: Error processing date:', error, tripDate);
    return null;
  }

  const exactDateString = DateNormalizationService.toDateString(exactSegmentDate);
  const daysFromNow = Math.ceil((exactSegmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  console.log(`🚨 FIXED: getWeatherDataForTripDate for ${cityName} on ${exactDateString}, ${daysFromNow} days from now`);

  const weatherService = EnhancedWeatherService.getInstance();
  
  // Get coordinates if not provided
  let coords = coordinates;
  if (!coords) {
    coords = GeocodingService.getCoordinatesForCity(cityName);
    if (!coords) {
      console.warn(`❌ No coordinates found for ${cityName}`);
      return null;
    }
  }

  // FIXED: Try live forecast for 0-5 days from now (including today)
  if (weatherService.hasApiKey() && daysFromNow >= 0 && daysFromNow <= 5) {
    console.log(`🚨 FIXED: Attempting live forecast for ${cityName} on ${exactDateString} (${daysFromNow} days from now)`);
    
    try {
      const timeoutPromise = new Promise<ForecastWeatherData | null>((_, reject) => {
        setTimeout(() => reject(new Error('Weather API timeout')), 8000);
      });
      
      const forecastPromise = weatherService.getWeatherForDate(
        coords.lat,
        coords.lng,
        cityName,
        exactSegmentDate
      );
      
      const forecastData: ForecastWeatherData | null = await Promise.race([
        forecastPromise,
        timeoutPromise
      ]);
      
      // FIXED: Accept live forecast with any valid data
      if (forecastData && forecastData.isActualForecast === true) {
        const highTemp = forecastData.highTemp || forecastData.temperature || 0;
        const lowTemp = forecastData.lowTemp || forecastData.temperature || 0;
        
        if (highTemp > 0 || lowTemp > 0 || forecastData.temperature !== undefined) {
          console.log(`✅ FIXED: Live forecast SUCCESS for ${cityName} on ${exactDateString}:`, {
            high: highTemp + '°F',
            low: lowTemp + '°F',
            isActualForecast: true,
            daysFromNow
          });
          
          return {
            lowTemp: lowTemp || forecastData.temperature || 0,
            highTemp: highTemp || forecastData.temperature || 0,
            icon: forecastData.icon,
            description: forecastData.description,
            source: 'forecast',
            isAvailable: true,
            humidity: forecastData.humidity,
            windSpeed: forecastData.windSpeed,
            precipitationChance: forecastData.precipitationChance,
            cityName: forecastData.cityName,
            isActualForecast: true
          };
        }
      }
      
      console.log(`⚠️ Live forecast validation failed for ${cityName} on ${exactDateString} - falling back to historical`);
      
    } catch (error) {
      if (error instanceof Error && error.message === 'Weather API timeout') {
        console.warn(`⏰ Weather API timeout for ${cityName} on ${exactDateString} - falling back to historical`);
      } else {
        console.error('❌ Error getting live forecast, falling back to historical:', error);
      }
    }
  } else {
    console.log(`⚠️ Live forecast not available for ${cityName}: API key = ${weatherService.hasApiKey()}, days from now = ${daysFromNow} (not within 0-5 day range)`);
  }
  
  // FALLBACK: Historical data
  console.log(`📊 FALLBACK: Using historical data for ${cityName} on ${exactDateString}`);
  
  const historicalData = getHistoricalWeatherData(cityName, exactSegmentDate, 0);
  
  return {
    lowTemp: historicalData.low,
    highTemp: historicalData.high,
    icon: '🌡️',
    description: historicalData.condition,
    source: 'historical' as const,
    isAvailable: true,
    humidity: historicalData.humidity,
    windSpeed: historicalData.windSpeed,
    precipitationChance: historicalData.precipitationChance,
    cityName: cityName,
    isActualForecast: false
  };
};
