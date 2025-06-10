
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
 * Central utility for handling weather data selection and formatting
 * CRITICAL FIX: NO OFFSET - Always use the exact segment date
 */
export const getWeatherDataForTripDate = async (
  cityName: string,
  tripDate: Date | string,
  coordinates?: { lat: number; lng: number }
): Promise<WeatherDisplayData | null> => {
  // Validate and normalize tripDate to prevent any date drift
  let normalizedTripDate: Date;
  try {
    if (tripDate instanceof Date) {
      if (isNaN(tripDate.getTime())) {
        console.error('❌ getWeatherDataForTripDate: Invalid Date object provided', tripDate);
        return null;
      }
      normalizedTripDate = DateNormalizationService.normalizeSegmentDate(tripDate);
    } else if (typeof tripDate === 'string') {
      const tempDate = new Date(tripDate);
      if (isNaN(tempDate.getTime())) {
        console.error('❌ getWeatherDataForTripDate: Invalid date string provided', tripDate);
        return null;
      }
      normalizedTripDate = DateNormalizationService.normalizeSegmentDate(tempDate);
    } else {
      console.error('❌ getWeatherDataForTripDate: tripDate is not a Date or string', { tripDate, type: typeof tripDate });
      return null;
    }
  } catch (error) {
    console.error('❌ getWeatherDataForTripDate: Error processing date:', error, tripDate);
    return null;
  }

  // CRITICAL: Use EXACT normalized date - NO OFFSET
  const exactDateString = DateNormalizationService.toDateString(normalizedTripDate);
  const daysFromNow = Math.ceil((normalizedTripDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  console.log(`🎯 getWeatherDataForTripDate: ${cityName} for EXACT date ${exactDateString}, ${daysFromNow} days from now`);

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

  // PRIORITY 1: Try to get live forecast first if API key is available and date is within range
  if (weatherService.hasApiKey() && daysFromNow >= 0 && daysFromNow <= 5) {
    console.log(`🔮 PRIORITY: Attempting live forecast for ${cityName} on EXACT date ${exactDateString}`);
    
    try {
      // Add timeout wrapper for API calls
      const timeoutPromise = new Promise<ForecastWeatherData | null>((_, reject) => {
        setTimeout(() => reject(new Error('Weather API timeout')), 8000);
      });
      
      const forecastPromise = weatherService.getWeatherForDate(
        coords.lat,
        coords.lng,
        cityName,
        normalizedTripDate // Use exact normalized date
      );
      
      const forecastData: ForecastWeatherData | null = await Promise.race([
        forecastPromise,
        timeoutPromise
      ]);
      
      // STRICT VALIDATION: Accept live forecast if it has valid data and is marked as actual forecast
      if (forecastData && 
          forecastData.isActualForecast === true && 
          forecastData.highTemp !== undefined && 
          forecastData.lowTemp !== undefined &&
          forecastData.highTemp > 0 && 
          forecastData.lowTemp > 0) {
        
        console.log(`✅ LIVE FORECAST SUCCESS: Using live forecast for ${cityName} on ${exactDateString}:`, {
          high: forecastData.highTemp + '°F',
          low: forecastData.lowTemp + '°F',
          isActualForecast: forecastData.isActualForecast,
          description: forecastData.description,
          exactDateUsed: exactDateString,
          priorityOverHistorical: true
        });
        
        return {
          lowTemp: forecastData.lowTemp,
          highTemp: forecastData.highTemp,
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
      
      console.log(`⚠️ Live forecast validation failed for ${cityName} on ${exactDateString} - falling back to historical:`, {
        hasData: !!forecastData,
        isActualForecast: forecastData?.isActualForecast,
        hasValidTemps: !!(forecastData?.highTemp && forecastData?.lowTemp),
        reason: 'validation_failed'
      });
      
    } catch (error) {
      if (error instanceof Error && error.message === 'Weather API timeout') {
        console.warn(`⏰ Weather API timeout for ${cityName} on ${exactDateString} - falling back to historical`);
      } else {
        console.error('❌ Error getting live forecast, falling back to historical:', error);
      }
    }
  } else {
    console.log(`⚠️ Live forecast not available for ${cityName}: API key = ${weatherService.hasApiKey()}, days from now = ${daysFromNow} (fallback to historical)`);
  }
  
  // FALLBACK: Historical data using NO OFFSET - same exact date
  console.log(`📊 Using historical data for ${cityName} on EXACT date ${exactDateString} with NO OFFSET`);
  const historicalData = getHistoricalWeatherData(cityName, normalizedTripDate, 0); // NO OFFSET
  
  // ABSOLUTE validation that historical data aligns with our exact segment date
  const expectedDateString = DateNormalizationService.toDateString(normalizedTripDate);
  if (historicalData.alignedDate !== expectedDateString) {
    console.error(`❌ CRITICAL: Historical data misalignment for ${cityName}`, {
      expectedSegmentDate: expectedDateString,
      historicalDate: historicalData.alignedDate,
      inputDateUsed: normalizedTripDate.toISOString(),
      noOffsetRequired: true
    });
    
    // Force correction to prevent display issues
    historicalData.alignedDate = expectedDateString;
  } else {
    console.log(`✅ Historical data EXACTLY aligned for ${cityName} on exact date ${expectedDateString}`);
  }
  
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
