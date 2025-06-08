import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { GapDetectionService, RouteGap } from './GapDetectionService';
import { DailySegment, TripPlan, DriveTimeCategory, RecommendedStop } from './TripPlanBuilder';
import { ConsecutiveMajorCitiesOptimizer } from './ConsecutiveMajorCitiesOptimizer';
import { Route66CityClassifier } from './Route66CityClassifier';

export interface DestinationFocusedResult {
  tripPlan: TripPlan;
  routeGaps: RouteGap[];
  warnings: string[];
  routeAssessment: {
    isRecommended: boolean;
    summary: string;
    totalLongDrives: number;
  };
  optimizationDetails?: {
    consecutivePairs: number;
    gapFillers: number;
    adjustmentsMade: string[];
    priorityScore: number;
  };
}

export class DestinationFocusedPlanningService {
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * Create a destination-focused trip plan prioritizing consecutive major Route 66 cities
   */
  static createDestinationFocusedPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string
  ): DestinationFocusedResult {
    console.log(`🏙️ Creating optimized destination-focused trip plan: ${inputStartCity} → ${inputEndCity} in ${requestedDays} days`);

    // Filter to exclude start and end stops from available stops
    const availableStops = allStops.filter(stop => 
      stop.id !== startStop.id && stop.id !== endStop.id
    );

    console.log(`🎯 Found ${availableStops.length} available stops for optimization`);

    // Use the new optimizer to prioritize consecutive major cities
    const optimizationResult = ConsecutiveMajorCitiesOptimizer.optimizeRoute(
      startStop,
      endStop,
      availableStops,
      requestedDays
    );

    console.log(`🏙️ Optimization complete: ${optimizationResult.optimizedStops.length} stops selected`);
    console.log(`🔗 Consecutive pairs: ${optimizationResult.consecutivePairs.length}`);
    console.log(`📍 Gap fillers: ${optimizationResult.gapFillers.length}`);

    // Create segments using optimized stops
    const segments = this.createOptimizedDestinationSegments(
      startStop,
      endStop,
      optimizationResult.optimizedStops,
      allStops,
      optimizationResult
    );

    // Calculate total distance
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Detect route gaps and generate warnings
    const allDestinations = [startStop, ...optimizationResult.optimizedStops, endStop];
    const routeGaps = GapDetectionService.detectRouteGaps(allDestinations);
    const warnings = GapDetectionService.generateGapWarnings(routeGaps);
    
    // Add optimization-specific warnings
    const optimizationWarnings = this.generateOptimizationWarnings(optimizationResult);
    warnings.push(...optimizationWarnings);

    const routeAssessment = GapDetectionService.getRouteAssessment(routeGaps);

    // Enhance route assessment with consecutive city analysis
    const enhancedAssessment = this.enhanceRouteAssessment(routeAssessment, optimizationResult);

    console.log(`⚠️ Enhanced route assessment: ${enhancedAssessment.summary} (${optimizationResult.consecutivePairs.length} consecutive pairs)`);

    // Calculate total metrics
    const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

    const tripPlan: TripPlan = {
      id: `optimized-trip-${Math.random().toString(36).substring(2, 9)}`,
      title: `${inputStartCity} to ${inputEndCity} - Optimized Route 66 Heritage Journey`,
      startCity: inputStartCity,
      endCity: inputEndCity,
      startDate: new Date(),
      totalDays: segments.length,
      totalDistance: Math.round(totalDistance),
      totalMiles: Math.round(totalDistance),
      totalDrivingTime: parseFloat(totalDrivingTime.toFixed(1)),
      segments,
      dailySegments: segments,
      driveTimeBalance: this.calculateOptimizedDestinationBalance(segments, enhancedAssessment, optimizationResult)
    };

    return {
      tripPlan,
      routeGaps,
      warnings,
      routeAssessment: enhancedAssessment,
      optimizationDetails: {
        consecutivePairs: optimizationResult.consecutivePairs.length,
        gapFillers: optimizationResult.gapFillers.length,
        adjustmentsMade: optimizationResult.adjustmentsMade,
        priorityScore: optimizationResult.priorityScore
      }
    };
  }

  /**
   * Create daily segments with optimization context
   */
  private static createOptimizedDestinationSegments(
    startStop: TripStop,
    endStop: TripStop,
    optimizedStops: TripStop[],
    allStops: TripStop[],
    optimizationResult: any
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    const allDestinations = [startStop, ...optimizedStops, endStop];

    // Create map of optimization context for each stop
    const consecutivePairMap = new Map();
    optimizationResult.consecutivePairs.forEach((pair: any) => {
      consecutivePairMap.set(`${pair.city1.id}-${pair.city2.id}`, pair);
    });

    const gapFillerMap = new Map();
    optimizationResult.gapFillers.forEach((filler: any) => {
      gapFillerMap.set(filler.city.id, filler);
    });

    // Filter stops for attractions (exclude destination cities and used stops)
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
      const segmentAttractions = this.findAttractionsForOptimizedSegment(
        currentStop,
        nextStop,
        attractionStops,
        4
      );

      // Determine drive time category with optimization context
      const driveTimeCategory = this.getOptimizedDriveTimeCategory(
        driveTimeHours,
        currentStop,
        nextStop,
        consecutivePairMap,
        gapFillerMap
      );

      // Get classification info for stops
      const currentClassification = Route66CityClassifier.classifyCity(currentStop);
      const nextClassification = Route66CityClassifier.classifyCity(nextStop);

      // Create enhanced title with city tier information
      const title = this.createEnhancedSegmentTitle(
        day,
        currentStop,
        nextStop,
        currentClassification,
        nextClassification,
        consecutivePairMap
      );

      const segment: DailySegment = {
        day,
        title,
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
        attractions: segmentAttractions.map(stop => ({
          name: stop.name,
          title: stop.name,
          description: stop.description,
          city: stop.city || stop.city_name || 'Unknown'
        })),
        driveTimeCategory,
        routeSection: `Historic Route 66 - ${nextStop.state} ${this.getSegmentContext(nextStop, gapFillerMap)}`
      };

      segments.push(segment);
      console.log(`🏙️ Day ${day}: ${Math.round(segmentDistance)}mi to ${nextStop.name} (${nextClassification.tier}), ${driveTimeHours.toFixed(1)}h`);
    }

    return segments;
  }

  /**
   * Create enhanced segment title with city tier and consecutive pair information
   */
  private static createEnhancedSegmentTitle(
    day: number,
    currentStop: TripStop,
    nextStop: TripStop,
    currentClassification: any,
    nextClassification: any,
    consecutivePairMap: Map<string, any>
  ): string {
    const baseTitle = `Day ${day}: ${CityDisplayService.getCityDisplayName(currentStop)} to ${CityDisplayService.getCityDisplayName(nextStop)}`;
    
    // Check if this is a consecutive pair
    const pairKey = `${currentStop.id}-${nextStop.id}`;
    const consecutivePair = consecutivePairMap.get(pairKey);
    
    if (consecutivePair && consecutivePair.bonus > 0) {
      return `${baseTitle} ⭐ Iconic Route 66 Heritage Corridor`;
    }
    
    if (nextClassification.tier === 'major') {
      return `${baseTitle} 🏙️ Major Route 66 Destination`;
    }
    
    if (nextClassification.tier === 'secondary') {
      return `${baseTitle} 🎯 Historic Route 66 Stop`;
    }
    
    return baseTitle;
  }

  /**
   * Get segment context for route section
   */
  private static getSegmentContext(stop: TripStop, gapFillerMap: Map<string, any>): string {
    const gapFiller = gapFillerMap.get(stop.id);
    if (gapFiller) {
      return `(Strategic Stop)`;
    }
    
    const classification = Route66CityClassifier.classifyCity(stop);
    return classification.tier === 'major' ? '(Heritage City)' : '';
  }

  /**
   * Generate optimization-specific warnings
   */
  private static generateOptimizationWarnings(optimizationResult: any): string[] {
    const warnings: string[] = [];
    
    if (optimizationResult.gapFillers.length > 0) {
      const longGaps = optimizationResult.gapFillers.filter((f: any) => f.gapHours > 9);
      if (longGaps.length > 0) {
        warnings.push(`${longGaps.length} drive days exceed 9 hours due to major city prioritization`);
      }
    }
    
    if (optimizationResult.consecutivePairs.length === 0) {
      warnings.push('No consecutive major cities found - route may have long gaps between heritage destinations');
    }
    
    return warnings;
  }

  /**
   * Enhance route assessment with consecutive city analysis
   */
  private static enhanceRouteAssessment(
    baseAssessment: any,
    optimizationResult: any
  ) {
    const consecutivePairs = optimizationResult.consecutivePairs.length;
    const gapFillers = optimizationResult.gapFillers.length;
    
    let enhancedSummary = baseAssessment.summary;
    
    if (consecutivePairs > 0) {
      enhancedSummary += ` Features ${consecutivePairs} consecutive major city pairs for authentic Route 66 heritage experience.`;
    }
    
    if (gapFillers > 0) {
      enhancedSummary += ` Includes ${gapFillers} strategic stops to maintain reasonable drive times.`;
    }
    
    // Adjust recommendation based on optimization success
    const isRecommended = baseAssessment.isRecommended || 
                         (consecutivePairs >= 2 && gapFillers <= 2);
    
    return {
      ...baseAssessment,
      isRecommended,
      summary: enhancedSummary,
      consecutivePairs,
      optimizationScore: optimizationResult.priorityScore
    };
  }

  /**
   * Find attractions along optimized destination segments
   */
  private static findAttractionsForOptimizedSegment(
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
   * Get optimized drive time category with context
   */
  private static getOptimizedDriveTimeCategory(
    driveTimeHours: number,
    currentStop: TripStop,
    nextStop: TripStop,
    consecutivePairMap: Map<string, any>,
    gapFillerMap: Map<string, any>
  ): DriveTimeCategory {
    const pairKey = `${currentStop.id}-${nextStop.id}`;
    const isConsecutivePair = consecutivePairMap.has(pairKey);
    const isGapFiller = gapFillerMap.has(nextStop.id);
    
    if (driveTimeHours <= 4) {
      return {
        category: 'short',
        message: `${driveTimeHours.toFixed(1)} hours - ${isConsecutivePair ? 'Quick hop between major heritage cities' : 'Relaxed pace with time for attractions'}`,
        color: 'text-green-800'
      };
    } else if (driveTimeHours <= 6) {
      return {
        category: 'optimal',
        message: `${driveTimeHours.toFixed(1)} hours - ${isConsecutivePair ? 'Perfect connection between Route 66 destinations' : 'Comfortable drive with exploration time'}`,
        color: 'text-blue-800'
      };
    } else if (driveTimeHours <= 8) {
      return {
        category: 'long',
        message: `${driveTimeHours.toFixed(1)} hours - ${isConsecutivePair ? 'Longer drive connecting major heritage cities' : isGapFiller ? 'Strategic stop preventing extreme drive day' : 'Substantial drive day'}`,
        color: 'text-orange-800'
      };
    } else {
      return {
        category: 'extreme',
        message: `${driveTimeHours.toFixed(1)} hours - ${isConsecutivePair ? 'Extended drive for major city connection - plan rest stops' : 'Very long drive day, consider breaking up'}`,
        color: 'text-red-800'
      };
    }
  }

  /**
   * Calculate drive time balance for optimized destination-focused trips
   */
  private static calculateOptimizedDestinationBalance(segments: DailySegment[], routeAssessment: any, optimizationResult: any) {
    const driveTimes = segments.map(seg => seg.driveTimeHours);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const variance = Math.sqrt(
      driveTimes.reduce((sum, time) => sum + Math.pow(time - averageDriveTime, 2), 0) / driveTimes.length
    );

    const minTime = Math.min(...driveTimes);
    const maxTime = Math.max(...driveTimes);

    // For optimized destination-focused, balance heritage value with safety
    const consecutivePairBonus = optimizationResult.consecutivePairs.length * 10;
    const safetyPenalty = Math.max(0, maxTime - 10) * 20;
    
    const isBalanced = maxTime <= 10 && routeAssessment.isRecommended;

    const balanceQuality: 'excellent' | 'good' | 'fair' | 'poor' = 
      isBalanced && maxTime <= 6 && optimizationResult.consecutivePairs.length >= 2 ? 'excellent' :
      isBalanced && maxTime <= 8 && optimizationResult.consecutivePairs.length >= 1 ? 'good' :
      isBalanced && maxTime <= 10 ? 'fair' : 'poor';

    const qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 
      balanceQuality === 'excellent' ? 'A' :
      balanceQuality === 'good' ? 'B' :
      balanceQuality === 'fair' ? 'C' :
      maxTime <= 10 ? 'D' : 'F';

    // Score based on heritage optimization success
    const overallScore = Math.max(0, 
      70 + consecutivePairBonus - safetyPenalty - (variance * 5)
    );

    const suggestions: string[] = [];
    if (maxTime > 10) {
      suggestions.push(`Day with ${maxTime.toFixed(1)}h drive time exceeds safe limits`);
    }
    if (optimizationResult.consecutivePairs.length === 0) {
      suggestions.push('Consider switching to Balanced mode for more evenly distributed stops');
    }
    if (optimizationResult.gapFillers.length > 2) {
      suggestions.push('Route requires multiple gap-filling stops - consider adding more days');
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
      reason: isBalanced ? 
        `Optimized Route 66 heritage experience with ${optimizationResult.consecutivePairs.length} consecutive major city connections` :
        maxTime > 10 ? `Maximum drive time (${maxTime.toFixed(1)}h) exceeds safe limits` :
        'Route prioritizes major heritage cities but requires challenging drive times'
    };
  }
}
