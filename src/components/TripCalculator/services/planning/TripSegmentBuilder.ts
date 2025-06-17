
import { TripStop } from '../data/SupabaseDataService';
import { DailySegment } from './TripPlanTypes';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { SequenceOrderService } from './SequenceOrderService';

export class TripCompletionService {
  static calculateRouteProgression(
    segmentNumber: number,
    totalDistance: number,
    cumulativeDistance: number
  ): any {
    const progressPercentage = (cumulativeDistance / totalDistance) * 100;
    return {
      segmentNumber,
      progressPercentage: Math.round(progressPercentage),
      cumulativeDistance: Math.round(cumulativeDistance),
      totalDistance: Math.round(totalDistance)
    };
  }

  static sanitizeSegment(segment: DailySegment, index: number): DailySegment {
    return {
      ...segment,
      day: segment.day || index + 1,
      distance: segment.distance || 0,
      driveTimeHours: segment.driveTimeHours || 0,
      approximateMiles: segment.approximateMiles || Math.round(segment.distance || 0)
    };
  }

  static analyzeTripCompletion(
    originalDays: number,
    optimizedDays: number,
    segments: any[]
  ): any {
    const isCompleted = optimizedDays > 0 && segments.length > 0;
    
    return {
      isCompleted,
      originalDays,
      optimizedDays,
      adjustmentReason: originalDays !== optimizedDays ? 'Route optimization' : undefined,
      confidence: 0.85,
      qualityMetrics: {
        driveTimeBalance: 'good',
        routeEfficiency: 'excellent',
        attractionCoverage: 'good',
        overallScore: 0.8
      },
      recommendations: [
        'Consider adding rest stops for longer driving segments',
        'Check local attractions at each destination'
      ],
      totalUsefulDays: optimizedDays,
      unusedDays: Math.max(0, originalDays - optimizedDays)
    };
  }
}

export class TripSegmentBuilder {
  static buildSegment(
    startStop: TripStop,
    endStop: TripStop,
    segments: DailySegment[],
    totalDistance: number
  ): DailySegment {
    const distance = DistanceCalculationService.calculateDistance(
      startStop.latitude,
      startStop.longitude,
      endStop.latitude,
      endStop.longitude
    );

    const cumulativeDistance = segments.reduce((sum, segment) => sum + segment.distance, 0) + distance;

    const routeSection = TripCompletionService.calculateRouteProgression(
      segments.length + 1,
      totalDistance,
      cumulativeDistance
    );

    const sanitizedSegments = segments.map((segment, index) => 
      TripCompletionService.sanitizeSegment(segment, index)
    );

    return {
      day: segments.length + 1,
      title: `Day ${segments.length + 1}: ${startStop.name} to ${endStop.name}`,
      startCity: CityDisplayService.getCityDisplayName(startStop),
      endCity: CityDisplayService.getCityDisplayName(endStop),
      distance: distance,
      approximateMiles: Math.round(distance),
      driveTimeHours: distance / 60,
      destination: {
        city: endStop.city_name || endStop.name,
        state: endStop.state,
      },
      recommendedStops: [],
      attractions: [],
      routeSection: routeSection,
    };
  }

  static buildSegmentsWithDestinationCities(
    startStop: TripStop,
    endStop: TripStop,
    selectedDestinationCities: TripStop[],
    tripDays: number,
    styleConfig: any
  ): DailySegment[] {
    console.log(`🏗️ Building segments with sequence-aware validation`);
    
    // Validate sequence progression before building segments
    const allTripStops = [startStop, ...selectedDestinationCities, endStop];
    const sequenceValidation = SequenceOrderService.validateSequenceProgression(allTripStops);
    
    if (!sequenceValidation.isValid) {
      console.warn(`⚠️ Sequence violations detected before building segments:`, sequenceValidation.violations);
      
      // Attempt to fix sequence by re-sorting destinations
      const direction = SequenceOrderService.getTripDirection(startStop, endStop);
      const correctedDestinations = SequenceOrderService.sortBySequence(selectedDestinationCities, direction);
      
      console.log(`🔧 Attempting to fix sequence by re-sorting destinations`);
      selectedDestinationCities = correctedDestinations;
    }
    
    const segments: DailySegment[] = [];
    let currentStop = startStop;

    // Calculate total distance for progress tracking
    const totalDistance = this.calculateTotalTripDistance(startStop, endStop, selectedDestinationCities);

    // Create segments through selected destinations
    for (let i = 0; i < selectedDestinationCities.length; i++) {
      const nextStop = selectedDestinationCities[i];
      
      // Validate this specific segment maintains sequence
      const direction = SequenceOrderService.getTripDirection(startStop, endStop);
      const currentOrder = SequenceOrderService.getSequenceOrder(currentStop);
      const nextOrder = SequenceOrderService.getSequenceOrder(nextStop);
      
      let isValidProgression = false;
      if (direction === 'westbound') {
        isValidProgression = nextOrder >= currentOrder;
      } else {
        isValidProgression = nextOrder <= currentOrder;
      }
      
      if (!isValidProgression) {
        console.warn(`⚠️ Sequence violation: ${currentStop.name} (${currentOrder}) → ${nextStop.name} (${nextOrder}) for ${direction} travel`);
      }
      
      const segment = this.buildSegment(currentStop, nextStop, segments, totalDistance);
      segments.push(segment);
      currentStop = nextStop;
    }

    // Add final segment to end destination
    if (currentStop.id !== endStop.id) {
      const finalSegment = this.buildSegment(currentStop, endStop, segments, totalDistance);
      segments.push(finalSegment);
    }

    // Final validation of complete trip sequence
    const finalValidation = SequenceOrderService.validateSequenceProgression(allTripStops);
    if (finalValidation.isValid) {
      console.log(`✅ Sequence-validated segments built successfully: ${segments.length} segments`);
    } else {
      console.warn(`⚠️ Final sequence validation failed:`, finalValidation.violations);
    }

    return segments;
  }

  private static calculateTotalTripDistance(
    startStop: TripStop,
    endStop: TripStop,
    intermediateStops: TripStop[]
  ): number {
    let totalDistance = 0;
    let currentStop = startStop;

    // Add distances through intermediate stops
    for (const stop of intermediateStops) {
      totalDistance += DistanceCalculationService.calculateDistance(
        currentStop.latitude,
        currentStop.longitude,
        stop.latitude,
        stop.longitude
      );
      currentStop = stop;
    }

    // Add final distance to end
    totalDistance += DistanceCalculationService.calculateDistance(
      currentStop.latitude,
      currentStop.longitude,
      endStop.latitude,
      endStop.longitude
    );

    return totalDistance;
  }
}
