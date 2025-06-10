
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
 * CRITICAL FIX: Use EXACT segment date - no offset whatsoever
 */
export const getWeatherDataForTripDate = async (
  cityName: string,
  tripDate: Date | string,
  coordinates?: { lat: number; lng: number }
): Promise<WeatherDisplayData | null> => {
  // Validate and normalize tripDate to prevent any date drift
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

  // CRITICAL: Use EXACT segment date - NO OFFSET ANYWHERE
  const exactDateString = DateNormalizationService.toDateString(exactSegmentDate);
  const daysFromNow = Math.ceil((exactSegmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  console.log(`🎯 getWeatherDataForTripDate: ${cityName} for EXACT segment date ${exactDateString}, ${daysFromNow} days from now - NO OFFSET APPLIED`);

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
        exactSegmentDate // Use exact segment date
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
  
  // FALLBACK: Historical data using ZERO OFFSET - use the EXACT same segment date
  console.log(`📊 CRITICAL FIX: Using historical data for ${cityName} on EXACT segment date ${exactDateString} with ZERO OFFSET`);
  
  // CRITICAL FIX: Pass the EXACT segment date to historical service with ZERO offset
  const historicalData = getHistoricalWeatherData(cityName, exactSegmentDate, 0); // ZERO OFFSET - exact same date
  
  // ABSOLUTE validation that historical data uses the EXACT segment date
  const expectedDateString = DateNormalizationService.toDateString(exactSegmentDate);
  if (historicalData.alignedDate !== expectedDateString) {
    console.error(`❌ CRITICAL: Historical data using wrong date for ${cityName}`, {
      expectedSegmentDate: expectedDateString,
      historicalDate: historicalData.alignedDate,
      segmentDateISO: exactSegmentDate.toISOString(),
      mustBeExactMatch: true
    });
    
    // Force correction to prevent display issues
    console.log(`🔧 FORCING HISTORICAL DATE CORRECTION: ${historicalData.alignedDate} → ${expectedDateString}`);
    historicalData.alignedDate = expectedDateString;
  } else {
    console.log(`✅ Historical data PERFECTLY aligned for ${cityName} on exact segment date ${expectedDateString}`);
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
