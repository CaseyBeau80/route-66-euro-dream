
import { DailySegment, RecommendedStop } from '../TripPlanBuilder';
import { TripStop } from '../../../types/TripStop';
import { DistanceCalculationService } from '../../utils/DistanceCalculationService';
import { CityDisplayService } from '../../utils/CityDisplayService';
import { TripPlanUtils } from '../TripPlanUtils';
import { TripStyleConfig } from '../TripStyleLogic';
import { DriveTimeEnforcementService } from '../DriveTimeEnforcementService';
import { EnhancedDistanceService } from '../../EnhancedDistanceService';

export class SegmentCreationService {
  /**
   * Create a validated segment with Google Maps integration
   */
  static async createValidatedSegment(
    startStop: TripStop,
    endStop: TripStop,
    day: number,
    styleConfig: TripStyleConfig
  ): Promise<DailySegment | null> {
    // Use EnhancedDistanceService for Google Maps integration
    const distanceResult = await EnhancedDistanceService.calculateDistance(
      startStop,
      endStop
    );

    // Final safety check - this should never fail with our new logic
    if (distanceResult.driveTimeHours > styleConfig.maxDailyDriveHours) {
      console.error(`❌ CRITICAL: Validated segment still exceeds limit: ${distanceResult.driveTimeHours.toFixed(1)}h`);
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
      distance: distanceResult.distance,
      approximateMiles: Math.round(distanceResult.distance),
      driveTimeHours: distanceResult.driveTimeHours,
      stops: [startStop, endStop],
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
      driveTimeCategory: TripPlanUtils.getDriveTimeCategory(distanceResult.driveTimeHours),
      routeSection: TripPlanUtils.getRouteSection(day, 14),
      isGoogleMapsData: distanceResult.isGoogleData,
      dataAccuracy: distanceResult.accuracy
    };

    return segment;
  }

  /**
   * Create a capped segment as last resort with Google Maps data
   */
  static async createCappedSegment(
    startStop: TripStop,
    endStop: TripStop,
    day: number,
    styleConfig: TripStyleConfig
  ): Promise<DailySegment> {
    // Use EnhancedDistanceService for Google Maps integration
    const distanceResult = await EnhancedDistanceService.calculateDistance(
      startStop,
      endStop
    );

    // Force cap the drive time
    const cappedDriveTime = Math.min(
      distanceResult.driveTimeHours,
      styleConfig.maxDailyDriveHours
    );

    console.log(`🚨 CAPPED SEGMENT: Day ${day} - Forcing ${cappedDriveTime}h (was ${distanceResult.driveTimeHours.toFixed(1)}h)`);

    const segment: DailySegment = {
      day,
      title: `Day ${day}: ${startStop.city_name || startStop.name} to ${endStop.city_name || endStop.name}`,
      startCity: CityDisplayService.getCityDisplayName(startStop),
      endCity: CityDisplayService.getCityDisplayName(endStop),
      distance: distanceResult.distance,
      approximateMiles: Math.round(distanceResult.distance),
      driveTimeHours: cappedDriveTime,
      stops: [startStop, endStop],
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
      driveTimeWarning: `Drive time capped at ${cappedDriveTime}h due to excessive distance (${distanceResult.distance.toFixed(0)}mi). Consider extending trip duration.`,
      isGoogleMapsData: distanceResult.isGoogleData,
      dataAccuracy: distanceResult.accuracy
    };

    return segment;
  }
}
