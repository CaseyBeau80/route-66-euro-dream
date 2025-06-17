import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { HeritageScoringService } from './HeritageScoringService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { Route66SequenceEnforcer } from './Route66SequenceEnforcer';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { SegmentRebalancingService } from './SegmentRebalancingService';
import { TripStyleLogic } from './TripStyleLogic';

export interface HeritageEnforcedResult {
  segments: DailySegment[];
  heritageStats: {
    totalHeritageCities: number;
    highHeritageCities: number;
    averageHeritageScore: number;
    tierDistribution: Record<string, number>;
  };
  gapAnalysis: {
    hasSignificantGaps: boolean;
    gapDetails: string[];
  };
  warnings: string[];
  success: boolean;
}

export class HeritageEnforcedTripBuilder {
  private static readonly HIGH_HERITAGE_THRESHOLD = 85;
  private static readonly AVG_SPEED_MPH = 55;

  /**
   * Build a heritage-enforced trip with mandatory high-heritage cities
   */
  static buildHeritageEnforcedTrip(
    startLocation: string,
    endLocation: string,
    totalDays: number,
    allStops: TripStop[]
  ): HeritageEnforcedResult {
    console.log(`🏛️ HERITAGE-ENFORCED TRIP BUILDER: ${startLocation} → ${endLocation} in ${totalDays} days`);

    const warnings: string[] = [];

    // 1. Find start and end stops
    const startStop = this.findLocationStop(startLocation, allStops);
    const endStop = this.findLocationStop(endLocation, allStops);

    if (!startStop || !endStop) {
      return {
        segments: [],
        heritageStats: { totalHeritageCities: 0, highHeritageCities: 0, averageHeritageScore: 0, tierDistribution: {} },
        gapAnalysis: { hasSignificantGaps: false, gapDetails: [] },
        warnings: [`Could not find ${!startStop ? startLocation : endLocation}`],
        success: false
      };
    }

    // 2. Filter to destination cities only
    const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    
    // 3. Enforce Route 66 sequence
    const sequenceResult = Route66SequenceEnforcer.enforceSequenceDirection(
      startStop,
      endStop,
      destinationCities
    );

    // 4. Identify mandatory high-heritage cities
    const mandatoryHeritageCities = this.identifyMandatoryHeritageCities(
      sequenceResult.validStops,
      startStop,
      endStop
    );

    console.log(`🏛️ Found ${mandatoryHeritageCities.length} mandatory high-heritage cities`);

    // 5. Select additional destinations to fill the itinerary
    const selectedDestinations = this.selectDestinationsWithHeritageEnforcement(
      startStop,
      endStop,
      mandatoryHeritageCities,
      sequenceResult.validStops,
      totalDays
    );

    if (selectedDestinations.length === 0) {
      warnings.push('No destinations could be selected with heritage enforcement');
    }

    // 6. Build initial segments
    const initialSegments = this.buildInitialSegments(
      startStop,
      selectedDestinations,
      endStop
    );

    // 7. Apply segment rebalancing
    const styleConfig = TripStyleLogic.getStyleConfig('destination-focused');
    const rebalancingResult = SegmentRebalancingService.rebalanceSegments(
      initialSegments.map(seg => ({ startStop: seg.startStop, endStop: seg.endStop })),
      allStops,
      styleConfig,
      totalDays
    );

    let finalSegments: DailySegment[];
    
    if (rebalancingResult.success) {
      finalSegments = this.convertToFinalSegments(rebalancingResult.rebalancedSegments);
      warnings.push(...rebalancingResult.warnings);
    } else {
      finalSegments = initialSegments.map(seg => seg.segment);
      warnings.push('Segment rebalancing failed, using original segments');
      warnings.push(...rebalancingResult.warnings);
    }

    // 8. Calculate heritage statistics
    const heritageStats = this.calculateHeritageStatistics(selectedDestinations);

    // 9. Perform gap analysis
    const gapAnalysis = this.performGapAnalysis(finalSegments, startStop, endStop);

    // 10. Validate heritage enforcement success
    const highHeritageCount = mandatoryHeritageCities.length;
    const success = highHeritageCount > 0 && finalSegments.length > 0;

    if (highHeritageCount === 0) {
      warnings.push('No high-heritage cities were successfully included in the trip');
    }

    console.log(`✅ Heritage-enforced trip built: ${finalSegments.length} segments, ${highHeritageCount} high-heritage cities`);

    return {
      segments: finalSegments,
      heritageStats,
      gapAnalysis,
      warnings,
      success
    };
  }

