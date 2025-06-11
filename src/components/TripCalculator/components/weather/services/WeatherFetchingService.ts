
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
    
    WeatherDataDebugger.debugWeatherFlow(
      `WeatherFetchingService.fetchWeatherForSegment [${segmentEndCity}] - ENHANCED DEBUG`,
      {
        originalDate: segmentDate.toISOString(),
        normalizedDate: normalizedSegmentDate.toISOString(),
        segmentDateString,
        daysFromNow: Math.ceil((normalizedSegmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
        hasApiKey: this.weatherService.hasApiKey(),
        apiKeySource: this.weatherService.getApiKeySource?.() || 'unknown'
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

      WeatherDataDebugger.debugWeatherFlow(
        `WeatherFetchingService.coordinates [${segmentEndCity}]`,
        { coordinates, segmentDateString, apiKeyAvailable: true }
      );

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
        temperature: weatherData?.temperature,
        highTemp: weatherData?.highTemp,
        lowTemp: weatherData?.lowTemp,
        description: weatherData?.description
      });

      if (weatherData) {
        // Use improved validation
        const isValidData = WeatherDataValidator.validateWeatherData(weatherData, segmentEndCity, segmentDateString);
        
        if (isValidData) {
          WeatherDataDebugger.debugWeatherFlow(
            `WeatherFetchingService.success [${segmentEndCity}] - VALIDATION PASSED`,
            {
              isActualForecast: weatherData.isActualForecast,
              temperature: weatherData.temperature,
              highTemp: weatherData.highTemp,
              lowTemp: weatherData.lowTemp,
              description: weatherData.description,
              dateMatchInfo: weatherData.dateMatchInfo,
              validationPassed: true
            }
          );

          setWeather(weatherData);
          console.log(`✅ WEATHER SET for ${segmentEndCity}:`, weatherData);
        } else {
          console.warn(`⚠️ Weather data validation failed for ${segmentEndCity}, but trying to use anyway`);
          // Try to use data even if validation fails
          setWeather(weatherData);
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
