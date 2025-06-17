import { DailySegment, RecommendedStop } from './TripPlanTypes';
import { TripStop } from '../data/SupabaseDataService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { TripPlanUtils } from './TripPlanUtils';
import { TripStyleConfig } from './TripStyleLogic';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';
import { SegmentBalancingService } from './SegmentBalancingService';
import { TripCompletionService } from './TripCompletionService';

export class TripSegmentBuilder {
  /**
   * Build segments with destination cities only and drive-time enforcement (ENHANCED WITH COMPLETION DETECTION)
   */
  static buildSegmentsWithDestinationCities(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number,
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    console.log(`🏗️ ENHANCED SEGMENT BUILDING: ${tripDays} days, ${styleConfig.style} style`);
    console.log(`🏗️ Available destination cities: ${destinationCities.length}`, destinationCities.map(c => c.name));
    
    // STEP 1: Create initial segments with proper validation
    const initialSegments = this.createInitialSegments(
      startStop,
      endStop,
      destinationCities,
      tripDays,
      styleConfig
    );
    
    console.log(`🏗️ Initial segments created: ${initialSegments.length}`);
    
    // STEP 2: Analyze for completion and duplicates
    const completionAnalysis = TripCompletionService.analyzeTripCompletion(
      initialSegments,
      tripDays,
      destinationCities
    );
    
    console.log(`🔍 COMPLETION ANALYSIS:`, {
      isCompleted: completionAnalysis.isCompleted,
      completedOnDay: completionAnalysis.completedOnDay,
      unusedDays: completionAnalysis.unusedDays,
      duplicateSegments: completionAnalysis.duplicateSegments.length
    });
    
    // STEP 3: Clean up segments if needed
    let finalSegments = initialSegments;
    
    if (completionAnalysis.isCompleted || completionAnalysis.duplicateSegments.length > 0) {
      console.log(`🧹 CLEANING UP: Removing ${completionAnalysis.duplicateSegments.length} duplicate segments`);
      finalSegments = TripCompletionService.cleanupSegments(initialSegments);
    }
    
    // STEP 4: Final validation
    console.log(`🏗️ FINAL SEGMENTS: ${finalSegments.length} segments created`);
    finalSegments.forEach((segment, index) => {
      console.log(`   Day ${segment.day}: ${segment.startCity} → ${segment.endCity} (${segment.distance.toFixed(1)}mi, ${segment.driveTimeHours.toFixed(1)}h)`);
    });
    
    return finalSegments;
  }

  /**
   * Create initial segments with enhanced duplicate prevention
   */
  private static createInitialSegments(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number,
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    // Create the sequence of valid unique destinations
    const validDestinations = this.selectValidUniqueDestinations(
      startStop,
      endStop,
      destinationCities,
      tripDays
    );
    
    console.log(`🎯 VALID DESTINATIONS: ${validDestinations.length}`, validDestinations.map(d => d.name));
    
    // Create all trip stops: start + intermediates + end
    const allTripStops = [startStop, ...validDestinations, endStop];
    console.log(`🗺️ COMPLETE ROUTE: ${allTripStops.length} stops`, allTripStops.map(s => s.name));
    
    // Create segments between consecutive stops
    const segments: DailySegment[] = [];
    
    for (let i = 0; i < allTripStops.length - 1; i++) {
      const currentStop = allTripStops[i];
      const nextStop = allTripStops[i + 1];
      const day = i + 1;
      
      // CRITICAL: Validate this is not a duplicate segment
      if (this.isDuplicateSegment(currentStop, nextStop)) {
        console.warn(`⚠️ SKIPPING DUPLICATE: Day ${day} - ${currentStop.name} → ${nextStop.name}`);
        continue;
      }
      
      const segment = this.createValidatedSegment(
        currentStop,
        nextStop,
        day,
        styleConfig
      );
      
      if (segment) {
        segments.push(segment);
        console.log(`✅ CREATED: Day ${day} - ${currentStop.name} → ${nextStop.name} (${segment.distance.toFixed(1)}mi)`);
      }
    }
    
    return segments;
  }