  /**
   * Identify mandatory high-heritage cities in the route
   */
  private static identifyMandatoryHeritageCities(
    validStops: TripStop[],
    startStop: TripStop,
    endStop: TripStop
  ): TripStop[] {
    const mandatoryCities: TripStop[] = [];

    for (const stop of validStops) {
      const heritage = HeritageScoringService.calculateHeritageScore(stop);
      
      if (heritage.heritageScore >= this.HIGH_HERITAGE_THRESHOLD) {
        // Ensure the city is positioned correctly in the route
        const distanceFromStart = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          stop.latitude, stop.longitude
        );
        
        const distanceToEnd = DistanceCalculationService.calculateDistance(
          stop.latitude, stop.longitude,
          endStop.latitude, endStop.longitude
        );

        // Only include if it's actually on the route (not a detour)
        const totalRouteDistance = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          endStop.latitude, endStop.longitude
        );

        const detourDistance = (distanceFromStart + distanceToEnd) - totalRouteDistance;
        
        if (detourDistance < totalRouteDistance * 0.3) { // Allow 30% detour for high heritage
          mandatoryCities.push(stop);
          console.log(`🏛️ Mandatory heritage city: ${stop.name} (${heritage.heritageScore}/100, ${heritage.heritageTier})`);
        }
      }
    }

    // Sort by distance from start to maintain proper sequence
    return mandatoryCities.sort((a, b) => {
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        b.latitude, b.longitude
      );
      return distA - distB;
    });
  }

  /**
   * Select destinations with heritage enforcement
   */
  private static selectDestinationsWithHeritageEnforcement(
    startStop: TripStop,
    endStop: TripStop,
    mandatoryHeritageCities: TripStop[],
    allValidStops: TripStop[],
    totalDays: number
  ): TripStop[] {
    const intermediateDays = totalDays - 1;
    const selectedDestinations: TripStop[] = [];

    // First, include all mandatory heritage cities
    selectedDestinations.push(...mandatoryHeritageCities);

    // If we need more destinations, fill with best available
    const remainingSlots = intermediateDays - mandatoryHeritageCities.length;
    
    if (remainingSlots > 0) {
      const availableStops = allValidStops.filter(stop => 
        !mandatoryHeritageCities.some(mandatory => mandatory.id === stop.id)
      );

      // Score remaining stops by heritage + position
      const scoredStops = availableStops.map(stop => {
        const heritage = HeritageScoringService.calculateHeritageScore(stop);
        const distanceFromStart = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          stop.latitude, stop.longitude
        );
        
        return {
          stop,
          score: heritage.heritageScore,
          distanceFromStart
        };
      });

      // Sort by heritage score, then by position
      scoredStops.sort((a, b) => {
        if (Math.abs(a.score - b.score) > 10) {
          return b.score - a.score; // Prefer higher heritage
        }
        return a.distanceFromStart - b.distanceFromStart; // Then by position
      });

      // Add the best remaining destinations
      for (let i = 0; i < Math.min(remainingSlots, scoredStops.length); i++) {
        selectedDestinations.push(scoredStops[i].stop);
      }
    }

    // Sort final list by distance from start to maintain sequence
    return selectedDestinations.sort((a, b) => {
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        b.latitude, b.longitude
      );
      return distA - distB;
    });
  }

  /**
   * Build initial segments from destinations
   */
  private static buildInitialSegments(
    startStop: TripStop,
    destinations: TripStop[],
    endStop: TripStop
  ): Array<{ segment: DailySegment; startStop: TripStop; endStop: TripStop }> {
    const segments: Array<{ segment: DailySegment; startStop: TripStop; endStop: TripStop }> = [];
    let currentStop = startStop;

    // Intermediate segments
    destinations.forEach((destination, index) => {
      const day = index + 1;
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        destination.latitude, destination.longitude
      );

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${currentStop.name} to ${destination.name}`,
        startCity: CityDisplayService.getCityDisplayName(currentStop),
        endCity: CityDisplayService.getCityDisplayName(destination),
        distance,
        approximateMiles: Math.round(distance),
        driveTimeHours: distance / this.AVG_SPEED_MPH,
        destination: {
          city: destination.city_name || destination.name,
          state: destination.state
        },
        recommendedStops: [{
          stopId: destination.id,
          id: destination.id,
          name: destination.name,
          description: destination.description,
          latitude: destination.latitude,
          longitude: destination.longitude,
          category: destination.category,
          city_name: destination.city_name,
          state: destination.state,
          city: destination.city || destination.city_name || 'Unknown'
        }],
        attractions: [],
        stops: []
      };

      segments.push({ segment, startStop: currentStop, endStop: destination });
      currentStop = destination;
    });

    // Final segment to end
    const finalDay = destinations.length + 1;
    const finalDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      endStop.latitude, endStop.longitude
    );

    const finalSegment: DailySegment = {
      day: finalDay,
      title: `Day ${finalDay}: ${currentStop.name} to ${endStop.name}`,
      startCity: CityDisplayService.getCityDisplayName(currentStop),
      endCity: CityDisplayService.getCityDisplayName(endStop),
      distance: finalDistance,
      approximateMiles: Math.round(finalDistance),
      driveTimeHours: finalDistance / this.AVG_SPEED_MPH,
      destination: {
        city: endStop.city_name || endStop.name,
        state: endStop.state
      },
      recommendedStops: [{
        stopId: endStop.id,
        id: endStop.id,
        name: endStop.name,
        description: endStop.description,
        latitude: endStop.latitude,
        longitude: endStop.longitude,
        category: endStop.category,
        city_name: endStop.city_name,
        state: endStop.state,
        city: endStop.city || endStop.city_name || 'Unknown'
      }],
      attractions: [],
      stops: []
    };

    segments.push({ segment: finalSegment, startStop: currentStop, endStop });

    return segments;
  }

  /**
   * Convert rebalanced segments back to DailySegment format
   */
  private static convertToFinalSegments(
    rebalancedSegments: Array<{ startStop: TripStop; endStop: TripStop }>
  ): DailySegment[] {
    return rebalancedSegments.map((segment, index) => {
      const day = index + 1;
      const distance = DistanceCalculationService.calculateDistance(
        segment.startStop.latitude, segment.startStop.longitude,
        segment.endStop.latitude, segment.endStop.longitude
      );

      return {
        day,
        title: `Day ${day}: ${segment.startStop.name} to ${segment.endStop.name}`,
        startCity: CityDisplayService.getCityDisplayName(segment.startStop),
        endCity: CityDisplayService.getCityDisplayName(segment.endStop),
        distance,
        approximateMiles: Math.round(distance),
        driveTimeHours: distance / this.AVG_SPEED_MPH,
        destination: {
          city: segment.endStop.city_name || segment.endStop.name,
          state: segment.endStop.state
        },
        recommendedStops: [{
          stopId: segment.endStop.id,
          id: segment.endStop.id,
          name: segment.endStop.name,
          description: segment.endStop.description,
          latitude: segment.endStop.latitude,
          longitude: segment.endStop.longitude,
          category: segment.endStop.category,
          city_name: segment.endStop.city_name,
          state: segment.endStop.state,
          city: segment.endStop.city || segment.endStop.city_name || 'Unknown'
        }],
        attractions: [],
        stops: []
      };
    });
  }

  /**
   * Calculate heritage statistics for the trip
   */
  private static calculateHeritageStatistics(destinations: TripStop[]) {
    const heritageScores = destinations.map(dest => 
      HeritageScoringService.calculateHeritageScore(dest)
    );

    const totalHeritageCities = destinations.length;
    const highHeritageCities = heritageScores.filter(h => h.heritageScore >= this.HIGH_HERITAGE_THRESHOLD).length;
    const averageHeritageScore = heritageScores.reduce((sum, h) => sum + h.heritageScore, 0) / heritageScores.length;

    const tierDistribution: Record<string, number> = {};
    heritageScores.forEach(h => {
      tierDistribution[h.heritageTier] = (tierDistribution[h.heritageTier] || 0) + 1;
    });

    return {
      totalHeritageCities,
      highHeritageCities,
      averageHeritageScore,
      tierDistribution
    };
  }

  /**
   * Perform gap analysis on the trip
   */
  private static performGapAnalysis(
    segments: DailySegment[],
    startStop: TripStop,
    endStop: TripStop
  ) {
    const gapDetails: string[] = [];
    let hasSignificantGaps = false;

    // Check for drive time imbalances
    const driveTimes = segments.map(seg => seg.driveTimeHours);
    const maxDriveTime = Math.max(...driveTimes);
    const minDriveTime = Math.min(...driveTimes);
    const avgDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;

    if (maxDriveTime > avgDriveTime * 1.5) {
      hasSignificantGaps = true;
      gapDetails.push(`Significant drive time imbalance: max ${maxDriveTime.toFixed(1)}h vs avg ${avgDriveTime.toFixed(1)}h`);
    }

    // Check if final segment is consistently the longest
    const finalSegmentIndex = segments.length - 1;
    if (segments[finalSegmentIndex]?.driveTimeHours === maxDriveTime && maxDriveTime > 8) {
      hasSignificantGaps = true;
      gapDetails.push(`Final day has longest drive time: ${maxDriveTime.toFixed(1)}h`);
    }

    return {
      hasSignificantGaps,
      gapDetails
    };
  }

  /**
   * Find a location stop by name
   */
  private static findLocationStop(locationName: string, allStops: TripStop[]): TripStop | null {
    return allStops.find(stop =>
      stop.city_name?.toLowerCase().includes(locationName.toLowerCase()) ||
      stop.name.toLowerCase().includes(locationName.toLowerCase())
    ) || null;
  }
}
