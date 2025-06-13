
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
    
    // FIXED: Use consistent normalized date calculation for forecast range check
    const today = new Date();
    const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
    const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedSegmentDate);
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 6;
    
    console.log('🔧 FIXED: WeatherFetchingService - CONSISTENT FORECAST RANGE CHECK', {
      cityName: segmentEndCity,
      normalizedToday: normalizedToday.toISOString(),
      normalizedSegmentDate: normalizedSegmentDate.toISOString(),
      daysFromToday,
      isWithinForecastRange,
      shouldAttemptLiveForecast: isWithinForecastRange && this.weatherService.hasApiKey(),
      segmentDateString,
      dateCalculationMethod: 'DateNormalizationService'
    });

    // FIXED: Only use cached data immediately if we're beyond forecast range OR no API key
    if (!isWithinForecastRange || !this.weatherService.hasApiKey()) {
      const cachedWeather = WeatherPersistenceService.getWeatherData(segmentEndCity, normalizedSegmentDate);
      if (cachedWeather) {
        console.log('💾 FIXED: Using cached weather data for', segmentEndCity, {
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

    // FIXED: For forecast range dates (0-6 days), the cache check above returns null
    // so we proceed with live forecast attempt
    WeatherDataDebugger.debugWeatherFlow(
      `WeatherFetchingService.fetchWeatherForSegment [${segmentEndCity}] - LIVE FORECAST ATTEMPT`,
      {
        originalDate: segmentDate.toISOString(),
        normalizedDate: normalizedSegmentDate.toISOString(),
        segmentDateString,
        daysFromToday,
        isWithinForecastRange,
        hasApiKey: this.weatherService.hasApiKey(),
        willAttemptLiveForecast: true,
        cacheSkipped: isWithinForecastRange
      }
    );

    setLoading(true);
    setError(null);

    try {
      // Check API key first
      if (!this.weatherService.hasApiKey()) {
        throw new Error('No weather API key configured');
      }

      const coordinates = GeocodingService.getCoordinatesForCity(segmentEndCity);
      if (!coordinates) {
        throw new Error(`No coordinates found for ${segmentEndCity}`);
      }

      console.log(`🌤️ FIXED: ATTEMPTING LIVE FORECAST: ${segmentEndCity} for ${segmentDateString}`, {
        coordinates,
        daysFromToday,
        isWithinForecastRange,
        reason: 'within_forecast_range_with_normalized_dates',
        normalizedCalculation: true
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

      console.log(`🌤️ FIXED: LIVE FORECAST RESPONSE for ${segmentEndCity}:`, {
        hasData: !!weatherData,
        isActualForecast: weatherData?.isActualForecast,
        source: weatherData?.source,
        temperature: weatherData?.temperature,
        daysFromToday,
        shouldBeLiveForecast: isWithinForecastRange,
        normalizedDateUsed: true
      });

      if (weatherData) {
        console.log('🔧 FIXED: Live forecast SUCCESS for', segmentEndCity, {
          daysFromToday,
          source: weatherData.source,
          isActualForecast: weatherData.isActualForecast,
          temperature: weatherData.temperature,
          normalizedCalculation: true
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
            `WeatherFetchingService.success [${segmentEndCity}] - LIVE FORECAST PERSISTED`,
            {
              isActualForecast: weatherData.isActualForecast,
              source: weatherData.source,
              daysFromToday,
              liveForecastSuccess: true,
              normalizedDateUsed: true
            }
          );

          WeatherDebugService.logWeatherStateSet(segmentEndCity, weatherData);
          setWeather(weatherData);
          console.log(`✅ FIXED: LIVE FORECAST SET for ${segmentEndCity}:`, normalizedData);
        } else {
          console.warn(`⚠️ Weather data normalization failed for ${segmentEndCity}, using raw data`);
          WeatherDebugService.logWeatherStateSet(segmentEndCity, weatherData);
          setWeather(weatherData);
        }
      } else {
        console.log(`🔧 FIXED: Live forecast returned null for ${segmentEndCity}, trying cache fallback`);
        
        // FIXED: Only now try cached data as fallback
        const cachedWeather = WeatherPersistenceService.getWeatherData(segmentEndCity, normalizedSegmentDate);
        if (cachedWeather) {
          console.log('💾 FIXED: Using cached weather as fallback for failed live forecast:', segmentEndCity);
          
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
        } else {
          throw new Error('No weather data received from service and no cache available');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      
      console.error(`❌ FIXED: Live forecast failed for ${segmentEndCity}, trying cache:`, err);
      
      // FIXED: Try cached data as final fallback
      const cachedWeather = WeatherPersistenceService.getWeatherData(segmentEndCity, normalizedSegmentDate);
      if (cachedWeather) {
        console.log('💾 FIXED: Using cached weather as error fallback for:', segmentEndCity);
        
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
      } else {
        WeatherDataDebugger.debugWeatherFlow(
          `WeatherFetchingService.error [${segmentEndCity}]`,
          { error: errorMessage, hasApiKey: this.weatherService.hasApiKey(), daysFromToday, normalizedCalculation: true }
        );
        
        console.error(`❌ Weather fetch error for ${segmentEndCity} on ${segmentDateString}:`, err);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }
}
