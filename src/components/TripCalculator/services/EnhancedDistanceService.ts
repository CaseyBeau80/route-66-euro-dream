
import { TripStop } from '../types/TripStop';
import { GoogleMapsIntegrationService, EnhancedDistanceResult } from './GoogleMapsIntegrationService';
import { DistanceCalculationService } from './utils/DistanceCalculationService';

export interface DistanceCalculationOptions {
  useGoogleMaps?: boolean;
  onProgress?: (current: number, total: number) => void;
  rateLimit?: number; // milliseconds between requests
}

export class EnhancedDistanceService {
  /**
   * Calculate distance between two stops with Google Maps integration
   */
  static async calculateDistance(
    origin: TripStop,
    destination: TripStop,
    options: DistanceCalculationOptions = {}
  ): Promise<{
    distance: number;
    duration: number;
    driveTimeHours: number;
    isGoogleData: boolean;
    accuracy: string;
  }> {
    const { useGoogleMaps = true } = options;

    if (useGoogleMaps && GoogleMapsIntegrationService.isAvailable()) {
      try {
        const result = await GoogleMapsIntegrationService.calculateDistance(origin, destination);
        
        return {
          distance: result.distance,
          duration: result.duration,
          driveTimeHours: result.duration / 3600, // Convert seconds to hours
          isGoogleData: result.isGoogleData,
          accuracy: result.accuracy
        };
      } catch (error) {
        console.warn('Google Maps failed, falling back to Haversine:', error);
      }
    }

    // Fallback to existing Haversine calculation
    const distance = DistanceCalculationService.calculateDistance(
      origin.latitude, origin.longitude,
      destination.latitude, destination.longitude
    );
    
    // Estimate drive time (assuming 50 mph average)
    const driveTimeHours = distance / 50;
    const duration = driveTimeHours * 3600; // Convert to seconds
    
    return {
      distance,
      duration,
      driveTimeHours,
      isGoogleData: false,
      accuracy: 'estimated'
    };
  }

  /**
   * Calculate total trip metrics with Google Maps integration
   */
  static async calculateTripMetrics(
    stops: TripStop[],
    options: DistanceCalculationOptions = {}
  ): Promise<{
    totalDistance: number;
    totalDuration: number;
    totalDriveTimeHours: number;
    segments: Array<{
      from: TripStop;
      to: TripStop;
      distance: number;
      duration: number;
      driveTimeHours: number;
      isGoogleData: boolean;
      accuracy: string;
    }>;
    isGoogleData: boolean;
    accuracy: string;
  }> {
    if (stops.length < 2) {
      return {
        totalDistance: 0,
        totalDuration: 0,
        totalDriveTimeHours: 0,
        segments: [],
        isGoogleData: false,
        accuracy: 'none'
      };
    }

    const { useGoogleMaps = true, onProgress, rateLimit = 200 } = options;
    
    let totalDistance = 0;
    let totalDuration = 0;
    let allGoogleData = true;
    const segments = [];

    console.log(`📊 Calculating enhanced trip metrics for ${stops.length} stops`);

    for (let i = 0; i < stops.length - 1; i++) {
      const from = stops[i];
      const to = stops[i + 1];
      
      // Report progress
      if (onProgress) {
        onProgress(i + 1, stops.length - 1);
      }
      
      try {
        const result = await this.calculateDistance(from, to, { useGoogleMaps });
        
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
          driveTimeHours: result.driveTimeHours,
          isGoogleData: result.isGoogleData,
          accuracy: result.accuracy
        });
        
        // Rate limiting
        if (result.isGoogleData && i < stops.length - 2 && rateLimit > 0) {
          await new Promise(resolve => setTimeout(resolve, rateLimit));
        }
        
      } catch (error) {
        console.error(`❌ Failed to calculate segment ${from.name} → ${to.name}:`, error);
        // Continue with fallback calculation
        const fallbackDistance = DistanceCalculationService.calculateDistance(
          from.latitude, from.longitude, to.latitude, to.longitude
        );
        const fallbackDriveTime = fallbackDistance / 50;
        
        segments.push({
          from,
          to,
          distance: fallbackDistance,
          duration: fallbackDriveTime * 3600,
          driveTimeHours: fallbackDriveTime,
          isGoogleData: false,
          accuracy: 'fallback'
        });
        
        totalDistance += fallbackDistance;
        totalDuration += fallbackDriveTime * 3600;
        allGoogleData = false;
      }
    }

    const totalDriveTimeHours = totalDuration / 3600;
    const accuracy = allGoogleData ? 'high' : segments.some(s => s.isGoogleData) ? 'mixed' : 'estimated';

    console.log(`✅ Enhanced trip metrics complete: ${totalDistance.toFixed(1)} miles, ${totalDriveTimeHours.toFixed(1)}h, Accuracy: ${accuracy}`);

    return {
      totalDistance: Math.round(totalDistance),
      totalDuration: Math.round(totalDuration),
      totalDriveTimeHours,
      segments,
      isGoogleData: allGoogleData,
      accuracy
    };
  }

  /**
   * Update a single segment with Google Maps data
   */
  static async updateSegmentWithGoogleMaps(
    segment: any,
    startStop: TripStop,
    endStop: TripStop
  ): Promise<any> {
    if (!GoogleMapsIntegrationService.isAvailable()) {
      console.log('Google Maps not available, keeping existing segment data');
      return segment;
    }

    try {
      const result = await this.calculateDistance(startStop, endStop);
      
      return {
        ...segment,
        distance: result.distance,
        approximateMiles: result.distance,
        driveTimeHours: result.driveTimeHours,
        drivingTime: result.driveTimeHours,
        isGoogleMapsData: result.isGoogleData,
        dataAccuracy: result.accuracy,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to update segment with Google Maps data:', error);
      return segment;
    }
  }
}
