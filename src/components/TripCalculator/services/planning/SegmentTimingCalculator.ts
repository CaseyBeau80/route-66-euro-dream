
import { TripStop } from '../../types/TripStop';

export type DriveTimeCategory = 'short' | 'optimal' | 'long' | 'extreme';

export interface SubStopTiming {
  fromStop: TripStop;
  toStop: TripStop;
  distance: number;
  driveTimeHours: number;
  drivingTime: number;
  distanceMiles: number;
}

export class SegmentTimingCalculator {
  static calculateOptimalTiming(segments: any[]): any {
    console.log('⏱️ SegmentTimingCalculator: calculateOptimalTiming stub');
    return { optimizedSegments: segments };
  }

  static categorizedriveTime(driveTime: number): DriveTimeCategory {
    if (driveTime <= 3) return 'short';
    if (driveTime <= 6) return 'optimal';
    if (driveTime <= 9) return 'long';
    return 'extreme';
  }

  static getDriveTimeCategory(category: string): DriveTimeCategory {
    // Fix type conversion with proper validation
    const validCategories: DriveTimeCategory[] = ['short', 'optimal', 'long', 'extreme'];
    return validCategories.includes(category as DriveTimeCategory) 
      ? (category as DriveTimeCategory)
      : 'optimal';
  }

  static async calculateSegmentTimings(
    startStop: TripStop,
    endStop: TripStop,
    segmentStops: TripStop[]
  ): Promise<{
    segmentTimings: SubStopTiming[];
    totalSegmentDriveTime: number;
    segmentDistance: number;
    isGoogleMapsData: boolean;
    dataAccuracy: string;
  }> {
    const segmentTimings: SubStopTiming[] = [];
    let totalDistance = 0;
    let totalDriveTime = 0;

    // Create timings between consecutive stops
    const allStops = [startStop, ...segmentStops, endStop];
    
    for (let i = 0; i < allStops.length - 1; i++) {
      const fromStop = allStops[i];
      const toStop = allStops[i + 1];
      
      // Mock distance calculation
      const distance = this.calculateDistance(fromStop, toStop);
      const driveTime = distance / 50; // 50 mph average
      
      segmentTimings.push({
        fromStop,
        toStop,
        distance,
        driveTimeHours: driveTime,
        drivingTime: driveTime,
        distanceMiles: distance
      });
      
      totalDistance += distance;
      totalDriveTime += driveTime;
    }

    return {
      segmentTimings,
      totalSegmentDriveTime: totalDriveTime,
      segmentDistance: totalDistance,
      isGoogleMapsData: false,
      dataAccuracy: 'estimated'
    };
  }

  private static calculateDistance(stop1: TripStop, stop2: TripStop): number {
    // Simple distance calculation using Haversine formula
    const R = 3959; // Earth's radius in miles
    const dLat = (stop2.latitude - stop1.latitude) * Math.PI / 180;
    const dLon = (stop2.longitude - stop1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(stop1.latitude * Math.PI / 180) * Math.cos(stop2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}
