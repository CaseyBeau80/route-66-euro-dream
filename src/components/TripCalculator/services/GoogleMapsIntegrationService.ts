
import { GoogleDistanceMatrixService, DistanceMatrixResult } from '@/components/Route66Planner/services/GoogleDistanceMatrixService';
import { TripStop } from '../types/TripStop';

export interface EnhancedDistanceResult extends DistanceMatrixResult {
  isGoogleData: boolean;
  accuracy: 'high' | 'medium' | 'estimated';
}

export class GoogleMapsIntegrationService {
  private static cache = new Map<string, EnhancedDistanceResult>();

  /**
   * Check if Google Maps API is available and configured
   */
  static isAvailable(): boolean {
    return GoogleDistanceMatrixService.isAvailable();
  }

  /**
   * Set Google Maps API key
   */
  static setApiKey(key: string): void {
    GoogleDistanceMatrixService.setApiKey(key);
  }

  /**
   * Get API key status
   */
  static getApiKey(): string | null {
    return GoogleDistanceMatrixService.getApiKey();
  }

  /**
   * Convert TripStop to DestinationCity format for Google API
   */
  private static tripStopToDestination(stop: TripStop) {
    return {
      name: stop.name,
      state: stop.state || 'Unknown',
      latitude: stop.latitude,
      longitude: stop.longitude
    };
  }

  /**
   * Calculate distance between two TripStops using Google Maps API
   */
  static async calculateDistance(
    origin: TripStop,
    destination: TripStop
  ): Promise<EnhancedDistanceResult> {
    const cacheKey = `${origin.id}-${destination.id}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log(`📊 Using cached Google Maps distance for ${origin.name} → ${destination.name}`);
      return this.cache.get(cacheKey)!;
    }

    if (!this.isAvailable()) {
      // Fallback to Haversine calculation
      const distance = this.calculateHaversineDistance(origin, destination);
      const duration = this.estimateDrivingTime(distance);
      
      const result: EnhancedDistanceResult = {
        distance,
        duration,
        status: 'OK',
        isGoogleData: false,
        accuracy: 'estimated'
      };
      
      console.log(`📐 Using Haversine fallback: ${origin.name} → ${destination.name} = ${distance.toFixed(1)} miles`);
      return result;
    }

    try {
      const originDest = this.tripStopToDestination(origin);
      const destDest = this.tripStopToDestination(destination);
      
      console.log(`🗺️ Fetching Google Maps distance: ${origin.name} → ${destination.name}`);
      
      const googleResult = await GoogleDistanceMatrixService.calculateDistance(originDest, destDest);
      
      const enhancedResult: EnhancedDistanceResult = {
        ...googleResult,
        isGoogleData: true,
        accuracy: 'high'
      };
      
      // Cache the result
      this.cache.set(cacheKey, enhancedResult);
      
      console.log(`✅ Google Maps result: ${origin.name} → ${destination.name} = ${googleResult.distance} miles, ${GoogleDistanceMatrixService.formatDuration(googleResult.duration)}`);
      
      return enhancedResult;
      
    } catch (error) {
      console.warn(`⚠️ Google Maps API failed for ${origin.name} → ${destination.name}, falling back to Haversine:`, error);
      
      // Fallback to Haversine calculation
      const distance = this.calculateHaversineDistance(origin, destination);
      const duration = this.estimateDrivingTime(distance);
      
      const result: EnhancedDistanceResult = {
        distance,
        duration,
        status: 'OK',
        isGoogleData: false,
        accuracy: 'medium'
      };
      
      return result;
    }
  }

  /**
   * Calculate route distances for multiple stops
   */
  static async calculateRouteDistances(
    stops: TripStop[],
    onProgress?: (current: number, total: number) => void
  ): Promise<{
    totalDistance: number;
    totalDuration: number;
    segments: Array<{
      from: TripStop;
      to: TripStop;
      distance: number;
      duration: number;
      isGoogleData: boolean;
      accuracy: string;
    }>;
    isGoogleData: boolean;
  }> {
    if (stops.length < 2) {
      return {
        totalDistance: 0,
        totalDuration: 0,
        segments: [],
        isGoogleData: false
      };
    }

    console.log(`🛣️ Calculating enhanced route distances for ${stops.length} stops`);
    
    let totalDistance = 0;
    let totalDuration = 0;
    let allGoogleData = true;
    const segments = [];

    for (let i = 0; i < stops.length - 1; i++) {
      const from = stops[i];
      const to = stops[i + 1];
      
      // Report progress
      if (onProgress) {
        onProgress(i + 1, stops.length - 1);
      }
      
      try {
        const result = await this.calculateDistance(from, to);
        
        totalDistance += result.distance;
        totalDuration += result.duration;
        
        if (!result.isGoogleData) {
          allGoogleData = false;
        }
        
        segments.push({
          from,
          to,
          distance: result.distance,
          duration: result.duration,
          isGoogleData: result.isGoogleData,
          accuracy: result.accuracy
        });
        
        // Rate limiting for Google API
        if (result.isGoogleData && i < stops.length - 2) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
      } catch (error) {
        console.error(`❌ Failed to calculate distance for ${from.name} → ${to.name}:`, error);
        // Continue with other segments
      }
    }

    console.log(`🏁 Enhanced route calculation complete: ${totalDistance.toFixed(1)} miles, ${GoogleDistanceMatrixService.formatDuration(totalDuration)}, Google Data: ${allGoogleData}`);

    return {
      totalDistance: Math.round(totalDistance),
      totalDuration: Math.round(totalDuration),
      segments,
      isGoogleData: allGoogleData
    };
  }

  /**
   * Fallback Haversine calculation
   */
  private static calculateHaversineDistance(stop1: TripStop, stop2: TripStop): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (stop2.latitude - stop1.latitude) * Math.PI / 180;
    const dLon = (stop2.longitude - stop1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(stop1.latitude * Math.PI / 180) * Math.cos(stop2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Estimate driving time based on distance
   */
  private static estimateDrivingTime(distance: number): number {
    // Assume average speed of 50 mph for Route 66
    return (distance / 50) * 3600; // Convert to seconds
  }

  /**
   * Clear cache
   */
  static clearCache(): void {
    this.cache.clear();
    GoogleDistanceMatrixService.clearCache();
    console.log('🗑️ Google Maps integration cache cleared');
  }

  /**
   * Format duration in human-readable format
   */
  static formatDuration(seconds: number): string {
    return GoogleDistanceMatrixService.formatDuration(seconds);
  }
}
