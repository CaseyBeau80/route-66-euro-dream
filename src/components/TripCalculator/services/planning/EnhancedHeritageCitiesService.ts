import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { TripBoundaryService } from './TripBoundaryService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { calculateRealisticDriveTime, validateGeographicProgression } from '../../utils/distanceCalculator';
import { PlanningPolicy, PlanningAdjustment } from './PlanningPolicy';
import { TripAdjustmentService, TripAdjustmentNotice } from './TripAdjustmentService';
import { CoordinateAccessSafety } from './CoordinateAccessSafety';

export class EnhancedHeritageCitiesService {
  // ABSOLUTE CONSTRAINTS - These cannot be exceeded
  private static readonly ABSOLUTE_MAX_DRIVE_HOURS = 10;
  private static readonly RECOMMENDED_MAX_DRIVE_HOURS = 8;
  private static readonly OPTIMAL_MAX_DRIVE_HOURS = 6;
  private static readonly MIN_DRIVE_HOURS = 2;
  private static readonly MAX_DAILY_MILES = 500; // HARD LIMIT: Never exceed 500 miles per day
  
  // ENHANCED DISCOVERY PARAMETERS - Removed artificial limits
  private static readonly EXPANDED_SEARCH_RADIUS = 200; // Increased from 150 miles
  private static readonly MIN_STOPS_FOR_WARNING = 3; // Warn if fewer than 3 real stops found

