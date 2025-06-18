import { TripStop } from '../../types/TripStop';
import { TripPlan, DailySegment } from './TripPlanTypes';
import { CityDisplayService } from '../utils/CityDisplayService';
import { Route66SequenceEnforcer } from './Route66SequenceEnforcer';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';

export class EvenPacingPlanningService {
  private static readonly TARGET_DRIVE_TIME = 5.5; // 5.5 hours target for even pacing
  private static readonly MAX_DRIVE_TIME = 8; // Maximum for even pacing
  private static readonly MIN_DRIVE_TIME = 3; // Minimum for even pacing

  static async planEvenPacingTrip(
    startCityName: string,
    endCityName: string,
    tripDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`⚖️ EVEN PACING PLANNING: ${startCityName} to ${endCityName} in ${tripDays} days`);
    
    // Use enhanced city finding
    const startStop = CityDisplayService.findCityInStops(startCityName, allStops);
    const endStop = CityDisplayService.findCityInStops(endCityName, allStops);
    
    if (!startStop || !endStop) {
      throw new Error(`Could not find start (${startCityName}) or end (${endCityName}) locations`);
    }

    console.log(`✅ FOUND: ${startStop.name} → ${endStop.name}`);

    // EMERGENCY CHECK: Validate the overall route isn't impossible
    const routeValidation = DriveTimeEnforcementService.validateAndFixSegmentDistance(
      startStop, endStop, this.MAX_DRIVE_TIME
    );

    if (routeValidation.needsSplitting && tripDays < routeValidation.recommendedSplits) {
      console.error(`🚨 EMERGENCY: Route needs ${routeValidation.recommendedSplits} days but only ${tripDays} requested!`);
      tripDays = Math.max(tripDays, routeValidation.recommendedSplits);
      console.log(`🔧 EMERGENCY FIX: Adjusting to ${tripDays} days to prevent impossible drives`);
    }

    // Calculate total distance and target daily distance
    const totalDistance = this.calculateTotalDistance(startStop, endStop);
    const targetDailyDistance = totalDistance / tripDays;
    
    console.log(`📏 Total distance: ${totalDistance.toFixed(0)}mi, Target daily: ${targetDailyDistance.toFixed(0)}mi`);

    // EMERGENCY CHECK: If target daily distance is too high, increase days
    if (targetDailyDistance > 400) {
      const newDays = Math.ceil(totalDistance / 350); // Max 350 miles per day
      console.error(`🚨 EMERGENCY: Target daily distance ${targetDailyDistance.toFixed(0)}mi too high!`);
      console.log(`🔧 EMERGENCY FIX: Increasing from ${tripDays} to ${newDays} days`);
      tripDays = newDays;
    }

    // Include ALL stops for variety (not just major destinations)
    const allValidStops = allStops.filter(stop => 
      stop.latitude && stop.longitude && stop.id !== startStop.id && stop.id !== endStop.id
    );

    // Enforce Route 66 sequence
    const sequenceResult = Route66SequenceEnforcer.enforceSequenceDirection(
      startStop, endStop, allValidStops
    );

    if (!sequenceResult.isValidRoute) {
      throw new Error('Invalid Route 66 sequence');
    }

    // 🔧 NEW: Use sequential destination selection instead of greedy scoring
    const intermediateDestinations = Route66SequenceEnforcer.selectSequentialDestinations(
      startStop, endStop, sequenceResult.validStops, tripDays - 1
    );

    console.log(`🎯 SEQUENTIAL SELECTION: Selected ${intermediateDestinations.length} destinations in proper Route 66 order`);

    // Build segments with EMERGENCY validation and sequential flow
    const segments = this.buildSequentialSegments(
      startStop, endStop, intermediateDestinations, tripDays
    );

    const totalDrivingTime = segments.reduce((total, seg) => total + seg.driveTimeHours, 0);

