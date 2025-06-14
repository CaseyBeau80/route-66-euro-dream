import { TripPlan } from './planning/TripPlanBuilder';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface SerializedTripData {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  weatherData: Record<string, ForecastWeatherData>; // key: cityName-day
  serializedAt: string;
}

export class TripDataSerializer {
  private static readonly MAX_URL_LENGTH = 2000; // Much more conservative limit
  private static readonly FALLBACK_URL_LENGTH = 1500; // Even more conservative fallback
  
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

      // If still too large, progressively reduce data
      if (compressed.length > this.MAX_URL_LENGTH) {
        console.warn('⚠️ URL too large, reducing weather data...');
        
        // Try with reduced weather data (keep only essential fields)
        const reducedWeatherData = this.reduceWeatherData(weatherData || {});
        const reducedData = { ...data, weatherData: reducedWeatherData };
        jsonString = JSON.stringify(reducedData);
        compressed = this.compressData(jsonString);
        
        console.log('🔧 After weather reduction:', {
          compressedSize: compressed.length,
          weatherEntries: Object.keys(reducedWeatherData).length
        });
      }

      // If still too large, remove weather data entirely
      if (compressed.length > this.FALLBACK_URL_LENGTH) {
        console.warn('⚠️ Still too large, removing all weather data');
        const fallbackData = { ...data, weatherData: {} };
        compressed = this.compressData(JSON.stringify(fallbackData));
        
        console.log('🔧 Final fallback size:', compressed.length);
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
      // Keep all required fields but remove optional/large ones to save space
      reduced[key] = {
        temperature: weather.temperature,
        description: weather.description,
        icon: weather.icon,
        precipitationChance: weather.precipitationChance,
        windSpeed: weather.windSpeed,
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        // Include all required fields
        humidity: weather.humidity,
        cityName: weather.cityName,
        forecastDate: weather.forecastDate,
        // Keep optional fields that are small
        highTemp: weather.highTemp,
        lowTemp: weather.lowTemp,
        // Set forecast to empty array to save space while satisfying TypeScript
        forecast: []
      };
    });
    
    return reduced;
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
        isWithinLimits: shareUrl.length < 4000,
        weatherEntries: Object.keys(weatherData || {}).length
      });
      
      if (shareUrl.length > 4000) {
        console.warn('⚠️ Generated URL is very long and may cause issues:', shareUrl.length);
      }
      
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
