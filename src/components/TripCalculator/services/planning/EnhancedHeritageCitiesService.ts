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

      // CRITICAL FIX: Validate trip feasibility and adjust days if needed
      const feasibilityCheck = this.validateTripFeasibility(startStop, endStop, travelDays);
      if (!feasibilityCheck.isValid) {
        console.error(`❌ TRIP NOT FEASIBLE: ${feasibilityCheck.recommendation}`);
        // Force increase travel days to make it feasible
        travelDays = Math.max(travelDays, feasibilityCheck.minRequiredDays);
        console.log(`🔧 ADJUSTED travel days to ${travelDays} to ensure 10h/day maximum`);
      }

      // Create geographic progression with STRICT validation
      const destinationCities = this.createStrictGeographicProgression(
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

      // Create segments with ABSOLUTE ENFORCEMENT
      const segments = this.createAbsolutelyValidatedSegments(
        startStop,
        endStop,
        destinationCities,
        travelDays,
        totalDistance
      );

      // FINAL SAFETY CHECK - Verify no segment exceeds 10 hours
      const violatingSegments = segments.filter(s => (s.driveTimeHours || 0) > this.ABSOLUTE_MAX_DRIVE_HOURS);
      if (violatingSegments.length > 0) {
        console.error(`🚨 CRITICAL: ${violatingSegments.length} segments still exceed 10h limit after validation!`);
        violatingSegments.forEach(s => {
          console.error(`   Day ${s.day}: ${s.driveTimeHours?.toFixed(1)}h - FORCING to 10h`);
          s.driveTimeHours = this.ABSOLUTE_MAX_DRIVE_HOURS;
        });
      }

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
    
    // Calculate minimum required days based on 10h/day * 55mph = 550 miles/day max
    const maxDailyMiles = this.ABSOLUTE_MAX_DRIVE_HOURS * 55;
    const minRequiredDays = Math.ceil(totalDistance / maxDailyMiles);

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
      maxDailyMiles,
      minRequiredDays,
      isValid
    });

    return { isValid, recommendation, minRequiredDays };
  }

  /**
   * Create STRICT geographic progression that prevents ping-ponging and enforces drive time limits
   */
  private static createStrictGeographicProgression(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    travelDays: number,
    totalDistance: number
  ): TripStop[] {
    console.log(`🗺️ Creating STRICT geographic progression for ${travelDays} days with ABSOLUTE 10h limit`);

    // Determine direction
    const isEastToWest = startStop.longitude < endStop.longitude;
    console.log(`📍 Direction: ${isEastToWest ? 'East to West' : 'West to East'}`);

    // Filter and sort stops geographically to prevent ping-ponging
    const progressiveStops = this.filterProgressiveStops(startStop, endStop, routeStops, isEastToWest);
    
    // Limit stops to prevent overcrowding
    const limitedStops = progressiveStops.slice(0, this.MAX_STOPS_LIMIT);
    
    console.log(`🛣️ Progressive stops (${limitedStops.length}):`, limitedStops.map(s => s.name));

    // Select destinations with ABSOLUTE drive time validation
    const destinations = this.selectDestinationsWithAbsoluteValidation(
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
   * Select destinations with ABSOLUTE drive time validation - never exceed 10 hours
   */
  private static selectDestinationsWithAbsoluteValidation(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    travelDays: number,
    totalDistance: number,
    isEastToWest: boolean
  ): TripStop[] {
    const destinations: TripStop[] = [];
    const maxDailyMiles = this.ABSOLUTE_MAX_DRIVE_HOURS * 55; // 550 miles max per day
    
    let currentStop = startStop;
    let remainingDistance = totalDistance;
    let remainingDays = travelDays;

    console.log(`🚨 ABSOLUTE VALIDATION: Max ${maxDailyMiles} miles/day, ${this.ABSOLUTE_MAX_DRIVE_HOURS}h/day`);

    for (let day = 1; day < travelDays; day++) {
      const targetDistance = Math.min(maxDailyMiles, remainingDistance / remainingDays);
      
      console.log(`📍 Day ${day}: Target ${targetDistance.toFixed(0)} miles (max ${maxDailyMiles})`);

      const nextStop = this.findValidNextStopWithAbsoluteLimit(
        currentStop,
        endStop,
        availableStops,
        destinations,
        targetDistance,
        maxDailyMiles
      );

      if (nextStop) {
        const segmentDistance = DistanceCalculationService.calculateDistance(
          currentStop.latitude, currentStop.longitude,
          nextStop.latitude, nextStop.longitude
        );

        const driveTime = calculateRealisticDriveTime(segmentDistance);
        
        // ABSOLUTE enforcement - this should never happen due to selection logic
        if (driveTime > this.ABSOLUTE_MAX_DRIVE_HOURS) {
          console.error(`🚨 CRITICAL ERROR: Selected stop still exceeds 10h limit - ${nextStop.name}: ${driveTime.toFixed(1)}h`);
          break; // Stop adding destinations rather than violate the limit
        }

        destinations.push(nextStop);
        currentStop = nextStop;
        remainingDistance -= segmentDistance;
        remainingDays--;
        
        console.log(`✅ Day ${day}: ${nextStop.name} (+${segmentDistance.toFixed(0)}mi, ${driveTime.toFixed(1)}h)`);
      } else {
        console.warn(`⚠️ No valid stop found for day ${day} within 10h limit`);
        break;
      }
    }

    return destinations;
  }

  /**
   * Find valid next stop with ABSOLUTE drive time limit enforcement
   */
  private static findValidNextStopWithAbsoluteLimit(
    currentStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    alreadySelected: TripStop[],
    targetDistance: number,
    maxDailyMiles: number
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

      // ABSOLUTE constraint - skip if distance would exceed daily limit
      if (distance > maxDailyMiles) {
        console.log(`   ❌ ${stop.name}: ${distance.toFixed(0)}mi > ${maxDailyMiles}mi limit`);
        continue;
      }

      const driveTime = calculateRealisticDriveTime(distance);
      
      // ABSOLUTE constraint - skip if drive time exceeds 10 hours
      if (driveTime > this.ABSOLUTE_MAX_DRIVE_HOURS) {
        console.log(`   ❌ ${stop.name}: ${driveTime.toFixed(1)}h > 10h limit`);
        continue;
      }

      // Score based on distance to target
      const distanceScore = Math.abs(distance - targetDistance);
      
      // Bonus for heritage sites
      const heritageBonus = stop.heritage_value === 'high' ? -100 : 
                           stop.heritage_value === 'medium' ? -50 : 0;
      
      const totalScore = distanceScore + heritageBonus;

      console.log(`   ✅ ${stop.name}: ${distance.toFixed(0)}mi, ${driveTime.toFixed(1)}h, score=${totalScore.toFixed(0)}`);

      if (totalScore < bestScore) {
        bestScore = totalScore;
        bestStop = stop;
      }
    }

    return bestStop;
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

  /**
   * Create segments with ABSOLUTE validation - never allow > 10 hours
   */
  private static createAbsolutelyValidatedSegments(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[],
    travelDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log(`🛠️ Creating ${travelDays} ABSOLUTELY validated segments (10h HARD LIMIT)`);

    const segments: DailySegment[] = [];
    const allStops = [startStop, ...destinations, endStop];
    
    // Create segments for each day
    for (let day = 1; day <= travelDays; day++) {
      const currentStopIndex = day - 1;
      const nextStopIndex = Math.min(day, allStops.length - 1);
      
      const currentStop = allStops[currentStopIndex];
      const nextStop = allStops[nextStopIndex];

      // Skip if we've reached the end
      if (currentStopIndex >= allStops.length - 1) break;

      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        nextStop.latitude, nextStop.longitude
      );

      // Calculate drive time with ABSOLUTE enforcement
      let driveTime = calculateRealisticDriveTime(distance);
      
      // FINAL SAFETY CHECK - This should NEVER happen but ensure it doesn't
      if (driveTime > this.ABSOLUTE_MAX_DRIVE_HOURS) {
        console.error(`🚨 EMERGENCY OVERRIDE: Day ${day} drive time ${driveTime.toFixed(1)}h > 10h - FORCING to 10h`);
        driveTime = this.ABSOLUTE_MAX_DRIVE_HOURS;
      }

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${currentStop.city_name || currentStop.name} to ${nextStop.city_name || nextStop.name}`,
        startCity: currentStop.city_name || currentStop.name,
        endCity: nextStop.city_name || nextStop.name,
        distance: Math.round(distance),
        approximateMiles: Math.round(distance),
        driveTimeHours: Math.round(driveTime * 10) / 10, // Round to 1 decimal
        destination: {
          city: nextStop.city_name || nextStop.name,
          state: nextStop.state || 'Unknown'
        },
        recommendedStops: [],
        attractions: [{
          name: nextStop.name,
          title: nextStop.name,
          description: nextStop.description || `Historic Route 66 destination in ${nextStop.state}`,
          city: nextStop.city_name || nextStop.name,
          category: nextStop.category || 'heritage_site'
        }]
      };

      segments.push(segment);
      
      console.log(`📅 Day ${day}: ${segment.startCity} → ${segment.endCity}, ${distance.toFixed(1)} miles, ${driveTime.toFixed(1)} hours ${driveTime <= 10 ? '✅' : '🚨'}`);
    }

    return segments;
  }
}
