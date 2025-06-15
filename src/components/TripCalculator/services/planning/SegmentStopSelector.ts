
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopValidationService } from './StopValidationService';

export class SegmentStopSelector {
  /**
   * Select stops for a specific segment with validation and deduplication
   */
  static selectStopsForSegment(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    maxStops: number,
    expectedDriveTime?: number
  ): TripStop[] {
    console.log(`🎯 Selecting stops for segment: ${startStop.name} → ${endStop.name}`);
    
    // Calculate distance between start and end
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Filter stops that are roughly along this segment
    const segmentCandidates = availableStops.filter(stop => {
      if (stop.id === startStop.id || stop.id === endStop.id) return false;
      
      const startToStop = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );
      const stopToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        endStop.latitude, endStop.longitude
      );
      
      // Check if stop is roughly on the segment path
      const totalViaStop = startToStop + stopToEnd;
      const detourFactor = totalViaStop / totalDistance;
      
      // More restrictive filtering to avoid excessive detours
      return detourFactor <= 1.15 && startToStop < totalDistance * 0.75;
    });

    // Validate and deduplicate candidates
    const validCandidates = StopValidationService.validateAndDeduplicateStops(
      segmentCandidates,
      startStop,
      endStop
    );

    // Sort by priority and distance
    validCandidates.sort((a, b) => {
      // Prioritize destination cities
      if (a.category === 'destination_city' && b.category !== 'destination_city') return -1;
      if (b.category === 'destination_city' && a.category !== 'destination_city') return 1;
      
      // Then by distance from start
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

    // Select up to maxStops
    const selectedStops = validCandidates.slice(0, Math.min(maxStops, validCandidates.length));

    console.log(`📍 Selected ${selectedStops.length} validated stops for segment (from ${validCandidates.length} candidates)`);
    return selectedStops;
  }
}
