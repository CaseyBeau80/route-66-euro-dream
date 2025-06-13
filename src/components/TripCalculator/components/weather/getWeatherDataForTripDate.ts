
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { GeocodingService } from '../../services/GeocodingService';
import { DateNormalizationService } from './DateNormalizationService';
import { WeatherSourceValidator } from './services/WeatherSourceValidator';
import { WeatherDataConverter } from './services/WeatherDataConverter';

export interface WeatherDisplayData {
  lowTemp: number;
  highTemp: number;
  icon: string;
  description: string;
  source: 'live_forecast' | 'historical_fallback';
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
  console.log('🚨 [FORECAST AUDIT] getWeatherDataForTripDate ENTRY POINT', {
    cityName,
    tripDate: tripDate instanceof Date ? tripDate.toISOString() : tripDate,
    coordinates,
    timestamp: new Date().toISOString()
  });

  let exactSegmentDate: Date;
  try {
    if (tripDate instanceof Date) {
      if (isNaN(tripDate.getTime())) {
        console.error('❌ Invalid Date object provided', tripDate);
        return null;
      }
      exactSegmentDate = DateNormalizationService.normalizeSegmentDate(tripDate);
    } else if (typeof tripDate === 'string') {
      const tempDate = new Date(tripDate);
      if (isNaN(tempDate.getTime())) {
        console.error('❌ Invalid date string provided', tripDate);
        return null;
      }
      exactSegmentDate = DateNormalizationService.normalizeSegmentDate(tempDate);
    } else {
      console.error('❌ tripDate is not a Date or string', { tripDate, type: typeof tripDate });
      return null;
    }
  } catch (error) {
    console.error('❌ Error processing date:', error, tripDate);
    return null;
  }

  const exactDateString = DateNormalizationService.toDateString(exactSegmentDate);
  const daysFromNow = Math.ceil((exactSegmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  console.log(`🚨 Enhanced date analysis for ${cityName}:`, {
    originalDate: tripDate instanceof Date ? tripDate.toISOString() : tripDate,
    exactSegmentDate: exactSegmentDate.toISOString(),
    exactDateString,
    daysFromNow,
    isWithinForecastRange: daysFromNow >= 0 && daysFromNow <= 5
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

  // Check if we should attempt live forecast
  const shouldAttemptLiveForecast = WeatherSourceValidator.shouldAttemptLiveForecast(
    daysFromNow, 
    weatherService.hasApiKey()
  );
  
  console.log(`🚨 Enhanced live forecast decision for ${cityName}:`, {
    shouldAttemptLiveForecast,
    criteria: {
      hasApiKey: weatherService.hasApiKey(),
      daysFromNow,
      withinRange: daysFromNow >= 0 && daysFromNow <= 5
    }
  });

  if (shouldAttemptLiveForecast) {
    console.log(`🚨 ATTEMPTING LIVE FORECAST for ${cityName} on ${exactDateString}`);
    
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
      
      console.log(`🚨 Enhanced API response validation for ${cityName}:`, {
        hasData: !!forecastData,
        isActualForecast: forecastData?.isActualForecast,
        temperature: forecastData?.temperature,
        highTemp: forecastData?.highTemp,
        lowTemp: forecastData?.lowTemp,
        source: forecastData?.dateMatchInfo?.source
      });
      
      if (forecastData && WeatherSourceValidator.isValidLiveForecast(forecastData, daysFromNow)) {
        const highTemp = forecastData.highTemp || forecastData.temperature || 0;
        const lowTemp = forecastData.lowTemp || forecastData.temperature || 0;
        
        if (WeatherSourceValidator.validateTemperatureData(highTemp, lowTemp)) {
          console.log(`✅ LIVE FORECAST ACCEPTED for ${cityName}:`, {
            high: highTemp + '°F',
            low: lowTemp + '°F',
            source: 'live_forecast'
          });
          
          return WeatherDataConverter.createLiveForecastResult(forecastData, cityName);
        } else {
          console.log(`⚠️ Invalid temperature data for ${cityName}:`, {
            highTemp,
            lowTemp,
            reason: 'temperature_validation_failed'
          });
        }
      } else {
        console.log(`⚠️ LIVE FORECAST REJECTED for ${cityName}:`, {
          hasData: !!forecastData,
          isActualForecast: forecastData?.isActualForecast,
          source: forecastData?.dateMatchInfo?.source,
          reason: 'FAILED_STRICT_LIVE_VALIDATION'
        });
      }
      
    } catch (error) {
      console.error('🚨 Error in live forecast attempt:', {
        cityName,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  // Use historical fallback
  console.log(`📊 TRIGGERING HISTORICAL FALLBACK for ${cityName}:`, {
    reason: shouldAttemptLiveForecast ? 'live_forecast_failed_validation' : 'outside_forecast_range',
    daysFromNow,
    exactDateString
  });
  
  const fallbackResult = WeatherDataConverter.createHistoricalFallbackResult(cityName, exactSegmentDate);

  console.log(`📊 ENHANCED HISTORICAL FALLBACK RESULT for ${cityName}:`, fallbackResult);

  return fallbackResult;
};
