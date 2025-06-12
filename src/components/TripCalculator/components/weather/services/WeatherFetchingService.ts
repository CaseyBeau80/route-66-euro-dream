
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { GeocodingService } from '../../../services/GeocodingService';
import { DateNormalizationService } from '../DateNormalizationService';
import { WeatherDataDebugger } from '../WeatherDataDebugger';
import { WeatherDataValidator } from '../utils/WeatherDataValidator';

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
    
    console.log('🌤️ ENHANCED WeatherFetchingService for', segmentEndCity, ':', {
      originalDate: segmentDate.toISOString(),
      normalizedDate: normalizedSegmentDate.toISOString(),
      segmentDateString,
      daysFromNow: Math.ceil((normalizedSegmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
      hasApiKey: this.weatherService.hasApiKey(),
      apiKeySource: this.weatherService.getApiKeySource?.() || 'unknown'
    });

    setLoading(true);
    setError(null);

    try {
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

      console.log(`🌤️ ENHANCED WEATHER RESPONSE for ${segmentEndCity}:`, {
        hasData: !!weatherData,
        dataType: typeof weatherData
      });

      if (weatherData) {
        // Log the specific fields the user requested
        WeatherDataDebugger.debugWeatherFieldsForUser(segmentEndCity, weatherData, 'FETCH_RESPONSE');

        // Use enhanced permissive validation
        const isValidData = WeatherDataValidator.validateWeatherData(weatherData, segmentEndCity, segmentDateString);
        
        console.log('🔧 ENHANCED VALIDATION RESULT for', segmentEndCity, ':', {
          isValidData,
          willSetWeather: true, // Force set weather regardless of validation
          validationMode: 'PERMISSIVE_FORCE_RENDER'
        });

        // FORCE SET: Always set weather data if we receive it
        setWeather(weatherData);
        console.log(`✅ WEATHER FORCE SET for ${segmentEndCity}:`, {
          hasWeather: true,
          'weather.isActualForecast': weatherData.isActualForecast,
          'weather.temperature': weatherData.temperature,
          'weather.description': weatherData.description
        });
      } else {
        throw new Error('No weather data received from service');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      
      console.error(`❌ ENHANCED Weather fetch error for ${segmentEndCity} on ${segmentDateString}:`, {
        error: errorMessage,
        hasApiKey: this.weatherService.hasApiKey(),
        coordinates: GeocodingService.getCoordinatesForCity(segmentEndCity)
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }
}
