
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
  console.log('🚨 CRITICAL DEBUG: getWeatherDataForTripDate ENTRY POINT', {
    cityName,
    tripDate: tripDate instanceof Date ? tripDate.toISOString() : tripDate,
    coordinates,
    timestamp: new Date().toISOString()
  });

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
  
  console.log(`🚨 CRITICAL DEBUG: Processing ${cityName} on ${exactDateString}, ${daysFromNow} days from now`);

  const weatherService = EnhancedWeatherService.getInstance();
  
  console.log('🚨 CRITICAL DEBUG: Weather service status', {
    hasApiKey: weatherService.hasApiKey(),
    debugInfo: weatherService.getDebugInfo(),
    daysFromNow,
    withinForecastRange: daysFromNow >= 0 && daysFromNow <= 5
  });
  
  // Get coordinates if not provided
  let coords = coordinates;
  if (!coords) {
    coords = GeocodingService.getCoordinatesForCity(cityName);
    if (!coords) {
      console.warn(`❌ No coordinates found for ${cityName}`);
      return null;
    }
  }

  // CRITICAL: Try live forecast for 0-5 days from now (including today)
  if (weatherService.hasApiKey() && daysFromNow >= 0 && daysFromNow <= 5) {
    console.log(`🚨 CRITICAL DEBUG: ATTEMPTING LIVE FORECAST for ${cityName} on ${exactDateString}`);
    
    try {
      console.log('🚨 CRITICAL DEBUG: About to call weatherService.getWeatherForDate');
      
      const timeoutPromise = new Promise<ForecastWeatherData | null>((_, reject) => {
        setTimeout(() => reject(new Error('Weather API timeout')), 10000);
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
      
      console.log(`🚨 CRITICAL DEBUG: FORECAST API RESPONSE for ${cityName}:`, {
        hasData: !!forecastData,
        isActualForecast: forecastData?.isActualForecast,
        temperature: forecastData?.temperature,
        highTemp: forecastData?.highTemp,
        lowTemp: forecastData?.lowTemp,
        description: forecastData?.description,
        source: forecastData?.dateMatchInfo?.source,
        fullResponse: forecastData
      });
      
      // CRITICAL: Accept live forecast ONLY if API returns isActualForecast=true
      if (forecastData && forecastData.isActualForecast === true) {
        const highTemp = forecastData.highTemp || forecastData.temperature || 0;
        const lowTemp = forecastData.lowTemp || forecastData.temperature || 0;
        
        console.log(`✅ CRITICAL DEBUG: LIVE FORECAST ACCEPTED for ${cityName}:`, {
          high: highTemp + '°F',
          low: lowTemp + '°F',
          isActualForecast: true,
          source: 'forecast',
          description: forecastData.description
        });
        
        return {
          lowTemp: lowTemp,
          highTemp: highTemp,
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
        console.log(`⚠️ CRITICAL DEBUG: LIVE FORECAST REJECTED for ${cityName}:`, {
          hasData: !!forecastData,
          isActualForecast: forecastData?.isActualForecast,
          reason: !forecastData ? 'no_data_returned' : 'isActualForecast_not_true'
        });
      }
      
    } catch (error) {
      console.error('🚨 CRITICAL DEBUG: Error in live forecast attempt:', error);
    }
  } else {
    console.log(`⚠️ CRITICAL DEBUG: LIVE FORECAST NOT ATTEMPTED for ${cityName}:`, {
      hasApiKey: weatherService.hasApiKey(),
      daysFromNow,
      reason: !weatherService.hasApiKey() ? 'no_api_key' : 'outside_0_5_day_range'
    });
  }
  
  // FALLBACK: Historical data
  console.log(`📊 CRITICAL DEBUG: Using historical fallback for ${cityName}`);
  
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
