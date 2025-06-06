
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { GapDetectionService, RouteGap } from './GapDetectionService';
import { DailySegment, TripPlan, DriveTimeCategory, RecommendedStop } from './TripPlanBuilder';

export interface DestinationFocusedResult {
  tripPlan: TripPlan;
  routeGaps: RouteGap[];
  warnings: string[];
  routeAssessment: {
    isRecommended: boolean;
    summary: string;
    totalLongDrives: number;
  };
}

export class DestinationFocusedPlanningService {
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * Create a destination-focused trip plan prioritizing major Route 66 cities
   */
  static createDestinationFocusedPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string
  ): DestinationFocusedResult {
    console.log(`🏙️ Creating destination-focused trip plan: ${inputStartCity} → ${inputEndCity} in ${requestedDays} days`);

    // Filter to only official destination cities
    const destinationCities = allStops.filter(stop => 
      stop.category === 'destination_city' &&
      stop.id !== startStop.id &&
      stop.id !== endStop.id
    );

    console.log(`🎯 Found ${destinationCities.length} official destination cities available`);

    // Calculate total distance
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Select destination cities based on route progression
    const selectedDestinations = this.selectRouteDestinations(
      startStop,
      endStop,
      destinationCities,
      requestedDays
    );

    console.log(`🏙️ Selected ${selectedDestinations.length} destination cities for ${requestedDays} days`);

    // Create segments connecting destination cities
    const segments = this.createDestinationSegments(
      startStop,
      endStop,
      selectedDestinations,
      allStops
    );

    // Detect route gaps and generate warnings
    const allDestinations = [startStop, ...selectedDestinations, endStop];
    const routeGaps = GapDetectionService.detectRouteGaps(allDestinations);
    const warnings = GapDetectionService.generateGapWarnings(routeGaps);
    const routeAssessment = GapDetectionService.getRouteAssessment(routeGaps);

    console.log(`⚠️ Route assessment: ${routeAssessment.summary} (${routeGaps.length} gaps detected)`);

    // Calculate total metrics
    const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

    const tripPlan: TripPlan = {
      id: `destination-trip-${Math.random().toString(36).substring(2, 9)}`,
      title: `${inputStartCity} to ${inputEndCity} Destination-Focused Route`,
      startCity: inputStartCity,
      endCity: inputEndCity,
      startDate: new Date(),
      totalDays: segments.length,
      totalDistance: Math.round(totalDistance),
      totalMiles: Math.round(totalDistance),
      totalDrivingTime: parseFloat(totalDrivingTime.toFixed(1)),
      segments,
      dailySegments: segments,
      driveTimeBalance: this.calculateDestinationFocusedBalance(segments, routeAssessment)
    };

    return {
      tripPlan,
      routeGaps,
      warnings,
      routeAssessment
    };
  }

  /**
   * Select destination cities based on route progression
   */
  private static selectRouteDestinations(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    requestedDays: number
  ): TripStop[] {
    // Sort destination cities by distance from start (route progression)
    const sortedDestinations = destinationCities
      .map(city => ({
        city,
        distanceFromStart: DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          city.latitude, city.longitude
        )
      }))
      .sort((a, b) => a.distanceFromStart - b.distanceFromStart);

    // For destination-focused planning, we need exactly (requestedDays - 1) intermediate stops
    const neededStops = Math.max(0, requestedDays - 1);
    
    if (neededStops === 0) {
      return []; // Direct trip
    }

    // Select destinations to create the most logical progression
    const selectedDestinations: TripStop[] = [];
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Calculate ideal positions for stops
    for (let i = 1; i <= neededStops; i++) {
      const targetDistance = (totalDistance * i) / requestedDays;
      
      // Find the destination city closest to the target distance
      let bestDestination: TripStop | null = null;
      let bestDifference = Number.MAX_VALUE;

      for (const item of sortedDestinations) {
        if (selectedDestinations.some(selected => selected.id === item.city.id)) {
          continue; // Skip already selected destinations
        }

        const difference = Math.abs(item.distanceFromStart - targetDistance);
        if (difference < bestDifference) {
          bestDestination = item.city;
          bestDifference = difference;
        }
      }

      if (bestDestination) {
        selectedDestinations.push(bestDestination);
        console.log(`✅ Selected ${bestDestination.name} for day ${i + 1} (${bestDifference.toFixed(0)}mi from ideal position)`);
      }
    }

    // Sort selected destinations by distance from start to maintain route order
    return selectedDestinations
      .map(city => ({
        city,
        distanceFromStart: DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          city.latitude, city.longitude
        )
      }))
      .sort((a, b) => a.distanceFromStart - b.distanceFromStart)
      .map(item => item.city);
  }

  /**
   * Create daily segments connecting destination cities
   */
  private static createDestinationSegments(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[],
    allStops: TripStop[]
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    const allDestinations = [startStop, ...destinations, endStop];

    // Filter stops for attractions (exclude destination cities)
    const usedStopIds = new Set(allDestinations.map(d => d.id));
    const attractionStops = allStops.filter(stop => !usedStopIds.has(stop.id));

    for (let i = 0; i < allDestinations.length - 1; i++) {
      const currentStop = allDestinations[i];
      const nextStop = allDestinations[i + 1];
      const day = i + 1;

      // Calculate segment metrics
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        nextStop.latitude, nextStop.longitude
      );
      const driveTimeHours = segmentDistance / this.AVG_SPEED_MPH;

      // Find attractions along this segment
      const segmentAttractions = this.findAttractionsForDestinationSegment(
        currentStop,
        nextStop,
        attractionStops,
        4
      );

      // Create drive time category
      const driveTimeCategory = this.getDestinationFocusedDriveTimeCategory(driveTimeHours);

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${CityDisplayService.getCityDisplayName(currentStop)} to ${CityDisplayService.getCityDisplayName(nextStop)}`,
        startCity: CityDisplayService.getCityDisplayName(currentStop),
        endCity: CityDisplayService.getCityDisplayName(nextStop),
        distance: segmentDistance,
        approximateMiles: Math.round(segmentDistance),
        driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
        destination: {
          city: nextStop.city || nextStop.city_name,
          state: nextStop.state,
          city_name: nextStop.city_name,
          name: nextStop.name
        },
        recommendedStops: segmentAttractions,
        attractions: segmentAttractions.map(stop => stop.name),
        driveTimeCategory,
        routeSection: `Historic Route 66 - ${nextStop.state}`
      };

      segments.push(segment);
      console.log(`🏙️ Day ${day}: ${Math.round(segmentDistance)}mi to ${nextStop.name}, ${driveTimeHours.toFixed(1)}h`);
    }

    return segments;
  }

  /**
   * Find attractions along destination-focused segments
   */
  private static findAttractionsForDestinationSegment(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    maxAttractions: number
  ): RecommendedStop[] {
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Score stops based on route alignment and Route 66 significance
    const scoredStops = availableStops.map(stop => {
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );
      const distanceToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        endStop.latitude, endStop.longitude
      );

      // Route alignment score
      const routeDeviation = (distanceFromStart + distanceToEnd) - segmentDistance;
      const alignmentScore = Math.max(0, 30 - routeDeviation);

      // Route 66 significance score
      const significanceScore = this.getRoute66SignificanceScore(stop.category);

      // State relevance bonus
      const stateBonus = (stop.state === startStop.state || stop.state === endStop.state) ? 10 : 0;

      const totalScore = alignmentScore + significanceScore + stateBonus;

      return { stop, score: totalScore };
    });

    // Filter and sort by score
    const topStops = scoredStops
      .filter(item => item.score > 15) // Quality threshold
      .sort((a, b) => b.score - a.score)
      .slice(0, maxAttractions);

    // Convert to RecommendedStops
    return topStops.map(item => ({
      id: item.stop.id,
      name: item.stop.name,
      description: item.stop.description,
      latitude: item.stop.latitude,
      longitude: item.stop.longitude,
      category: item.stop.category,
      city_name: item.stop.city_name,
      state: item.stop.state,
      city: item.stop.city || item.stop.city_name || 'Unknown'
    }));
  }

  /**
   * Get Route 66 significance score for categories
   */
  private static getRoute66SignificanceScore(category: string): number {
    switch (category) {
      case 'route66_waypoint':
        return 35;
      case 'historic_site':
        return 30;
      case 'attraction':
        return 25;
      case 'hidden_gem':
        return 20;
      default:
        return 10;
    }
  }

  /**
   * Get drive time category for destination-focused trips
   */
  private static getDestinationFocusedDriveTimeCategory(driveTimeHours: number): DriveTimeCategory {
    if (driveTimeHours <= 4) {
      return {
        category: 'short',
        message: `${driveTimeHours.toFixed(1)} hours - Quick hop between historic cities`,
        color: 'text-green-800'
      };
    } else if (driveTimeHours <= 6) {
      return {
        category: 'optimal',
        message: `${driveTimeHours.toFixed(1)} hours - Comfortable drive between destination cities`,
        color: 'text-blue-800'
      };
    } else if (driveTimeHours <= 8) {
      return {
        category: 'long',
        message: `${driveTimeHours.toFixed(1)} hours - Longer drive, but connects major Route 66 cities`,
        color: 'text-orange-800'
      };
    } else {
      return {
        category: 'extreme',
        message: `${driveTimeHours.toFixed(1)} hours - Very long drive between cities, plan accordingly`,
        color: 'text-red-800'
      };
    }
  }

  /**
   * Calculate drive time balance for destination-focused trips
   */
  private static calculateDestinationFocusedBalance(segments: DailySegment[], routeAssessment: any) {
    const driveTimes = segments.map(seg => seg.driveTimeHours);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const variance = Math.sqrt(
      driveTimes.reduce((sum, time) => sum + Math.pow(time - averageDriveTime, 2), 0) / driveTimes.length
    );

    const minTime = Math.min(...driveTimes);
    const maxTime = Math.max(...driveTimes);

    // For destination-focused, we're more lenient on balance but strict on safety
    const isBalanced = maxTime <= 10 && routeAssessment.isRecommended;

    const balanceQuality: 'excellent' | 'good' | 'fair' | 'poor' = 
      isBalanced && maxTime <= 6 ? 'good' : // Destination-focused rarely achieves "excellent"
      isBalanced && maxTime <= 8 ? 'fair' :
      maxTime <= 10 ? 'poor' : 'poor';

    const qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 
      balanceQuality === 'excellent' ? 'A' :
      balanceQuality === 'good' ? 'B' :
      balanceQuality === 'fair' ? 'C' :
      maxTime <= 10 ? 'D' : 'F';

    // Score based on Route 66 authenticity rather than pure balance
    const authenticityBonus = segments.every(seg => seg.routeSection?.includes('Historic Route 66')) ? 20 : 0;
    const overallScore = Math.max(0, 70 + authenticityBonus - (variance * 10) - Math.max(0, maxTime - 8) * 10);

    const suggestions: string[] = [];
    if (maxTime > 10) {
      suggestions.push(`Day with ${maxTime.toFixed(1)}h drive time exceeds safe limits`);
    }
    if (routeAssessment.totalLongDrives > 2) {
      suggestions.push('Consider adding more days or switching to Balanced mode for easier driving');
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
      reason: isBalanced ? 'Connects authentic Route 66 destination cities' : 
              maxTime > 10 ? `Maximum drive time (${maxTime.toFixed(1)}h) exceeds safe limits` :
              'Route requires challenging drive times between historic cities'
    };
  }
}
