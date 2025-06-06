import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { SegmentDestinationPlanner } from './SegmentDestinationPlanner';
import { DailySegment, TripPlan } from './TripPlanBuilder';

export class UnifiedTripPlanningService {
  private static readonly MIN_DRIVE_TIME = 3;
  private static readonly MAX_DRIVE_TIME = 8;
  private static readonly IDEAL_DRIVE_TIME = 6;
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * Create a complete trip plan with enhanced destination selection
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

    // Use SegmentDestinationPlanner to select optimal destinations
    const destinations = SegmentDestinationPlanner.selectDailyDestinations(
      startStop,
      endStop,
      allStops,
      optimalDays
    );

    console.log(`🎯 ${SegmentDestinationPlanner.getSelectionSummary(destinations)}`);

    // Create daily segments with enhanced stop curation
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
   * Create daily segments with enhanced stop curation
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

    console.log(`🎯 Creating segments with ${remainingStops.length} remaining stops for recommendations`);

    for (let day = 1; day <= totalDays; day++) {
      const isLastDay = day === totalDays;
      const dayDestination = isLastDay ? endStop : destinations[day - 1];

      // Calculate segment distance and drive time
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );
      const driveTimeHours = segmentDistance / this.AVG_SPEED_MPH;

      // Enhanced stop curation for this segment
      const segmentStops = this.curateEnhancedStopsForSegment(
        currentStop,
        dayDestination,
        remainingStops,
        Math.min(5, Math.floor(driveTimeHours) + 2)
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

      console.log(`✅ Day ${day}: ${Math.round(segmentDistance)}mi to ${dayDestination.name} (${dayDestination.category}), ${driveTimeHours.toFixed(1)}h, ${segmentStops.length} stops`);
    }

    return segments;
  }

  /**
   * Enhanced stop curation focusing on route alignment and quality
   */
  private static curateEnhancedStopsForSegment(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    maxStops: number
  ): TripStop[] {
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Score stops based on multiple factors
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
      const alignmentScore = Math.max(0, 50 - routeDeviation);

      // Position score - prefer stops in middle third of segment
      const positionRatio = distanceFromStart / segmentDistance;
      const positionScore = positionRatio >= 0.2 && positionRatio <= 0.8 ? 20 : 0;

      // Category priority score
      const categoryScore = this.getCategoryPriorityScore(stop.category);

      // State relevance bonus
      const stateBonus = (stop.state === startStop.state || stop.state === endStop.state) ? 10 : 0;

      const totalScore = alignmentScore + positionScore + categoryScore + stateBonus;

      return { stop, score: totalScore };
    });

    // Filter out poorly aligned stops and sort by score
    const wellAlignedStops = scoredStops
      .filter(item => item.score > 20) // Minimum quality threshold
      .sort((a, b) => b.score - a.score);

    // Ensure category diversity in selection
    const selectedStops: TripStop[] = [];
    const categoryCount: Record<string, number> = {};

    for (const item of wellAlignedStops) {
      if (selectedStops.length >= maxStops) break;

      const category = item.stop.category;
      const currentCount = categoryCount[category] || 0;
      const maxPerCategory = Math.ceil(maxStops / 3); // Limit per category

      if (currentCount < maxPerCategory) {
        selectedStops.push(item.stop);
        categoryCount[category] = currentCount + 1;
      }
    }

    return selectedStops;
  }

  /**
   * Get category priority score for enhanced curation
   */
  private static getCategoryPriorityScore(category: string): number {
    switch (category) {
      case 'route66_waypoint':
        return 30;
      case 'attraction':
        return 25;
      case 'historic_site':
        return 20;
      case 'hidden_gem':
        return 15;
      default:
        return 10;
    }
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
