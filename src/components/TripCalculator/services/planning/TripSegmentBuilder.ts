
import { DailySegment, RecommendedStop } from './TripPlanTypes';
import { TripStop } from '../data/SupabaseDataService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { TripPlanUtils } from './TripPlanUtils';
import { TripStyleConfig } from './TripStyleLogic';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';
import { SegmentBalancingService } from './SegmentBalancingService';

export class TripSegmentBuilder {
  /**
   * Build segments with destination cities only and drive-time enforcement
   */
  static buildSegmentsWithDestinationCities(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number,
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    console.log(`🏗️ Building segments with drive-time enforcement: ${tripDays} days, ${styleConfig.style} style`);
    
    // Create initial segment plan
    const allDayStops = [startStop, ...destinationCities, endStop];
    const initialSegments: Array<{ startStop: TripStop; endStop: TripStop }> = [];
    
    for (let day = 1; day <= tripDays; day++) {
      const currentStop = allDayStops[day - 1];
      const nextStop = allDayStops[day];
      
      if (!currentStop || !nextStop) continue;
      
      initialSegments.push({
        startStop: currentStop,
        endStop: nextStop
      });
    }
    
    // Check if rebalancing is needed
    if (DriveTimeEnforcementService.requiresRebalancing(initialSegments, styleConfig)) {
      console.log(`⚖️ Rebalancing required for ${styleConfig.style} trip`);
      
      const balancingResult = SegmentBalancingService.rebalanceSegments(
        initialSegments,
        [...destinationCities, startStop, endStop],
        styleConfig,
        tripDays
      );
      
      if (balancingResult.success) {
        console.log(`✅ Successfully rebalanced to ${balancingResult.rebalancedSegments.length} segments`);
        return this.createDailySegmentsFromPairs(balancingResult.rebalancedSegments, styleConfig);
      } else {
        console.warn(`⚠️ Rebalancing failed, using original segments with warnings`);
        // Continue with original plan but add warnings to segments
      }
    }
    
    // Create segments from the plan (original or rebalanced)
    return this.createDailySegmentsFromPairs(initialSegments, styleConfig);
  }

  /**
   * Create daily segments from start/end stop pairs
   */
  private static createDailySegmentsFromPairs(
    segmentPairs: Array<{ startStop: TripStop; endStop: TripStop }>,
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    
    segmentPairs.forEach((pair, index) => {
      const day = index + 1;
      const { startStop, endStop } = pair;
      
      const segmentDistance = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        endStop.latitude, endStop.longitude
      );
      
      const driveTimeHours = DriveTimeEnforcementService.calculateRealisticDriveTime(segmentDistance);
      
      // Validate drive time against style limits
      const validation = DriveTimeEnforcementService.validateSegmentDriveTime(
        startStop,
        endStop,
        styleConfig
      );
      
      // Only include destination cities as recommended stops with stopId
      const segmentStops = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly([endStop]);
      const recommendedStops: RecommendedStop[] = segmentStops.map(stop => ({
        stopId: stop.id, // Add required stopId
        id: stop.id,
        name: stop.name,
        description: stop.description,
        latitude: stop.latitude,
        longitude: stop.longitude,
        category: stop.category,
        city_name: stop.city_name,
        state: stop.state,
        city: stop.city || stop.city_name || 'Unknown'
      }));
      
      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${startStop.city_name} to ${endStop.city_name}`,
        startCity: CityDisplayService.getCityDisplayName(startStop),
        endCity: CityDisplayService.getCityDisplayName(endStop),
        distance: segmentDistance,
        approximateMiles: Math.round(segmentDistance),
        driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
        destination: {
          city: endStop.city_name,
          state: endStop.state
        },
        recommendedStops,
        attractions: recommendedStops.map(stop => ({
          name: stop.name,
          title: stop.name,
          description: stop.description,
          city: stop.city
        })),
        driveTimeCategory: TripPlanUtils.getDriveTimeCategory(driveTimeHours),
        routeSection: TripPlanUtils.getRouteSection(day, segmentPairs.length)
      };
      
      // Add drive-time validation warning if needed
      if (!validation.isValid && validation.recommendation) {
        segment.driveTimeWarning = validation.recommendation;
      }
      
      segments.push(segment);
      
      console.log(`📍 Day ${day}: ${startStop.name} → ${endStop.name} | ${segmentDistance.toFixed(1)}mi | ${driveTimeHours.toFixed(1)}h | Valid: ${validation.isValid}`);
    });
    
    return segments;
  }

  /**
   * Legacy method for backward compatibility
   */
  static buildSegmentsWithDestinationCitiesLegacy(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number
  ): DailySegment[] {
    // Use balanced style as default for legacy calls
    const defaultStyleConfig = {
      style: 'balanced' as const,
      maxDailyDriveHours: 6,
      preferDestinationCities: false,
      allowFlexibleStops: true,
      balancePriority: 'distance' as const
    };
    
    return this.buildSegmentsWithDestinationCities(
      startStop,
      endStop,
      destinationCities,
      tripDays,
      defaultStyleConfig
    );
  }
}
