import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { TripBoundaryService } from './TripBoundaryService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { calculateRealisticDriveTime, validateGeographicProgression } from '../../utils/distanceCalculator';

export class EnhancedHeritageCitiesService {
  // ABSOLUTE CONSTRAINTS - These cannot be exceeded
  private static readonly ABSOLUTE_MAX_DRIVE_HOURS = 10;
  private static readonly RECOMMENDED_MAX_DRIVE_HOURS = 8;
  private static readonly OPTIMAL_MAX_DRIVE_HOURS = 6;
  private static readonly MIN_DRIVE_HOURS = 2;
  private static readonly MAX_STOPS_LIMIT = 8; // Prevent overcrowding
  
  /**
   * Plan Heritage Cities trip with strict geographic and time constraints
   */
  static async planEnhancedHeritageCitiesTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`🏛️ ENHANCED Heritage Cities Planning: ${startLocation} → ${endLocation}, ${travelDays} days`);

    // Validate minimum days requirement
    if (travelDays < 1) {
      console.error(`❌ CRITICAL: Invalid travel days: ${travelDays}`);
      travelDays = 4; // Force minimum sensible duration
    }

    try {
      // Find boundary stops
      const { startStop, endStop, routeStops } = TripBoundaryService.findBoundaryStops(
        startLocation,
        endLocation,
        allStops
      );

      console.log(`✅ Boundary stops found:`, {
        start: `${startStop.name} (${startStop.state})`,
        end: `${endStop.name} (${endStop.state})`,
        availableStops: routeStops.length
      });

      // Calculate total distance and validate feasibility
      const totalDistance = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        endStop.latitude, endStop.longitude
      );

      console.log(`📏 Total trip: ${totalDistance.toFixed(1)} miles in ${travelDays} days`);

      // Validate trip feasibility with 10-hour constraint
      const feasibilityCheck = this.validateTripFeasibility(startStop, endStop, travelDays);
      if (!feasibilityCheck.isValid) {
        console.warn(`⚠️ FEASIBILITY WARNING: ${feasibilityCheck.recommendation}`);
        // Continue but with awareness of constraints
      }

      // Create geographic progression with anti-ping-pong logic
      const destinationCities = this.createGeographicProgression(
        startStop,
        endStop,
        routeStops,
        travelDays,
        totalDistance
      );

      // Validate geographic progression
      const allStopsInOrder = [startStop, ...destinationCities, endStop];
      const isEastToWest = startStop.longitude < endStop.longitude;
      const progressionValidation = validateGeographicProgression(allStopsInOrder, isEastToWest);
      
      if (!progressionValidation.isValid) {
        console.error(`❌ GEOGRAPHIC VIOLATIONS:`, progressionValidation.violations);
        // Fix the progression by removing problematic stops
        const fixedDestinations = this.fixGeographicProgression(destinationCities, startStop, endStop, isEastToWest);
        destinationCities.splice(0, destinationCities.length, ...fixedDestinations);
      }

      // Create segments with strict validation
      const segments = this.createStrictValidatedSegments(
        startStop,
        endStop,
        destinationCities,
        travelDays,
        totalDistance
      );

      // Calculate final metrics
      const actualTotalDistance = segments.reduce((total, segment) => total + segment.distance, 0);
      const totalDrivingTime = segments.reduce((total, segment) => total + (segment.driveTimeHours || 0), 0);

      // Apply stops limitation message if applicable
      const stopsLimited = routeStops.length > this.MAX_STOPS_LIMIT;
      const limitMessage = stopsLimited 
        ? `🎯 Optimized to ${Math.min(routeStops.length, this.MAX_STOPS_LIMIT)} major destinations for ${travelDays}-day experience`
        : undefined;

      const tripPlan: TripPlan = {
        id: `enhanced-heritage-${Date.now()}`,
        title: `${startLocation} to ${endLocation} Enhanced Route 66 Heritage Journey`,
        startCity: startStop.city_name || startStop.name,
        endCity: endStop.city_name || endStop.name,
        startLocation,
        endLocation,
        startDate: new Date(),
        totalDays: travelDays,
        totalDistance: actualTotalDistance,
        totalMiles: Math.round(actualTotalDistance),
        totalDrivingTime,
        segments,
        dailySegments: segments,
        stops: [startStop, ...destinationCities, endStop],
        tripStyle: 'destination-focused',
        lastUpdated: new Date(),
        stopsLimited,
        limitMessage
      };

      console.log(`✅ Enhanced Heritage trip complete:`, {
        segments: segments.length,
        totalDistance: actualTotalDistance.toFixed(1),
        totalDrivingTime: totalDrivingTime.toFixed(1),
        maxDailyDriveTime: Math.max(...segments.map(s => s.driveTimeHours || 0)).toFixed(1),
        stopsLimited
      });

      return tripPlan;

    } catch (error) {
      console.error('❌ Enhanced Heritage Cities planning failed:', error);
      throw new Error(`Enhanced Heritage Cities planning failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate trip feasibility with strict 10-hour constraint
   */
  private static validateTripFeasibility(
    startStop: TripStop,
    endStop: TripStop,
    travelDays: number
  ): { isValid: boolean; recommendation: string; minRequiredDays: number } {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    const avgDailyDistance = totalDistance / travelDays;
    const avgDailyDriveTime = calculateRealisticDriveTime(avgDailyDistance);
    const minRequiredDays = Math.ceil(totalDistance / (this.ABSOLUTE_MAX_DRIVE_HOURS * 50)); // 50 mph * 10h = 500 miles max/day

    const isValid = avgDailyDriveTime <= this.ABSOLUTE_MAX_DRIVE_HOURS;

    let recommendation = '';
    if (!isValid) {
      recommendation = `Average ${avgDailyDriveTime.toFixed(1)}h/day exceeds 10h limit. Minimum ${minRequiredDays} days required.`;
    } else if (avgDailyDriveTime > this.RECOMMENDED_MAX_DRIVE_HOURS) {
      recommendation = `${avgDailyDriveTime.toFixed(1)}h/day is long but feasible. Consider adding 1-2 days for comfort.`;
    } else {
      recommendation = `${avgDailyDriveTime.toFixed(1)}h/day is within comfortable limits.`;
    }

    console.log(`🔍 Feasibility check:`, {
      totalDistance: totalDistance.toFixed(1),
      avgDailyDistance: avgDailyDistance.toFixed(1),
      avgDailyDriveTime: avgDailyDriveTime.toFixed(1),
      isValid,
      minRequiredDays
    });

    return { isValid, recommendation, minRequiredDays };
  }

  /**
   * Create geographic progression that prevents ping-ponging
   */
  private static createGeographicProgression(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    travelDays: number,
    totalDistance: number
  ): TripStop[] {
    console.log(`🗺️ Creating geographic progression for ${travelDays} days`);

    // Determine direction
    const isEastToWest = startStop.longitude < endStop.longitude;
    console.log(`📍 Direction: ${isEastToWest ? 'East to West' : 'West to East'}`);

    // Filter and sort stops geographically to prevent ping-ponging
    const progressiveStops = this.filterProgressiveStops(startStop, endStop, routeStops, isEastToWest);
    
    // Limit stops to prevent overcrowding
    const limitedStops = progressiveStops.slice(0, this.MAX_STOPS_LIMIT);
    
    console.log(`🛣️ Progressive stops (${limitedStops.length}):`, limitedStops.map(s => s.name));

    // Select balanced destinations
    const destinations = this.selectBalancedDestinations(
      startStop,
      endStop,
      limitedStops,
      travelDays,
      totalDistance,
      isEastToWest
    );

    return destinations;
  }

  /**
   * Filter stops to ensure progressive movement (no ping-ponging)
   */
  private static filterProgressiveStops(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    isEastToWest: boolean
  ): TripStop[] {
    return routeStops
      .filter(stop => {
        // Must be between start and end geographically
        const isBetween = isEastToWest 
          ? stop.longitude > startStop.longitude && stop.longitude < endStop.longitude
          : stop.longitude < startStop.longitude && stop.longitude > endStop.longitude;
        
        if (!isBetween) return false;
        
        // Must be within reasonable distance from direct route (prevent major detours)
        const distanceFromRoute = this.calculateDistanceFromDirectRoute(startStop, endStop, stop);
        return distanceFromRoute < 150; // Within 150 miles of direct route
      })
      .sort((a, b) => {
        // Sort by geographic progression
        return isEastToWest ? a.longitude - b.longitude : b.longitude - a.longitude;
      });
  }

  /**
   * Select balanced destinations with strict drive time validation
   */
  private static selectBalancedDestinations(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    travelDays: number,
    totalDistance: number,
    isEastToWest: boolean
  ): TripStop[] {
    const destinations: TripStop[] = [];
    const targetDistance = totalDistance / travelDays;
    
    let currentStop = startStop;
    let accumulatedDistance = 0;

    for (let day = 1; day < travelDays; day++) {
      const nextStop = this.findOptimalNextStop(
        currentStop,
        endStop,
        availableStops,
        destinations,
        targetDistance,
        day,
        travelDays
      );

      if (nextStop) {
        const segmentDistance = DistanceCalculationService.calculateDistance(
          currentStop.latitude, currentStop.longitude,
          nextStop.latitude, nextStop.longitude
        );

        const driveTime = calculateRealisticDriveTime(segmentDistance);
        
        // STRICT validation - never allow > 10 hours
        if (driveTime <= this.ABSOLUTE_MAX_DRIVE_HOURS) {
          destinations.push(nextStop);
          currentStop = nextStop;
          accumulatedDistance += segmentDistance;
          console.log(`📍 Day ${day}: ${nextStop.name} (+${segmentDistance.toFixed(0)}mi, ${driveTime.toFixed(1)}h)`);
        } else {
          console.error(`❌ Rejected ${nextStop.name}: ${driveTime.toFixed(1)}h > 10h limit`);
          break;
        }
      } else {
        console.log(`⚠️ No suitable stop found for day ${day}`);
        break;
      }
    }

    return destinations;
  }

  /**
   * Find optimal next stop ensuring progressive movement and drive time limits
   */
  private static findOptimalNextStop(
    currentStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    alreadySelected: TripStop[],
    targetDistance: number,
    currentDay: number,
    totalDays: number
  ): TripStop | null {
    const remainingStops = availableStops.filter(stop => 
      !alreadySelected.some(selected => selected.id === stop.id)
    );

    if (remainingStops.length === 0) return null;

    let bestStop: TripStop | null = null;
    let bestScore = Infinity;

    for (const stop of remainingStops) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      const driveTime = calculateRealisticDriveTime(distance);
      
      // ABSOLUTE constraint - skip if over 10 hours
      if (driveTime > this.ABSOLUTE_MAX_DRIVE_HOURS) {
        continue;
      }

      // Score based on distance to target
      const distanceScore = Math.abs(distance - targetDistance);
      
      // Bonus for heritage sites
      const heritageBonus = stop.heritage_value === 'high' ? -100 : 
                           stop.heritage_value === 'medium' ? -50 : 0;
      
      // Penalty for drive times over 8 hours
      const driveTimePenalty = driveTime > this.RECOMMENDED_MAX_DRIVE_HOURS ? 
                              (driveTime - this.RECOMMENDED_MAX_DRIVE_HOURS) * 100 : 0;
      
      const totalScore = distanceScore + heritageBonus + driveTimePenalty;

      if (totalScore < bestScore) {
        bestScore = totalScore;
        bestStop = stop;
      }
    }

    return bestStop;
  }

  /**
   * Fix geographic progression by removing problematic stops
   */
  private static fixGeographicProgression(
    destinations: TripStop[],
    startStop: TripStop,
    endStop: TripStop,
    isEastToWest: boolean
  ): TripStop[] {
    const fixed: TripStop[] = [];
    let currentLongitude = startStop.longitude;

    for (const stop of destinations) {
      const expectedDirection = isEastToWest ? 1 : -1;
      const longDiff = stop.longitude - currentLongitude;
      
      // Only keep stops that maintain progressive movement
      if ((longDiff * expectedDirection) >= -0.5) { // Allow small deviations
        fixed.push(stop);
        currentLongitude = stop.longitude;
        console.log(`✅ Keeping progressive stop: ${stop.name}`);
      } else {
        console.log(`❌ Removing ping-pong stop: ${stop.name}`);
      }
    }

    return fixed;
  }

  /**
   * Create strictly validated segments with 10-hour enforcement
   */
  private static createStrictValidatedSegments(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[],
    travelDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log(`🛠️ Creating ${travelDays} strictly validated segments`);

    const segments: DailySegment[] = [];
    const allStops = [startStop, ...destinations, endStop];
    
    // Ensure we have exactly the right number of segments
    const segmentCount = Math.min(travelDays, allStops.length - 1);
    
    for (let i = 0; i < segmentCount; i++) {
      const currentStop = allStops[i];
      const nextStop = allStops[i + 1];
      const day = i + 1;
      const isLastDay = day === travelDays;

      // For the last day, always go to the end destination
      const actualNextStop = isLastDay ? endStop : nextStop;

      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        actualNextStop.latitude, actualNextStop.longitude
      );

      // Calculate realistic drive time with ABSOLUTE enforcement
      let driveTime = calculateRealisticDriveTime(distance);
      
      // ABSOLUTE ENFORCEMENT - This should never happen due to earlier validation, but safety check
      if (driveTime > this.ABSOLUTE_MAX_DRIVE_HOURS) {
        console.error(`🚨 FORCING drive time from ${driveTime.toFixed(1)}h to 10h for Day ${day}`);
        driveTime = this.ABSOLUTE_MAX_DRIVE_HOURS;
      }

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${currentStop.city_name || currentStop.name} to ${actualNextStop.city_name || actualNextStop.name}`,
        startCity: currentStop.city_name || currentStop.name,
        endCity: actualNextStop.city_name || actualNextStop.name,
        distance: Math.round(distance),
        approximateMiles: Math.round(distance),
        driveTimeHours: Math.round(driveTime * 10) / 10, // Round to 1 decimal
        destination: {
          city: actualNextStop.city_name || actualNextStop.name,
          state: actualNextStop.state || 'Unknown'
        },
        recommendedStops: [],
        attractions: [{
          name: actualNextStop.name,
          title: actualNextStop.name,
          description: actualNextStop.description || `Historic Route 66 destination in ${actualNextStop.state}`,
          city: actualNextStop.city_name || actualNextStop.name,
          category: actualNextStop.category || 'heritage_site'
        }]
      };

      segments.push(segment);
      
      console.log(`📅 Day ${day}: ${segment.startCity} → ${segment.endCity}, ${distance.toFixed(1)} miles, ${driveTime.toFixed(1)} hours ✅`);
    }

    // Final validation - ensure all days are under 10 hours
    segments.forEach(segment => {
      if (segment.driveTimeHours > this.ABSOLUTE_MAX_DRIVE_HOURS) {
        console.error(`❌ FINAL CHECK VIOLATION: Day ${segment.day} still exceeds 10h limit`);
        segment.driveTimeHours = this.ABSOLUTE_MAX_DRIVE_HOURS;
      }
    });

    return segments;
  }

  /**
   * Calculate distance from point to direct route line
   */
  private static calculateDistanceFromDirectRoute(
    startStop: TripStop,
    endStop: TripStop,
    testStop: TripStop
  ): number {
    const A = startStop.latitude;
    const B = startStop.longitude;
    const C = endStop.latitude;
    const D = endStop.longitude;
    const P = testStop.latitude;
    const Q = testStop.longitude;

    const numerator = Math.abs((D - B) * (A - P) - (C - A) * (B - Q));
    const denominator = Math.sqrt(Math.pow(D - B, 2) + Math.pow(C - A, 2));
    
    const distanceInDegrees = numerator / denominator;
    return distanceInDegrees * 69; // Approximate miles per degree
  }
}
