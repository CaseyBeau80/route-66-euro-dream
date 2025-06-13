
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
    
    // Check for cached data first
    const cachedWeather = WeatherPersistenceService.getWeatherData(segmentEndCity, normalizedSegmentDate);
    if (cachedWeather) {
      console.log('💾 WeatherFetchingService: Using cached weather data for', segmentEndCity);
      
      // FIXED: Properly reconstruct ForecastWeatherData with all required properties
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
        source: cachedWeather.source, // FIXED: Include source from cached data
        dateMatchInfo: cachedWeather.dateMatchInfo
      };
      
      console.log('🔧 PLAN: WeatherFetchingService CACHED DATA RECONSTRUCTION', {
        cityName: segmentEndCity,
        cachedSource: cachedWeather.source,
        cachedIsActualForecast: cachedWeather.isActualForecast,
        reconstructedSource: forecastData.source,
        reconstructedIsActualForecast: forecastData.isActualForecast,
        hasAllRequiredFields: !!(forecastData.source && forecastData.dateMatchInfo),
        timestamp: new Date().toISOString()
      });
      
      // 🎯 NEW: Use specific debug marker for cached weather state set
      WeatherDebugService.logWeatherStateSet(segmentEndCity, forecastData);
      
      setWeather(forecastData);
      return;
    }

    WeatherDataDebugger.debugWeatherFlow(
      `WeatherFetchingService.fetchWeatherForSegment [${segmentEndCity}] - ENHANCED WITH PERSISTENCE`,
      {
        originalDate: segmentDate.toISOString(),
        normalizedDate: normalizedSegmentDate.toISOString(),
        segmentDateString,
        daysFromNow: Math.ceil((normalizedSegmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
        hasApiKey: this.weatherService.hasApiKey(),
        hasCachedData: !!cachedWeather
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

      console.log(`🌤️ FETCHING WEATHER: ${segmentEndCity} for ${segmentDateString}`, {
        coordinates,
        normalizedDate: normalizedSegmentDate.toISOString(),
        serviceHasKey: this.weatherService.hasApiKey()
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

      console.log(`🌤️ WEATHER RESPONSE for ${segmentEndCity}:`, {
        hasData: !!weatherData,
        isActualForecast: weatherData?.isActualForecast,
        source: weatherData?.source,
        temperature: weatherData?.temperature,
        highTemp: weatherData?.highTemp,
        lowTemp: weatherData?.lowTemp
      });

      if (weatherData) {
        console.log('🔧 PLAN: WeatherFetchingService FRESH DATA PATH', {
          cityName: segmentEndCity,
          freshSource: weatherData.source,
          freshIsActualForecast: weatherData.isActualForecast,
          hasAllRequiredFields: !!(weatherData.source && weatherData.dateMatchInfo),
          timestamp: new Date().toISOString()
        });
        
        // 🎯 NEW: Use specific debug marker for forecast API response
        WeatherDebugService.logForecastApiRawResponse(segmentEndCity, weatherData);
        
        // Normalize and validate the data
        const normalizedData = WeatherDataNormalizer.normalizeWeatherData(
          weatherData, 
          segmentEndCity, 
          normalizedSegmentDate
        );
        
        // 🎯 NEW: Use specific debug marker for normalized forecast output
        WeatherDebugService.logNormalizedForecastOutput(segmentEndCity, normalizedData);
        
        if (normalizedData && WeatherDataValidator.validateNormalizedData(normalizedData)) {
          // Store in persistence service
          WeatherPersistenceService.storeWeatherData(segmentEndCity, normalizedSegmentDate, normalizedData);
          
          WeatherDataDebugger.debugWeatherFlow(
            `WeatherFetchingService.success [${segmentEndCity}] - NORMALIZED AND PERSISTED`,
            {
              isActualForecast: weatherData.isActualForecast,
              source: weatherData.source,
              normalizedTemperature: normalizedData.temperature,
              normalizedHighTemp: normalizedData.highTemp,
              normalizedLowTemp: normalizedData.lowTemp,
              persistenceSuccess: true
            }
          );

          // 🎯 NEW: Use specific debug marker for weather state set
          WeatherDebugService.logWeatherStateSet(segmentEndCity, weatherData);

          setWeather(weatherData);
          console.log(`✅ WEATHER SET AND PERSISTED for ${segmentEndCity}:`, normalizedData);
        } else {
          console.warn(`⚠️ Weather data normalization failed for ${segmentEndCity}`);
          
          // 🎯 NEW: Use specific debug marker even for failed normalization
          WeatherDebugService.logWeatherStateSet(segmentEndCity, weatherData);
          
          setWeather(weatherData); // Try to use anyway
        }
      } else {
        throw new Error('No weather data received from service');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      
      WeatherDataDebugger.debugWeatherFlow(
        `WeatherFetchingService.error [${segmentEndCity}]`,
        { error: errorMessage, hasApiKey: this.weatherService.hasApiKey() }
      );
      
      console.error(`❌ Weather fetch error for ${segmentEndCity} on ${segmentDateString}:`, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }
}
