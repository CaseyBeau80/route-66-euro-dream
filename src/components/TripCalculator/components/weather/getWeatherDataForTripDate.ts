
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
 * CRITICAL FIX: ABSOLUTE segment date preservation with live forecast priority
 */
export const getWeatherDataForTripDate = async (
  cityName: string,
  tripDate: Date | string,
  coordinates?: { lat: number; lng: number }
): Promise<WeatherDisplayData | null> => {
  // Validate and ensure tripDate is a proper Date object
  let validTripDate: Date;
  try {
    if (tripDate instanceof Date) {
      if (isNaN(tripDate.getTime())) {
        console.error('❌ getWeatherDataForTripDate: Invalid Date object provided', tripDate);
        return null;
      }
      validTripDate = tripDate;
    } else if (typeof tripDate === 'string') {
      validTripDate = new Date(tripDate);
      if (isNaN(validTripDate.getTime())) {
        console.error('❌ getWeatherDataForTripDate: Invalid date string provided', tripDate);
        return null;
      }
    } else {
      console.error('❌ getWeatherDataForTripDate: tripDate is not a Date or string', { tripDate, type: typeof tripDate });
      return null;
    }
  } catch (error) {
    console.error('❌ getWeatherDataForTripDate: Error processing date:', error, tripDate);
    return null;
  }

  // CRITICAL: Use EXACT input date - no normalization to prevent drift
  const exactDateString = DateNormalizationService.toDateString(validTripDate);
  const daysFromNow = Math.ceil((validTripDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  console.log(`🌤️ getWeatherDataForTripDate: ${cityName} for ABSOLUTE date ${exactDateString}, ${daysFromNow} days from now`);

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
    console.log(`🔮 PRIORITY: Attempting live forecast for ${cityName} on ABSOLUTE date ${exactDateString}`);
    
    try {
      const forecastData: ForecastWeatherData | null = await weatherService.getWeatherForDate(
        coords.lat,
        coords.lng,
        cityName,
        validTripDate // Use exact input date
      );
      
      // STRICT VALIDATION: Accept live forecast if it has valid data and is marked as actual forecast
      if (forecastData && 
          forecastData.isActualForecast === true && 
          forecastData.highTemp !== undefined && 
          forecastData.lowTemp !== undefined &&
          forecastData.highTemp > 0 && 
          forecastData.lowTemp > 0) {
        
        console.log(`✅ LIVE FORECAST PRIORITY: Using live forecast for ${cityName} on ${exactDateString}:`, {
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
        hasValidTemps: !!(forecastData?.highTemp && forecastData?.lowTemp)
      });
      
    } catch (error) {
      console.error('❌ Error getting live forecast, falling back to historical:', error);
    }
  } else {
    console.log(`⚠️ Live forecast not available for ${cityName}: API key = ${weatherService.hasApiKey()}, days from now = ${daysFromNow} (fallback to historical)`);
  }
  
  // FALLBACK: Historical data using the ABSOLUTE exact input date
  console.log(`📊 Using historical data for ${cityName} on ABSOLUTE date ${exactDateString}`);
  const historicalData = getHistoricalWeatherData(cityName, validTripDate); // Pass exact input date
  
  // ABSOLUTE validation that historical data aligns with our exact date
  if (historicalData.alignedDate !== exactDateString) {
    console.error(`❌ CRITICAL: Historical data misalignment for ${cityName}`, {
      expectedDate: exactDateString,
      historicalDate: historicalData.alignedDate,
      inputDateUsed: validTripDate.toISOString(),
      absoluteAlignmentFailure: true
    });
    
    // Force correction to prevent display issues
    historicalData.alignedDate = exactDateString;
  } else {
    console.log(`✅ Historical data ABSOLUTELY aligned for ${cityName} on ${exactDateString}`);
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
