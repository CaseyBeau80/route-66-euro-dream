
import { TripPlan } from './planning/TripPlanBuilder';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface SerializedTripData {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  weatherData: Record<string, ForecastWeatherData>; // key: cityName-day
  serializedAt: string;
}

export class TripDataSerializer {
  private static readonly MAX_URL_LENGTH = 8192; // Safe URL length limit
  
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
      const jsonString = JSON.stringify(data);
      const compressed = this.compressData(jsonString);
      
      console.log('🔧 TripDataSerializer: Serialized trip data', {
        originalSize: jsonString.length,
        compressedSize: compressed.length,
        segments: tripPlan.segments?.length,
        weatherEntries: Object.keys(weatherData || {}).length
      });

      if (compressed.length > this.MAX_URL_LENGTH) {
        console.warn('⚠️ Serialized data exceeds safe URL length, truncating weather data');
        // Remove weather data if too large
        const fallbackData = { ...data, weatherData: {} };
        return this.compressData(JSON.stringify(fallbackData));
      }

      return compressed;
    } catch (error) {
      console.error('❌ Failed to serialize trip data:', error);
      throw new Error('Failed to serialize trip data');
    }
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
    // Simple base64 encoding - in a real app you might use actual compression
    try {
      return btoa(encodeURIComponent(data));
    } catch (error) {
      console.error('❌ Failed to compress data:', error);
      throw new Error('Failed to compress data');
    }
  }

  private static decompressData(compressed: string): string {
    try {
      return decodeURIComponent(atob(compressed));
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
    const serializedData = this.serializeTripData(tripPlan, tripStartDate, weatherData);
    const baseUrl = window.location.origin;
    
    return `${baseUrl}/serialized-trip?data=${encodeURIComponent(serializedData)}`;
  }

  static createWeatherDataKey(cityName: string, day: number): string {
    return `${cityName}-day${day}`;
  }
}
