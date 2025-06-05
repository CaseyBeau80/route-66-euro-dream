
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
    console.log(`🎯 Starting curation for ${currentStop.name} → ${dayDestination.name} with ${remainingStops.length} available stops`);
    
    // Calculate expected drive time for curation
    const segmentDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      dayDestination.latitude, dayDestination.longitude
    );
    const expectedDriveTime = segmentDistance / 50; // 50 mph average

    console.log(`🚗 Segment distance: ${segmentDistance.toFixed(1)} miles, expected drive time: ${expectedDriveTime.toFixed(1)} hours`);

    // Enhanced stop curation with intelligent categorization
    const curatedSelection = EnhancedSegmentStopSelector.selectCuratedStopsForSegment(
      currentStop,
      dayDestination,
      remainingStops,
      expectedDriveTime,
      {
        maxStops: expectedDriveTime <= 5 ? 4 : expectedDriveTime <= 7 ? 3 : 1,
        attractionRatio: 0.6,
        preferDestinationCities: true,
        diversityBonus: true
      }
    );

    // Combine all selected stops for backward compatibility
    const segmentStops = EnhancedSegmentStopSelector.combineSelectedStops(curatedSelection);

    console.log(`✅ Curated ${segmentStops.length} stops for segment:`, {
      driveTime: expectedDriveTime.toFixed(1) + 'h',
      attractions: curatedSelection.attractions.length,
      waypoints: curatedSelection.waypoints.length,
      hiddenGems: curatedSelection.hiddenGems.length,
      stopNames: segmentStops.map(s => s.name)
    });

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
      if (index > -1) {
        remainingStops.splice(index, 1);
        console.log(`♻️ Removed used stop: ${stop.name}`);
      }
    });
    return remainingStops;
  }
}
