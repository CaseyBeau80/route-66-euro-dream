import { TripPlan } from './planning/TripPlanBuilder';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface SerializedTripData {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  weatherData: Record<string, ForecastWeatherData>; // key: cityName-day
  serializedAt: string;
}

export class TripDataSerializer {
  private static readonly MAX_URL_LENGTH = 800; // Much more conservative limit
  private static readonly FALLBACK_URL_LENGTH = 600; // Very conservative fallback
  private static readonly MINIMAL_URL_LENGTH = 400; // Minimal fallback
  
  static serializeTripData(
    tripPlan: TripPlan,
    tripStartDate?: Date,
    weatherData?: Record<string, ForecastWeatherData>
  ): string {
    const data: SerializedTripData = {
      tripPlan,
      tripStartDate,
      weatherData: weatherData || {},
      serializedAt: new Date().toISOString()
    };

    try {
      let jsonString = JSON.stringify(data);
      let compressed = this.compressData(jsonString);
      
      console.log('🔧 TripDataSerializer: Initial serialization', {
        originalSize: jsonString.length,
        compressedSize: compressed.length,
        segments: tripPlan.segments?.length,
        weatherEntries: Object.keys(weatherData || {}).length
      });

      // Progressive data reduction strategy - start more aggressively
      if (compressed.length > this.MAX_URL_LENGTH) {
        console.warn('⚠️ URL too large, applying aggressive weather reduction immediately...');
        
        // Step 1: Start with minimal weather data right away
        const minimalWeatherData = this.createMinimalWeatherData(weatherData || {});
        const minimalData = { ...data, weatherData: minimalWeatherData };
        jsonString = JSON.stringify(minimalData);
        compressed = this.compressData(jsonString);
        
        console.log('🔧 After aggressive weather reduction:', {
          compressedSize: compressed.length,
          weatherEntries: Object.keys(minimalWeatherData).length
        });
      }

      if (compressed.length > this.FALLBACK_URL_LENGTH) {
        console.warn('⚠️ Still too large, removing most weather data...');
        
        // Step 2: Keep only every 3rd weather entry
        const ultraMinimalWeatherData = this.createUltraMinimalWeatherData(weatherData || {});
        const ultraMinimalData = { ...data, weatherData: ultraMinimalWeatherData };
        jsonString = JSON.stringify(ultraMinimalData);
        compressed = this.compressData(jsonString);
        
        console.log('🔧 After ultra-minimal weather reduction:', {
          compressedSize: compressed.length,
          weatherEntries: Object.keys(ultraMinimalWeatherData).length
        });
      }

      if (compressed.length > this.MINIMAL_URL_LENGTH) {
        console.warn('⚠️ Still too large, removing all weather data');
        const noWeatherData = { ...data, weatherData: {} };
        compressed = this.compressData(JSON.stringify(noWeatherData));
        
        console.log('🔧 Final fallback size (no weather):', compressed.length);
      }

      return compressed;
    } catch (error) {
      console.error('❌ Failed to serialize trip data:', error);
      throw new Error('Failed to serialize trip data');
    }
  }

  private static reduceWeatherData(weatherData: Record<string, ForecastWeatherData>): Record<string, ForecastWeatherData> {
    const reduced: Record<string, ForecastWeatherData> = {};
    
    Object.entries(weatherData).forEach(([key, weather]) => {
      // Keep only the most essential fields
      reduced[key] = {
        temperature: weather.temperature,
        description: weather.description.substring(0, 15), // Even shorter description
        icon: weather.icon,
        precipitationChance: weather.precipitationChance,
        windSpeed: weather.windSpeed,
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        humidity: weather.humidity,
        cityName: weather.cityName.substring(0, 15), // Shorter city name
        forecastDate: weather.forecastDate,
        highTemp: weather.highTemp,
        lowTemp: weather.lowTemp,
        forecast: [] // Remove forecast array
      };
    });
    
    return reduced;
  }

