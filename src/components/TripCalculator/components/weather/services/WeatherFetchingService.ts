
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { GeocodingService } from '../../../services/GeocodingService';
import { DateNormalizationService } from '../DateNormalizationService';
import { WeatherDataDebugger } from '../WeatherDataDebugger';
import { WeatherDataValidator } from '../utils/WeatherDataValidator';
import { WeatherDataNormalizer } from './WeatherDataNormalizer';
import { WeatherPersistenceService } from './WeatherPersistenceService';
import { WeatherDebugService } from './WeatherDebugService';

export class WeatherFetchingService {
  private static weatherService = EnhancedWeatherService.getInstance();

  static async fetchWeatherForSegment(
    segmentEndCity: string,
    segmentDate: Date,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    setWeather: (weather: ForecastWeatherData | null) => void
  ): Promise<void> {
    const normalizedSegmentDate = DateNormalizationService.normalizeSegmentDate(segmentDate);
    const segmentDateString = DateNormalizationService.toDateString(normalizedSegmentDate);
    
    // PLAN: Use consistent normalized LOCAL date calculation for forecast range check
    const today = new Date();
    const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
    const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedSegmentDate);
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7; // PLAN: Standardized to 0-7
    
    console.log('🔧 PLAN: WeatherFetchingService - STANDARDIZED FORECAST RANGE 0-7 WITH FALLBACK ENABLED', {
      cityName: segmentEndCity,
      normalizedToday: normalizedToday.toISOString(),
      normalizedTodayLocal: normalizedToday.toLocaleDateString(),
      normalizedSegmentDate: normalizedSegmentDate.toISOString(),
      normalizedSegmentLocal: normalizedSegmentDate.toLocaleDateString(),
      daysFromToday,
      isWithinForecastRange,
      shouldAttemptLiveForecast: isWithinForecastRange && this.weatherService.hasApiKey(),
      segmentDateString,
      dateCalculationMethod: 'DateNormalizationService_LOCAL',
      forecastLogic: 'Days 0-7 = TRY live forecast then fallback, Day 8+ = direct fallback',
      standardizedRange: true,
      localDateCalculation: true,
      fallbackEnabled: true
    });

