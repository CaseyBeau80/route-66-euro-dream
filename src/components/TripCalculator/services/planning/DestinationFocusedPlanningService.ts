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
import { CanonicalRoute66Cities } from './CanonicalRoute66Cities';
import { TripStyleConfig, TripStyleLogic } from './TripStyleLogic';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';

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
  canonicalCoverage?: {
    includedCanonical: number;
    totalCanonical: number;
    majorIncluded: number;
    coverage: number;
  };
  driveTimeEnforcement?: {
    violationsFound: number;
    segmentsRebalanced: number;
    intermediateStopsAdded: number;
    warnings: string[];
  };
}

export class DestinationFocusedPlanningService {
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * ENHANCED: Create destination-focused plan with strict drive time enforcement
   */
  static createDestinationFocusedPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string
  ): DestinationFocusedResult {
    console.log(`🏙️ ENHANCED DESTINATION-FOCUSED WITH DRIVE TIME ENFORCEMENT: ${inputStartCity} → ${inputEndCity} in ${requestedDays} days (max 14)`);

    // Get style configuration for destination-focused trips
    const styleConfig = TripStyleLogic.getStyleConfig('destination-focused');
    console.log(`⚙️ STYLE CONFIG: Max ${styleConfig.maxDailyDriveHours}h/day, enforcement: ${styleConfig.enforcementLevel}`);

    // Enforce 14-day maximum
    const effectiveDays = Math.min(requestedDays, 14);
    if (effectiveDays < requestedDays) {
      console.log(`⚠️ CANONICAL: Limiting trip to ${effectiveDays} days (14-day maximum enforced)`);
    }

    // STEP 1: Use enhanced destination selector with canonical city prioritization
    const selectedDestinationCities = EnhancedDestinationSelector.selectDestinationCitiesForTrip(
      startStop,
      endStop,
      allStops,
      effectiveDays
    );

    console.log(`🎯 CANONICAL SELECTED: ${selectedDestinationCities.length} destination cities with canonical prioritization`);

    // STEP 2: Get canonical coverage analysis
    const canonicalCoverage = CanonicalRoute66Cities.getDestinationCoverage(selectedDestinationCities);
    console.log(`📊 CANONICAL COVERAGE: ${canonicalCoverage.coverage}% (${canonicalCoverage.includedCanonical}/${canonicalCoverage.totalCanonical} destinations)`);

    // STEP 3: Validate sequence integrity
    const sequenceIntegrity = Route66SequenceEnforcer.validateTripSequenceIntegrity(
      startStop,
      selectedDestinationCities,
      endStop
    );

    if (!sequenceIntegrity.isValid) {
      console.warn(`⚠️ CANONICAL SEQUENCE ISSUES:`, sequenceIntegrity.violations);
    }

    // STEP 4: Protect from over-filtering by ensuring minimum destination coverage
    const protectedDestinations = this.protectFromOverFiltering(
      selectedDestinationCities,
      allStops,
      effectiveDays,
      canonicalCoverage
    );

    // STEP 5: Use optimizer with protected destinations
    const optimizationResult = ConsecutiveMajorCitiesOptimizer.optimizeRoute(
      startStop,
      endStop,
      protectedDestinations,
      effectiveDays
    );

    console.log(`🏙️ CANONICAL OPTIMIZATION: ${optimizationResult.optimizedStops.length} stops selected with ${optimizationResult.consecutivePairs.length} consecutive pairs`);

    // STEP 6: ENHANCED - Apply drive time enforcement before creating segments
    const enforcedSegmentsResult = this.enforceAndRebalanceDriveTimes(
      startStop,
      endStop,
      optimizationResult.optimizedStops,
      allStops,
      styleConfig
    );

    console.log(`🚗 DRIVE TIME ENFORCEMENT: ${enforcedSegmentsResult.violationsFound} violations, ${enforcedSegmentsResult.segmentsRebalanced} rebalanced, ${enforcedSegmentsResult.intermediateStopsAdded} stops added`);

    // Create segments using enforced route
    const segments = this.createEnforcedDestinationSegments(
      enforcedSegmentsResult.enforcedRoute,
      allStops,
      optimizationResult,
      styleConfig
    );

    // STEP 7: Enforce Route 66 sequence order in final segments
    const sequenceEnforcement = Route66SequenceEnforcer.enforceSequenceOrder(segments);
    console.log(`🔒 CANONICAL SEQUENCE ENFORCEMENT: ${sequenceEnforcement.summary}`);

    // Generate warnings with drive time enforcement context
    const warnings = this.generateEnhancedWarnings(
      optimizationResult, 
      sequenceEnforcement, 
      canonicalCoverage,
      effectiveDays,
      requestedDays,
      enforcedSegmentsResult
    );

    // Calculate route gaps and assessment
    const allDestinations = enforcedSegmentsResult.enforcedRoute;
    const routeGaps = GapDetectionService.detectRouteGaps(allDestinations);
    const baseAssessment = GapDetectionService.getRouteAssessment(routeGaps);
    
    // Enhance assessment with canonical coverage and drive time compliance
    const enhancedAssessment = this.enhanceRouteAssessmentWithDriveTime(
      baseAssessment, 
      optimizationResult, 
      sequenceEnforcement,
      canonicalCoverage,
      enforcedSegmentsResult
    );

    // Calculate total distance and metrics
    const totalDistance = this.calculateTotalRouteDistance(enforcedSegmentsResult.enforcedRoute);
    const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

    const tripPlan: TripPlan = {
      id: `enhanced-destination-trip-${Math.random().toString(36).substring(2, 9)}`,
      title: `${inputStartCity} to ${inputEndCity} - Drive-Time Optimized Route 66 Heritage Journey`,
      startCity: inputStartCity,
      endCity: inputEndCity,
      startDate: new Date(),
      totalDays: segments.length,
      totalDistance: Math.round(totalDistance),
      totalMiles: Math.round(totalDistance),
      totalDrivingTime: parseFloat(totalDrivingTime.toFixed(1)),
      segments,
      dailySegments: segments,
      driveTimeBalance: this.calculateEnhancedDestinationBalance(segments, enhancedAssessment, canonicalCoverage, enforcedSegmentsResult)
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
        sequenceQuality: sequenceEnforcement.isValid ? 'excellent' : 'fair'
      },
      canonicalCoverage,
      driveTimeEnforcement: enforcedSegmentsResult
    };
  }

  /**
   * ENHANCED: Enforce drive time limits and rebalance segments
   */
  private static enforceAndRebalanceDriveTimes(
    startStop: TripStop,
    endStop: TripStop,
    optimizedStops: TripStop[],
    allStops: TripStop[],
    styleConfig: TripStyleConfig
  ): {
    enforcedRoute: TripStop[];
    violationsFound: number;
    segmentsRebalanced: number;
    intermediateStopsAdded: number;
    warnings: string[];
  } {
    console.log(`🚗 ENFORCING DRIVE TIMES: Checking ${optimizedStops.length} destination segments`);
    
    const initialRoute = [startStop, ...optimizedStops, endStop];
    const enforcedRoute: TripStop[] = [startStop];
    let violationsFound = 0;
    let segmentsRebalanced = 0;
    let totalIntermediateStopsAdded = 0;
    const warnings: string[] = [];

    // Check each segment between consecutive destinations
    for (let i = 0; i < initialRoute.length - 1; i++) {
      const currentStop = initialRoute[i];
      const nextStop = initialRoute[i + 1];
      
      console.log(`🔍 CHECKING SEGMENT: ${currentStop.name} → ${nextStop.name}`);
      
      const enforcementResult = DriveTimeEnforcementService.enforceMaxDriveTimePerSegment(
        currentStop,
        nextStop,
        allStops,
        styleConfig
      );
      
      if (!enforcementResult.isValid) {
        violationsFound++;
        console.log(`❌ VIOLATION FOUND: ${currentStop.name} → ${nextStop.name}`);
      }
      
      if (enforcementResult.segments.length > 1) {
        segmentsRebalanced++;
        totalIntermediateStopsAdded += enforcementResult.intermediateStopsAdded;
        console.log(`🔧 REBALANCED: Split into ${enforcementResult.segments.length} segments`);
        
        // Add intermediate stops to the route
        for (let j = 0; j < enforcementResult.segments.length; j++) {
          const segment = enforcementResult.segments[j];
          
          // Add intermediate end stops (but not the final destination if it's not the last segment)
          if (j < enforcementResult.segments.length - 1) {
            enforcedRoute.push(segment.endStop);
          }
        }
      }
      
      // Add warnings
      warnings.push(...enforcementResult.warnings);
      
      // Always add the final destination (unless it's already added)
      if (i === initialRoute.length - 2) {
        enforcedRoute.push(nextStop);
      }
    }

    console.log(`✅ ENFORCEMENT COMPLETE: ${violationsFound} violations, ${segmentsRebalanced} rebalanced, ${totalIntermediateStopsAdded} stops added`);
    console.log(`📍 ENFORCED ROUTE: ${enforcedRoute.length} stops`, enforcedRoute.map(s => s.name));

    return {
      enforcedRoute,
      violationsFound,
      segmentsRebalanced,
      intermediateStopsAdded: totalIntermediateStopsAdded,
      warnings
    };
  }

  /**
   * Calculate total route distance
   */
  private static calculateTotalRouteDistance(route: TripStop[]): number {
    let totalDistance = 0;
    
    for (let i = 0; i < route.length - 1; i++) {
      const currentStop = route[i];
      const nextStop = route[i + 1];
      
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        nextStop.latitude, nextStop.longitude
      );
      
      totalDistance += segmentDistance;
    }
    
    return totalDistance;
  }

  /**
   * Create segments from enforced route with drive time validation
   */
  private static createEnforcedDestinationSegments(
    enforcedRoute: TripStop[],
    allStops: TripStop[],
    optimizationResult: any,
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    const segments: DailySegment[] = [];

    // Filter stops for attractions (exclude destination cities and used stops)
    const usedStopIds = new Set(enforcedRoute.map(d => d.id));
    const attractionStops = allStops.filter(stop => !usedStopIds.has(stop.id));

    for (let i = 0; i < enforcedRoute.length - 1; i++) {
      const currentStop = enforcedRoute[i];
      const nextStop = enforcedRoute[i + 1];
      const day = i + 1;

      // Validate sequence before creating segment
      const sequenceValidation = Route66SequenceValidator.validateSequence(currentStop, nextStop, enforcedRoute[enforcedRoute.length - 1]);
      
      if (!sequenceValidation.isValid) {
        console.warn(`⚠️ SEQUENCE WARNING Day ${day}: ${sequenceValidation.reason}`);
      }

      // Calculate segment metrics
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        nextStop.latitude, nextStop.longitude
      );
      const driveTimeHours = DriveTimeEnforcementService.calculateRealisticDriveTime(segmentDistance);

      // Validate drive time compliance
      const driveTimeValidation = DriveTimeEnforcementService.validateSegmentDriveTime(
        currentStop,
        nextStop,
        styleConfig
      );

      // Find attractions along this segment
      const segmentAttractions = this.findAttractionsForOptimizedSegment(
        currentStop,
        nextStop,
        attractionStops,
        4
      );

      // Determine drive time category with enforcement context
      const driveTimeCategory = this.getEnforcedDriveTimeCategory(
        driveTimeHours,
        driveTimeValidation,
        styleConfig
      );

      // Get classification info for stops
      const currentClassification = Route66CityClassifier.classifyCity(currentStop);
      const nextClassification = Route66CityClassifier.classifyCity(nextStop);

      // Create enhanced title with drive time context
      const title = this.createEnforcedSegmentTitle(
        day,
        currentStop,
        nextStop,
        driveTimeValidation,
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
        routeSection: `Drive-Time Optimized Route 66 - ${nextStop.state} ${this.getDriveTimeSegmentContext(driveTimeValidation)}`
      };

      // Add warnings for drive time or sequence issues
      const segmentWarnings: string[] = [];
      if (!driveTimeValidation.isValid) {
        segmentWarnings.push(`⚠️ Drive Time: ${driveTimeValidation.actualDriveTime.toFixed(1)}h exceeds ${styleConfig.maxDailyDriveHours}h safe limit`);
      }
      if (!sequenceValidation.isValid) {
        segmentWarnings.push(`⚠️ Route 66 Sequence: ${sequenceValidation.reason}`);
      }
      
      if (segmentWarnings.length > 0) {
        segment.notes = segmentWarnings.join(' | ');
      }

      segments.push(segment);
      console.log(`🏙️ ENFORCED Day ${day}: ${currentStop.name} → ${nextStop.name} | ${segmentDistance.toFixed(1)}mi | ${driveTimeHours.toFixed(1)}h | Valid: ${driveTimeValidation.isValid}`);
    }

    return segments;
  }

  /**
   * Create enhanced segment title with drive time enforcement context
   */
  private static createEnforcedSegmentTitle(
    day: number,
    currentStop: TripStop,
    nextStop: TripStop,
    driveTimeValidation: any,
    sequenceValidation: any
  ): string {
    const baseTitle = `Day ${day}: ${CityDisplayService.getCityDisplayName(currentStop)} to ${CityDisplayService.getCityDisplayName(nextStop)}`;
    
    // Add drive time indicator
    let driveTimeIndicator = '';
    if (driveTimeValidation.isValid) {
      driveTimeIndicator = ' ✅ Safe Drive Time';
    } else {
      driveTimeIndicator = ` ⚠️ Long Drive (${driveTimeValidation.actualDriveTime.toFixed(1)}h)`;
    }
    
    // Add sequence validation indicator
    const sequenceIndicator = sequenceValidation.isValid ? '' : ' 🔄';
    
    return `${baseTitle}${driveTimeIndicator}${sequenceIndicator}`;
  }

  /**
   * Get drive time segment context
   */
  private static getDriveTimeSegmentContext(driveTimeValidation: any): string {
    if (driveTimeValidation.isValid) {
      return '(Safe Drive Time)';
    } else {
      return `(${driveTimeValidation.actualDriveTime.toFixed(1)}h Drive - Caution)`;
    }
  }

  /**
   * Get enhanced drive time category with enforcement context
   */
  private static getEnforcedDriveTimeCategory(
    driveTimeHours: number,
    driveTimeValidation: any,
    styleConfig: TripStyleConfig
  ): DriveTimeCategory {
    const isWithinLimits = driveTimeValidation.isValid;
    
    if (driveTimeHours <= 4) {
      return {
        category: 'short',
        message: `${driveTimeHours.toFixed(1)} hours - ${isWithinLimits ? 'Perfect for sightseeing' : 'Short drive with time for exploration'}`
      };
    } else if (driveTimeHours <= 6) {
      return {
        category: 'medium',
        message: `${driveTimeHours.toFixed(1)} hours - ${isWithinLimits ? 'Comfortable pace with breaks' : 'Moderate drive with planned stops'}`
      };
    } else if (driveTimeHours <= styleConfig.maxDailyDriveHours) {
      return {
        category: 'long',
        message: `${driveTimeHours.toFixed(1)} hours - ${isWithinLimits ? 'Within safe limits' : 'Long but manageable drive'}`
      };
    } else {
      return {
        category: 'very_long',
        message: `${driveTimeHours.toFixed(1)} hours - ⚠️ Exceeds ${styleConfig.maxDailyDriveHours}h safe limit, consider breaking into multiple days`
      };
    }
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
        console.warn(`⚠️ CANONICAL SEQUENCE WARNING Day ${day}: ${sequenceValidation.reason}`);
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

      // Determine drive time category with canonical context
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

      // Create enhanced title with canonical context
      const title = this.createCanonicalSegmentTitle(
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
        routeSection: `Historic Route 66 - ${nextStop.state} ${this.getCanonicalSegmentContext(nextStop, gapFillerMap)}`
      };

      // Add sequence validation warning if needed
      if (!sequenceValidation.isValid) {
        segment.notes = `⚠️ Route 66 Sequence: ${sequenceValidation.reason}`;
      }

      segments.push(segment);
      console.log(`🏙️ CANONICAL Day ${day}: ${currentStop.name} → ${nextStop.name} | ${segmentDistance.toFixed(1)}mi | ${driveTimeHours.toFixed(1)}h`);
    }

    return segments;
  }

  /**
   * Create enhanced segment title with canonical context
   */
  private static createCanonicalSegmentTitle(
    day: number,
    currentStop: TripStop,
    nextStop: TripStop,
    currentClassification: any,
    nextClassification: any,
    consecutivePairMap: Map<string, any>,
    sequenceValidation: any
  ): string {
    const baseTitle = `Day ${day}: ${CityDisplayService.getCityDisplayName(currentStop)} to ${CityDisplayService.getCityDisplayName(nextStop)}`;
    
    // Check canonical status
    const isCanonical = CanonicalRoute66Cities.isCanonicalDestination(
      nextStop.city_name || nextStop.name,
      nextStop.state
    );
    
    const canonicalInfo = CanonicalRoute66Cities.getDestinationInfo(
      nextStop.city_name || nextStop.name,
      nextStop.state
    );
    
    // Add sequence validation indicator
    const sequenceIndicator = sequenceValidation.isValid ? '' : ' ⚠️';
    
    if (isCanonical && canonicalInfo) {
      if (canonicalInfo.tier === 'major') {
        return `${baseTitle} 🏛️ Canonical Route 66 Heritage City${sequenceIndicator}`;
      } else {
        return `${baseTitle} 🎯 Official Route 66 Destination${sequenceIndicator}`;
      }
    }
    
    // Check if this is a consecutive pair
    const pairKey = `${currentStop.id}-${nextStop.id}`;
    const consecutivePair = consecutivePairMap.get(pairKey);
    
    if (consecutivePair && consecutivePair.bonus > 0) {
      return `${baseTitle} ⭐ Heritage Corridor Connection${sequenceIndicator}`;
    }
    
    return `${baseTitle}${sequenceIndicator}`;
  }

  /**
   * Get canonical segment context for route section
   */
  private static getCanonicalSegmentContext(stop: TripStop, gapFillerMap: Map<string, any>): string {
    const isCanonical = CanonicalRoute66Cities.isCanonicalDestination(
      stop.city_name || stop.name,
      stop.state
    );
    
    if (isCanonical) {
      const canonicalInfo = CanonicalRoute66Cities.getDestinationInfo(
        stop.city_name || stop.name,
        stop.state
      );
      return canonicalInfo?.tier === 'major' ? '(Canonical Heritage City)' : '(Official Destination)';
    }
    
    const gapFiller = gapFillerMap.get(stop.id);
    if (gapFiller) {
      return `(Strategic Stop)`;
    }
    
    return '';
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
   * Get optimized drive time category with canonical context
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
    const isCanonical = CanonicalRoute66Cities.isCanonicalDestination(
      nextStop.city_name || nextStop.name,
      nextStop.state
    );
    
    if (driveTimeHours <= 4) {
      return {
        category: 'short',
        message: `${driveTimeHours.toFixed(1)} hours - ${isCanonical ? 'Quick hop to canonical destination' : isConsecutivePair ? 'Quick hop between major heritage cities' : 'Relaxed pace with time for attractions'}`,
        color: 'text-green-800'
      };
    } else if (driveTimeHours <= 6) {
      return {
        category: 'optimal',
        message: `${driveTimeHours.toFixed(1)} hours - ${isCanonical ? 'Perfect drive to canonical Route 66 city' : isConsecutivePair ? 'Perfect connection between Route 66 destinations' : 'Comfortable drive with exploration time'}`,
        color: 'text-blue-800'
      };
    } else if (driveTimeHours <= 8) {
      return {
        category: 'long',
        message: `${driveTimeHours.toFixed(1)} hours - ${isCanonical ? 'Longer drive for canonical destination access' : isConsecutivePair ? 'Longer drive connecting major heritage cities' : isGapFiller ? 'Strategic stop preventing extreme drive day' : 'Substantial drive day'}`,
        color: 'text-orange-800'
      };
    } else {
      return {
        category: 'extreme',
        message: `${driveTimeHours.toFixed(1)} hours - ${isCanonical ? 'Extended drive for canonical destination - plan rest stops' : isConsecutivePair ? 'Extended drive for major city connection - plan rest stops' : 'Very long drive day, consider breaking up'}`,
        color: 'text-red-800'
      };
    }
  }

  /**
   * Protect from over-filtering by ensuring minimum canonical destination coverage
   */
  private static protectFromOverFiltering(
    selectedDestinations: TripStop[],
    allStops: TripStop[],
    effectiveDays: number,
    canonicalCoverage: any
  ): TripStop[] {
    console.log(`🛡️ PROTECTION: Analyzing coverage for ${effectiveDays} days`);
    
    // If we have good canonical coverage, use selected destinations
    if (canonicalCoverage.coverage >= 50 && selectedDestinations.length >= Math.min(effectiveDays - 1, 5)) {
      console.log(`✅ PROTECTION: Good coverage (${canonicalCoverage.coverage}%), using selected destinations`);
      return selectedDestinations;
    }

    // If under-filtered, add more canonical destinations
    console.log(`⚠️ PROTECTION: Low coverage (${canonicalCoverage.coverage}%), adding more canonical destinations`);
    
    const allCanonicalStops = CanonicalRoute66Cities.matchStopsToCanonical(allStops);
    const additionalStops: TripStop[] = [];
    const maxNeeded = Math.min(effectiveDays - 1, 8); // Cap at reasonable number
    
    // Add high-priority canonical destinations not already included
    for (const canonical of CanonicalRoute66Cities.getForcedInclusionDestinations()) {
      if (additionalStops.length + selectedDestinations.length >= maxNeeded) break;
      
      const alreadyIncluded = selectedDestinations.some(stop => 
        CanonicalRoute66Cities.isCanonicalDestination(stop.city_name || stop.name, stop.state)
      );
      
      if (!alreadyIncluded) {
        const matchingStop = allCanonicalStops.find(stop => 
          CanonicalRoute66Cities.isCanonicalDestination(stop.city_name || stop.name, stop.state) &&
          (stop.name.toLowerCase().includes(canonical.name.toLowerCase()) ||
           stop.city_name.toLowerCase().includes(canonical.name.toLowerCase())) &&
          stop.state.toLowerCase() === canonical.state.toLowerCase()
        );
        
        if (matchingStop) {
          additionalStops.push(matchingStop);
          console.log(`✅ PROTECTION: Added canonical destination ${canonical.name}, ${canonical.state}`);
        }
      }
    }
    
    const protectedDestinations = [...selectedDestinations, ...additionalStops];
    console.log(`🛡️ PROTECTION: Final count ${protectedDestinations.length} destinations (added ${additionalStops.length})`);
    
    return protectedDestinations;
  }

  /**
   * Generate canonical-aware warnings
   */
  private static generateCanonicalWarnings(
    optimizationResult: any,
    sequenceEnforcement: any,
    canonicalCoverage: any,
    effectiveDays: number,
    requestedDays: number
  ): string[] {
    const warnings: string[] = [];
    
    // 14-day limit warning
    if (effectiveDays < requestedDays) {
      warnings.push(`Trip limited to ${effectiveDays} days (14-day maximum for optimal planning)`);
    }
    
    // Canonical coverage warnings
    if (canonicalCoverage.coverage < 30) {
      warnings.push(`Low canonical destination coverage (${canonicalCoverage.coverage}%) - consider more days for full Route 66 experience`);
    }
    
    if (canonicalCoverage.majorIncluded < 3) {
      warnings.push(`Only ${canonicalCoverage.majorIncluded} major Route 66 destinations included - consider extending trip for more heritage cities`);
    }
    
    // Optimization warnings
    if (optimizationResult.gapFillers.length > 0) {
      const longGaps = optimizationResult.gapFillers.filter((f: any) => f.gapHours > 9);
      if (longGaps.length > 0) {
        warnings.push(`${longGaps.length} drive days exceed 9 hours due to canonical destination prioritization`);
      }
    }
    
    // Sequence warnings
    if (!sequenceEnforcement.isValid) {
      warnings.push(`Route contains ${sequenceEnforcement.violations.length} sequence violations - some backtracking may occur`);
    }
    
    return warnings;
  }

  /**
   * Generate enhanced warnings with drive time enforcement context
   */
  private static generateEnhancedWarnings(
    optimizationResult: any,
    sequenceEnforcement: any,
    canonicalCoverage: any,
    effectiveDays: number,
    requestedDays: number,
    enforcedSegmentsResult: any
  ): string[] {
    const warnings: string[] = [];
    
    // 14-day limit warning
    if (effectiveDays < requestedDays) {
      warnings.push(`Trip limited to ${effectiveDays} days (14-day maximum for optimal planning)`);
    }
    
    // Drive time enforcement warnings
    if (enforcedSegmentsResult.violationsFound > 0) {
      warnings.push(`${enforcedSegmentsResult.violationsFound} segments exceeded safe drive times and were rebalanced`);
    }
    
    if (enforcedSegmentsResult.intermediateStopsAdded > 0) {
      warnings.push(`Added ${enforcedSegmentsResult.intermediateStopsAdded} intermediate stops to manage drive times`);
    }
    
    // Add enforcement-specific warnings
    warnings.push(...enforcedSegmentsResult.warnings);
    
    // Canonical coverage warnings
    if (canonicalCoverage.coverage < 30) {
      warnings.push(`Low canonical destination coverage (${canonicalCoverage.coverage}%) - consider more days for full Route 66 experience`);
    }
    
    if (canonicalCoverage.majorIncluded < 3) {
      warnings.push(`Only ${canonicalCoverage.majorIncluded} major Route 66 destinations included - consider extending trip for more heritage cities`);
    }
    
    // Sequence warnings
    if (!sequenceEnforcement.isValid) {
      warnings.push(`Route contains ${sequenceEnforcement.violations.length} sequence violations - some backtracking may occur`);
    }
    
    return warnings;
  }

  /**
   * Enhance route assessment with canonical coverage context
   */
  private static enhanceRouteAssessmentWithCanonical(
    baseAssessment: any,
    optimizationResult: any,
    sequenceEnforcement: any,
    canonicalCoverage: any
  ) {
    let enhancedSummary = baseAssessment.summary;
    
    // Add canonical coverage context
    enhancedSummary += ` Features ${canonicalCoverage.includedCanonical} canonical Route 66 destinations (${canonicalCoverage.coverage}% coverage) including ${canonicalCoverage.majorIncluded} major heritage cities.`;
    
    if (optimizationResult.consecutivePairs.length > 0) {
      enhancedSummary += ` Includes ${optimizationResult.consecutivePairs.length} consecutive major city connections for authentic Route 66 heritage experience.`;
    }

    // Sequence validation context
    if (sequenceEnforcement.isValid) {
      enhancedSummary += ` ✅ Maintains proper Route 66 sequence order.`;
    } else {
      enhancedSummary += ` ⚠️ Contains some sequence variations for optimal destination coverage.`;
    }
    
    // Adjust recommendation based on canonical coverage
    const isRecommended = baseAssessment.isRecommended && 
                         canonicalCoverage.coverage >= 40 &&
                         canonicalCoverage.majorIncluded >= 2;
    
    return {
      ...baseAssessment,
      isRecommended,
      summary: enhancedSummary,
      canonicalCoverage: canonicalCoverage.coverage,
      majorDestinations: canonicalCoverage.majorIncluded
    };
  }

  /**
   * Enhance route assessment with canonical coverage and drive time compliance
   */
  private static enhanceRouteAssessmentWithDriveTime(
    baseAssessment: any,
    optimizationResult: any,
    sequenceEnforcement: any,
    canonicalCoverage: any,
    enforcedSegmentsResult: any
  ) {
    let enhancedSummary = baseAssessment.summary;
    
    // Add drive time enforcement context
    if (enforcedSegmentsResult.violationsFound === 0) {
      enhancedSummary += ` ✅ All segments comply with 10-hour daily drive time limits.`;
    } else {
      enhancedSummary += ` ⚙️ ${enforcedSegmentsResult.violationsFound} segments rebalanced for safe drive times.`;
    }
    
    // Add canonical coverage context
    enhancedSummary += ` Features ${canonicalCoverage.includedCanonical} canonical Route 66 destinations (${canonicalCoverage.coverage}% coverage) including ${canonicalCoverage.majorIncluded} major heritage cities.`;
    
    if (optimizationResult.consecutivePairs.length > 0) {
      enhancedSummary += ` Includes ${optimizationResult.consecutivePairs.length} consecutive major city connections for authentic Route 66 heritage experience.`;
    }

    // Sequence validation context
    if (sequenceEnforcement.isValid) {
      enhancedSummary += ` ✅ Maintains proper Route 66 sequence order.`;
    } else {
      enhancedSummary += ` ⚠️ Contains some sequence variations for optimal destination coverage.`;
    }
    
    // Adjust recommendation based on drive time compliance and canonical coverage
    const isRecommended = baseAssessment.isRecommended && 
                         canonicalCoverage.coverage >= 40 &&
                         canonicalCoverage.majorIncluded >= 2 &&
                         enforcedSegmentsResult.violationsFound <= 2;
    
    return {
      ...baseAssessment,
      isRecommended,
      summary: enhancedSummary,
      canonicalCoverage: canonicalCoverage.coverage,
      majorDestinations: canonicalCoverage.majorIncluded,
      driveTimeCompliance: enforcedSegmentsResult.violationsFound === 0
    };
  }

  /**
   * Calculate drive time balance with canonical destination context
   */
  private static calculateCanonicalDestinationBalance(
    segments: DailySegment[], 
    routeAssessment: any, 
    canonicalCoverage: any
  ): DriveTimeBalance {
    const driveTimes = segments.map(seg => seg.driveTimeHours);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const maxTime = Math.max(...driveTimes);

    // Score based on canonical coverage and heritage value
    const canonicalBonus = canonicalCoverage.coverage;
    const majorCityBonus = canonicalCoverage.majorIncluded * 15;
    const sequenceBonus = routeAssessment.isRecommended ? 20 : -10;
    const safetyPenalty = Math.max(0, maxTime - 10) * 20;
    
    const isBalanced = maxTime <= 10 && canonicalCoverage.coverage >= 40;

    const balanceQuality: 'excellent' | 'good' | 'fair' | 'poor' = 
      isBalanced && canonicalCoverage.coverage >= 60 && canonicalCoverage.majorIncluded >= 4 ? 'excellent' :
      isBalanced && canonicalCoverage.coverage >= 50 && canonicalCoverage.majorIncluded >= 3 ? 'good' :
      isBalanced && canonicalCoverage.coverage >= 40 ? 'fair' : 'poor';

    const overallScore = Math.max(0, 
      50 + canonicalBonus + majorCityBonus + sequenceBonus - safetyPenalty
    );

    const suggestions: string[] = [];
    if (maxTime > 10) {
      suggestions.push(`Day with ${maxTime.toFixed(1)}h drive exceeds safe limits`);
    }
    if (canonicalCoverage.coverage < 40) {
      suggestions.push('Consider adding more days to include additional canonical Route 66 destinations');
    }
    if (canonicalCoverage.majorIncluded < 3) {
      suggestions.push('Route could benefit from more major heritage cities');
    }

    return {
      isBalanced,
      averageDriveTime: parseFloat(averageDriveTime.toFixed(1)),
      variance: 0, // Simplified for canonical focus
      driveTimeRange: { min: Math.min(...driveTimes), max: maxTime },
      balanceQuality,
      qualityGrade: balanceQuality === 'excellent' ? 'A' : balanceQuality === 'good' ? 'B' : balanceQuality === 'fair' ? 'C' : 'D',
      overallScore: Math.round(overallScore),
      suggestions,
      reason: isBalanced ? 
        `Canonical Route 66 heritage experience with ${canonicalCoverage.coverage}% destination coverage` :
        `Prioritizes canonical destinations but ${maxTime > 10 ? 'requires challenging drive times' : 'needs more heritage city coverage'}`
    };
  }

  /**
   * Calculate drive time balance with canonical destination context
   */
  private static calculateEnhancedDestinationBalance(
    segments: DailySegment[], 
    routeAssessment: any, 
    canonicalCoverage: any,
    enforcedSegmentsResult: any
  ): DriveTimeBalance {
    const driveTimes = segments.map(seg => seg.driveTimeHours);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const maxTime = Math.max(...driveTimes);

    // Enhanced scoring with drive time compliance
    const canonicalBonus = canonicalCoverage.coverage;
    const majorCityBonus = canonicalCoverage.majorIncluded * 15;
    const sequenceBonus = routeAssessment.isRecommended ? 20 : -10;
    const driveTimeComplianceBonus = enforcedSegmentsResult.violationsFound === 0 ? 30 : -enforcedSegmentsResult.violationsFound * 10;
    const safetyPenalty = Math.max(0, maxTime - 10) * 20;
    
    const isBalanced = maxTime <= 10 && canonicalCoverage.coverage >= 40 && enforcedSegmentsResult.violationsFound <= 1;

    const balanceQuality: 'excellent' | 'good' | 'fair' | 'poor' = 
      isBalanced && enforcedSegmentsResult.violationsFound === 0 && canonicalCoverage.coverage >= 60 ? 'excellent' :
      isBalanced && enforcedSegmentsResult.violationsFound <= 1 && canonicalCoverage.coverage >= 50 ? 'good' :
      maxTime <= 10 && canonicalCoverage.coverage >= 40 ? 'fair' : 'poor';

    const overallScore = Math.max(0, 
      50 + canonicalBonus + majorCityBonus + sequenceBonus + driveTimeComplianceBonus - safetyPenalty
    );

    const suggestions: string[] = [];
    if (maxTime > 10) {
      suggestions.push(`Day with ${maxTime.toFixed(1)}h drive exceeds safe limits`);
    }
    if (enforcedSegmentsResult.violationsFound > 0) {
      suggestions.push(`${enforcedSegmentsResult.violationsFound} segments required drive time rebalancing`);
    }
    if (canonicalCoverage.coverage < 40) {
      suggestions.push('Consider adding more days to include additional canonical Route 66 destinations');
    }
    if (canonicalCoverage.majorIncluded < 3) {
      suggestions.push('Route could benefit from more major heritage cities');
    }

    return {
      isBalanced,
      averageDriveTime: parseFloat(averageDriveTime.toFixed(1)),
      variance: 0, // Simplified for canonical focus
      driveTimeRange: { min: Math.min(...driveTimes), max: maxTime },
      balanceQuality,
      qualityGrade: balanceQuality === 'excellent' ? 'A' : balanceQuality === 'good' ? 'B' : balanceQuality === 'fair' ? 'C' : 'D',
      overallScore: Math.round(overallScore),
      suggestions,
      reason: isBalanced ? 
        `Drive-time optimized Route 66 heritage experience with ${canonicalCoverage.coverage}% destination coverage` :
        `Prioritizes canonical destinations with ${enforcedSegmentsResult.violationsFound === 0 ? 'compliant' : 'managed'} drive times`
    };
  }
}
