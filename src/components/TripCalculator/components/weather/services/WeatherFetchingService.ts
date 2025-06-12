
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { GeocodingService } from '@/components/TripCalculator/services/GeocodingService';
import { DateNormalizationService } from '../DateNormalizationService';
import { WeatherDataDebugger } from '../WeatherDataDebugger';

export class WeatherFetchingService {
  static async fetchWeatherForSegment(
    segmentEndCity: string,
    segmentDate: Date,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    setWeather: (weather: ForecastWeatherData | null) => void
  ): Promise<void> {
    const dateString = DateNormalizationService.toDateString(segmentDate);
    const daysFromNow = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    WeatherDataDebugger.debugWeatherFlow(
      `WeatherFetchingService.fetchWeatherForSegment [${segmentEndCity}]`,
      {
        segmentDate: segmentDate.toISOString(),
        dateString,
        daysFromNow,
        withinForecastRange: daysFromNow >= 0 && daysFromNow <= 5
      }
    );

    setLoading(true);
    setError(null);

    try {
      const weatherService = EnhancedWeatherService.getInstance();
      
      if (!weatherService.hasApiKey()) {
        console.warn(`❌ No API key for weather service`);
        setError('Weather API key not configured');
        setLoading(false);
        return;
      }

      // Get coordinates for the city
      const coordinates = GeocodingService.getCoordinatesForCity(segmentEndCity);
      if (!coordinates) {
        console.warn(`❌ No coordinates found for ${segmentEndCity}`);
        setError(`Location not found: ${segmentEndCity}`);
        setLoading(false);
        return;
      }

      // Set a timeout for the weather fetch
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Weather fetch timeout')), 10000);
      });

      const weatherPromise = weatherService.getWeatherForDate(
        coordinates.lat,
        coordinates.lng,
        segmentEndCity,
        segmentDate
      );

      const weatherData = await Promise.race([weatherPromise, timeoutPromise]);

      if (weatherData) {
        console.log(`✅ Weather data fetched successfully for ${segmentEndCity}:`, {
          hasData: true,
          isActualForecast: weatherData.isActualForecast,
          dateString,
          temperature: weatherData.temperature,
          description: weatherData.description
        });
        
        setWeather(weatherData);
        setError(null);
      } else {
        console.warn(`⚠️ No weather data returned for ${segmentEndCity}`);
        setError('No weather data available');
      }
    } catch (error) {
      console.error(`❌ Weather fetch failed for ${segmentEndCity}:`, error);
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          setError('Weather service timed out - please try again');
        } else if (error.message.includes('API key')) {
          setError('Weather service configuration error');
        } else {
          setError('Unable to fetch weather data');
        }
      } else {
        setError('Weather service error');
      }
    } finally {
      setLoading(false);
    }
  }
}