    return this.createTripPlan(
      startCityName,
      endCityName,
      tripDays,
      segments,
      totalDistance,
      totalDrivingTime
    );
  }

  /**
   * 🔧 NEW: Build segments with sequential flow validation
   */
  private static buildSequentialSegments(
    startStop: TripStop,
    endStop: TripStop,
    intermediateDestinations: TripStop[],
    tripDays: number
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    const allStops = [startStop, ...intermediateDestinations, endStop];
    
    console.log(`🏗️ BUILDING SEQUENTIAL SEGMENTS: ${allStops.length} stops for ${tripDays} days`);

    for (let i = 0; i < allStops.length - 1; i++) {
      const currentStop = allStops[i];
      const nextStop = allStops[i + 1];
      const day = i + 1;

      const distance = this.calculateTotalDistance(currentStop, nextStop);
      
      // EMERGENCY VALIDATION: Check if this segment is realistic
      const validation = DriveTimeEnforcementService.validateAndFixSegmentDistance(
        currentStop, nextStop, this.MAX_DRIVE_TIME
      );
      
      if (!validation.isValid) {
        console.error(`🚨 EMERGENCY: Day ${day} segment is invalid! ${validation.actualDistance.toFixed(0)}mi, ${validation.actualDriveTime.toFixed(1)}h`);
        // NOTE: With sequential selection, this should be much less likely to occur
      }
      
      // Use the emergency-validated drive time
      const driveTimeHours = validation.actualDriveTime;

      console.log(`⚖️ Day ${day}: ${currentStop.name} → ${nextStop.name} = ${distance.toFixed(0)}mi, ${driveTimeHours.toFixed(1)}h (sequential flow)`);

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${CityDisplayService.getCityDisplayName(currentStop)} to ${CityDisplayService.getCityDisplayName(nextStop)}`,
        startCity: CityDisplayService.getCityDisplayName(currentStop),
        endCity: CityDisplayService.getCityDisplayName(nextStop),
        distance,
        driveTimeHours,
        drivingTime: driveTimeHours,
        approximateMiles: Math.round(distance),
        destination: {
          city: nextStop.city_name || nextStop.name,
          state: nextStop.state
        },
        recommendedStops: [{
          stopId: nextStop.id,
          id: nextStop.id,
          name: nextStop.name,
          description: nextStop.description || `Visit ${nextStop.name}`,
          latitude: nextStop.latitude,
          longitude: nextStop.longitude,
          category: nextStop.category,
          city_name: nextStop.city_name,
          state: nextStop.state,
          city: nextStop.city || nextStop.city_name || nextStop.name
        }],
        attractions: [],
        notes: `Day ${day}: Sequential Route 66 drive from ${currentStop.name} to ${nextStop.name}${validation.needsSplitting ? ' (Distance optimized for realistic driving)' : ''}`,
        recommendations: validation.needsSplitting ? [`This segment was optimized to ensure realistic daily driving distances.`] : []
      };

      segments.push(segment);
    }

    return segments;
  }

  /**
   * Select destinations prioritizing even spacing and EMERGENCY validation
   */
  private static selectEvenPacingDestinations(
    startStop: TripStop,
    endStop: TripStop,
    validStops: TripStop[],
    neededDestinations: number,
    targetDailyDistance: number
  ): TripStop[] {
    console.log(`⚖️ SELECTING EVEN PACING: ${neededDestinations} destinations with ${targetDailyDistance.toFixed(0)}mi target`);
    
    if (validStops.length === 0) return [];

    const selectedDestinations: TripStop[] = [];
    let currentStop = startStop;
    
    for (let day = 1; day <= neededDestinations; day++) {
      const remainingDistance = this.calculateTotalDistance(currentStop, endStop);
      const remainingDays = neededDestinations - day + 1;
      const adjustedTargetDistance = remainingDistance / remainingDays;
      
      console.log(`⚖️ Day ${day + 1}: Looking for ~${adjustedTargetDistance.toFixed(0)}mi from ${currentStop.name}`);
      
      // EMERGENCY: Cap the target distance to prevent impossible segments
      const cappedTargetDistance = Math.min(adjustedTargetDistance, 400);
      
      // Score each available stop for even pacing with EMERGENCY checks
      const scoredStops = validStops
        .filter(stop => !selectedDestinations.some(selected => selected.id === stop.id))
        .map(stop => {
          const distance = this.calculateTotalDistance(currentStop, stop);
          
          // EMERGENCY CHECK: Skip stops that would create impossible drives
          const validation = DriveTimeEnforcementService.validateAndFixSegmentDistance(
            currentStop, stop, this.MAX_DRIVE_TIME
          );
          
          if (!validation.isValid) {
            console.log(`🚨 EMERGENCY: Skipping ${stop.name} - would create ${validation.actualDriveTime.toFixed(1)}h drive`);
            return { stop, distance, driveTime: validation.actualDriveTime, totalScore: -1 };
          }
          
          const driveTime = validation.actualDriveTime;
          
          // Score based on how close to target distance and ideal drive time
          const distanceScore = this.calculateDistanceScore(distance, cappedTargetDistance);
          const driveTimeScore = this.calculateDriveTimeScore(driveTime);
          const varietyScore = this.calculateVarietyScore(stop, selectedDestinations);
          
          const totalScore = (distanceScore * 0.5) + (driveTimeScore * 0.3) + (varietyScore * 0.2);
          
          return { stop, distance, driveTime, totalScore };
        })
        .filter(scored => scored.totalScore > 0) // Remove invalid stops
        .sort((a, b) => b.totalScore - a.totalScore);
      
      if (scoredStops.length > 0) {
        const bestStop = scoredStops[0];
        selectedDestinations.push(bestStop.stop);
        currentStop = bestStop.stop;
        
        console.log(`✅ Selected: ${bestStop.stop.name} (${bestStop.distance.toFixed(0)}mi, ${bestStop.driveTime.toFixed(1)}h, score: ${bestStop.totalScore.toFixed(1)})`);
      } else {
        console.error(`🚨 EMERGENCY: No valid destinations found for day ${day + 1}!`);
        break;
      }
    }
    
    return selectedDestinations;
  }

  /**
   * Calculate score based on distance from target (higher score = closer to target)
   */
  private static calculateDistanceScore(distance: number, targetDistance: number): number {
    const difference = Math.abs(distance - targetDistance);
    const tolerance = targetDistance * 0.3; // 30% tolerance
    return Math.max(0, 100 - (difference / tolerance) * 100);
  }

  /**
   * Calculate score based on drive time (prefers moderate drive times)
   */
  private static calculateDriveTimeScore(driveTime: number): number {
    if (driveTime >= this.MIN_DRIVE_TIME && driveTime <= this.TARGET_DRIVE_TIME) {
      return 100; // Perfect range
    } else if (driveTime <= this.MAX_DRIVE_TIME) {
      return 80; // Acceptable
    } else {
      return Math.max(0, 50 - (driveTime - this.MAX_DRIVE_TIME) * 10); // Penalty for too long
    }
  }

  /**
   * Calculate variety score (prefers different types of stops)
   */
  private static calculateVarietyScore(stop: TripStop, alreadySelected: TripStop[]): number {
    if (alreadySelected.length === 0) return 50; // Baseline for first selection
    
    const categories = alreadySelected.map(s => s.category);
    const hasCategory = categories.includes(stop.category);
    
    // Bonus for new categories, but don't penalize too much for repeats
    return hasCategory ? 30 : 70;
  }

  /**
   * Build segments with EMERGENCY validation
   */
  private static buildEvenPacingSegments(
    startStop: TripStop,
    endStop: TripStop,
    intermediateDestinations: TripStop[],
    tripDays: number
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    const allStops = [startStop, ...intermediateDestinations, endStop];
    
    console.log(`🏗️ BUILDING EVEN PACING SEGMENTS: ${allStops.length} stops for ${tripDays} days`);

    for (let i = 0; i < allStops.length - 1; i++) {
      const currentStop = allStops[i];
      const nextStop = allStops[i + 1];
      const day = i + 1;

      const distance = this.calculateTotalDistance(currentStop, nextStop);
      
      // EMERGENCY VALIDATION: Check if this segment is realistic
      const validation = DriveTimeEnforcementService.validateAndFixSegmentDistance(
        currentStop, nextStop, this.MAX_DRIVE_TIME
      );
      
      if (!validation.isValid) {
        console.error(`🚨 EMERGENCY: Day ${day} segment is invalid! ${validation.actualDistance.toFixed(0)}mi, ${validation.actualDriveTime.toFixed(1)}h`);
      }
      
      // Use the emergency-validated drive time
      const driveTimeHours = validation.actualDriveTime;

      console.log(`⚖️ Day ${day}: ${currentStop.name} → ${nextStop.name} = ${distance.toFixed(0)}mi, ${driveTimeHours.toFixed(1)}h (emergency validated)`);

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${CityDisplayService.getCityDisplayName(currentStop)} to ${CityDisplayService.getCityDisplayName(nextStop)}`,
        startCity: CityDisplayService.getCityDisplayName(currentStop),
        endCity: CityDisplayService.getCityDisplayName(nextStop),
        distance,
        driveTimeHours,
        drivingTime: driveTimeHours,
        approximateMiles: Math.round(distance),
        destination: {
          city: nextStop.city_name || nextStop.name,
          state: nextStop.state
        },
        recommendedStops: [{
          stopId: nextStop.id,
          id: nextStop.id,
          name: nextStop.name,
          description: nextStop.description || `Visit ${nextStop.name}`,
          latitude: nextStop.latitude,
          longitude: nextStop.longitude,
          category: nextStop.category,
          city_name: nextStop.city_name,
          state: nextStop.state,
          city: nextStop.city || nextStop.city_name || nextStop.name
        }],
        attractions: [],
        notes: `Day ${day}: Even-paced drive from ${currentStop.name} to ${nextStop.name}${validation.needsSplitting ? ' (Distance optimized for realistic driving)' : ''}`,
        recommendations: validation.needsSplitting ? [`This segment was optimized to ensure realistic daily driving distances.`] : []
      };

      segments.push(segment);
    }

    return segments;
  }

  private static createTripPlan(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    segments: DailySegment[],
    totalDistance: number,
    totalDrivingTime: number
  ): TripPlan {
    return {
      id: `even-pacing-${Date.now()}`,
      startCity: startLocation,
      endCity: endLocation,
      startLocation,
      endLocation,
      startDate: new Date(),
      totalDays: travelDays,
      totalDistance,
      totalMiles: Math.round(totalDistance),
      totalDrivingTime,
      segments,
      dailySegments: segments,
      stops: [],
      lastUpdated: new Date()
    };
  }

  private static calculateTotalDistance(startStop: TripStop, endStop: TripStop): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(endStop.latitude - startStop.latitude);
    const dLon = this.toRad(endStop.longitude - startStop.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(startStop.latitude)) * Math.cos(this.toRad(endStop.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance);
  }

  private static toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
