import { TripStop } from '../../types/TripStop';
import { TripPlan, DailySegment } from './TripPlanTypes';
import { CityDisplayService } from '../utils/CityDisplayService';
import { Route66SequenceEnforcer } from './Route66SequenceEnforcer';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';

export class EvenPacingPlanningService {
  private static readonly TARGET_DRIVE_TIME = 5.5; // 5.5 hours target for even pacing
  private static readonly MAX_DRIVE_TIME = 7; // Maximum for even pacing
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

    // Calculate total distance and target daily distance
    const totalDistance = this.calculateTotalDistance(startStop, endStop);
    const targetDailyDistance = totalDistance / tripDays;
    
    console.log(`📏 Total distance: ${totalDistance.toFixed(0)}mi, Target daily: ${targetDailyDistance.toFixed(0)}mi`);

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

    // Select destinations for even pacing (prioritizes consistent distances)
    const intermediateDestinations = this.selectEvenPacingDestinations(
      startStop, endStop, sequenceResult.validStops, tripDays - 1, targetDailyDistance
    );

    // Build segments with even pacing constraints
    const segments = this.buildEvenPacingSegments(
      startStop, endStop, intermediateDestinations, tripDays
    );

    const totalDrivingTime = segments.reduce((total, seg) => total + seg.driveTimeHours, 0);

    return {
      id: `trip-${Date.now()}`,
      startCity: startCityName,
      endCity: endCityName,
      startDate: new Date(),
      totalDays: tripDays,
      totalDistance,
      totalMiles: Math.round(totalDistance),
      totalDrivingTime,
      segments,
      dailySegments: segments,
      lastUpdated: new Date()
    };
  }

  /**
   * Select destinations prioritizing even spacing and consistent drive times
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
      
      // Score each available stop for even pacing
      const scoredStops = validStops
        .filter(stop => !selectedDestinations.some(selected => selected.id === stop.id))
        .map(stop => {
          const distance = this.calculateTotalDistance(currentStop, stop);
          const driveTime = distance / 55; // 55 mph average
          
          // Score based on how close to target distance and ideal drive time
          const distanceScore = this.calculateDistanceScore(distance, adjustedTargetDistance);
          const driveTimeScore = this.calculateDriveTimeScore(driveTime);
          const varietyScore = this.calculateVarietyScore(stop, selectedDestinations);
          
          const totalScore = (distanceScore * 0.5) + (driveTimeScore * 0.3) + (varietyScore * 0.2);
          
          return { stop, distance, driveTime, totalScore };
        })
        .sort((a, b) => b.totalScore - a.totalScore);
      
      if (scoredStops.length > 0) {
        const bestStop = scoredStops[0];
        selectedDestinations.push(bestStop.stop);
        currentStop = bestStop.stop;
        
        console.log(`✅ Selected: ${bestStop.stop.name} (${bestStop.distance.toFixed(0)}mi, ${bestStop.driveTime.toFixed(1)}h, score: ${bestStop.totalScore.toFixed(1)})`);
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
   * Build segments optimized for even pacing
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
      // Use conservative drive time calculation for even pacing
      const driveTimeHours = Math.min(distance / 55, this.MAX_DRIVE_TIME);

      console.log(`⚖️ Day ${day}: ${currentStop.name} → ${nextStop.name} = ${distance.toFixed(0)}mi, ${driveTimeHours.toFixed(1)}h (even pacing)`);

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
        notes: `Day ${day}: Even-paced drive from ${currentStop.name} to ${nextStop.name}`,
        recommendations: []
      };

      segments.push(segment);
    }

    return segments;
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
