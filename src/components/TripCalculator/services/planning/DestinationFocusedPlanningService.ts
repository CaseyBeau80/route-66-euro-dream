import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { GapDetectionService, RouteGap } from './GapDetectionService';
import { DailySegment, TripPlan, DriveTimeCategory, RecommendedStop, DriveTimeBalance } from './TripPlanBuilder';
import { ConsecutiveMajorCitiesOptimizer } from './ConsecutiveMajorCitiesOptimizer';
import { Route66CityClassifier } from './Route66CityClassifier';
import { Route66SequenceValidator } from './utils/Route66SequenceValidator';
import { Route66SequenceEnforcer } from './Route66SequenceEnforcer';
import { EnhancedDestinationSelector } from './EnhancedDestinationSelector';

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
  sequenceValidation?: {
    isValid: boolean;
    violations: string[];
    sequenceQuality: 'excellent' | 'good' | 'fair' | 'poor';
  };
}

export class DestinationFocusedPlanningService {
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * Create a destination-focused trip plan with Route 66 sequence enforcement
   */
  static createDestinationFocusedPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string
  ): DestinationFocusedResult {
    console.log(`🏙️ Creating SEQUENCE-AWARE destination-focused trip plan: ${inputStartCity} → ${inputEndCity} in ${requestedDays} days`);

    // STEP 1: Use enhanced destination selector with sequence enforcement
    const selectedDestinationCities = EnhancedDestinationSelector.selectDestinationCitiesForTrip(
      startStop,
      endStop,
      allStops,
      requestedDays
    );

    console.log(`🎯 SEQUENCE-SELECTED: ${selectedDestinationCities.length} destination cities with proper Route 66 order`);

    // STEP 2: Validate sequence integrity before proceeding
    const sequenceIntegrity = Route66SequenceEnforcer.validateTripSequenceIntegrity(
      startStop,
      selectedDestinationCities,
      endStop
    );

    if (!sequenceIntegrity.isValid) {
      console.warn(`⚠️ SEQUENCE INTEGRITY ISSUES:`, sequenceIntegrity.violations);
    }

    // Filter to exclude start and end stops from available stops for optimization
    const availableStops = allStops.filter(stop => 
      stop.id !== startStop.id && stop.id !== endStop.id
    );

    console.log(`🎯 Found ${availableStops.length} available stops for optimization`);

    // Use the new optimizer with sequence-validated destinations
    const optimizationResult = ConsecutiveMajorCitiesOptimizer.optimizeRoute(
      startStop,
      endStop,
      selectedDestinationCities.length > 0 ? selectedDestinationCities : availableStops,
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

    // STEP 3: Enforce Route 66 sequence order in final segments
    const sequenceEnforcement = Route66SequenceEnforcer.enforceSequenceOrder(segments);
    console.log(`🔒 SEQUENCE ENFORCEMENT: ${sequenceEnforcement.summary}`);

    // Add sequence violations to warnings
    const sequenceWarnings = sequenceEnforcement.violations.map(v => 
      `Day ${v.day}: Sequence violation ${v.from} → ${v.to} (${v.violation})`
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
    
    // Add sequence warnings
    warnings.push(...sequenceWarnings);

    const routeAssessment = GapDetectionService.getRouteAssessment(routeGaps);

    // Enhance route assessment with consecutive city analysis and sequence validation
    const enhancedAssessment = this.enhanceRouteAssessment(routeAssessment, optimizationResult, sequenceEnforcement);

    console.log(`⚠️ Enhanced route assessment: ${enhancedAssessment.summary} (${optimizationResult.consecutivePairs.length} consecutive pairs, sequence: ${sequenceEnforcement.isValid ? 'valid' : 'invalid'})`);

    // Calculate total metrics
    const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

    // Get sequence quality summary
    const sequenceQualitySummary = Route66SequenceEnforcer.getSequenceEnforcementSummary(segments);

    const tripPlan: TripPlan = {
      id: `sequence-optimized-trip-${Math.random().toString(36).substring(2, 9)}`,
      title: `${inputStartCity} to ${inputEndCity} - Sequence-Validated Route 66 Heritage Journey`,
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
      },
      sequenceValidation: {
        isValid: sequenceEnforcement.isValid,
        violations: sequenceEnforcement.violations.map(v => `Day ${v.day}: ${v.violation}`),
        sequenceQuality: sequenceQualitySummary.sequenceQuality
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

      // Validate sequence before creating segment
      const sequenceValidation = Route66SequenceValidator.validateSequence(currentStop, nextStop, endStop);
      
      if (!sequenceValidation.isValid) {
        console.warn(`⚠️ SEQUENCE WARNING Day ${day}: ${sequenceValidation.reason}`);
      }

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

      // Create enhanced title with city tier information and sequence validation
      const title = this.createEnhancedSegmentTitle(
        day,
        currentStop,
        nextStop,
        currentClassification,
        nextClassification,
        consecutivePairMap,
        sequenceValidation
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
          state: nextStop.state
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

      // Add sequence validation warning if needed
      if (!sequenceValidation.isValid) {
        segment.notes = `⚠️ Route 66 Sequence: ${sequenceValidation.reason}`;
      }

      segments.push(segment);
      console.log(`🏙️ Day ${day}: ${startStop.name} → ${nextStop.name} | ${segmentDistance.toFixed(1)}mi | ${driveTimeHours.toFixed(1)}h | Sequence: ${sequenceValidation.isValid ? 'Valid' : 'Invalid'}`);
    }

    return segments;
  }

  /**
   * Create enhanced segment title with sequence validation status
   */
  private static createEnhancedSegmentTitle(
    day: number,
    currentStop: TripStop,
    nextStop: TripStop,
    currentClassification: any,
    nextClassification: any,
    consecutivePairMap: Map<string, any>,
    sequenceValidation: any
  ): string {
    const baseTitle = `Day ${day}: ${CityDisplayService.getCityDisplayName(currentStop)} to ${CityDisplayService.getCityDisplayName(nextStop)}`;
    
    // Check if this is a consecutive pair
    const pairKey = `${currentStop.id}-${nextStop.id}`;
    const consecutivePair = consecutivePairMap.get(pairKey);
    
    // Add sequence validation indicator
    const sequenceIndicator = sequenceValidation.isValid ? '' : ' ⚠️';
    
    if (consecutivePair && consecutivePair.bonus > 0) {
      return `${baseTitle} ⭐ Iconic Route 66 Heritage Corridor${sequenceIndicator}`;
    }
    
    if (nextClassification.tier === 'major') {
      return `${baseTitle} 🏙️ Major Route 66 Destination${sequenceIndicator}`;
    }
    
    if (nextClassification.tier === 'secondary') {
      return `${baseTitle} 🎯 Historic Route 66 Stop${sequenceIndicator}`;
    }
    
    return `${baseTitle}${sequenceIndicator}`;
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
   * Enhance route assessment with consecutive city analysis and sequence validation
   */
  private static enhanceRouteAssessment(
    baseAssessment: any,
    optimizationResult: any,
    sequenceEnforcement: any
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

    // Add sequence validation summary
    if (sequenceEnforcement.isValid) {
      enhancedSummary += ` ✅ Maintains proper Route 66 sequence order with no backtracking.`;
    } else {
      enhancedSummary += ` ⚠️ Contains ${sequenceEnforcement.violations.length} sequence violations requiring attention.`;
    }
    
    // Adjust recommendation based on optimization success and sequence validation
    const isRecommended = baseAssessment.isRecommended && 
                         sequenceEnforcement.isValid &&
                         (consecutivePairs >= 2 && gapFillers <= 2);
    
    return {
      ...baseAssessment,
      isRecommended,
      summary: enhancedSummary,
      consecutivePairs,
      optimizationScore: optimizationResult.priorityScore,
      sequenceValid: sequenceEnforcement.isValid
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

    // Convert to RecommendedStops with stopId
    return topStops.map(item => ({
      stopId: item.stop.id, // Add required stopId
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
  private static calculateOptimizedDestinationBalance(segments: DailySegment[], routeAssessment: any, optimizationResult: any): DriveTimeBalance {
    const driveTimes = segments.map(seg => seg.driveTimeHours);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const variance = Math.sqrt(
      driveTimes.reduce((sum, time) => sum + Math.pow(time - averageDriveTime, 2), 0) / driveTimes.length
    );

    const minTime = Math.min(...driveTimes);
    const maxTime = Math.max(...driveTimes);

    // For optimized destination-focused, balance heritage value with safety and sequence adherence
    const consecutivePairBonus = optimizationResult.consecutivePairs.length * 10;
    const sequenceBonus = routeAssessment.sequenceValid ? 20 : -30; // Big penalty for sequence violations
    const safetyPenalty = Math.max(0, maxTime - 10) * 20;
    
    const isBalanced = maxTime <= 10 && routeAssessment.isRecommended && routeAssessment.sequenceValid;

    const balanceQuality: 'excellent' | 'good' | 'fair' | 'poor' = 
      isBalanced && maxTime <= 6 && optimizationResult.consecutivePairs.length >= 2 && routeAssessment.sequenceValid ? 'excellent' :
      isBalanced && maxTime <= 8 && optimizationResult.consecutivePairs.length >= 1 && routeAssessment.sequenceValid ? 'good' :
      isBalanced && maxTime <= 10 && routeAssessment.sequenceValid ? 'fair' : 'poor';

    const qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 
      balanceQuality === 'excellent' ? 'A' :
      balanceQuality === 'good' ? 'B' :
      balanceQuality === 'fair' ? 'C' :
      maxTime <= 10 && routeAssessment.sequenceValid ? 'D' : 'F';

    // Score based on heritage optimization success and sequence adherence
    const overallScore = Math.max(0, 
      70 + consecutivePairBonus + sequenceBonus - safetyPenalty - (variance * 5)
    );

    const suggestions: string[] = [];
    if (maxTime > 10) {
      suggestions.push(`Day with ${maxTime.toFixed(1)}h drive time exceeds safe limits`);
    }
    if (!routeAssessment.sequenceValid) {
      suggestions.push('Route contains backtracking - consider reordering stops');
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
      reason: isBalanced && routeAssessment.sequenceValid ? 
        `Sequence-validated Route 66 heritage experience with ${optimizationResult.consecutivePairs.length} consecutive major city connections` :
        !routeAssessment.sequenceValid ? 'Route contains backtracking violations of Route 66 sequence order' :
        maxTime > 10 ? `Maximum drive time (${maxTime.toFixed(1)}h) exceeds safe limits` :
        'Route prioritizes major heritage cities but requires challenging drive times'
    };
  }
}
