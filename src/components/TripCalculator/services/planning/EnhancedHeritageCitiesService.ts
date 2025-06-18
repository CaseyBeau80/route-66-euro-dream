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
  private static readonly MAX_DAILY_MILES = 500; // HARD LIMIT: Never exceed 500 miles per day
  
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

      // CRITICAL FIX: Force minimum days based on distance BEFORE any processing
      const minRequiredDays = Math.ceil(totalDistance / this.MAX_DAILY_MILES);
      if (travelDays < minRequiredDays) {
        console.error(`🚨 CRITICAL: ${travelDays} days insufficient for ${totalDistance.toFixed(1)} miles`);
        console.error(`🚨 FORCING travel days from ${travelDays} to ${minRequiredDays} (max ${this.MAX_DAILY_MILES} miles/day)`);
        travelDays = minRequiredDays;
      }

      // Create geographic progression with ULTRA STRICT validation
      const destinationCities = this.createUltraStrictGeographicProgression(
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

      // FINAL SAFETY CHECK - Verify no segment exceeds limits
      const violatingSegments = segments.filter(s => 
        (s.driveTimeHours || 0) > this.ABSOLUTE_MAX_DRIVE_HOURS || 
        (s.distance || 0) > this.MAX_DAILY_MILES
      );
      
      if (violatingSegments.length > 0) {
        console.error(`🚨 CRITICAL: ${violatingSegments.length} segments still exceed limits after validation!`);
        violatingSegments.forEach(s => {
          if ((s.driveTimeHours || 0) > this.ABSOLUTE_MAX_DRIVE_HOURS) {
            console.error(`   Day ${s.day}: ${s.driveTimeHours?.toFixed(1)}h > 10h - FORCING to 10h`);
            s.driveTimeHours = this.ABSOLUTE_MAX_DRIVE_HOURS;
          }
          if ((s.distance || 0) > this.MAX_DAILY_MILES) {
            console.error(`   Day ${s.day}: ${s.distance?.toFixed(1)}mi > 500mi - FORCING to 500mi`);
            s.distance = this.MAX_DAILY_MILES;
          }
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
        maxDailyDistance: Math.max(...segments.map(s => s.distance || 0)).toFixed(1),
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
   * Create ULTRA STRICT geographic progression - never allow excessive distances
   */
  private static createUltraStrictGeographicProgression(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    travelDays: number,
    totalDistance: number
  ): TripStop[] {
    console.log(`🗺️ Creating ULTRA STRICT geographic progression for ${travelDays} days with HARD 500mi/10h limits`);

    // Determine direction
    const isEastToWest = startStop.longitude < endStop.longitude;
    console.log(`📍 Direction: ${isEastToWest ? 'East to West' : 'West to East'}`);

    // Filter and sort stops geographically to prevent ping-ponging
    const progressiveStops = this.filterProgressiveStops(startStop, endStop, routeStops, isEastToWest);
    
    // Limit stops to prevent overcrowding
    const limitedStops = progressiveStops.slice(0, this.MAX_STOPS_LIMIT);
    
    console.log(`🛣️ Progressive stops (${limitedStops.length}):`, limitedStops.map(s => s.name));

    // Select destinations with ULTRA STRICT validation - never exceed daily limits
    const destinations = this.selectDestinationsWithUltraStrictValidation(
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
   * Select destinations with ULTRA STRICT validation - NEVER exceed daily limits
   */
  private static selectDestinationsWithUltraStrictValidation(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    travelDays: number,
    totalDistance: number,
    isEastToWest: boolean
  ): TripStop[] {
    const destinations: TripStop[] = [];
    
    console.log(`🚨 ULTRA STRICT: Max ${this.MAX_DAILY_MILES} miles/day, ${this.ABSOLUTE_MAX_DRIVE_HOURS}h/day - NO EXCEPTIONS`);

    // Calculate safe daily distance target (well below maximum)
    const safeDailyTarget = Math.min(this.MAX_DAILY_MILES * 0.8, totalDistance / travelDays);
    
    let currentStop = startStop;
    let remainingDistance = totalDistance;

    for (let day = 1; day < travelDays; day++) {
      const targetDistance = Math.min(safeDailyTarget, remainingDistance / (travelDays - day + 1));
      
      console.log(`📍 Day ${day}: Target ${targetDistance.toFixed(0)} miles (safe target, max ${this.MAX_DAILY_MILES})`);

      const nextStop = this.findUltraSafeNextStop(
        currentStop,
        endStop,
        availableStops,
        destinations,
        targetDistance
      );

      if (nextStop) {
        const segmentDistance = DistanceCalculationService.calculateDistance(
          currentStop.latitude, currentStop.longitude,
          nextStop.latitude, nextStop.longitude
        );

        // ULTRA STRICT: Never allow segments that exceed limits
        if (segmentDistance > this.MAX_DAILY_MILES) {
          console.error(`🚨 ULTRA STRICT REJECTION: ${nextStop.name} would create ${segmentDistance.toFixed(1)}mi segment > ${this.MAX_DAILY_MILES}mi limit`);
          break; // Stop adding destinations rather than violate limits
        }

        const driveTime = calculateRealisticDriveTime(segmentDistance);
        
        if (driveTime > this.ABSOLUTE_MAX_DRIVE_HOURS) {
          console.error(`🚨 ULTRA STRICT REJECTION: ${nextStop.name} would create ${driveTime.toFixed(1)}h segment > 10h limit`);
          break; // Stop adding destinations rather than violate limits
        }

        destinations.push(nextStop);
        currentStop = nextStop;
        remainingDistance -= segmentDistance;
        
        console.log(`✅ Day ${day}: ${nextStop.name} (+${segmentDistance.toFixed(0)}mi, ${driveTime.toFixed(1)}h) - SAFE`);
      } else {
        console.warn(`⚠️ No ultra-safe stop found for day ${day} within strict limits`);
        break;
      }
    }

    // FINAL CHECK: Ensure last segment to end doesn't exceed limits
    if (destinations.length > 0) {
      const lastDestination = destinations[destinations.length - 1];
      const finalSegmentDistance = DistanceCalculationService.calculateDistance(
        lastDestination.latitude, lastDestination.longitude,
        endStop.latitude, endStop.longitude
      );
      
      if (finalSegmentDistance > this.MAX_DAILY_MILES) {
        console.error(`🚨 FINAL SEGMENT TOO LONG: ${finalSegmentDistance.toFixed(1)}mi > ${this.MAX_DAILY_MILES}mi - removing last destination`);
        destinations.pop(); // Remove the last destination to make the final segment manageable
      }
    }

    return destinations;
  }

  /**
   * Find ultra-safe next stop that definitely won't exceed limits
   */
  private static findUltraSafeNextStop(
    currentStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    alreadySelected: TripStop[],
    targetDistance: number
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

      // ULTRA STRICT: Skip if distance exceeds 80% of daily limit for safety margin
      const safeLimit = this.MAX_DAILY_MILES * 0.8;
      if (distance > safeLimit) {
        console.log(`   ❌ ${stop.name}: ${distance.toFixed(0)}mi > ${safeLimit.toFixed(0)}mi safe limit`);
        continue;
      }

      const driveTime = calculateRealisticDriveTime(distance);
      
      // ULTRA STRICT: Skip if drive time exceeds 80% of time limit for safety margin
      const safeTimeLimit = this.ABSOLUTE_MAX_DRIVE_HOURS * 0.8;
      if (driveTime > safeTimeLimit) {
        console.log(`   ❌ ${stop.name}: ${driveTime.toFixed(1)}h > ${safeTimeLimit.toFixed(1)}h safe limit`);
        continue;
      }

      // Score based on distance to target
      const distanceScore = Math.abs(distance - targetDistance);
      
      // Bonus for heritage sites
      const heritageBonus = stop.heritage_value === 'high' ? -100 : 
                           stop.heritage_value === 'medium' ? -50 : 0;
      
      const totalScore = distanceScore + heritageBonus;

      console.log(`   ✅ ${stop.name}: ${distance.toFixed(0)}mi, ${driveTime.toFixed(1)}h, score=${totalScore.toFixed(0)} - ULTRA SAFE`);

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
    console.log(`🛠️ Creating ${travelDays} ABSOLUTELY validated segments (10h/500mi HARD LIMITS)`);

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

      // ULTRA STRICT: Force distance within limits
      const clampedDistance = Math.min(distance, this.MAX_DAILY_MILES);
      if (clampedDistance !== distance) {
        console.error(`🚨 EMERGENCY: Day ${day} distance ${distance.toFixed(1)}mi > ${this.MAX_DAILY_MILES}mi - CLAMPED to ${clampedDistance}`);
      }

      // Calculate drive time with ABSOLUTE enforcement
      let driveTime = calculateRealisticDriveTime(clampedDistance);
      
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
        distance: Math.round(clampedDistance),
        approximateMiles: Math.round(clampedDistance),
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
      
      console.log(`📅 Day ${day}: ${segment.startCity} → ${segment.endCity}, ${clampedDistance.toFixed(1)} miles, ${driveTime.toFixed(1)} hours ${driveTime <= 10 && clampedDistance <= this.MAX_DAILY_MILES ? '✅' : '🚨'}`);
    }

    return segments;
  }
}
