
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
 * CRITICAL: Uses centralized date normalization to prevent misalignment
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

  // CRITICAL: Normalize the date using centralized service
  const normalizedTripDate = DateNormalizationService.normalizeSegmentDate(validTripDate);
  const normalizedDateString = DateNormalizationService.toDateString(normalizedTripDate);
  const daysFromNow = Math.ceil((normalizedTripDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  console.log(`🌤️ getWeatherDataForTripDate: ${cityName} for ${normalizedDateString}, ${daysFromNow} days from now`);
  console.log(`🗓️ Date normalization in getWeatherDataForTripDate:`, {
    originalTripDate: validTripDate.toISOString(),
    normalizedTripDate: normalizedTripDate.toISOString(),
    normalizedDateString,
    daysFromNow
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

  // PRIORITY 1: Try to get live forecast if API key is available and date is within range
  if (weatherService.hasApiKey() && daysFromNow >= 0 && daysFromNow <= 5) {
    console.log(`🔮 Attempting live forecast for ${cityName} (${daysFromNow} days ahead) using normalized date: ${normalizedDateString}`);
    
    try {
      const forecastData: ForecastWeatherData | null = await weatherService.getWeatherForDate(
        coords.lat,
        coords.lng,
        cityName,
        normalizedTripDate // Pass the normalized date directly
      );
      
      // Check if we got actual forecast data with valid temperatures AND proper date alignment
      if (forecastData && 
          forecastData.isActualForecast && 
          forecastData.highTemp !== undefined && 
          forecastData.lowTemp !== undefined &&
          forecastData.highTemp > 0 && 
          forecastData.lowTemp > 0 &&
          forecastData.dateMatchInfo?.requestedDate === normalizedDateString) {
        
        console.log(`✅ Got live forecast for ${cityName} with date alignment:`, {
          requestedDate: normalizedDateString,
          matchedDate: forecastData.dateMatchInfo.matchedDate,
          high: forecastData.highTemp + '°F',
          low: forecastData.lowTemp + '°F',
          humidity: forecastData.humidity + '%',
          wind: forecastData.windSpeed + ' mph',
          precipitation: (forecastData.precipitationChance || 0) + '%'
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
      
      console.log(`⚠️ Forecast request returned but no valid aligned data for ${cityName}`, {
        hasForecastData: !!forecastData,
        isActualForecast: forecastData?.isActualForecast,
        hasValidTemps: !!(forecastData?.highTemp && forecastData?.lowTemp),
        dateAlignment: forecastData?.dateMatchInfo?.requestedDate === normalizedDateString
      });
      
    } catch (error) {
      console.error('❌ Error getting live forecast:', error);
    }
  } else {
    console.log(`📊 Skipping forecast request for ${cityName}:`, {
      hasApiKey: weatherService.hasApiKey(),
      daysFromNow,
      isWithinRange: daysFromNow >= 0 && daysFromNow <= 5
    });
  }
  
  // PRIORITY 2: Fall back to historical/seasonal data using the exact normalized date
  console.log(`📊 Using historical data for ${cityName} using normalized date: ${normalizedDateString}`);
  const historicalData = getHistoricalWeatherData(cityName, normalizedTripDate);
  
  const historicalDisplay = {
    lowTemp: historicalData.low,
    highTemp: historicalData.high,
    icon: '🌡️', // Thermometer emoji for historical data
    description: historicalData.condition,
    source: 'historical' as const,
    isAvailable: true,
    humidity: historicalData.humidity,
    windSpeed: historicalData.windSpeed,
    precipitationChance: historicalData.precipitationChance,
    cityName: cityName,
    isActualForecast: false // This is key - marking it as NOT a forecast
  };
  
  console.log(`📊 Historical weather data for ${cityName} on ${normalizedDateString}:`, {
    alignedDate: historicalData.alignedDate,
    expectedDate: normalizedDateString,
    high: historicalDisplay.highTemp + '°F',
    low: historicalDisplay.lowTemp + '°F',
    humidity: historicalDisplay.humidity + '%',
    wind: historicalDisplay.windSpeed + ' mph',
    precipitation: (historicalDisplay.precipitationChance || 0) + '%'
  });
  
  return historicalDisplay;
};
