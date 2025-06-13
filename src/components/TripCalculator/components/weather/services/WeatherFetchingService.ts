
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
    
    // PLAN: Use consistent normalized LOCAL date calculation for forecast range check
    const today = new Date();
    const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
    const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedSegmentDate);
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7; // PLAN: Standardized to 0-7
    
    console.log('🔧 PLAN: WeatherFetchingService - STANDARDIZED FORECAST RANGE 0-7 WITH LOCAL DATES', {
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
      forecastLogic: 'Days 0-7 = FORCE live forecast, Day 8+ = historical',
      standardizedRange: true,
      localDateCalculation: true
    });

    // PLAN: For forecast range dates (0-7), skip cache completely and go straight to live forecast
    if (isWithinForecastRange && this.weatherService.hasApiKey()) {
      console.log('🔧 PLAN: FORCING live forecast attempt for STANDARDIZED forecast range date', {
        cityName: segmentEndCity,
        daysFromToday,
        reason: 'within_0_to_7_day_range_MUST_attempt_live',
        skippingCacheCompletely: true,
        standardizedForecastRange: true,
        localDateCalculation: true
      });

      setLoading(true);
      setError(null);

      try {
        const coordinates = GeocodingService.getCoordinatesForCity(segmentEndCity);
        if (!coordinates) {
          throw new Error(`No coordinates found for ${segmentEndCity}`);
        }

        console.log(`🌤️ PLAN: LIVE FORECAST ATTEMPT: ${segmentEndCity} for ${segmentDateString}`, {
          coordinates,
          daysFromToday,
          isWithinForecastRange,
          reason: 'standardized_forecast_range_date_MUST_use_live',
          normalizedDateUsed: true,
          localDateCalculation: true,
          standardizedRange: true
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
          localDateCalculation: true
        });

        if (weatherData) {
          console.log('🔧 PLAN: Live forecast SUCCESS for standardized forecast range date', segmentEndCity, {
            daysFromToday,
            source: weatherData.source,
            isActualForecast: weatherData.isActualForecast,
            temperature: weatherData.temperature,
            normalizedCalculation: true,
            standardizedForecastRangeEnforced: true,
            localDateCalculation: true
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
              `WeatherFetchingService.success [${segmentEndCity}] - LIVE FORECAST ENFORCED STANDARDIZED RANGE`,
              {
                isActualForecast: weatherData.isActualForecast,
                source: weatherData.source,
                daysFromToday,
                liveForecastEnforced: true,
                normalizedDateUsed: true,
                standardizedForecastRangeEnforced: true,
                localDateCalculation: true
              }
            );

            WeatherDebugService.logWeatherStateSet(segmentEndCity, weatherData);
            setWeather(weatherData);
            console.log(`✅ PLAN: LIVE FORECAST SET for standardized forecast range date ${segmentEndCity}:`, normalizedData);
          } else {
            console.warn(`⚠️ Weather data normalization failed for ${segmentEndCity}, using raw data`);
            WeatherDebugService.logWeatherStateSet(segmentEndCity, weatherData);
            setWeather(weatherData);
          }
        } else {
          throw new Error('Live forecast returned null for standardized forecast range date');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
        
        console.error(`❌ PLAN: Live forecast failed for standardized forecast range date ${segmentEndCity}:`, err);
        
        WeatherDataDebugger.debugWeatherFlow(
          `WeatherFetchingService.error [${segmentEndCity}] - STANDARDIZED FORECAST RANGE LIVE ATTEMPT FAILED`,
          { 
            error: errorMessage, 
            hasApiKey: this.weatherService.hasApiKey(), 
            daysFromToday, 
            standardizedForecastRangeEnforced: true,
            localDateCalculation: true 
          }
        );
        
        console.error(`❌ Weather fetch error for standardized forecast range date ${segmentEndCity} on ${segmentDateString}:`, err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
      return;
    }

    // PLAN: Only check cache for dates beyond standardized forecast range OR when no API key
    if (!isWithinForecastRange || !this.weatherService.hasApiKey()) {
      const cachedWeather = WeatherPersistenceService.getWeatherData(segmentEndCity, normalizedSegmentDate);
      if (cachedWeather) {
        console.log('💾 PLAN: Using cached weather data for beyond-standardized-forecast-range date', segmentEndCity, {
          reason: !isWithinForecastRange ? 'beyond_standardized_forecast_range' : 'no_api_key',
          daysFromToday,
          isWithinForecastRange,
          standardizedRange: true,
          localDateCalculation: true
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

    // This should never be reached for standardized forecast range dates with API key
    console.error(`❌ PLAN ERROR: Reached fallback path for standardized forecast range date ${segmentEndCity}`, {
      daysFromToday,
      isWithinForecastRange,
      hasApiKey: this.weatherService.hasApiKey(),
      shouldNotReachHere: isWithinForecastRange && this.weatherService.hasApiKey(),
      standardizedRange: true,
      localDateCalculation: true
    });

    setError(`Weather service configuration error for ${segmentEndCity}`);
  }
}
