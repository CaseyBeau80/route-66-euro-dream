
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { DailySegment, TripPlan } from './TripPlanBuilder';

export class UnifiedTripPlanningService {
  private static readonly MIN_DRIVE_TIME = 3;
  private static readonly MAX_DRIVE_TIME = 8;
  private static readonly IDEAL_DRIVE_TIME = 6;
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * Create a complete trip plan with proper drive time balancing
   */
  static createTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string
  ): TripPlan {
    console.log(`🚗 Creating unified trip plan: ${inputStartCity} → ${inputEndCity} in ${requestedDays} days`);

    // Calculate total distance
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    console.log(`📏 Total distance: ${totalDistance.toFixed(0)} miles`);

    // Calculate optimal trip duration with proper constraints
    const optimalDays = this.calculateOptimalTripDays(totalDistance, requestedDays);
    const wasAdjusted = optimalDays !== requestedDays;

    console.log(`📅 Days: requested ${requestedDays}, optimal ${optimalDays}, adjusted: ${wasAdjusted}`);

    // Select intermediate destinations
    const destinations = this.selectIntermediateDestinations(
      startStop,
      endStop,
      allStops,
      optimalDays
    );

    // Create daily segments
    const segments = this.createDailySegments(
      startStop,
      endStop,
      destinations,
      allStops,
      optimalDays
    );

    // Calculate drive time balance metrics
    const driveTimeBalance = this.calculateDriveTimeBalance(segments);

    // Calculate total metrics
    const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

    const tripPlan: TripPlan = {
      title: `${inputStartCity} to ${inputEndCity} Road Trip`,
      startCity: inputStartCity,
      endCity: inputEndCity,
      totalDays: optimalDays,
      originalDays: wasAdjusted ? requestedDays : undefined,
      totalDistance: Math.round(totalDistance),
      totalMiles: Math.round(totalDistance),
      totalDrivingTime: parseFloat(totalDrivingTime.toFixed(1)),
      segments,
      dailySegments: segments,
      wasAdjusted,
      driveTimeBalance
    };

    console.log(`✅ Trip plan completed: ${optimalDays} days, ${Math.round(totalDistance)}mi, ${totalDrivingTime.toFixed(1)}h`);
    return tripPlan;
  }

  /**
   * Calculate optimal trip days based on distance and drive time constraints
   */
  private static calculateOptimalTripDays(totalDistance: number, requestedDays: number): number {
    const totalDriveTime = totalDistance / this.AVG_SPEED_MPH;
    const averageDriveTimePerDay = totalDriveTime / requestedDays;

    console.log(`⏱️ Drive time analysis: ${totalDriveTime.toFixed(1)}h total, ${averageDriveTimePerDay.toFixed(1)}h average`);

    // If average drive time is too high, increase days
    if (averageDriveTimePerDay > this.MAX_DRIVE_TIME) {
      const minRequiredDays = Math.ceil(totalDriveTime / this.MAX_DRIVE_TIME);
      console.log(`📈 Increasing days from ${requestedDays} to ${minRequiredDays} for safe driving`);
      return minRequiredDays;
    }

    // If average drive time is too low for long trips, reduce days
    if (averageDriveTimePerDay < this.MIN_DRIVE_TIME && requestedDays > 3) {
      const maxReasonableDays = Math.floor(totalDriveTime / this.MIN_DRIVE_TIME);
      const adjustedDays = Math.max(3, maxReasonableDays);
      console.log(`📉 Reducing days from ${requestedDays} to ${adjustedDays} for reasonable segments`);
      return adjustedDays;
    }

    // Otherwise, use requested days
    return requestedDays;
  }

  /**
   * Select intermediate destinations for balanced drive times
   */
  private static selectIntermediateDestinations(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    totalDays: number
  ): TripStop[] {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Filter to valid destination cities
    const destinationCities = allStops.filter(stop => 
      stop.category === 'destination_city' &&
      stop.id !== startStop.id &&
      stop.id !== endStop.id
    );

    console.log(`🏙️ Found ${destinationCities.length} destination cities for selection`);

    const destinations: TripStop[] = [];
    let currentStop = startStop;
    const targetDailyDistance = totalDistance / totalDays;

    // Select destinations for each intermediate day
    for (let day = 1; day < totalDays; day++) {
      const targetDistanceFromStart = targetDailyDistance * day;
      
      let bestDestination: TripStop | null = null;
      let bestScore = Number.MAX_VALUE;

      for (const city of destinationCities) {
        // Skip if already selected
        if (destinations.find(dest => dest.id === city.id)) continue;

        const distanceFromStart = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          city.latitude, city.longitude
        );

        const distanceToEnd = DistanceCalculationService.calculateDistance(
          city.latitude, city.longitude,
          endStop.latitude, endStop.longitude
        );

        const currentToEndDistance = DistanceCalculationService.calculateDistance(
          currentStop.latitude, currentStop.longitude,
          endStop.latitude, endStop.longitude
        );

        // Ensure geographic progression
        if (distanceToEnd >= currentToEndDistance) continue;

        // Score based on distance from target position
        const positionScore = Math.abs(distanceFromStart - targetDistanceFromStart);
        
        // Score based on drive time from current position
        const distanceFromCurrent = DistanceCalculationService.calculateDistance(
          currentStop.latitude, currentStop.longitude,
          city.latitude, city.longitude
        );
        const driveTime = distanceFromCurrent / this.AVG_SPEED_MPH;
        const driveTimeScore = Math.abs(driveTime - this.IDEAL_DRIVE_TIME) * 20;

        const totalScore = positionScore + driveTimeScore;

        if (totalScore < bestScore) {
          bestScore = totalScore;
          bestDestination = city;
        }
      }

      if (bestDestination) {
        destinations.push(bestDestination);
        currentStop = bestDestination;
        console.log(`📍 Day ${day}: Selected ${bestDestination.name}`);
      } else {
        console.log(`⚠️ No suitable destination found for day ${day}`);
        break;
      }
    }

    return destinations;
  }

  /**
   * Create daily segments with curated stops
   */
  private static createDailySegments(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[],
    allStops: TripStop[],
    totalDays: number
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    let currentStop = startStop;

    // Filter remaining stops (excluding start, end, and destinations)
    const usedStopIds = new Set([startStop.id, endStop.id, ...destinations.map(d => d.id)]);
    const remainingStops = allStops.filter(stop => !usedStopIds.has(stop.id));

    for (let day = 1; day <= totalDays; day++) {
      const isLastDay = day === totalDays;
      const dayDestination = isLastDay ? endStop : destinations[day - 1];

      // Calculate segment distance and drive time
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );
      const driveTimeHours = segmentDistance / this.AVG_SPEED_MPH;

      // Curate stops for this segment (simplified)
      const segmentStops = this.curateStopsForSegment(
        currentStop,
        dayDestination,
        remainingStops,
        Math.min(3, Math.floor(driveTimeHours))
      );

      // Create drive time category
      const driveTimeCategory = this.getDriveTimeCategory(driveTimeHours);

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${CityDisplayService.getCityDisplayName(currentStop)} to ${CityDisplayService.getCityDisplayName(dayDestination)}`,
        startCity: CityDisplayService.getCityDisplayName(currentStop),
        endCity: CityDisplayService.getCityDisplayName(dayDestination),
        distance: segmentDistance,
        approximateMiles: Math.round(segmentDistance),
        driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
        destination: dayDestination,
        recommendedStops: segmentStops,
        attractions: segmentStops.map(stop => stop.name),
        driveTimeCategory,
        routeSection: day <= Math.ceil(totalDays / 3) ? 'Early Route' : 
                     day <= Math.ceil(2 * totalDays / 3) ? 'Mid Route' : 'Final Stretch'
      };

      segments.push(segment);
      currentStop = dayDestination;

      console.log(`✅ Day ${day}: ${Math.round(segmentDistance)}mi, ${driveTimeHours.toFixed(1)}h, ${segmentStops.length} stops`);
    }

    return segments;
  }

  /**
   * Curate stops for a segment (simplified approach)
   */
  private static curateStopsForSegment(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    maxStops: number
  ): TripStop[] {
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Score stops based on proximity to route
    const scoredStops = availableStops.map(stop => {
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );
      const distanceToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        endStop.latitude, endStop.longitude
      );

      // Route alignment score (triangle inequality check)
      const routeDeviation = (distanceFromStart + distanceToEnd) - segmentDistance;
      const alignmentScore = Math.max(0, 100 - routeDeviation);

      // Category bonus
      const categoryBonus = stop.category === 'attraction' ? 20 :
                           stop.category === 'historic_site' ? 15 :
                           stop.category === 'hidden_gem' ? 10 : 0;

      return {
        stop,
        score: alignmentScore + categoryBonus
      };
    });

    // Sort by score and take the best ones
    scoredStops.sort((a, b) => b.score - a.score);
    return scoredStops.slice(0, maxStops).map(item => item.stop);
  }

  /**
   * Get drive time category with proper color coding
   */
  private static getDriveTimeCategory(driveTimeHours: number) {
    if (driveTimeHours <= 4) {
      return {
        category: 'short' as const,
        message: `${driveTimeHours.toFixed(1)} hours - Relaxed pace`,
        color: 'text-green-800'
      };
    } else if (driveTimeHours <= 7) {
      return {
        category: 'optimal' as const,
        message: `${driveTimeHours.toFixed(1)} hours - Good balance`,
        color: 'text-blue-800'
      };
    } else if (driveTimeHours <= 9) {
      return {
        category: 'long' as const,
        message: `${driveTimeHours.toFixed(1)} hours - Long day`,
        color: 'text-orange-800'
      };
    } else {
      return {
        category: 'extreme' as const,
        message: `${driveTimeHours.toFixed(1)} hours - Very long`,
        color: 'text-red-800'
      };
    }
  }

  /**
   * Calculate drive time balance metrics
   */
  private static calculateDriveTimeBalance(segments: DailySegment[]) {
    const driveTimes = segments.map(seg => seg.driveTimeHours);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const variance = Math.sqrt(
      driveTimes.reduce((sum, time) => sum + Math.pow(time - averageDriveTime, 2), 0) / driveTimes.length
    );

    const minTime = Math.min(...driveTimes);
    const maxTime = Math.max(...driveTimes);
    const isBalanced = variance <= 1.5 && maxTime <= this.MAX_DRIVE_TIME && minTime >= this.MIN_DRIVE_TIME;

    const balanceQuality: 'excellent' | 'good' | 'fair' | 'poor' = variance <= 1.0 ? 'excellent' :
                          variance <= 1.5 ? 'good' :
                          variance <= 2.0 ? 'fair' : 'poor';

    const qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F' = variance <= 1.0 ? 'A' :
                        variance <= 1.5 ? 'B' :
                        variance <= 2.0 ? 'C' :
                        variance <= 2.5 ? 'D' : 'F';

    return {
      isBalanced,
      averageDriveTime: parseFloat(averageDriveTime.toFixed(1)),
      variance: parseFloat(variance.toFixed(1)),
      driveTimeRange: { min: minTime, max: maxTime },
      balanceQuality,
      qualityGrade,
      overallScore: Math.max(0, 100 - (variance * 30))
    };
  }
}
