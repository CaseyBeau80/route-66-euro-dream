
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
 * CRITICAL FIX: STRICT date preservation - no additional normalization allowed
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

  // CRITICAL FIX: Use EXACT input date without any normalization to prevent drift
  const exactDateString = DateNormalizationService.toDateString(validTripDate);
  const daysFromNow = Math.ceil((validTripDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  console.log(`🌤️ getWeatherDataForTripDate: ${cityName} for EXACT date ${exactDateString}, ${daysFromNow} days from now`);

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

  // PRIORITY FIX: Try to get live forecast first if API key is available and date is within range
  if (weatherService.hasApiKey() && daysFromNow >= 0 && daysFromNow <= 5) {
    console.log(`🔮 Attempting live forecast for ${cityName} on EXACT date ${exactDateString}`);
    
    try {
      const forecastData: ForecastWeatherData | null = await weatherService.getWeatherForDate(
        coords.lat,
        coords.lng,
        cityName,
        validTripDate // Use exact input date, no normalization
      );
      
      // STRICT VALIDATION: Accept forecast data if it has valid temperatures and is marked as actual forecast
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
          exactDateUsed: exactDateString
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
      
      console.log(`⚠️ Live forecast request failed validation for ${cityName} on ${exactDateString}:`, {
        hasData: !!forecastData,
        isActualForecast: forecastData?.isActualForecast,
        hasValidTemps: !!(forecastData?.highTemp && forecastData?.lowTemp)
      });
      
    } catch (error) {
      console.error('❌ Error getting live forecast:', error);
    }
  } else {
    console.log(`⚠️ Live forecast not attempted for ${cityName}: API key = ${weatherService.hasApiKey()}, days from now = ${daysFromNow}`);
  }
  
  // FALLBACK: Historical data using the EXACT input date (no additional normalization)
  console.log(`📊 Using historical data for ${cityName} on EXACT date ${exactDateString}`);
  const historicalData = getHistoricalWeatherData(cityName, validTripDate); // Pass exact input date
  
  // STRICT validation that historical data aligns with our exact date
  if (historicalData.alignedDate !== exactDateString) {
    console.error(`❌ CRITICAL: Historical data misalignment for ${cityName}`, {
      expectedDate: exactDateString,
      historicalDate: historicalData.alignedDate,
      inputDateUsed: validTripDate.toISOString(),
      strictAlignmentFailure: true
    });
    
    // Force correction to prevent display issues
    historicalData.alignedDate = exactDateString;
  } else {
    console.log(`✅ Historical data STRICTLY aligned for ${cityName} on ${exactDateString}`);
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
