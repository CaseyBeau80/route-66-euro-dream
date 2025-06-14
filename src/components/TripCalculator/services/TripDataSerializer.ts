import { TripPlan } from './planning/TripPlanBuilder';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface SerializedTripData {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  weatherData: Record<string, ForecastWeatherData>; // key: cityName-day
  serializedAt: string;
}

export class TripDataSerializer {
  private static readonly MAX_URL_LENGTH = 1500; // More conservative limit
  private static readonly FALLBACK_URL_LENGTH = 1000; // Very conservative fallback
  private static readonly MINIMAL_URL_LENGTH = 800; // Minimal fallback
  
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

      // Progressive data reduction strategy
      if (compressed.length > this.MAX_URL_LENGTH) {
        console.warn('⚠️ URL too large, reducing weather data (step 1)...');
        
        // Step 1: Reduce weather data fields
        const reducedWeatherData = this.reduceWeatherData(weatherData || {});
        const reducedData = { ...data, weatherData: reducedWeatherData };
        jsonString = JSON.stringify(reducedData);
        compressed = this.compressData(jsonString);
        
        console.log('🔧 After weather reduction step 1:', {
          compressedSize: compressed.length,
          weatherEntries: Object.keys(reducedWeatherData).length
        });
      }

      if (compressed.length > this.FALLBACK_URL_LENGTH) {
        console.warn('⚠️ Still too large, applying aggressive weather reduction (step 2)...');
        
        // Step 2: Keep only essential weather fields
        const minimalWeatherData = this.createMinimalWeatherData(weatherData || {});
        const minimalData = { ...data, weatherData: minimalWeatherData };
        jsonString = JSON.stringify(minimalData);
        compressed = this.compressData(jsonString);
        
        console.log('🔧 After weather reduction step 2:', {
          compressedSize: compressed.length,
          weatherEntries: Object.keys(minimalWeatherData).length
        });
      }

      if (compressed.length > this.MINIMAL_URL_LENGTH) {
        console.warn('⚠️ Still too large, removing all weather data (step 3)');
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
      // Keep essential fields, remove optional/large ones
      reduced[key] = {
        temperature: weather.temperature,
        description: weather.description,
        icon: weather.icon,
        precipitationChance: weather.precipitationChance,
        windSpeed: weather.windSpeed,
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        humidity: weather.humidity,
        cityName: weather.cityName,
        forecastDate: weather.forecastDate,
        // Keep only high/low temps, remove forecast array
        highTemp: weather.highTemp,
        lowTemp: weather.lowTemp,
        forecast: []
      };
    });
    
    return reduced;
  }

  private static createMinimalWeatherData(weatherData: Record<string, ForecastWeatherData>): Record<string, ForecastWeatherData> {
    const minimal: Record<string, ForecastWeatherData> = {};
    
    // Only keep every other day's weather data to reduce size
    const entries = Object.entries(weatherData);
    entries.forEach(([key, weather], index) => {
      if (index % 2 === 0) { // Keep every other entry
        minimal[key] = {
          temperature: weather.temperature,
          description: weather.description.substring(0, 20), // Truncate description
          icon: weather.icon,
          precipitationChance: weather.precipitationChance,
          windSpeed: weather.windSpeed,
          source: weather.source,
          isActualForecast: weather.isActualForecast,
          humidity: weather.humidity,
          cityName: weather.cityName,
          forecastDate: weather.forecastDate,
          forecast: []
        };
      }
    });
    
    return minimal;
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
        isWithinLimits: shareUrl.length < 3000,
        weatherEntries: Object.keys(weatherData || {}).length
      });
      
      if (shareUrl.length > 3000) {
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
