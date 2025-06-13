
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
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
    
    // CRITICAL FIX: Use consistent normalized date calculation for forecast range check
    const today = new Date();
    const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
    const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedSegmentDate);
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 5;
    
    console.log('🔧 CRITICAL FIX: WeatherFetchingService - STRICT FORECAST RANGE ENFORCEMENT', {
      cityName: segmentEndCity,
      normalizedToday: normalizedToday.toISOString(),
      normalizedSegmentDate: normalizedSegmentDate.toISOString(),
      daysFromToday,
      isWithinForecastRange,
      shouldAttemptLiveForecast: isWithinForecastRange && this.weatherService.hasApiKey(),
      segmentDateString,
      dateCalculationMethod: 'DateNormalizationService',
      forecastLogic: 'Days 0-5 = FORCE live forecast, Day 6+ = historical'
    });

    // CRITICAL FIX: For forecast range dates, skip cache completely and go straight to live forecast
    if (isWithinForecastRange && this.weatherService.hasApiKey()) {
      console.log('🔧 CRITICAL FIX: FORCING live forecast attempt for forecast range date', {
        cityName: segmentEndCity,
        daysFromToday,
        reason: 'within_0_to_5_day_range_MUST_attempt_live',
        skippingCacheCompletely: true
      });

      setLoading(true);
      setError(null);

      try {
        const coordinates = GeocodingService.getCoordinatesForCity(segmentEndCity);
        if (!coordinates) {
          throw new Error(`No coordinates found for ${segmentEndCity}`);
        }

        console.log(`🌤️ CRITICAL FIX: LIVE FORECAST ATTEMPT: ${segmentEndCity} for ${segmentDateString}`, {
          coordinates,
          daysFromToday,
          isWithinForecastRange,
          reason: 'forecast_range_date_MUST_use_live',
          normalizedDateUsed: true
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

        console.log(`🌤️ CRITICAL FIX: LIVE FORECAST RESPONSE for ${segmentEndCity}:`, {
          hasData: !!weatherData,
          isActualForecast: weatherData?.isActualForecast,
          source: weatherData?.source,
          temperature: weatherData?.temperature,
          daysFromToday,
          shouldBeLiveForecast: isWithinForecastRange,
          normalizedDateUsed: true,
          forecastRangeEnforced: true
        });

        if (weatherData) {
          console.log('🔧 CRITICAL FIX: Live forecast SUCCESS for forecast range date', segmentEndCity, {
            daysFromToday,
            source: weatherData.source,
            isActualForecast: weatherData.isActualForecast,
            temperature: weatherData.temperature,
            normalizedCalculation: true,
            strictForecastRangeEnforced: true
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
              `WeatherFetchingService.success [${segmentEndCity}] - LIVE FORECAST ENFORCED`,
              {
                isActualForecast: weatherData.isActualForecast,
                source: weatherData.source,
                daysFromToday,
                liveForecastEnforced: true,
                normalizedDateUsed: true,
                strictForecastRangeEnforced: true
              }
            );

            WeatherDebugService.logWeatherStateSet(segmentEndCity, weatherData);
            setWeather(weatherData);
            console.log(`✅ CRITICAL FIX: LIVE FORECAST SET for forecast range date ${segmentEndCity}:`, normalizedData);
          } else {
            console.warn(`⚠️ Weather data normalization failed for ${segmentEndCity}, using raw data`);
            WeatherDebugService.logWeatherStateSet(segmentEndCity, weatherData);
            setWeather(weatherData);
          }
        } else {
          throw new Error('Live forecast returned null for forecast range date');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
        
        console.error(`❌ CRITICAL FIX: Live forecast failed for forecast range date ${segmentEndCity}:`, err);
        
        WeatherDataDebugger.debugWeatherFlow(
          `WeatherFetchingService.error [${segmentEndCity}] - FORECAST RANGE LIVE ATTEMPT FAILED`,
          { error: errorMessage, hasApiKey: this.weatherService.hasApiKey(), daysFromToday, forecastRangeEnforced: true }
        );
        
        console.error(`❌ Weather fetch error for forecast range date ${segmentEndCity} on ${segmentDateString}:`, err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
      return;
    }

    // CRITICAL FIX: Only check cache for dates beyond forecast range OR when no API key
    if (!isWithinForecastRange || !this.weatherService.hasApiKey()) {
      const cachedWeather = WeatherPersistenceService.getWeatherData(segmentEndCity, normalizedSegmentDate);
      if (cachedWeather) {
        console.log('💾 CRITICAL FIX: Using cached weather data for beyond-forecast-range date', segmentEndCity, {
          reason: !isWithinForecastRange ? 'beyond_forecast_range' : 'no_api_key',
          daysFromToday,
          isWithinForecastRange
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
    }

    // This should never be reached for forecast range dates with API key
    console.error(`❌ CRITICAL ERROR: Reached fallback path for forecast range date ${segmentEndCity}`, {
      daysFromToday,
      isWithinForecastRange,
      hasApiKey: this.weatherService.hasApiKey(),
      shouldNotReachHere: isWithinForecastRange && this.weatherService.hasApiKey()
    });

    setError(`Weather service configuration error for ${segmentEndCity}`);
  }
}