  /**
   * Select valid unique destinations that ensure progression
   */
  private static selectValidUniqueDestinations(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number
  ): TripStop[] {
    const neededIntermediateStops = Math.max(0, tripDays - 1);
    console.log(`🎯 Need ${neededIntermediateStops} intermediate stops for ${tripDays} days`);
    
    if (neededIntermediateStops === 0) {
      return [];
    }
    
    // Filter out start and end cities from available destinations
    const availableDestinations = destinationCities.filter(city => 
      city.id !== startStop.id && 
      city.id !== endStop.id &&
      city.name !== startStop.name &&
      city.name !== endStop.name
    );
    
    console.log(`🗺️ Available intermediate destinations: ${availableDestinations.length}`, availableDestinations.map(d => d.name));
    
    if (availableDestinations.length === 0) {
      console.warn(`⚠️ NO INTERMEDIATE DESTINATIONS AVAILABLE - trip will be direct`);
      return [];
    }
    
    // Take up to the needed number of destinations, but don't exceed what's available
    const maxIntermediateStops = Math.min(neededIntermediateStops, availableDestinations.length);
    const selectedDestinations = availableDestinations.slice(0, maxIntermediateStops);
    
    console.log(`✅ SELECTED ${selectedDestinations.length} intermediate destinations:`, selectedDestinations.map(d => d.name));
    
    return selectedDestinations;
  }

  /**
   * Check if this would be a duplicate segment (same start/end city)
   */
  private static isDuplicateSegment(startStop: TripStop, endStop: TripStop): boolean {
    const sameCity = startStop.name === endStop.name || startStop.city_name === endStop.city_name;
    const sameId = startStop.id === endStop.id;
    const isDuplicate = sameCity || sameId;
    
    if (isDuplicate) {
      console.log(`🚫 DUPLICATE DETECTED: ${startStop.name} → ${endStop.name}`);
    }
    
    return isDuplicate;
  }

  /**
   * Create a validated segment with proper distance checking
   */
  private static createValidatedSegment(
    startStop: TripStop,
    endStop: TripStop,
    day: number,
    styleConfig: TripStyleConfig
  ): DailySegment | null {
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    // Reject segments with insufficient distance (less than 5 miles indicates likely duplicate)
    if (segmentDistance < 5) {
      console.warn(`❌ REJECTING: Day ${day} segment too short (${segmentDistance.toFixed(1)}mi) - likely duplicate`);
      return null;
    }
    
    const driveTimeHours = DriveTimeEnforcementService.calculateRealisticDriveTime(segmentDistance);
    
    // Validate drive time against style limits
    const validation = DriveTimeEnforcementService.validateSegmentDriveTime(
      startStop,
      endStop,
      styleConfig
    );
    
    // Create recommended stops (only destination cities)
    const segmentStops = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly([endStop]);
    const recommendedStops: RecommendedStop[] = segmentStops.map(stop => ({
      stopId: stop.id,
      id: stop.id,
      name: stop.name,
      description: stop.description,
      latitude: stop.latitude,
      longitude: stop.longitude,
      category: stop.category,
      city_name: stop.city_name,
      state: stop.state,
      city: stop.city || stop.city_name || 'Unknown'
    }));
    
    const segment: DailySegment = {
      day,
      title: `Day ${day}: ${startStop.city_name || startStop.name} to ${endStop.city_name || endStop.name}`,
      startCity: CityDisplayService.getCityDisplayName(startStop),
      endCity: CityDisplayService.getCityDisplayName(endStop),
      distance: segmentDistance,
      approximateMiles: Math.round(segmentDistance),
      driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
      destination: {
        city: endStop.city_name || endStop.name,
        state: endStop.state
      },
      recommendedStops,
      attractions: recommendedStops.map(stop => ({
        name: stop.name,
        title: stop.name,
        description: stop.description,
        city: stop.city
      })),
      driveTimeCategory: TripPlanUtils.getDriveTimeCategory(driveTimeHours),
      routeSection: TripPlanUtils.getRouteSection(day, 14)
    };
    
    // Add drive-time validation warning if needed
    if (!validation.isValid && validation.recommendation) {
      segment.driveTimeWarning = validation.recommendation;
    }
    
    return segment;
  }

