
import { DestinationCity } from '../types';

export interface DistanceMatrixResult {
  distance: number; // in miles
  duration: number; // in seconds
  status: string;
}

export interface DistanceMatrixResponse {
  results: DistanceMatrixResult[][];
  status: string;
}

export class GoogleDistanceMatrixService {
  private static apiKey: string | null = null;
  private static cache = new Map<string, DistanceMatrixResult>();

  static setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('google_maps_api_key', key);
  }

  static getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('google_maps_api_key');
    }
    return this.apiKey;
  }

  static isAvailable(): boolean {
    return !!this.getApiKey();
  }

  private static getCacheKey(origin: DestinationCity, destination: DestinationCity): string {
    return `${origin.latitude},${origin.longitude}-${destination.latitude},${destination.longitude}`;
  }

  static async calculateDistance(
    origin: DestinationCity, 
    destination: DestinationCity
  ): Promise<DistanceMatrixResult> {
    const cacheKey = this.getCacheKey(origin, destination);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log(`📊 Using cached distance for ${origin.name} → ${destination.name}`);
      return this.cache.get(cacheKey)!;
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Google Maps API key not set');
    }

    try {
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destinationStr = `${destination.latitude},${destination.longitude}`;
      
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?` +
        `origins=${encodeURIComponent(originStr)}&` +
        `destinations=${encodeURIComponent(destinationStr)}&` +
        `units=imperial&` +
        `mode=driving&` +
        `key=${apiKey}`;

      console.log(`🗺️ Fetching distance from Google: ${origin.name} → ${destination.name}`);
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Distance Matrix API error: ${data.status}`);
      }

      const element = data.rows[0].elements[0];
      
      if (element.status !== 'OK') {
        throw new Error(`Route calculation failed: ${element.status}`);
      }

      const result: DistanceMatrixResult = {
        distance: Math.round(element.distance.value * 0.000621371), // Convert meters to miles
        duration: element.duration.value, // Already in seconds
        status: 'OK'
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      console.log(`✅ Distance calculated: ${result.distance} miles, ${Math.round(result.duration / 60)} minutes`);
      
      return result;
    } catch (error) {
      console.error('Error calculating distance:', error);
      throw error;
    }
  }

  static async calculateRouteDistances(cities: DestinationCity[]): Promise<{
    totalDistance: number;
    totalDuration: number;
    segments: DistanceMatrixResult[];
  }> {
    if (cities.length < 2) {
      return { totalDistance: 0, totalDuration: 0, segments: [] };
    }

    const segments: DistanceMatrixResult[] = [];
    let totalDistance = 0;
    let totalDuration = 0;

    console.log(`🛣️ Calculating route distances for ${cities.length} cities`);

    for (let i = 0; i < cities.length - 1; i++) {
      const segment = await this.calculateDistance(cities[i], cities[i + 1]);
      segments.push(segment);
      totalDistance += segment.distance;
      totalDuration += segment.duration;
    }

    console.log(`🏁 Route calculation complete: ${totalDistance} miles, ${Math.round(totalDuration / 3600)}h ${Math.round((totalDuration % 3600) / 60)}m`);

    return {
      totalDistance,
      totalDuration,
      segments
    };
  }

  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes}m`;
    }
    
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  static clearCache() {
    this.cache.clear();
    console.log('🗑️ Distance Matrix cache cleared');
  }
}
