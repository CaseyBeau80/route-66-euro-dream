
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface RebalancingResult {
  success: boolean;
  rebalancedSegments: Array<{ startStop: TripStop; endStop: TripStop }>;
  warnings: string[];
}

export interface StyleConfig {
  maxDriveTimeHours: number;
  preferredDriveTimeHours: number;
  allowExtendedDays: boolean;
}

export class SegmentRebalancingService {
  /**
   * Rebalance segments to optimize drive times based on trip style
   */
  static rebalanceSegments(
    segments: Array<{ startStop: TripStop; endStop: TripStop }>,
    allStops: TripStop[],
    styleConfig: StyleConfig,
    totalDays: number
  ): RebalancingResult {
    console.log(`⚖️ Rebalancing ${segments.length} segments for optimal drive times`);

    const warnings: string[] = [];
    
    // Calculate current drive times
    const segmentsWithTimes = segments.map(segment => {
      const distance = DistanceCalculationService.calculateDistance(
        segment.startStop.latitude, segment.startStop.longitude,
        segment.endStop.latitude, segment.endStop.longitude
      );
      return {
        ...segment,
        distance,
        driveTimeHours: distance / 55 // Average speed
      };
    });

    // Check if rebalancing is needed
    const maxDriveTime = Math.max(...segmentsWithTimes.map(s => s.driveTimeHours));
    const avgDriveTime = segmentsWithTimes.reduce((sum, s) => sum + s.driveTimeHours, 0) / segmentsWithTimes.length;

    if (maxDriveTime <= styleConfig.maxDriveTimeHours && maxDriveTime <= avgDriveTime * 1.3) {
      console.log('✅ Segments already well-balanced, no rebalancing needed');
      return {
        success: true,
        rebalancedSegments: segments,
        warnings: []
      };
    }

    console.log(`🔄 Rebalancing needed: max=${maxDriveTime.toFixed(1)}h, avg=${avgDriveTime.toFixed(1)}h`);

    // For now, return the original segments with a warning
    // In a full implementation, this would implement sophisticated rebalancing logic
    warnings.push('Drive time optimization available but not implemented in this version');
    
    return {
      success: true,
      rebalancedSegments: segments,
      warnings
    };
  }
}
