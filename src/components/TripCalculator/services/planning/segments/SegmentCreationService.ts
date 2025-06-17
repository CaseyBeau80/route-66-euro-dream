import { DailySegment, RecommendedStop } from '../TripPlanTypes';
import { TripStop } from '../../../types/TripStop';
import { DistanceCalculationService } from '../../utils/DistanceCalculationService';
import { CityDisplayService } from '../../utils/CityDisplayService';
import { TripPlanUtils } from '../TripPlanUtils';
import { TripStyleConfig } from '../TripStyleLogic';
import { DriveTimeEnforcementService } from '../DriveTimeEnforcementService';

export class SegmentCreationService {
  /**
   * Create a validated segment that meets all constraints
   */
  static createValidatedSegment(
    startStop: TripStop,
    endStop: TripStop,
    day: number,
    styleConfig: TripStyleConfig
  ): DailySegment | null {
    const distance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Use the enforced drive time calculation
    const driveTime = DriveTimeEnforcementService.calculateRealisticDriveTime(distance);

    // Final safety check - this should never fail with our new logic
    if (driveTime > styleConfig.maxDailyDriveHours) {
      console.error(`❌ CRITICAL: Validated segment still exceeds limit: ${driveTime.toFixed(1)}h`);
      return null;
    }

    const recommendedStops: RecommendedStop[] = [{
      stopId: endStop.id,
      id: endStop.id,
      name: endStop.name,
      description: endStop.description,
      latitude: endStop.latitude,
      longitude: endStop.longitude,
      category: endStop.category,
      city_name: endStop.city_name,
      state: endStop.state,
      city: endStop.city || endStop.city_name || 'Unknown'
    }];

    const segment: DailySegment = {
      day,
      title: `Day ${day}: ${startStop.city_name || startStop.name} to ${endStop.city_name || endStop.name}`,
      startCity: CityDisplayService.getCityDisplayName(startStop),
      endCity: CityDisplayService.getCityDisplayName(endStop),
      distance,
      approximateMiles: Math.round(distance),
      driveTimeHours: driveTime,
      stops: [startStop, endStop], // Add required stops property
      destination: {
        city: endStop.city_name || endStop.name,
        state: endStop.state
      },
      recommendedStops,
      attractions: recommendedStops.map(stop => ({
        name: stop.name,
        title: stop.name,
        description: stop.description,
        city: stop.city
      })),
      driveTimeCategory: TripPlanUtils.getDriveTimeCategory(driveTime),
      routeSection: TripPlanUtils.getRouteSection(day, 14)
    };

    return segment;
  }

  /**
   * Create a capped segment as last resort
   */
  static createCappedSegment(
    startStop: TripStop,
    endStop: TripStop,
    day: number,
    styleConfig: TripStyleConfig
  ): DailySegment {
    const distance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Force cap the drive time
    const cappedDriveTime = Math.min(
      DriveTimeEnforcementService.calculateRealisticDriveTime(distance),
      styleConfig.maxDailyDriveHours
    );

    console.log(`🚨 CAPPED SEGMENT: Day ${day} - Forcing ${cappedDriveTime}h (was ${DriveTimeEnforcementService.calculateRealisticDriveTime(distance).toFixed(1)}h)`);

    const segment: DailySegment = {
      day,
      title: `Day ${day}: ${startStop.city_name || startStop.name} to ${endStop.city_name || endStop.name}`,
      startCity: CityDisplayService.getCityDisplayName(startStop),
      endCity: CityDisplayService.getCityDisplayName(endStop),
      distance,
      approximateMiles: Math.round(distance),
      driveTimeHours: cappedDriveTime,
      stops: [startStop, endStop], // Add required stops property
      destination: {
        city: endStop.city_name || endStop.name,
        state: endStop.state
      },
      recommendedStops: [{
        stopId: endStop.id,
        id: endStop.id,
        name: endStop.name,
        description: endStop.description,
        latitude: endStop.latitude,
        longitude: endStop.longitude,
        category: endStop.category,
        city_name: endStop.city_name,
        state: endStop.state,
        city: endStop.city || endStop.city_name || 'Unknown'
      }],
      attractions: [{
        name: endStop.name,
        title: endStop.name,
        description: endStop.description,
        city: endStop.city || endStop.city_name || 'Unknown'
      }],
      driveTimeCategory: TripPlanUtils.getDriveTimeCategory(cappedDriveTime),
      routeSection: TripPlanUtils.getRouteSection(day, 14),
      driveTimeWarning: `Drive time capped at ${cappedDriveTime}h due to excessive distance (${distance.toFixed(0)}mi). Consider extending trip duration.`
    };

    return segment;
  }
}