  /**
   * Distribute available destination cities across the required number of days
   */
  private static distributeDestinationsAcrossDays(
    availableDestinations: TripStop[],
    neededStops: number
  ): TripStop[] {
    if (availableDestinations.length >= neededStops) {
      return availableDestinations.slice(0, neededStops);
    }
    
    console.log(`🔄 Distributing ${availableDestinations.length} destinations across ${neededStops} stops`);
    
    // Calculate spacing - distribute cities evenly across the trip
    const spacing = Math.floor(neededStops / availableDestinations.length);
    const distributed: TripStop[] = [];
    
    for (let i = 0; i < neededStops; i++) {
      const cityIndex = Math.floor(i / spacing);
      const city = availableDestinations[Math.min(cityIndex, availableDestinations.length - 1)];
      
      // Avoid consecutive duplicates
      if (distributed.length === 0 || distributed[distributed.length - 1].id !== city.id) {
        distributed.push(city);
      } else if (cityIndex + 1 < availableDestinations.length) {
        // Use next city if available
        distributed.push(availableDestinations[cityIndex + 1]);
      } else {
        // Create intermediate point
        distributed.push(city); // For now, allow duplicate
      }
    }
    
    return distributed.slice(0, neededStops);
  }

  /**
   * Create intermediate points when no destination cities are available
   */
  private static createIntermediatePoints(
    startStop: TripStop,
    endStop: TripStop,
    neededStops: number
  ): TripStop[] {
    console.log(`🎯 Creating ${neededStops} intermediate points between ${startStop.name} and ${endStop.name}`);
    
    const intermediatePoints: TripStop[] = [];
    
    for (let i = 1; i <= neededStops; i++) {
      const progress = i / (neededStops + 1);
      
      const lat = startStop.latitude + (endStop.latitude - startStop.latitude) * progress;
      const lng = startStop.longitude + (endStop.longitude - startStop.longitude) * progress;
      
      const intermediatePoint: TripStop = {
        id: `intermediate-${i}`,
        name: `Day ${i} Stop`,
        city_name: `Day ${i} Destination`,
        city: `Day ${i} Destination`,
        state: startStop.state,
        latitude: lat,
        longitude: lng,
        category: 'destination',
        description: `Intermediate stop for day ${i} of your Route 66 journey`
      };
      
      intermediatePoints.push(intermediatePoint);
    }
    
    return intermediatePoints;
  }

  /**
   * Create a single daily segment
   */
  private static createSingleSegment(
    startStop: TripStop,
    endStop: TripStop,
    day: number,
    styleConfig: TripStyleConfig
  ): DailySegment | null {
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const driveTimeHours = DriveTimeEnforcementService.calculateRealisticDriveTime(segmentDistance);
    
    // Validate drive time against style limits
    const validation = DriveTimeEnforcementService.validateSegmentDriveTime(
      startStop,
      endStop,
      styleConfig
    );
    
    // Only include destination cities as recommended stops with stopId
    const segmentStops = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly([endStop]);
    const recommendedStops: RecommendedStop[] = segmentStops.map(stop => ({
      stopId: stop.id,
      id: stop.id,
      name: stop.name,
      description: stop.description,
      latitude: stop.latitude,
      longitude: stop.longitude,
      category: stop.category,
      city_name: stop.city_name,
      state: stop.state,
      city: stop.city || stop.city_name || 'Unknown'
    }));
    
    const segment: DailySegment = {
      day,
      title: `Day ${day}: ${startStop.city_name || startStop.name} to ${endStop.city_name || endStop.name}`,
      startCity: CityDisplayService.getCityDisplayName(startStop),
      endCity: CityDisplayService.getCityDisplayName(endStop),
      distance: segmentDistance,
      approximateMiles: Math.round(segmentDistance),
      driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
      destination: {
        city: endStop.city_name || endStop.name,
        state: endStop.state
      },
      recommendedStops,
      attractions: recommendedStops.map(stop => ({
        name: stop.name,
        title: stop.name,
        description: stop.description,
        city: stop.city
      })),
      driveTimeCategory: TripPlanUtils.getDriveTimeCategory(driveTimeHours),
      routeSection: TripPlanUtils.getRouteSection(day, 14)
    };
    
    // Add drive-time validation warning if needed
    if (!validation.isValid && validation.recommendation) {
      segment.driveTimeWarning = validation.recommendation;
    }
    
    return segment;
  }