  private static createMinimalWeatherData(weatherData: Record<string, ForecastWeatherData>): Record<string, ForecastWeatherData> {
    const minimal: Record<string, ForecastWeatherData> = {};
    
    // Only keep every other day's weather data
    const entries = Object.entries(weatherData);
    entries.forEach(([key, weather], index) => {
      if (index % 2 === 0) { // Keep every other entry
        minimal[key] = {
          temperature: weather.temperature,
          description: weather.description.substring(0, 10), // Very short description
          icon: weather.icon,
          precipitationChance: weather.precipitationChance,
          windSpeed: Math.round(weather.windSpeed), // Round to save space
          source: weather.source.substring(0, 5), // Truncate source
          isActualForecast: weather.isActualForecast,
          humidity: Math.round(weather.humidity || 0), // Round humidity
          cityName: weather.cityName.substring(0, 10), // Short city name
          forecastDate: weather.forecastDate,
          forecast: []
        };
      }
    });
    
    return minimal;
  }

  private static createUltraMinimalWeatherData(weatherData: Record<string, ForecastWeatherData>): Record<string, ForecastWeatherData> {
    const ultraMinimal: Record<string, ForecastWeatherData> = {};
    
    // Only keep every 3rd day's weather data with bare minimum fields
    const entries = Object.entries(weatherData);
    entries.forEach(([key, weather], index) => {
      if (index % 3 === 0) { // Keep every 3rd entry
        ultraMinimal[key] = {
          temperature: Math.round(weather.temperature),
          description: weather.icon, // Use icon as description to save space
          icon: weather.icon,
          precipitationChance: Math.round(weather.precipitationChance / 10) * 10, // Round to nearest 10%
          windSpeed: Math.round(weather.windSpeed),
          source: 'api', // Generic source
          isActualForecast: weather.isActualForecast,
          humidity: Math.round((weather.humidity || 0) / 10) * 10, // Round to nearest 10%
          cityName: weather.cityName.substring(0, 8), // Very short city name
          forecastDate: weather.forecastDate,
          forecast: []
        };
      }
    });
    
    return ultraMinimal;
  }

  static deserializeTripData(serializedData: string): SerializedTripData {
    try {
      const decompressed = this.decompressData(serializedData);
      const data = JSON.parse(decompressed) as SerializedTripData;
      
      // Convert date strings back to Date objects
      if (data.tripStartDate) {
        data.tripStartDate = new Date(data.tripStartDate);
      }

      console.log('✅ TripDataSerializer: Deserialized trip data', {
        segments: data.tripPlan.segments?.length,
        weatherEntries: Object.keys(data.weatherData).length,
        serializedAt: data.serializedAt
      });

      return data;
    } catch (error) {
      console.error('❌ Failed to deserialize trip data:', error);
      throw new Error('Failed to deserialize trip data');
    }
  }

  private static compressData(data: string): string {
    try {
      // Use proper compression with URL-safe encoding
      const compressed = btoa(encodeURIComponent(data))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      return compressed;
    } catch (error) {
      console.error('❌ Failed to compress data:', error);
      throw new Error('Failed to compress data');
    }
  }

  private static decompressData(compressed: string): string {
    try {
      // Restore proper base64 format
      let base64 = compressed
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      // Add padding if needed
      while (base64.length % 4) {
        base64 += '=';
      }
      
      return decodeURIComponent(atob(base64));
    } catch (error) {
      console.error('❌ Failed to decompress data:', error);
      throw new Error('Failed to decompress data');
    }
  }

  static generateSerializedShareUrl(
    tripPlan: TripPlan,
    tripStartDate?: Date,
    weatherData?: Record<string, ForecastWeatherData>
  ): string {
    try {
      const serializedData = this.serializeTripData(tripPlan, tripStartDate, weatherData);
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/serialized-trip?data=${encodeURIComponent(serializedData)}`;
      
      console.log('🔗 Generated share URL:', {
        urlLength: shareUrl.length,
        isWithinLimits: shareUrl.length < 2000,
        weatherEntries: Object.keys(weatherData || {}).length
      });
      
      return shareUrl;
    } catch (error) {
      console.error('❌ Failed to generate share URL:', error);
      throw new Error('Failed to generate share URL');
    }
  }

  static createWeatherDataKey(cityName: string, day: number): string {
    return `${cityName}-day${day}`;
  }
}
