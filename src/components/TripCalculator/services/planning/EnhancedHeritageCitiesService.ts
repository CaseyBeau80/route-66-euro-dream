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
   * Plan Heritage Cities trip with strict geographic and time constraints - NO WAYPOINTS
   */
  static async planEnhancedHeritageCitiesTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`🏛️ ENHANCED Heritage Cities Planning (NO WAYPOINTS): ${startLocation} → ${endLocation}, ${travelDays} days`);

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

      // Create geographic progression with ULTRA STRICT validation - NO WAYPOINTS
      const destinationCities = this.selectRealDestinationsOnly(
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

      // Create segments with REAL destinations only - NO WAYPOINTS
      const segments = this.createRealDestinationSegments(
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

      console.log(`✅ Enhanced Heritage trip complete (NO WAYPOINTS):`, {
        segments: segments.length,
        totalDistance: actualTotalDistance.toFixed(1),
        totalDrivingTime: totalDrivingTime.toFixed(1),
        maxDailyDriveTime: Math.max(...segments.map(s => s.driveTimeHours || 0)).toFixed(1),
        maxDailyDistance: Math.max(...segments.map(s => s.distance || 0)).toFixed(1),
        stopsLimited,
        realDestinationsOnly: true
      });

      return tripPlan;

    } catch (error) {
      console.error('❌ Enhanced Heritage Cities planning failed:', error);
      throw new Error(`Enhanced Heritage Cities planning failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Select REAL destinations only - NO virtual waypoints
   */
  private static selectRealDestinationsOnly(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    travelDays: number,
    totalDistance: number
  ): TripStop[] {
    console.log(`🗺️ REAL DESTINATIONS ONLY: Selecting from ${routeStops.length} real stops for ${travelDays} days`);

    // Determine direction
    const isEastToWest = startStop.longitude < endStop.longitude;
    console.log(`📍 Direction: ${isEastToWest ? 'East to West' : 'West to East'}`);

    // Filter and sort stops geographically to prevent ping-ponging
    const progressiveStops = this.filterProgressiveStops(startStop, endStop, routeStops, isEastToWest);
    
    // Limit stops to prevent overcrowding
    const limitedStops = progressiveStops.slice(0, this.MAX_STOPS_LIMIT);
    
    console.log(`🛣️ Progressive real stops (${limitedStops.length}):`, limitedStops.map(s => s.name));

    // Select up to (travelDays - 1) destinations with ULTRA STRICT validation
    const maxDestinations = Math.min(travelDays - 1, limitedStops.length);
    const destinations: TripStop[] = [];
    
    console.log(`🚨 REAL ONLY: Max ${this.MAX_DAILY_MILES} miles/day, ${this.ABSOLUTE_MAX_DRIVE_HOURS}h/day - selecting ${maxDestinations} real destinations`);

    let currentStop = startStop;
    const remainingStops = [...limitedStops];

    for (let i = 0; i < maxDestinations && remainingStops.length > 0; i++) {
      const targetDistance = totalDistance / travelDays; // Even distribution target
      
      const nextStop = this.findBestRealDestination(
        currentStop,
        endStop,
        remainingStops,
        targetDistance
      );

      if (nextStop) {
        const segmentDistance = DistanceCalculationService.calculateDistance(
          currentStop.latitude, currentStop.longitude,
          nextStop.latitude, nextStop.longitude
        );

        // ULTRA STRICT: Never allow segments that exceed limits
        if (segmentDistance > this.MAX_DAILY_MILES) {
          console.error(`🚨 REAL DESTINATION REJECTION: ${nextStop.name} would create ${segmentDistance.toFixed(1)}mi segment > ${this.MAX_DAILY_MILES}mi limit`);
          // Remove this stop and continue
          const stopIndex = remainingStops.findIndex(s => s.id === nextStop.id);
          if (stopIndex >= 0) remainingStops.splice(stopIndex, 1);
          continue;
        }

        const driveTime = calculateRealisticDriveTime(segmentDistance);
        
        if (driveTime > this.ABSOLUTE_MAX_DRIVE_HOURS) {
          console.error(`🚨 REAL DESTINATION REJECTION: ${nextStop.name} would create ${driveTime.toFixed(1)}h segment > 10h limit`);
          // Remove this stop and continue
          const stopIndex = remainingStops.findIndex(s => s.id === nextStop.id);
          if (stopIndex >= 0) remainingStops.splice(stopIndex, 1);
          continue;
        }

        destinations.push(nextStop);
        currentStop = nextStop;
        
        // Remove selected stop from remaining options
        const stopIndex = remainingStops.findIndex(s => s.id === nextStop.id);
        if (stopIndex >= 0) remainingStops.splice(stopIndex, 1);
        
        console.log(`✅ Real destination ${i + 1}: ${nextStop.name} (+${segmentDistance.toFixed(0)}mi, ${driveTime.toFixed(1)}h) - APPROVED`);
      } else {
        console.warn(`⚠️ No suitable real destination found for slot ${i + 1}`);
        break;
      }
    }

    console.log(`🏁 Selected ${destinations.length} real destinations (no waypoints)`);
    return destinations;
  }

  /**
   * Find the best real destination that meets constraints
   */
  private static findBestRealDestination(
    currentStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    targetDistance: number
  ): TripStop | null {
    if (availableStops.length === 0) return null;

    let bestStop: TripStop | null = null;
    let bestScore = Infinity;

    for (const stop of availableStops) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      // Skip if distance exceeds safe limit
      const safeLimit = this.MAX_DAILY_MILES * 0.9; // 90% of max for safety
      if (distance > safeLimit) {
        continue;
      }

      const driveTime = calculateRealisticDriveTime(distance);
      
      // Skip if drive time exceeds safe limit
      const safeTimeLimit = this.ABSOLUTE_MAX_DRIVE_HOURS * 0.9; // 90% of max for safety
      if (driveTime > safeTimeLimit) {
        continue;
      }

      // Score based on distance to target and heritage value
      const distanceScore = Math.abs(distance - targetDistance);
      const heritageBonus = stop.heritage_value === 'high' ? -100 : 
                           stop.heritage_value === 'medium' ? -50 : 0;
      
      const totalScore = distanceScore + heritageBonus;

      if (totalScore < bestScore) {
        bestScore = totalScore;
        bestStop = stop;
      }
    }

    return bestStop;
  }

  /**
   * Create segments using REAL destinations only - NO waypoints
   */
  private static createRealDestinationSegments(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[],
    totalDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log(`🛠️ Creating ${totalDays} segments with REAL destinations only (10h/500mi HARD LIMITS)`);

    const segments: DailySegment[] = [];
    const allStops = [startStop, ...destinations, endStop];
    
    // If we have fewer stops than days, we need to distribute the journey differently
    if (allStops.length <= totalDays) {
      // Each stop becomes a day's destination
      for (let day = 1; day <= totalDays && day < allStops.length; day++) {
        const currentStop = allStops[day - 1];
        const nextStop = allStops[day];

        const distance = DistanceCalculationService.calculateDistance(
          currentStop.latitude, currentStop.longitude,
          nextStop.latitude, nextStop.longitude
        );

        // Force distance within limits
        const clampedDistance = Math.min(distance, this.MAX_DAILY_MILES);
        let driveTime = calculateRealisticDriveTime(clampedDistance);
        
        // Force drive time within limits
        if (driveTime > this.ABSOLUTE_MAX_DRIVE_HOURS) {
          console.error(`🚨 EMERGENCY: Day ${day} drive time ${driveTime.toFixed(1)}h > 10h - FORCING to 10h`);
          driveTime = this.ABSOLUTE_MAX_DRIVE_HOURS;
        }

        const segment: DailySegment = {
          day,
          title: `Day ${day}: ${currentStop.city_name || currentStop.name} to ${nextStop.city_name || nextStop.name}`,
          startCity: currentStop.city_name || currentStop.name,
          endCity: nextStop.city_name || nextStop.name,
          distance: Math.round(clampedDistance),
          approximateMiles: Math.round(clampedDistance),
          driveTimeHours: Math.round(driveTime * 10) / 10,
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
        
        console.log(`📅 Day ${day}: ${segment.startCity} → ${segment.endCity}, ${clampedDistance.toFixed(1)} miles, ${driveTime.toFixed(1)} hours ✅`);
      }
    } else {
      // More stops than days - need to group some stops
      const stopsPerDay = Math.ceil(allStops.length / totalDays);
      
      for (let day = 1; day <= totalDays; day++) {
        const startIndex = (day - 1) * stopsPerDay;
        const endIndex = Math.min(day * stopsPerDay, allStops.length - 1);
        
        if (startIndex >= allStops.length - 1) break;
        
        const currentStop = allStops[startIndex];
        const nextStop = allStops[endIndex];

        const distance = DistanceCalculationService.calculateDistance(
          currentStop.latitude, currentStop.longitude,
          nextStop.latitude, nextStop.longitude
        );

        const clampedDistance = Math.min(distance, this.MAX_DAILY_MILES);
        let driveTime = calculateRealisticDriveTime(clampedDistance);
        
        if (driveTime > this.ABSOLUTE_MAX_DRIVE_HOURS) {
          driveTime = this.ABSOLUTE_MAX_DRIVE_HOURS;
        }

        const segment: DailySegment = {
          day,
          title: `Day ${day}: ${currentStop.city_name || currentStop.name} to ${nextStop.city_name || nextStop.name}`,
          startCity: currentStop.city_name || currentStop.name,
          endCity: nextStop.city_name || nextStop.name,
          distance: Math.round(clampedDistance),
          approximateMiles: Math.round(clampedDistance),
          driveTimeHours: Math.round(driveTime * 10) / 10,
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
      }
    }

    return segments;
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
}
