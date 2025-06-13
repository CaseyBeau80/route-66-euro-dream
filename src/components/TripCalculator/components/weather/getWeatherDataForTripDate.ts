
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
  console.log('🚨 [FORECAST AUDIT] getWeatherDataForTripDate ENTRY POINT', {
    cityName,
    tripDate: tripDate instanceof Date ? tripDate.toISOString() : tripDate,
    coordinates,
    timestamp: new Date().toISOString(),
    auditPoint: 'ENTRY_VALIDATION'
  });

  let exactSegmentDate: Date;
  try {
    if (tripDate instanceof Date) {
      if (isNaN(tripDate.getTime())) {
        console.error('❌ [FORECAST AUDIT] Invalid Date object provided', tripDate);
        return null;
      }
      exactSegmentDate = DateNormalizationService.normalizeSegmentDate(tripDate);
    } else if (typeof tripDate === 'string') {
      const tempDate = new Date(tripDate);
      if (isNaN(tempDate.getTime())) {
        console.error('❌ [FORECAST AUDIT] Invalid date string provided', tripDate);
        return null;
      }
      exactSegmentDate = DateNormalizationService.normalizeSegmentDate(tempDate);
    } else {
      console.error('❌ [FORECAST AUDIT] tripDate is not a Date or string', { tripDate, type: typeof tripDate });
      return null;
    }
  } catch (error) {
    console.error('❌ [FORECAST AUDIT] Error processing date:', error, tripDate);
    return null;
  }

  const exactDateString = DateNormalizationService.toDateString(exactSegmentDate);
  const daysFromNow = Math.ceil((exactSegmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  console.log(`🚨 [FORECAST AUDIT] Date analysis for ${cityName}:`, {
    originalDate: tripDate instanceof Date ? tripDate.toISOString() : tripDate,
    exactSegmentDate: exactSegmentDate.toISOString(),
    exactDateString,
    daysFromNow,
    isWithinForecastRange: daysFromNow >= 0 && daysFromNow <= 5,
    forecastRangeCheck: `${daysFromNow} days (must be 0-5 for live forecast)`,
    auditPoint: 'DATE_VALIDATION'
  });

  const weatherService = EnhancedWeatherService.getInstance();
  
  console.log('🚨 [FORECAST AUDIT] Weather service status', {
    hasApiKey: weatherService.hasApiKey(),
    debugInfo: weatherService.getDebugInfo(),
    daysFromNow,
    withinForecastRange: daysFromNow >= 0 && daysFromNow <= 5,
    auditPoint: 'SERVICE_CHECK'
  });
  
  // Get coordinates if not provided
  let coords = coordinates;
  if (!coords) {
    coords = GeocodingService.getCoordinatesForCity(cityName);
    if (!coords) {
      console.warn(`❌ [FORECAST AUDIT] No coordinates found for ${cityName}`);
      return null;
    }
  }

  // AUDIT POINT 1: Live forecast attempt criteria
  const shouldAttemptLiveForecast = weatherService.hasApiKey() && daysFromNow >= 0 && daysFromNow <= 5;
  
  console.log(`🚨 [FORECAST AUDIT] Live forecast decision for ${cityName}:`, {
    shouldAttemptLiveForecast,
    criteria: {
      hasApiKey: weatherService.hasApiKey(),
      daysFromNow,
      withinRange: daysFromNow >= 0 && daysFromNow <= 5
    },
    auditPoint: 'LIVE_FORECAST_CRITERIA'
  });

  if (shouldAttemptLiveForecast) {
    console.log(`🚨 [FORECAST AUDIT] ATTEMPTING LIVE FORECAST for ${cityName} on ${exactDateString}`);
    
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
      
      console.log(`🚨 [FORECAST AUDIT] API RESPONSE for ${cityName}:`, {
        hasData: !!forecastData,
        isActualForecast: forecastData?.isActualForecast,
        temperature: forecastData?.temperature,
        highTemp: forecastData?.highTemp,
        lowTemp: forecastData?.lowTemp,
        description: forecastData?.description,
        source: forecastData?.dateMatchInfo?.source,
        auditPoint: 'API_RESPONSE_VALIDATION'
      });
      
      // AUDIT POINT 2: Live forecast validation
      if (forecastData) {
        const isValidLiveForecast = forecastData.isActualForecast === true && 
          (forecastData.dateMatchInfo?.source === 'api-forecast' || 
           forecastData.dateMatchInfo?.source === 'forecast');
        
        console.log(`🚨 [FORECAST AUDIT] Live forecast validation for ${cityName}:`, {
          isValidLiveForecast,
          validationCriteria: {
            isActualForecast: forecastData.isActualForecast,
            expectedValue: true,
            source: forecastData.dateMatchInfo?.source,
            allowedSources: ['api-forecast', 'forecast']
          },
          auditPoint: 'LIVE_FORECAST_VALIDATION'
        });
        
        if (isValidLiveForecast) {
          const highTemp = forecastData.highTemp || forecastData.temperature || 0;
          const lowTemp = forecastData.lowTemp || forecastData.temperature || 0;
          
          // Temperature validation
          if (highTemp > 0 && lowTemp > 0 && highTemp >= lowTemp) {
            console.log(`✅ [FORECAST AUDIT] LIVE FORECAST ACCEPTED for ${cityName}:`, {
              high: highTemp + '°F',
              low: lowTemp + '°F',
              isActualForecast: true,
              source: 'forecast',
              description: forecastData.description,
              auditPoint: 'LIVE_FORECAST_ACCEPTED'
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
            console.log(`⚠️ [FORECAST AUDIT] Invalid temperature data for ${cityName}:`, {
              highTemp,
              lowTemp,
              reason: 'temperature_validation_failed',
              auditPoint: 'TEMPERATURE_VALIDATION_FAILED'
            });
          }
        } else {
          console.log(`⚠️ [FORECAST AUDIT] LIVE FORECAST REJECTED for ${cityName}:`, {
            hasData: !!forecastData,
            isActualForecast: forecastData?.isActualForecast,
            source: forecastData?.dateMatchInfo?.source,
            reason: 'FAILED_LIVE_VALIDATION',
            auditPoint: 'LIVE_FORECAST_REJECTED'
          });
        }
      } else {
        console.log(`⚠️ [FORECAST AUDIT] No data returned from API for ${cityName}`, {
          reason: 'api_returned_null',
          auditPoint: 'API_NO_DATA'
        });
      }
      
    } catch (error) {
      console.error('🚨 [FORECAST AUDIT] Error in live forecast attempt:', {
        cityName,
        error: error instanceof Error ? error.message : 'Unknown error',
        auditPoint: 'LIVE_FORECAST_ERROR'
      });
    }
  } else {
    console.log(`⚠️ [FORECAST AUDIT] LIVE FORECAST NOT ATTEMPTED for ${cityName}:`, {
      hasApiKey: weatherService.hasApiKey(),
      daysFromNow,
      reason: !weatherService.hasApiKey() ? 'no_api_key' : 'outside_0_5_day_range',
      auditPoint: 'LIVE_FORECAST_SKIPPED'
    });
  }
  
  // AUDIT POINT 3: Fallback trigger
  console.log(`📊 [FORECAST AUDIT] TRIGGERING HISTORICAL FALLBACK for ${cityName}:`, {
    reason: shouldAttemptLiveForecast ? 'live_forecast_failed_validation' : 'outside_forecast_range',
    daysFromNow,
    exactDateString,
    auditPoint: 'FALLBACK_TRIGGERED'
  });
  
  const historicalData = getHistoricalWeatherData(cityName, exactSegmentDate, 0);
  
  const fallbackResult = {
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

  console.log(`📊 [FORECAST AUDIT] HISTORICAL FALLBACK RESULT for ${cityName}:`, {
    fallbackResult,
    auditPoint: 'FALLBACK_RESULT'
  });

  return fallbackResult;
};
