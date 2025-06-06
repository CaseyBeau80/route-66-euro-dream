
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { SegmentDestinationPlanner } from './SegmentDestinationPlanner';
import { DailySegment, TripPlan, DriveTimeCategory } from './TripPlanBuilder';
import { EnhancedDriveTimeBalancer } from './EnhancedDriveTimeBalancer';

export class UnifiedTripPlanningService {
  private static readonly MIN_DRIVE_TIME = 3;
  private static readonly MAX_DRIVE_TIME = 8;
  private static readonly IDEAL_DRIVE_TIME = 6;
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * Create a complete trip plan with enhanced drive time balancing
   */
  static createTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string
  ): TripPlan {
    console.log(`🚗 Creating balanced trip plan: ${inputStartCity} → ${inputEndCity} in ${requestedDays} days`);

    // Calculate total distance
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    console.log(`📏 Total distance: ${totalDistance.toFixed(0)} miles`);

    // Use enhanced drive time balancer for optimal planning
    const balanceAnalysis = EnhancedDriveTimeBalancer.analyzeAndBalance(
      startStop,
      endStop,
      allStops,
      requestedDays
    );

    const optimalDays = balanceAnalysis.recommendedDays;
    const wasAdjusted = optimalDays !== requestedDays;

    console.log(`📅 Days: requested ${requestedDays}, optimal ${optimalDays}, adjusted: ${wasAdjusted}`);
    console.log(`⚖️ Balance quality: ${balanceAnalysis.isBalanced ? 'Balanced' : 'Needs attention'}, max drive: ${balanceAnalysis.maxDriveTime.toFixed(1)}h`);

    // Use SegmentDestinationPlanner with the balanced number of days
    const destinations = SegmentDestinationPlanner.selectDailyDestinations(
      startStop,
      endStop,
      allStops,
      optimalDays
    );

    console.log(`🎯 ${SegmentDestinationPlanner.getSelectionSummary(destinations)}`);

    // Create daily segments with enhanced balance validation
    const segments = this.createBalancedDailySegments(
      startStop,
      endStop,
      destinations,
      allStops,
      optimalDays
    );

    // Enhanced drive time balance metrics
    const driveTimeBalance = this.calculateEnhancedDriveTimeBalance(segments, balanceAnalysis);

    // Calculate total metrics
    const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

    const tripPlan: TripPlan = {
      id: `trip-${Math.random().toString(36).substring(2, 9)}`,
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
      driveTimeBalance
    };

    console.log(`✅ Balanced trip plan: ${optimalDays} days, ${Math.round(totalDistance)}mi, ${totalDrivingTime.toFixed(1)}h`);
    return tripPlan;
  }

  /**
   * Create daily segments with enhanced balance validation
   */
  private static createBalancedDailySegments(
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

    console.log(`🎯 Creating balanced segments with ${remainingStops.length} remaining stops`);

    for (let day = 1; day <= totalDays; day++) {
      const isLastDay = day === totalDays;
      const dayDestination = isLastDay ? endStop : destinations[day - 1];

      // Calculate segment distance and drive time
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );
      const driveTimeHours = segmentDistance / this.AVG_SPEED_MPH;

      // Validate drive time is within acceptable limits
      if (driveTimeHours > this.MAX_DRIVE_TIME) {
        console.warn(`⚠️ Day ${day}: Drive time ${driveTimeHours.toFixed(1)}h exceeds recommended maximum`);
      }

      // Enhanced stop curation for this segment
      const segmentStops = this.curateEnhancedStopsForSegment(
        currentStop,
        dayDestination,
        remainingStops,
        Math.min(5, Math.floor(driveTimeHours) + 2)
      );

      // Create drive time category with balance awareness
      const driveTimeCategory = this.getEnhancedDriveTimeCategory(driveTimeHours);

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${CityDisplayService.getCityDisplayName(currentStop)} to ${CityDisplayService.getCityDisplayName(dayDestination)}`,
        startCity: CityDisplayService.getCityDisplayName(currentStop),
        endCity: CityDisplayService.getCityDisplayName(dayDestination),
        distance: segmentDistance,
        approximateMiles: Math.round(segmentDistance),
        driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
        destination: {
          city: dayDestination.city || dayDestination.city_name,
          state: dayDestination.state,
          city_name: dayDestination.city_name,
          name: dayDestination.name
        },
        recommendedStops: segmentStops,
        attractions: segmentStops.map(stop => stop.name),
        driveTimeCategory,
        routeSection: day <= Math.ceil(totalDays / 3) ? 'Early Route' : 
                     day <= Math.ceil(2 * totalDays / 3) ? 'Mid Route' : 'Final Stretch'
      };

      segments.push(segment);
      currentStop = dayDestination;

      console.log(`✅ Day ${day}: ${Math.round(segmentDistance)}mi to ${dayDestination.name}, ${driveTimeHours.toFixed(1)}h ${driveTimeHours <= this.MAX_DRIVE_TIME ? '✅' : '⚠️'}`);
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
   * Enhanced drive time category with balance awareness
   */
  private static getEnhancedDriveTimeCategory(driveTimeHours: number): DriveTimeCategory {
    if (driveTimeHours <= 4) {
      return {
        category: 'short',
        message: `${driveTimeHours.toFixed(1)} hours - Relaxed pace, plenty of time for attractions`,
        color: 'text-green-800'
      };
    } else if (driveTimeHours <= 6) {
      return {
        category: 'optimal',
        message: `${driveTimeHours.toFixed(1)} hours - Perfect balance of driving and sightseeing`,
        color: 'text-blue-800'
      };
    } else if (driveTimeHours <= 8) {
      return {
        category: 'long',
        message: `${driveTimeHours.toFixed(1)} hours - Substantial day, but manageable`,
        color: 'text-orange-800'
      };
    } else {
      return {
        category: 'extreme',
        message: `${driveTimeHours.toFixed(1)} hours - Very long day, consider adding stops`,
        color: 'text-red-800'
      };
    }
  }

  /**
   * Calculate enhanced drive time balance metrics
   */
  private static calculateEnhancedDriveTimeBalance(segments: DailySegment[], balanceAnalysis: any) {
    const driveTimes = segments.map(seg => seg.driveTimeHours);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const variance = Math.sqrt(
      driveTimes.reduce((sum, time) => sum + Math.pow(time - averageDriveTime, 2), 0) / driveTimes.length
    );

    const minTime = Math.min(...driveTimes);
    const maxTime = Math.max(...driveTimes);
    const isBalanced = maxTime <= this.MAX_DRIVE_TIME && variance <= 1.5;

    const balanceQuality: 'excellent' | 'good' | 'fair' | 'poor' = 
      isBalanced && maxTime <= 6 ? 'excellent' :
      isBalanced && maxTime <= 8 ? 'good' :
      maxTime <= 9 ? 'fair' : 'poor';

    const qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 
      balanceQuality === 'excellent' ? 'A' :
      balanceQuality === 'good' ? 'B' :
      balanceQuality === 'fair' ? 'C' :
      maxTime <= 10 ? 'D' : 'F';

    const overallScore = Math.max(0, 100 - (variance * 20) - Math.max(0, maxTime - 8) * 15);

    const suggestions: string[] = [];
    if (maxTime > this.MAX_DRIVE_TIME) {
      suggestions.push(`Day with ${maxTime.toFixed(1)}h drive time should be shortened`);
    }
    if (variance > 2) {
      suggestions.push('Consider redistributing stops for more consistent daily drive times');
    }

    return {
      isBalanced,
      averageDriveTime: parseFloat(averageDriveTime.toFixed(1)),
      variance: parseFloat(variance.toFixed(1)),
      driveTimeRange: { min: minTime, max: maxTime },
      balanceQuality,
      qualityGrade,
      overallScore: Math.round(overallScore),
      suggestions,
      reason: isBalanced ? 'Drive times are well balanced' : 
              maxTime > this.MAX_DRIVE_TIME ? `Maximum drive time (${maxTime.toFixed(1)}h) exceeds recommended limit` :
              'Drive time variance could be improved'
    };
  }
}