  /**
   * Create daily segments from start/end stop pairs
   */
  private static createDailySegmentsFromPairs(
    segmentPairs: Array<{ startStop: TripStop; endStop: TripStop }>,
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    
    segmentPairs.forEach((pair, index) => {
      const day = index + 1;
      const { startStop, endStop } = pair;
      
      const segmentDistance = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        endStop.latitude, endStop.longitude
      );
      
      const driveTimeHours = DriveTimeEnforcementService.calculateRealisticDriveTime(segmentDistance);
      
      // Validate drive time against style limits
      const validation = DriveTimeEnforcementService.validateSegmentDriveTime(
        startStop,
        endStop,
        styleConfig
      );
      
      // Only include destination cities as recommended stops with stopId
      const segmentStops = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly([endStop]);
      const recommendedStops: RecommendedStop[] = segmentStops.map(stop => ({
        stopId: stop.id,
        id: stop.id,
        name: stop.name,
        description: stop.description,
        latitude: stop.latitude,
        longitude: stop.longitude,
        category: stop.category,
        city_name: stop.city_name,
        state: stop.state,
        city: stop.city || stop.city_name || 'Unknown'
      }));
      
      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${startStop.city_name} to ${endStop.city_name}`,
        startCity: CityDisplayService.getCityDisplayName(startStop),
        endCity: CityDisplayService.getCityDisplayName(endStop),
        distance: segmentDistance,
        approximateMiles: Math.round(segmentDistance),
        driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
        destination: {
          city: endStop.city_name,
          state: endStop.state
        },
        recommendedStops,
        attractions: recommendedStops.map(stop => ({
          name: stop.name,
          title: stop.name,
          description: stop.description,
          city: stop.city
        })),
        driveTimeCategory: TripPlanUtils.getDriveTimeCategory(driveTimeHours),
        routeSection: TripPlanUtils.getRouteSection(day, segmentPairs.length)
      };
      
      // Add drive-time validation warning if needed
      if (!validation.isValid && validation.recommendation) {
        segment.driveTimeWarning = validation.recommendation;
      }
      
      segments.push(segment);
      
      console.log(`📍 Day ${day}: ${startStop.name} → ${endStop.name} | ${segmentDistance.toFixed(1)}mi | ${driveTimeHours.toFixed(1)}h | Valid: ${validation.isValid}`);
    });
    
    return segments;
  }

  /**
   * Legacy method for backward compatibility
   */
  static buildSegmentsWithDestinationCitiesLegacy(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number
  ): DailySegment[] {
    // Use balanced style as default for legacy calls
    const defaultStyleConfig = {
      style: 'balanced' as const,
      maxDailyDriveHours: 6,
      preferDestinationCities: false,
      allowFlexibleStops: true,
      balancePriority: 'distance' as const
    };
    
    return this.buildSegmentsWithDestinationCities(
      startStop,
      endStop,
      destinationCities,
      tripDays,
      defaultStyleConfig
    );
  }
}
