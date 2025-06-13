
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
    console.log(`🚨 FORECAST ATTEMPT: ${cityName} on ${exactDateString} (${daysFromNow} days from now) - WITHIN LIVE RANGE`);
    
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
      
      console.log(`🚨 FORECAST API RESPONSE for ${cityName}:`, {
        hasData: !!forecastData,
        isActualForecast: forecastData?.isActualForecast,
        temperature: forecastData?.temperature,
        highTemp: forecastData?.highTemp,
        lowTemp: forecastData?.lowTemp,
        dateMatchInfo: forecastData?.dateMatchInfo,
        fullResponse: forecastData
      });
      
      // FIXED: Accept live forecast if API returns ANY forecast data with isActualForecast=true
      if (forecastData && forecastData.isActualForecast === true) {
        const highTemp = forecastData.highTemp || forecastData.temperature || 0;
        const lowTemp = forecastData.lowTemp || forecastData.temperature || 0;
        
        console.log(`✅ LIVE FORECAST ACCEPTED for ${cityName} on ${exactDateString}:`, {
          high: highTemp + '°F',
          low: lowTemp + '°F',
          isActualForecast: true,
          source: 'forecast',
          daysFromNow,
          reason: 'API_returned_isActualForecast_true'
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
      } else {
        console.log(`⚠️ LIVE FORECAST REJECTED for ${cityName} on ${exactDateString}:`, {
          hasData: !!forecastData,
          isActualForecast: forecastData?.isActualForecast,
          reason: !forecastData ? 'no_data_returned' : 'isActualForecast_not_true',
          fallbackToHistorical: true
        });
      }
      
    } catch (error) {
      if (error instanceof Error && error.message === 'Weather API timeout') {
        console.warn(`⏰ Weather API timeout for ${cityName} on ${exactDateString} - falling back to historical`);
      } else {
        console.error('❌ Error getting live forecast, falling back to historical:', error);
      }
    }
  } else {
    console.log(`⚠️ LIVE FORECAST NOT ATTEMPTED for ${cityName}:`, {
      hasApiKey: weatherService.hasApiKey(),
      daysFromNow,
      reason: !weatherService.hasApiKey() ? 'no_api_key' : 'outside_0_5_day_range'
    });
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
