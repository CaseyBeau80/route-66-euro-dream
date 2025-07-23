
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
    // Priority: Environment Variable > localStorage > hardcoded fallback
    
    // 1. Check environment variable first
    const envKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';
    if (envKey && envKey.trim() !== '' && envKey !== 'your_google_maps_api_key_here') {
      console.log('🔑 GoogleDistanceMatrix using API key from environment variable');
      return envKey.trim();
    }
    
    // 2. Check localStorage as fallback
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('google_maps_api_key');
    }
    if (this.apiKey && this.apiKey.trim() !== '') {
      console.log('🔑 GoogleDistanceMatrix using API key from localStorage');
      return this.apiKey.trim();
    }
    
    // 3. Use hardcoded key as last resort
    const hardcodedApiKey = 'AIzaSyCj2hJjT8wA0G3gBmUaK7qmhKX8Uv3mDH8';
    if (hardcodedApiKey && hardcodedApiKey.trim() !== '') {
      console.log('🔑 GoogleDistanceMatrix using hardcoded API key fallback');
      return hardcodedApiKey.trim();
    }
    
    console.warn('❌ GoogleDistanceMatrix: No API key available');
    return null;
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
      // Use city name + state for more accurate results, fallback to coordinates
      const originStr = `${origin.name}, ${origin.state}`;
      const destinationStr = `${destination.name}, ${destination.state}`;
      
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?` +
        `origins=${encodeURIComponent(originStr)}&` +
        `destinations=${encodeURIComponent(destinationStr)}&` +
        `units=imperial&` +
        `mode=driving&` +
        `avoid=highways&` + // Prefer scenic routes when possible
        `key=${apiKey}`;

      console.log(`🗺️ Fetching Route 66 distance: ${origin.name}, ${origin.state} → ${destination.name}, ${destination.state}`);
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        console.warn(`⚠️ Distance Matrix API status: ${data.status}, falling back to coordinates`);
        
        // Fallback to coordinates if city names fail
        const coordOriginStr = `${origin.latitude},${origin.longitude}`;
        const coordDestinationStr = `${destination.latitude},${destination.longitude}`;
        
        const coordUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?` +
          `origins=${encodeURIComponent(coordOriginStr)}&` +
          `destinations=${encodeURIComponent(coordDestinationStr)}&` +
          `units=imperial&` +
          `mode=driving&` +
          `avoid=highways&` +
          `key=${apiKey}`;
        
        const coordResponse = await fetch(coordUrl);
        const coordData = await coordResponse.json();
        
        if (coordData.status !== 'OK') {
          throw new Error(`Distance Matrix API error: ${coordData.status}`);
        }
        
        return this.processDistanceMatrixResponse(coordData, origin, destination);
      }

      return this.processDistanceMatrixResponse(data, origin, destination);
    } catch (error) {
      console.error(`❌ Error calculating distance ${origin.name} → ${destination.name}:`, error);
      throw error;
    }
  }

  private static processDistanceMatrixResponse(
    data: any, 
    origin: DestinationCity, 
    destination: DestinationCity
  ): DistanceMatrixResult {
    const element = data.rows[0].elements[0];
    
    if (element.status !== 'OK') {
      throw new Error(`Route calculation failed: ${element.status} for ${origin.name} → ${destination.name}`);
    }

    const result: DistanceMatrixResult = {
      distance: Math.round(element.distance.value * 0.000621371), // Convert meters to miles
      duration: element.duration.value, // Already in seconds
      status: 'OK'
    };

    // Cache the result
    const cacheKey = this.getCacheKey(origin, destination);
    this.cache.set(cacheKey, result);
    
    console.log(`✅ Route 66 segment: ${origin.name} → ${destination.name} = ${result.distance} miles, ${this.formatDuration(result.duration)}`);
    
    return result;
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

    console.log(`🛣️ Calculating Route 66 distances for ${cities.length} consecutive city pairs:`);
    cities.forEach((city, i) => {
      if (i < cities.length - 1) {
        console.log(`   ${i + 1}. ${city.name}, ${city.state} → ${cities[i + 1].name}, ${cities[i + 1].state}`);
      }
    });

    // Calculate distance for each consecutive city pair
    for (let i = 0; i < cities.length - 1; i++) {
      try {
        const segment = await this.calculateDistance(cities[i], cities[i + 1]);
        segments.push(segment);
        totalDistance += segment.distance;
        totalDuration += segment.duration;
        
        // Small delay to respect API rate limits
        if (i < cities.length - 2) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`❌ Failed to calculate segment ${cities[i].name} → ${cities[i + 1].name}:`, error);
        // Continue with other segments even if one fails
      }
    }

    const formattedDuration = this.formatDuration(totalDuration);
    console.log(`🏁 Total Route 66 journey: ${totalDistance} miles, ${formattedDuration} drive time`);

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