    // PLAN: For forecast range dates (0-7), attempt live forecast but fallback on failure
    if (isWithinForecastRange && this.weatherService.hasApiKey()) {
      console.log('🔧 PLAN: ATTEMPTING live forecast with fallback for forecast range date', {
        cityName: segmentEndCity,
        daysFromToday,
        reason: 'within_0_to_7_day_range_attempt_live_then_fallback',
        standardizedForecastRange: true,
        localDateCalculation: true,
        fallbackEnabled: true
      });

      setLoading(true);
      setError(null); // Clear any previous errors

      try {
        const coordinates = GeocodingService.getCoordinatesForCity(segmentEndCity);
        if (!coordinates) {
          console.warn(`🌤️ No coordinates found for ${segmentEndCity}, using fallback weather`);
          throw new Error(`No coordinates found for ${segmentEndCity}`);
        }

        console.log(`🌤️ PLAN: LIVE FORECAST ATTEMPT: ${segmentEndCity} for ${segmentDateString}`, {
          coordinates,
          daysFromToday,
          isWithinForecastRange,
          reason: 'standardized_forecast_range_date_with_fallback',
          normalizedDateUsed: true,
          localDateCalculation: true,
          standardizedRange: true,
          fallbackEnabled: true
        });

        const weatherPromise = this.weatherService.getWeatherForDate(
          coordinates.lat,
          coordinates.lng,
          segmentEndCity,
          normalizedSegmentDate
        );

        const timeoutPromise = new Promise<ForecastWeatherData | null>((_, reject) => {
          setTimeout(() => reject(new Error('Weather fetch timeout after 15 seconds')), 15000);
        });

        const weatherData = await Promise.race([weatherPromise, timeoutPromise]);

        console.log(`🌤️ PLAN: LIVE FORECAST RESPONSE for ${segmentEndCity}:`, {
          hasData: !!weatherData,
          isActualForecast: weatherData?.isActualForecast,
          source: weatherData?.source,
          temperature: weatherData?.temperature,
          daysFromToday,
          shouldBeLiveForecast: isWithinForecastRange,
          normalizedDateUsed: true,
          standardizedForecastRangeEnforced: true,
          localDateCalculation: true,
          fallbackEnabled: true
        });

        if (weatherData) {
          console.log('🔧 PLAN: Live forecast SUCCESS for forecast range date', segmentEndCity, {
            daysFromToday,
            source: weatherData.source,
            isActualForecast: weatherData.isActualForecast,
            temperature: weatherData.temperature,
            normalizedCalculation: true,
            standardizedForecastRangeEnforced: true,
            localDateCalculation: true,
            fallbackEnabled: true
          });
          
          WeatherDebugService.logForecastApiRawResponse(segmentEndCity, weatherData);
          
          // Normalize and validate the data
          const normalizedData = WeatherDataNormalizer.normalizeWeatherData(
            weatherData, 
            segmentEndCity, 
            normalizedSegmentDate
          );
          
          WeatherDebugService.logNormalizedForecastOutput(segmentEndCity, normalizedData);
          
          if (normalizedData && WeatherDataValidator.validateNormalizedData(normalizedData)) {
            // Store in persistence service
            WeatherPersistenceService.storeWeatherData(segmentEndCity, normalizedSegmentDate, normalizedData);
            
            WeatherDataDebugger.debugWeatherFlow(
              `WeatherFetchingService.success [${segmentEndCity}] - LIVE FORECAST SUCCESS`,
              {
                isActualForecast: weatherData.isActualForecast,
                source: weatherData.source,
                daysFromToday,
                liveForecastSucceeded: true,
                normalizedDateUsed: true,
                standardizedForecastRangeEnforced: true,
                localDateCalculation: true,
                fallbackEnabled: true
              }
            );

            WeatherDebugService.logWeatherStateSet(segmentEndCity, weatherData);
            setWeather(weatherData);
            setLoading(false);
            console.log(`✅ PLAN: LIVE FORECAST SET for forecast range date ${segmentEndCity}:`, normalizedData);
            return; // Success - exit early
          } else {
            console.warn(`⚠️ Weather data normalization failed for ${segmentEndCity}, attempting fallback`);
            throw new Error('Weather data normalization failed');
          }
        } else {
          throw new Error('Live forecast returned null');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
        
        console.warn(`⚠️ PLAN: Live forecast failed for ${segmentEndCity}, using fallback weather:`, err);
        
        WeatherDataDebugger.debugWeatherFlow(
          `WeatherFetchingService.liveFailed [${segmentEndCity}] - USING FALLBACK`,
          { 
            error: errorMessage, 
            hasApiKey: this.weatherService.hasApiKey(), 
            daysFromToday, 
            standardizedForecastRangeEnforced: true,
            localDateCalculation: true,
            fallbackEnabled: true,
            fallbackReason: 'live_forecast_failed'
          }
        );
        
        // DON'T set error - instead use fallback weather
        console.log(`🔧 PLAN: FALLBACK WEATHER for failed live forecast ${segmentEndCity}`);
        
        try {
          const fallbackWeather = WeatherFallbackService.createFallbackForecast(
            segmentEndCity,
            normalizedSegmentDate,
            segmentDateString,
            daysFromToday
          );
          
          // Add debug footer for fallback due to location error
          const enhancedFallbackWeather = {
            ...fallbackWeather,
            source: 'historical_fallback' as const,
            dateMatchInfo: {
              ...fallbackWeather.dateMatchInfo,
              source: 'fallback_historical_due_to_location_error' as const
            }
          };

          console.log(`✅ PLAN: FALLBACK WEATHER SUCCESS for ${segmentEndCity}:`, {
            temperature: enhancedFallbackWeather.temperature,
            source: enhancedFallbackWeather.source,
            isActualForecast: enhancedFallbackWeather.isActualForecast,
            fallbackReason: 'live_forecast_failed'
          });

          WeatherDebugService.logWeatherStateSet(segmentEndCity, enhancedFallbackWeather);
          setWeather(enhancedFallbackWeather);
          setLoading(false);
          // DON'T set error - weather fallback worked
          return;
        } catch (fallbackErr) {
          console.error(`❌ PLAN: Both live forecast AND fallback failed for ${segmentEndCity}:`, fallbackErr);
          setError(`Weather service temporarily unavailable for ${segmentEndCity}`);
          setLoading(false);
          return;
        }
      }
    }

    // PLAN: For beyond forecast range OR no API key, use cached or fallback directly
    if (!isWithinForecastRange || !this.weatherService.hasApiKey()) {
      const cachedWeather = WeatherPersistenceService.getWeatherData(segmentEndCity, normalizedSegmentDate);
      if (cachedWeather) {
        console.log('💾 PLAN: Using cached weather data for beyond-forecast-range date', segmentEndCity, {
          reason: !isWithinForecastRange ? 'beyond_standardized_forecast_range' : 'no_api_key',
          daysFromToday,
          isWithinForecastRange,
          standardizedRange: true,
          localDateCalculation: true,
          fallbackEnabled: true
        });
        
        const forecastData: ForecastWeatherData = {
          temperature: cachedWeather.temperature,
          highTemp: cachedWeather.highTemp,
          lowTemp: cachedWeather.lowTemp,
          description: cachedWeather.description,
          icon: cachedWeather.icon,
          humidity: cachedWeather.humidity,
          windSpeed: cachedWeather.windSpeed,
          precipitationChance: cachedWeather.precipitationChance,
          cityName: cachedWeather.cityName,
          forecast: [],
          forecastDate: normalizedSegmentDate,
          isActualForecast: cachedWeather.isActualForecast,
          source: cachedWeather.source,
          dateMatchInfo: cachedWeather.dateMatchInfo
        };
        
        WeatherDebugService.logWeatherStateSet(segmentEndCity, forecastData);
        setWeather(forecastData);
        return;
      }

      // Use fallback weather directly for beyond forecast range
      console.log(`🔧 PLAN: DIRECT FALLBACK for beyond-forecast-range date ${segmentEndCity}`);
      
      try {
        const fallbackWeather = WeatherFallbackService.createFallbackForecast(
          segmentEndCity,
          normalizedSegmentDate,
          segmentDateString,
          daysFromToday
        );

        console.log(`✅ PLAN: DIRECT FALLBACK SUCCESS for ${segmentEndCity}:`, {
          temperature: fallbackWeather.temperature,
          source: fallbackWeather.source,
          isActualForecast: fallbackWeather.isActualForecast,
          reason: !isWithinForecastRange ? 'beyond_forecast_range' : 'no_api_key'
        });

        WeatherDebugService.logWeatherStateSet(segmentEndCity, fallbackWeather);
        setWeather(fallbackWeather);
        return;
      } catch (fallbackErr) {
        console.error(`❌ PLAN: Direct fallback failed for ${segmentEndCity}:`, fallbackErr);
        setError(`Weather service configuration error for ${segmentEndCity}`);
        return;
      }
    }

    // This should never be reached
    console.error(`❌ PLAN ERROR: Unexpected code path for ${segmentEndCity}`, {
      daysFromToday,
      isWithinForecastRange,
      hasApiKey: this.weatherService.hasApiKey(),
      standardizedRange: true,
      localDateCalculation: true,
      fallbackEnabled: true
    });

    setError(`Weather service configuration error for ${segmentEndCity}`);
  }
}