  /**
   * Plan Heritage Cities trip with BULLETPROOF coordinate validation
   */
  static async planEnhancedHeritageCitiesTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`🏛️ ENHANCED Heritage Cities Planning with COORDINATE SAFETY: ${startLocation} → ${endLocation} (${travelDays} days requested)`);

    // Validate minimum days requirement
    if (travelDays < 1) {
      console.error(`❌ CRITICAL: Invalid travel days: ${travelDays}`);
      travelDays = 4; // Force minimum sensible duration
    }

    try {
      // PHASE 3: Enhanced boundary stop finding with coordinate validation
      console.log(`🔍 PHASE 3: Finding boundary stops with coordinate validation`);
      const { startStop, endStop, routeStops } = TripBoundaryService.findBoundaryStops(
        startLocation,
        endLocation,
        allStops
      );

      // PHASE 3: CRITICAL - Validate coordinates before ANY access
      console.log(`🔐 PHASE 3: Validating start stop coordinates`);
      const startCoords = CoordinateAccessSafety.safeGetCoordinates(startStop, 'planEnhanced-startStop');
      if (!startCoords) {
        console.error(`❌ PHASE 3 CRITICAL: Start stop has invalid coordinates`, { startStop });
        throw new Error(`Start location "${startLocation}" has invalid coordinate data`);
      }

      console.log(`🔐 PHASE 3: Validating end stop coordinates`);
      const endCoords = CoordinateAccessSafety.safeGetCoordinates(endStop, 'planEnhanced-endStop');
      if (!endCoords) {
        console.error(`❌ PHASE 3 CRITICAL: End stop has invalid coordinates`, { endStop });
        throw new Error(`End location "${endLocation}" has invalid coordinate data`);
      }

      console.log(`✅ PHASE 3: Boundary stops coordinate validation passed:`, {
        start: `${startStop.name} (${startCoords.latitude}, ${startCoords.longitude})`,
        end: `${endStop.name} (${endCoords.latitude}, ${endCoords.longitude})`,
        availableStops: routeStops.length
      });

      // Apply planning constraints using the new policy system
      const planningPolicy = new PlanningPolicy();
      const constraintResult = planningPolicy.applyConstraints({
        startLocation,
        endLocation,
        requestedDays: travelDays,
        tripStyle: 'destination-focused',
        availableStops: allStops,
        routeStops
      });

      // Update travel days based on constraints
      const originalDays = travelDays;
      travelDays = constraintResult.finalDays;

      console.log(`🎯 CONSTRAINTS APPLIED:`, {
        originalDays,
        adjustedDays: travelDays,
        adjustments: constraintResult.adjustments.length,
        warnings: constraintResult.warnings.length
      });

      // PHASE 3: Calculate total distance with SAFE coordinate access
      console.log(`📏 PHASE 3: Calculating total distance with coordinate safety`);
      const totalDistance = CoordinateAccessSafety.wrapCoordinateOperation(
        () => DistanceCalculationService.calculateDistance(
          startCoords.latitude, startCoords.longitude,
          endCoords.latitude, endCoords.longitude
        ),
        'total-distance-calculation',
        0
      );

      if (totalDistance === 0) {
        console.error(`❌ PHASE 3 CRITICAL: Could not calculate total distance`);
        throw new Error('Unable to calculate trip distance - coordinate data may be invalid');
      }

      console.log(`📏 Total trip: ${totalDistance.toFixed(1)} miles in ${travelDays} days`);

      // CRITICAL FIX: Force minimum days based on distance BEFORE any processing
      const minRequiredDays = Math.ceil(totalDistance / this.MAX_DAILY_MILES);
      if (travelDays < minRequiredDays) {
        console.error(`🚨 CRITICAL: ${travelDays} days insufficient for ${totalDistance.toFixed(1)} miles`);
        console.error(`🚨 FORCING travel days from ${travelDays} to ${minRequiredDays} (max ${this.MAX_DAILY_MILES} miles/day)`);
        travelDays = minRequiredDays;
      }

      // ENHANCED STOP DISCOVERY with coordinate validation
      const discoveredDestinations = this.enhancedStopDiscoveryWithValidation(
        startStop,
        endStop,
        routeStops,
        travelDays,
        totalDistance
      );

      console.log(`🔍 Enhanced discovery found ${discoveredDestinations.length} real destinations for ${travelDays} days`);

      // Validate geographic progression with safe coordinate access
      const allStopsInOrder = [startStop, ...discoveredDestinations, endStop];
      const isEastToWest = startCoords.longitude < endCoords.longitude;
      const progressionValidation = validateGeographicProgression(allStopsInOrder, isEastToWest);
      
      if (!progressionValidation.isValid) {
        console.error(`❌ GEOGRAPHIC VIOLATIONS:`, progressionValidation.violations);
        // Fix the progression by removing problematic stops
        const fixedDestinations = this.fixGeographicProgressionSafe(discoveredDestinations, startStop, endStop, isEastToWest);
        discoveredDestinations.splice(0, discoveredDestinations.length, ...fixedDestinations);
      }

      // INTELLIGENT SEGMENT DISTRIBUTION with coordinate safety
      const { segments, warningMessage } = this.intelligentSegmentDistributionSafe(
        startStop,
        endStop,
        discoveredDestinations,
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

      // Generate adjustment notice if days were changed
      let adjustmentNotice: TripAdjustmentNotice | null = null;
      if (originalDays !== travelDays || constraintResult.warnings.length > 0) {
        adjustmentNotice = TripAdjustmentService.generateAdjustmentNotice(
          constraintResult.adjustments,
          constraintResult.warnings,
          originalDays,
          travelDays
        );
      }

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
        stops: [startStop, ...discoveredDestinations, endStop],
        tripStyle: 'destination-focused',
        lastUpdated: new Date(),
        stopsLimited: discoveredDestinations.length < travelDays - 1,
        limitMessage: warningMessage,
        // Add constraint-related metadata
        planningAdjustments: constraintResult.adjustments,
        adjustmentNotice,
        originalRequestedDays: originalDays
      };

      console.log(`✅ Enhanced Heritage trip complete (${travelDays} DAYS):`, {
        segments: segments.length,
        totalDistance: actualTotalDistance.toFixed(1),
        totalDrivingTime: totalDrivingTime.toFixed(1),
        maxDailyDriveTime: Math.max(...segments.map(s => s.driveTimeHours || 0)).toFixed(1),
        maxDailyDistance: Math.max(...segments.map(s => s.distance || 0)).toFixed(1),
        realDestinationsFound: discoveredDestinations.length,
        hasWarning: !!warningMessage,
        exactDayCount: segments.length === travelDays,
        constraintAdjustments: constraintResult.adjustments.length,
        adjustmentSummary: TripAdjustmentService.formatAdjustmentSummary(
          constraintResult.adjustments, 
          originalDays, 
          travelDays
        )
      });

      return tripPlan;

    } catch (error) {
      console.error('❌ Enhanced Heritage Cities planning failed:', error);
      throw new Error(`Enhanced Heritage Cities planning failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * ENHANCED STOP DISCOVERY with coordinate validation
   */
  private static enhancedStopDiscoveryWithValidation(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    travelDays: number,
    totalDistance: number
  ): TripStop[] {
    console.log(`🔍 ENHANCED STOP DISCOVERY with coordinate validation: Comprehensive search for ${travelDays} days`);

    // Validate start and end coordinates
    const startCoords = CoordinateAccessSafety.safeGetCoordinates(startStop, 'discovery-start');
    const endCoords = CoordinateAccessSafety.safeGetCoordinates(endStop, 'discovery-end');

    if (!startCoords || !endCoords) {
      console.error(`❌ DISCOVERY: Cannot proceed without valid start/end coordinates`);
      return [];
    }

    // Determine direction
    const isEastToWest = startCoords.longitude < endCoords.longitude;
    console.log(`📍 Direction: ${isEastToWest ? 'East to West' : 'West to East'}`);

    // STEP 1: Primary heritage stops (existing logic but with validation)
    const primaryStops = this.filterProgressiveStopsSafe(startStop, endStop, routeStops, isEastToWest);
    console.log(`🏛️ Primary heritage stops found: ${primaryStops.length}`);

    // STEP 2: Secondary category stops (new comprehensive search)
    const secondaryStops = this.findSecondaryStopsSafe(startStop, endStop, routeStops, isEastToWest);
    console.log(`🎯 Secondary category stops found: ${secondaryStops.length}`);

    // STEP 3: Combine and prioritize all discovered stops
    const allDiscoveredStops = [...primaryStops, ...secondaryStops];
    const uniqueStops = this.deduplicateStops(allDiscoveredStops);
    console.log(`🔄 Total unique stops after deduplication: ${uniqueStops.length}`);

    // STEP 4: Enhanced selection algorithm with coordinate safety
    const selectedDestinations = this.enhancedStopSelectionSafe(
      startStop,
      endStop,
      uniqueStops,
      travelDays,
      totalDistance
    );

    console.log(`✅ Enhanced discovery selected ${selectedDestinations.length} destinations for ${travelDays} days`);
    return selectedDestinations;
  }

  /**
   * Filter progressive stops with coordinate safety
   */
  private static filterProgressiveStopsSafe(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    isEastToWest: boolean
  ): TripStop[] {
    return routeStops.filter(stop => {
      // First check if we can safely access coordinates
      const stopCoords = CoordinateAccessSafety.safeGetCoordinates(stop, `progressive-filter-${stop.name || 'unnamed'}`);
      if (!stopCoords) {
        console.warn(`⚠️ FILTER: Skipping stop with invalid coordinates: ${stop.name || 'unnamed'}`);
        return false;
      }

      // Check if it's geographically relevant
      return this.isGeographicallyRelevantSafe(stop, startStop, endStop, isEastToWest);
    });
  }

  /**
   * Create segment with coordinate safety
   */
  private static createSegmentSafe(fromStop: TripStop, toStop: TripStop, day: number): DailySegment {
    const fromCoords = CoordinateAccessSafety.safeGetCoordinates(fromStop, `segment-from-${day}`);
    const toCoords = CoordinateAccessSafety.safeGetCoordinates(toStop, `segment-to-${day}`);

    if (!fromCoords || !toCoords) {
      console.error(`❌ SEGMENT CREATION: Invalid coordinates for day ${day}`);
      // Return a fallback segment
      return {
        day,
        startCity: fromStop.name || 'Unknown',
        endCity: toStop.name || 'Unknown',
        startStop: fromStop,
        endStop: toStop,
        distance: 0,
        driveTimeHours: this.MIN_DRIVE_HOURS,
        stops: [toStop],
        description: `Day ${day}: Unable to calculate distance due to coordinate issues`
      };
    }

    const distance = CoordinateAccessSafety.wrapCoordinateOperation(
      () => DistanceCalculationService.calculateDistance(
        fromCoords.latitude, fromCoords.longitude,
        toCoords.latitude, toCoords.longitude
      ),
      `segment-distance-day-${day}`,
      0
    );

    const driveTimeHours = distance > 0 ? calculateRealisticDriveTime(distance) : this.MIN_DRIVE_HOURS;

    return {
      day,
      startCity: fromStop.city_name || fromStop.name,
      endCity: toStop.city_name || toStop.name,
      startStop: fromStop,
      endStop: toStop,
      distance,
      driveTimeHours,
      stops: [toStop],
      description: `Day ${day}: ${fromStop.name} to ${toStop.name} - ${distance.toFixed(0)} miles (${driveTimeHours.toFixed(1)} hours)`
    };
  }

  /**
   * Check if stop is geographically relevant with expanded radius
   */
  private static isGeographicallyRelevantSafe(
    stop: TripStop,
    startStop: TripStop,
    endStop: TripStop,
    isEastToWest: boolean
  ): boolean {
    const stopCoords = CoordinateAccessSafety.safeGetCoordinates(stop, 'geographically-relevant');
    const startCoords = CoordinateAccessSafety.safeGetCoordinates(startStop, 'geographically-relevant-start');
    const endCoords = CoordinateAccessSafety.safeGetCoordinates(endStop, 'geographically-relevant-end');

    if (!stopCoords || !startCoords || !endCoords) {
      return true; // Include by default if coordinates are invalid
    }

    // Must be between start and end geographically
    const isBetween = isEastToWest 
      ? stopCoords.longitude > startCoords.longitude && stopCoords.longitude < endCoords.longitude
      : stopCoords.longitude < startCoords.longitude && stopCoords.longitude > endCoords.longitude;
    
    if (!isBetween) return false;
    
    // Must be within expanded distance from direct route
    const distanceFromRoute = this.calculateDistanceFromDirectRouteSafe(startStop, endStop, stop);
    return distanceFromRoute < this.EXPANDED_SEARCH_RADIUS;
  }

  /**
   * Calculate distance from point to direct route line
   */
  private static calculateDistanceFromDirectRouteSafe(
    startStop: TripStop,
    endStop: TripStop,
    candidateStop: TripStop
  ): number {
    const startCoords = CoordinateAccessSafety.safeGetCoordinates(startStop, 'route-distance-start');
    const endCoords = CoordinateAccessSafety.safeGetCoordinates(endStop, 'route-distance-end');
    const candidateCoords = CoordinateAccessSafety.safeGetCoordinates(candidateStop, 'route-distance-candidate');

    if (!startCoords || !endCoords || !candidateCoords) {
      return 0; // Return 0 to include the stop if coordinates are invalid
    }

    return CoordinateAccessSafety.wrapCoordinateOperation(
      () => {
        // Calculate direct distance
        const directDistance = DistanceCalculationService.calculateDistance(
          startCoords.latitude, startCoords.longitude,
          endCoords.latitude, endCoords.longitude
        );

        // Calculate distance through candidate
        const toCandidate = DistanceCalculationService.calculateDistance(
          startCoords.latitude, startCoords.longitude,
          candidateCoords.latitude, candidateCoords.longitude
        );

        const fromCandidate = DistanceCalculationService.calculateDistance(
          candidateCoords.latitude, candidateCoords.longitude,
          endCoords.latitude, endCoords.longitude
        );

        return (toCandidate + fromCandidate) - directDistance;
      },
      'route-distance-calculation',
      0
    );
  }

  /**
   * Find secondary category stops for comprehensive coverage
   */
  private static findSecondaryStopsSafe(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    isEastToWest: boolean
  ): TripStop[] {
    const secondaryCategories = [
      'attraction',
      'restaurant', 
      'museum',
      'landmark',
      'scenic_spot',
      'historic_site',
      'cultural_site',
      'drive_in_theater',
      'gas_station',
      'motel'
    ];

    return routeStops.filter(stop => {
      // Must be geographically relevant
      if (!this.isGeographicallyRelevantSafe(stop, startStop, endStop, isEastToWest)) {
        return false;
      }

      // Include secondary categories
      const category = stop.category || '';
      return secondaryCategories.some(cat => category.toLowerCase().includes(cat.toLowerCase()));
    }).sort((a, b) => {
      // Sort by geographic progression
      return isEastToWest ? a.longitude - b.longitude : b.longitude - a.longitude;
    });
  }

  /**
   * Enhanced stop selection algorithm with heritage prioritization
   */
  private static enhancedStopSelectionSafe(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    travelDays: number,
    totalDistance: number
  ): TripStop[] {
    console.log(`🎯 ENHANCED SELECTION: Choosing from ${availableStops.length} stops for ${travelDays} days`);

    const maxDestinations = travelDays - 1; // One less than total days (start to end)
    const destinations: TripStop[] = [];
    
    console.log(`🎯 Target: ${maxDestinations} real destinations (no artificial padding)`);

    let currentStop = startStop;
    const remainingStops = [...availableStops];
    const targetSegmentDistance = totalDistance / travelDays;

    // Smart selection prioritizing heritage value and geographic progression
    for (let i = 0; i < maxDestinations && remainingStops.length > 0; i++) {
      const targetDistance = (i === maxDestinations - 1) 
        ? null // Last segment - any reasonable distance to end
        : targetSegmentDistance;

      const nextStop = this.findOptimalNextStopSafe(
        currentStop,
        endStop,
        remainingStops,
        targetDistance,
        i === maxDestinations - 1 // isLastSegment
      );

      if (nextStop) {
        const segmentDistance = DistanceCalculationService.calculateDistance(
          currentStop.latitude, currentStop.longitude,
          nextStop.latitude, nextStop.longitude
        );

        // Validate constraints
        if (segmentDistance <= this.MAX_DAILY_MILES) {
          const driveTime = calculateRealisticDriveTime(segmentDistance);
          
          if (driveTime <= this.ABSOLUTE_MAX_DRIVE_HOURS) {
            destinations.push(nextStop);
            currentStop = nextStop;
            
            // Remove selected stop from remaining options
            const stopIndex = remainingStops.findIndex(s => s.id === nextStop.id);
            if (stopIndex >= 0) remainingStops.splice(stopIndex, 1);
            
            console.log(`✅ Selected destination ${i + 1}: ${nextStop.name} (+${segmentDistance.toFixed(0)}mi, ${driveTime.toFixed(1)}h)`);
          } else {
            console.warn(`⚠️ Skipping ${nextStop.name}: ${driveTime.toFixed(1)}h exceeds ${this.ABSOLUTE_MAX_DRIVE_HOURS}h limit`);
            // Remove this stop and continue
            const stopIndex = remainingStops.findIndex(s => s.id === nextStop.id);
            if (stopIndex >= 0) remainingStops.splice(stopIndex, 1);
            i--; // Retry this slot
          }
        } else {
          console.warn(`⚠️ Skipping ${nextStop.name}: ${segmentDistance.toFixed(1)}mi exceeds ${this.MAX_DAILY_MILES}mi limit`);
          // Remove this stop and continue
          const stopIndex = remainingStops.findIndex(s => s.id === nextStop.id);
          if (stopIndex >= 0) remainingStops.splice(stopIndex, 1);
          i--; // Retry this slot
        }
      } else {
        console.warn(`⚠️ No suitable destination found for slot ${i + 1}`);
        break;
      }
    }

    console.log(`🏁 Enhanced selection result: ${destinations.length} real destinations found`);
    return destinations;
  }

  /**
   * Find optimal next stop with heritage prioritization
   */
  private static findOptimalNextStopSafe(
    currentStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    targetDistance: number | null,
    isLastSegment: boolean
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
      if (distance > this.MAX_DAILY_MILES * 0.9) continue;

      const driveTime = calculateRealisticDriveTime(distance);
      if (driveTime > this.ABSOLUTE_MAX_DRIVE_HOURS * 0.9) continue;

      // Calculate score based on multiple factors
      let score = 0;

      // Distance score
      if (targetDistance) {
        score += Math.abs(distance - targetDistance) * 0.5; // Moderate weight
      } else {
        score += distance * 0.1; // Slight preference for closer stops
      }

      // Heritage value bonus (negative score = better)
      const heritageBonus = this.getHeritageBonus(stop);
      score -= heritageBonus;

      // Category preference bonus
      const categoryBonus = this.getCategoryBonus(stop);
      score -= categoryBonus;

      // Final segment consideration
      if (isLastSegment) {
        const distanceToEnd = DistanceCalculationService.calculateDistance(
          stop.latitude, stop.longitude,
          endStop.latitude, endStop.longitude
        );
        
        // Prefer stops that don't create an extremely long final segment
        if (distanceToEnd > this.MAX_DAILY_MILES * 0.8) {
          score += 200; // Penalty for creating long final segment
        }
      }

      if (score < bestScore) {
        bestScore = score;
        bestStop = stop;
      }
    }

    return bestStop;
  }

  /**
   * Get heritage value bonus for scoring
   */
  private static getHeritageBonus(stop: TripStop): number {
    const heritage = stop.heritage_value || '';
    switch (heritage.toLowerCase()) {
      case 'high': return 150;
      case 'medium': return 75;
      case 'low': return 25;
      default: return 0;
    }
  }

  /**
   * Get category preference bonus for scoring
   */
  private static getCategoryBonus(stop: TripStop): number {
    const category = (stop.category || '').toLowerCase();
    
    // Prioritize heritage and cultural sites
    if (category.includes('heritage') || category.includes('historic')) return 100;
    if (category.includes('museum') || category.includes('cultural')) return 80;
    if (category.includes('landmark') || category.includes('attraction')) return 60;
    if (category.includes('restaurant') || category.includes('drive_in')) return 40;
    
    return 0;
  }

  /**
   * Remove duplicate stops based on proximity and name similarity
   */
  private static deduplicateStops(stops: TripStop[]): TripStop[] {
    const unique: TripStop[] = [];
    const PROXIMITY_THRESHOLD = 5; // 5 miles

    for (const stop of stops) {
      const isDuplicate = unique.some(existing => {
        if (!stop.latitude || !stop.longitude || !existing.latitude || !existing.longitude) {
          // Name-based comparison if coordinates missing
          return stop.name.toLowerCase() === existing.name.toLowerCase();
        }

        const distance = DistanceCalculationService.calculateDistance(
          stop.latitude, stop.longitude,
          existing.latitude, existing.longitude
        );

        return distance < PROXIMITY_THRESHOLD && 
               stop.name.toLowerCase().includes(existing.name.toLowerCase().split(' ')[0]);
      });

      if (!isDuplicate) {
        unique.push(stop);
      }
    }

    console.log(`🔄 Deduplication: ${stops.length} → ${unique.length} stops`);
    return unique;
  }

  /**
   * INTELLIGENT SEGMENT DISTRIBUTION with coordinate safety
   */
  private static intelligentSegmentDistributionSafe(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[],
    requestedDays: number,
    totalDistance: number
  ): { segments: DailySegment[]; warningMessage?: string } {
    console.log(`🧠 INTELLIGENT DISTRIBUTION: Creating EXACTLY ${requestedDays} segments from ${destinations.length} real destinations`);

    const segments: DailySegment[] = [];
    let warningMessage: string | undefined;

    // Build the route stops in order
    const allRouteStops = [startStop, ...destinations, endStop];
    
    console.log(`📍 Route stops: ${allRouteStops.map(s => s.name).join(' → ')}`);

    // If we have enough real stops to create the requested days
    if (allRouteStops.length - 1 >= requestedDays) {
      console.log(`✅ Sufficient stops: Creating ${requestedDays} segments from ${allRouteStops.length} stops`);
      
      // Create segments by selecting appropriate stops to match requested days
      for (let day = 1; day <= requestedDays; day++) {
        const fromIndex = Math.floor((day - 1) * (allRouteStops.length - 1) / requestedDays);
        const toIndex = Math.floor(day * (allRouteStops.length - 1) / requestedDays);
        
        const fromStop = allRouteStops[fromIndex];
        const toStop = allRouteStops[toIndex === fromIndex ? toIndex + 1 : toIndex];

        const segment = this.createSegmentSafe(fromStop, toStop, day);
        segments.push(segment);
        
        console.log(`📅 Day ${day}: ${fromStop.name} → ${toStop.name}, ${segment.distance} miles, ${segment.driveTimeHours?.toFixed(1)} hours`);
      }
    } else {
      // We need to split longer segments to reach the requested days
      console.log(`⚠️ Insufficient stops: Need to create intermediate waypoints to reach ${requestedDays} days`);
      
      const availableSegments = allRouteStops.length - 1;
      const targetDistancePerDay = totalDistance / requestedDays;
      
      console.log(`🎯 Target: ${targetDistancePerDay.toFixed(0)} miles per day to reach ${requestedDays} days`);

      // Create segments by distance-based splitting
      let currentStopIndex = 0;
      let remainingDistance = totalDistance;

      for (let day = 1; day <= requestedDays; day++) {
        const fromStop = allRouteStops[currentStopIndex];
        
        // For the last day, always go to the end
        if (day === requestedDays) {
          const toStop = endStop;
          const segment = this.createSegmentSafe(fromStop, toStop, day);
          segments.push(segment);
          console.log(`📅 Day ${day} (FINAL): ${fromStop.name} → ${toStop.name}, ${segment.distance} miles, ${segment.driveTimeHours?.toFixed(1)} hours`);
          break;
        }

        // Find the best next stop for this day's target distance
        const targetDistance = Math.min(targetDistancePerDay, remainingDistance / (requestedDays - day + 1));
        let bestStopIndex = currentStopIndex + 1;
        let bestDistance = Infinity;

        // Look ahead to find the stop closest to our target distance
        for (let lookAheadIndex = currentStopIndex + 1; lookAheadIndex < allRouteStops.length; lookAheadIndex++) {
          const testDistance = DistanceCalculationService.calculateDistance(
            fromStop.latitude, fromStop.longitude,
            allRouteStops[lookAheadIndex].latitude, allRouteStops[lookAheadIndex].longitude
          );

          const distanceDiff = Math.abs(testDistance - targetDistance);
          if (distanceDiff < bestDistance && testDistance <= this.MAX_DAILY_MILES) {
            bestDistance = distanceDiff;
            bestStopIndex = lookAheadIndex;
          }
        }

        const toStop = allRouteStops[bestStopIndex];
        const segment = this.createSegmentSafe(fromStop, toStop, day);
        segments.push(segment);
        
        currentStopIndex = bestStopIndex;
        remainingDistance -= segment.distance;
        
        console.log(`📅 Day ${day}: ${fromStop.name} → ${toStop.name}, ${segment.distance} miles, ${segment.driveTimeHours?.toFixed(1)} hours`);
      }

      if (destinations.length < requestedDays - 1) {
        warningMessage = `Created ${requestedDays}-day itinerary as requested. Some segments may have fewer heritage attractions due to limited destinations between your start and end points.`;
      }
    }

    console.log(`✅ Intelligent distribution complete: ${segments.length} segments created for ${requestedDays} requested days`);
    return { segments, warningMessage };
  }
}
