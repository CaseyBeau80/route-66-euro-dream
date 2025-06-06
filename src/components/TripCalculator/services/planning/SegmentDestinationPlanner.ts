
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { DestinationCandidateService } from './DestinationCandidateService';

export class SegmentDestinationPlanner {
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * Select optimal destinations for daily segments, prioritizing official destination cities
   */
  static selectDailyDestinations(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    totalDays: number
  ): TripStop[] {
    console.log(`🎯 SegmentDestinationPlanner: Selecting destinations for ${totalDays} days`);

    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    console.log(`📏 Total distance: ${totalDistance.toFixed(0)} miles`);

    // Separate official destination cities from other stops
    const officialDestinations = allStops.filter(stop => 
      stop.category === 'destination_city' &&
      stop.id !== startStop.id &&
      stop.id !== endStop.id
    );

    const otherStops = allStops.filter(stop => 
      stop.category !== 'destination_city' &&
      stop.id !== startStop.id &&
      stop.id !== endStop.id
    );

    console.log(`🏙️ Found ${officialDestinations.length} official destination cities`);
    console.log(`📍 Found ${otherStops.length} other stops available`);

    const selectedDestinations: TripStop[] = [];
    let currentStop = startStop;
    const targetDailyDistance = totalDistance / totalDays;

    // Select destinations for each intermediate day
    for (let day = 1; day < totalDays; day++) {
      const targetDistanceFromStart = targetDailyDistance * day;
      
      console.log(`📅 Day ${day + 1}: Looking for destination around ${targetDistanceFromStart.toFixed(0)} miles from start`);

      const candidateDestination = DestinationCandidateService.selectBestDestinationForDay(
        currentStop,
        endStop,
        officialDestinations,
        otherStops,
        selectedDestinations,
        targetDistanceFromStart
      );

      if (candidateDestination) {
        selectedDestinations.push(candidateDestination);
        currentStop = candidateDestination;
        
        console.log(`✅ Selected ${candidateDestination.name} (${candidateDestination.category}) in ${CityDisplayService.getCityDisplayName(candidateDestination)}`);
      } else {
        console.log(`⚠️ No suitable destination found for day ${day + 1}`);
        break;
      }
    }

    console.log(`🎯 Final selection: ${selectedDestinations.length} destinations for ${totalDays} days`);
    return selectedDestinations;
  }

  /**
   * Get summary of destination selection strategy
   */
  static getSelectionSummary(destinations: TripStop[]): string {
    const officialCount = destinations.filter(d => d.category === 'destination_city').length;
    const otherCount = destinations.length - officialCount;
    
    return `Selected ${destinations.length} destinations: ${officialCount} official cities, ${otherCount} other stops`;
  }
}
