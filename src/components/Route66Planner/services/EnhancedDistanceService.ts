
import { DestinationCity } from '../types';
import { GoogleDistanceMatrixService } from './GoogleDistanceMatrixService';

export class EnhancedDistanceService {
  /**
   * Fallback Haversine formula for when Google API is not available
   */
  private static calculateHaversineDistance(city1: DestinationCity, city2: DestinationCity): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (city2.latitude - city1.latitude) * Math.PI / 180;
    const dLon = (city2.longitude - city1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(city1.latitude * Math.PI / 180) * Math.cos(city2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Estimate driving time based on distance (fallback)
   */
  private static estimateDrivingTime(distance: number): number {
    // Assume average speed of 50 mph for Route 66
    return (distance / 50) * 3600; // Convert to seconds
  }

  /**
   * Calculate distance and duration between two cities
   * Uses Google API if available, falls back to Haversine
   */
  static async calculateDistance(city1: DestinationCity, city2: DestinationCity): Promise<{
    distance: number;
    duration: number;
    isGoogleData: boolean;
  }> {
    if (GoogleDistanceMatrixService.isAvailable()) {
      try {
        const result = await GoogleDistanceMatrixService.calculateDistance(city1, city2);
        return {
          distance: result.distance,
          duration: result.duration,
          isGoogleData: true
        };
      } catch (error) {
        console.warn('Google API failed, falling back to Haversine:', error);
      }
    }

    // Fallback to Haversine calculation
    const distance = this.calculateHaversineDistance(city1, city2);
    const duration = this.estimateDrivingTime(distance);
    
    console.log(`📐 Using Haversine calculation: ${Math.round(distance)} miles`);
    
    return {
      distance,
      duration,
      isGoogleData: false
    };
  }

  /**
   * Calculate total route distance and duration
   */
  static async calculateRouteMetrics(cities: DestinationCity[]): Promise<{
    totalDistance: number;
    totalDuration: number;
    isGoogleData: boolean;
    segments: Array<{
      from: DestinationCity;
      to: DestinationCity;
      distance: number;
      duration: number;
    }>;
  }> {
    if (cities.length < 2) {
      return {
        totalDistance: 0,
        totalDuration: 0,
        isGoogleData: false,
        segments: []
      };
    }

    let totalDistance = 0;
    let totalDuration = 0;
    let isGoogleData = true;
    const segments = [];

    for (let i = 0; i < cities.length - 1; i++) {
      const result = await this.calculateDistance(cities[i], cities[i + 1]);
      
      totalDistance += result.distance;
      totalDuration += result.duration;
      
      // If any segment is not from Google, mark the entire route as non-Google
      if (!result.isGoogleData) {
        isGoogleData = false;
      }

      segments.push({
        from: cities[i],
        to: cities[i + 1],
        distance: result.distance,
        duration: result.duration
      });
    }

    return {
      totalDistance: Math.round(totalDistance),
      totalDuration: Math.round(totalDuration),
      isGoogleData,
      segments
    };
  }

  /**
   * Format duration in a human-readable way
   */
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes}m`;
    }
    
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
}
