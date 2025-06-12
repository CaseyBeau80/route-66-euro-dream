
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
    console.log(`🚀 ENHANCED DEBUG: Starting weather fetch for ${segmentEndCity}`);
    console.log(`📅 ENHANCED DEBUG: Segment date:`, segmentDate.toISOString());
    
    const dateString = DateNormalizationService.toDateString(segmentDate);
    const daysFromNow = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    console.log(`🔍 ENHANCED DEBUG: Date calculations:`, {
      dateString,
      daysFromNow,
      withinForecastRange: daysFromNow >= 0 && daysFromNow <= 5,
      segmentEndCity
    });

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
      console.log(`🔧 ENHANCED DEBUG: Getting weather service instance...`);
      const weatherService = EnhancedWeatherService.getInstance();
      
      if (!weatherService) {
        console.error(`❌ ENHANCED DEBUG: Weather service is null/undefined!`);
        setError('Weather service not available');
        setLoading(false);
        return;
      }

      console.log(`🔑 ENHANCED DEBUG: Checking API key...`);
      if (!weatherService.hasApiKey()) {
        console.warn(`❌ ENHANCED DEBUG: No API key for weather service`);
        setError('Weather API key not configured');
        setLoading(false);
        return;
      }

      console.log(`✅ ENHANCED DEBUG: API key confirmed, getting coordinates...`);
      
      // Get coordinates for the city
      const coordinates = GeocodingService.getCoordinatesForCity(segmentEndCity);
      if (!coordinates) {
        console.warn(`❌ ENHANCED DEBUG: No coordinates found for ${segmentEndCity}`);
        setError(`Location not found: ${segmentEndCity}`);
        setLoading(false);
        return;
      }

      console.log(`📍 ENHANCED DEBUG: Coordinates found:`, coordinates);

      // Set a timeout for the weather fetch
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          console.error(`⏰ ENHANCED DEBUG: Weather fetch timeout for ${segmentEndCity}`);
          reject(new Error('Weather fetch timeout'));
        }, 10000);
      });

      console.log(`🌤️ ENHANCED DEBUG: Making weather API call...`);
      const weatherPromise = weatherService.getWeatherForDate(
        coordinates.lat,
        coordinates.lng,
        segmentEndCity,
        segmentDate
      );

      const weatherData = await Promise.race([weatherPromise, timeoutPromise]);

      console.log(`📊 ENHANCED DEBUG: Raw weather response:`, {
        hasData: !!weatherData,
        weatherData: weatherData,
        dataType: typeof weatherData,
        keys: weatherData ? Object.keys(weatherData) : [],
        segmentEndCity
      });

      if (weatherData) {
        console.log(`✅ ENHANCED DEBUG: Weather data received, setting state...`);
        console.log(`🌡️ ENHANCED DEBUG: Temperature data:`, {
          temperature: weatherData.temperature,
          highTemp: weatherData.highTemp,
          lowTemp: weatherData.lowTemp,
          description: weatherData.description,
          isActualForecast: weatherData.isActualForecast,
          cityName: weatherData.cityName
        });
        
        setWeather(weatherData);
        setError(null);
        
        console.log(`🎉 ENHANCED DEBUG: Weather state updated successfully for ${segmentEndCity}`);
      } else {
        console.warn(`⚠️ ENHANCED DEBUG: No weather data returned for ${segmentEndCity}`);
        setError('No weather data available');
      }
    } catch (error) {
      console.error(`❌ ENHANCED DEBUG: Weather fetch error for ${segmentEndCity}:`, {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : 'No stack'
      });
      
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
      console.log(`🏁 ENHANCED DEBUG: Weather fetch completed for ${segmentEndCity}`);
      setLoading(false);
    }
  }
}
