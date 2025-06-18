
import { DailySegment } from '../TripPlanTypes';
import { TripStop } from '../../../types/TripStop';
import { DistanceCalculationService } from '../../utils/DistanceCalculationService';
import { TripStyleConfig } from '../TripStyleLogic';
import { DistanceValidationService } from '../DistanceValidationService';
import { SegmentCreationService } from './SegmentCreationService';

export class EmergencyFallbackService {
  /**
   * Create emergency fallback segments when all else fails
   */
  static async createEmergencyFallbackSegments(
    startStop: TripStop,
    endStop: TripStop,
    styleConfig: TripStyleConfig
  ): Promise<DailySegment[]> {
    console.log(`🚨 EMERGENCY FALLBACK: Creating minimal viable segments`);
    
    // Calculate minimum viable days
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const maxDailyDistance = DistanceValidationService.getMaxSafeDistance(styleConfig.maxDailyDriveHours);
    const minDays = Math.ceil(totalDistance / maxDailyDistance);
    
    // Create segments with artificial waypoints if needed
    const segments: DailySegment[] = [];
    
    for (let day = 1; day <= minDays; day++) {
      const progress = day / minDays;
      const segmentEndLat = startStop.latitude + (endStop.latitude - startStop.latitude) * progress;
      const segmentEndLng = startStop.longitude + (endStop.longitude - startStop.longitude) * progress;
      
      const segmentStart = day === 1 ? startStop : {
        ...startStop,
        id: `waypoint-${day-1}`,
        name: `Waypoint ${day-1}`,
        latitude: startStop.latitude + (endStop.latitude - startStop.latitude) * ((day-1) / minDays),
        longitude: startStop.longitude + (endStop.longitude - startStop.longitude) * ((day-1) / minDays)
      };
      
      const segmentEnd = day === minDays ? endStop : {
        ...endStop,
        id: `waypoint-${day}`,
        name: `Waypoint ${day}`,
        latitude: segmentEndLat,
        longitude: segmentEndLng
      };
      
      const segment = await SegmentCreationService.createValidatedSegment(segmentStart, segmentEnd, day, styleConfig);
      if (segment) {
        segments.push(segment);
      }
    }
    
    console.log(`🚨 EMERGENCY: Created ${segments.length} fallback segments for ${minDays} days`);
    return segments;
  }
}
