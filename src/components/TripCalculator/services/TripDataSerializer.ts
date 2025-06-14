import { TripPlan } from './planning/TripPlanBuilder';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface SerializedTripData {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  weatherData: Record<string, ForecastWeatherData>; // key: cityName-day
  serializedAt: string;
}

export class TripDataSerializer {
  private static readonly MAX_URL_LENGTH = 300; // Very conservative limit
  private static readonly FALLBACK_URL_LENGTH = 200; // Ultra conservative fallback
  private static readonly MINIMAL_URL_LENGTH = 150; // Minimal fallback
  
  static serializeTripData(
    tripPlan: TripPlan,
    tripStartDate?: Date,
    weatherData?: Record<string, ForecastWeatherData>
  ): string {
    // Start with ultra-minimal data immediately for trips with many segments
    const segments = tripPlan.segments || [];
    const shouldStartMinimal = segments.length > 5 || Object.keys(weatherData || {}).length > 10;
    
    let workingWeatherData = weatherData || {};
    
    // If trip is large, start with minimal weather data immediately
    if (shouldStartMinimal) {
      console.log('🔧 Large trip detected, starting with minimal weather data immediately');
      workingWeatherData = this.createMinimalWeatherDataFromStart(weatherData || {});
    }

    const data: SerializedTripData = {
      tripPlan: this.createMinimalTripPlan(tripPlan),
      tripStartDate,
      weatherData: workingWeatherData,
      serializedAt: new Date().toISOString()
    };

    try {
      let jsonString = JSON.stringify(data);
      let compressed = this.compressData(jsonString);
      
      console.log('🔧 TripDataSerializer: Initial serialization', {
        originalSize: jsonString.length,
        compressedSize: compressed.length,
        segments: tripPlan.segments?.length,
        weatherEntries: Object.keys(workingWeatherData).length
      });

      // If still too large, remove all weather data
      if (compressed.length > this.MAX_URL_LENGTH) {
        console.warn('⚠️ Still too large, removing all weather data immediately');
        const noWeatherData = { ...data, weatherData: {} };
        compressed = this.compressData(JSON.stringify(noWeatherData));
        
        console.log('🔧 No weather data size:', compressed.length);
      }

      // If still too large, remove trip plan details
      if (compressed.length > this.FALLBACK_URL_LENGTH) {
        console.warn('⚠️ Still too large, using ultra-minimal trip plan');
        const ultraMinimalData = {
          ...data,
          tripPlan: this.createUltraMinimalTripPlan(tripPlan),
          weatherData: {}
        };
        compressed = this.compressData(JSON.stringify(ultraMinimalData));
        
        console.log('🔧 Ultra-minimal size:', compressed.length);
      }

      return compressed;
    } catch (error) {
      console.error('❌ Failed to serialize trip data:', error);
      throw new Error('Failed to serialize trip data');
    }
  }

  private static createMinimalTripPlan(tripPlan: TripPlan): TripPlan {
    return {
      startCity: tripPlan.startCity,
      endCity: tripPlan.endCity,
      totalDays: tripPlan.totalDays,
      totalDistance: Math.round(tripPlan.totalDistance || 0),
      title: tripPlan.title?.substring(0, 30) || '',
      segments: tripPlan.segments?.map(segment => ({
        day: segment.day,
        startCity: segment.startCity.substring(0, 15),
        endCity: segment.endCity.substring(0, 15),
        distance: Math.round(segment.distance),
        attractions: segment.attractions?.slice(0, 2).map(attr => ({
          name: attr.name.substring(0, 20),
          type: attr.type
        })) || []
      })) || []
    };
  }

  private static createUltraMinimalTripPlan(tripPlan: TripPlan): TripPlan {
    return {
      startCity: tripPlan.startCity?.substring(0, 10) || '',
      endCity: tripPlan.endCity?.substring(0, 10) || '',
      totalDays: tripPlan.totalDays,
      totalDistance: Math.round(tripPlan.totalDistance || 0),
      title: tripPlan.title?.substring(0, 15) || '',
      segments: tripPlan.segments?.map(segment => ({
        day: segment.day,
        startCity: segment.startCity.substring(0, 8),
        endCity: segment.endCity.substring(0, 8),
        distance: Math.round(segment.distance),
        attractions: [] // Remove all attractions for ultra-minimal
      })) || []
    };
  }

  private static createMinimalWeatherDataFromStart(weatherData: Record<string, ForecastWeatherData>): Record<string, ForecastWeatherData> {
    const minimal: Record<string, ForecastWeatherData> = {};
    
    // Only keep every 3rd weather entry with absolute minimal data
    const entries = Object.entries(weatherData);
    entries.forEach(([key, weather], index) => {
      if (index % 3 === 0) { // Keep every 3rd entry only
        minimal[key] = {
          temperature: Math.round(weather.temperature),
          description: weather.icon, // Use icon as description
          icon: weather.icon,
          precipitationChance: Math.round(weather.precipitationChance / 20) * 20, // Round to nearest 20%
          windSpeed: Math.round(weather.windSpeed),
          source: 'historical_fallback',
          isActualForecast: false, // Mark as non-actual to save space
          humidity: Math.round((weather.humidity || 50) / 20) * 20, // Round to nearest 20%
          cityName: weather.cityName.substring(0, 6), // Very short city name
          forecastDate: weather.forecastDate,
          forecast: [] // Always empty
        };
      }
    });
    
    return minimal;
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
        source: weather.source, // Keep original valid source
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
          source: weather.source, // Keep original valid source
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
          source: 'historical_fallback', // Use valid WeatherSourceType
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
        isWithinLimits: shareUrl.length < 1000,
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
