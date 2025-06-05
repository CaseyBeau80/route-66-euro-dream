
import { TripStop } from '../data/SupabaseDataService';
import { EnhancedSegmentStopSelector } from './EnhancedSegmentStopSelector';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class SegmentStopCurator {
  /**
   * Curate stops for a segment with intelligent categorization
   */
  static curateStopsForSegment(
    currentStop: TripStop,
    dayDestination: TripStop,
    remainingStops: TripStop[]
  ): {
    segmentStops: TripStop[];
    curatedSelection: any;
  } {
    // Calculate expected drive time for curation
    const segmentDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      dayDestination.latitude, dayDestination.longitude
    );
    const expectedDriveTime = segmentDistance / 50; // 50 mph average

    // Enhanced stop curation with intelligent categorization
    const curatedSelection = EnhancedSegmentStopSelector.selectCuratedStopsForSegment(
      currentStop,
      dayDestination,
      remainingStops,
      expectedDriveTime,
      {
        maxStops: 4,
        attractionRatio: 0.6, // 60% attractions, 40% waypoints/gems
        preferDestinationCities: true,
        diversityBonus: true
      }
    );

    // Combine all selected stops for backward compatibility
    const segmentStops = EnhancedSegmentStopSelector.combineSelectedStops(curatedSelection);

    return {
      segmentStops,
      curatedSelection
    };
  }

  /**
   * Remove used stops from remaining stops collection
   */
  static removeUsedStops(remainingStops: TripStop[], usedStops: TripStop[]): TripStop[] {
    usedStops.forEach(stop => {
      const index = remainingStops.findIndex(s => s.id === stop.id);
      if (index > -1) remainingStops.splice(index, 1);
    });
    return remainingStops;
  }
}
