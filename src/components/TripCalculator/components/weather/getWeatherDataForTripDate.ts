
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

/**
 * ENHANCED weather data utility with improved debugging for June 12 issue
 */
export const getWeatherDataForTripDate = async (
  cityName: string,
  tripDate: Date | string,
  coordinates?: { lat: number; lng: number }
): Promise<WeatherDisplayData | null> => {
  // Validate and normalize tripDate
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
  
  console.log(`🌦 getWeatherDataForTripDate ENHANCED DEBUG: ${cityName} for ${exactDateString}, ${daysFromNow} days from now`, {
    isJune12: exactDateString.includes('2025-06-12'),
    originalDate: tripDate,
    normalizedDate: exactSegmentDate.toISOString(),
    dateString: exactDateString
  });

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

  // PRIORITY 1: Try live forecast if API key available and within range
  if (weatherService.hasApiKey() && daysFromNow >= 0 && daysFromNow <= 5) {
    console.log(`🔮 ATTEMPTING LIVE FORECAST for ${cityName} on ${exactDateString} (${daysFromNow} days from now)`);
    
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
      
      // ENHANCED LOGGING for June 12 debugging
      console.log(`🌦 FORECAST RESPONSE for ${cityName} on ${exactDateString}:`, {
        hasData: !!forecastData,
        isActualForecast: forecastData?.isActualForecast,
        temperature: forecastData?.temperature,
        highTemp: forecastData?.highTemp,
        lowTemp: forecastData?.lowTemp,
        description: forecastData?.description,
        icon: forecastData?.icon,
        allFields: forecastData ? Object.keys(forecastData) : [],
        isJune12Response: exactDateString.includes('2025-06-12')
      });
      
      // MUCH MORE PERMISSIVE validation - accept if we have ANY useful data
      if (forecastData && (
        forecastData.isActualForecast === true ||
        forecastData.temperature !== undefined ||
        forecastData.highTemp !== undefined ||
        forecastData.lowTemp !== undefined ||
        forecastData.description
      )) {
        const highTemp = forecastData.highTemp || forecastData.temperature || 0;
        const lowTemp = forecastData.lowTemp || forecastData.temperature || 0;
        
        console.log(`✅ LIVE FORECAST ACCEPTED for ${cityName} on ${exactDateString}:`, {
          high: highTemp + '°F',
          low: lowTemp + '°F',
          temperature: forecastData.temperature,
          description: forecastData.description,
          isActualForecast: forecastData.isActualForecast,
          acceptanceReason: 'permissive_validation'
        });
        
        return {
          lowTemp: lowTemp || forecastData.temperature || 0,
          highTemp: highTemp || forecastData.temperature || 0,
          icon: forecastData.icon || '🌤️',
          description: forecastData.description || 'Live forecast',
          source: 'forecast',
          isAvailable: true,
          humidity: forecastData.humidity || 50,
          windSpeed: forecastData.windSpeed || 5,
          precipitationChance: forecastData.precipitationChance || 10,
          cityName: forecastData.cityName || cityName,
          isActualForecast: true
        };
      }
      
      console.log(`⚠️ Live forecast validation failed for ${cityName} on ${exactDateString}:`, {
        hasData: !!forecastData,
        reason: 'insufficient_data_fields',
        availableFields: forecastData ? Object.keys(forecastData) : []
      });
      
    } catch (error) {
      if (error instanceof Error && error.message === 'Weather API timeout') {
        console.warn(`⏰ Weather API timeout for ${cityName} on ${exactDateString}`);
      } else {
        console.error('❌ Error getting live forecast:', error);
      }
    }
  } else {
    console.log(`⚠️ Live forecast not available for ${cityName}: API key = ${weatherService.hasApiKey()}, days from now = ${daysFromNow}`);
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
