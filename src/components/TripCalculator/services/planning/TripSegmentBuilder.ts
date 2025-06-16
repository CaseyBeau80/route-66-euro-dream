
import { DailySegment } from './TripPlanTypes';
import { TripStop } from '../data/SupabaseDataService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { TripPlanUtils } from './TripPlanUtils';

export class TripSegmentBuilder {
  /**
   * Build segments with destination cities only
   */
  static buildSegmentsWithDestinationCities(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    
    // Create array of all stops in order: start, destination cities, end
    const allDayStops = [startStop, ...destinationCities, endStop];
    
    for (let day = 1; day <= tripDays; day++) {
      const currentStop = allDayStops[day - 1];
      const nextStop = allDayStops[day];
      
      if (!currentStop || !nextStop) continue;
      
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        nextStop.latitude, nextStop.longitude
      );
      
      const driveTimeHours = segmentDistance / 50; // 50 mph average
      
      // Only include destination cities as recommended stops
      const segmentStops = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly([nextStop]);
      
      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${currentStop.city_name} to ${nextStop.city_name}`,
        startCity: CityDisplayService.getCityDisplayName(currentStop),
        endCity: CityDisplayService.getCityDisplayName(nextStop),
        distance: segmentDistance,
        approximateMiles: Math.round(segmentDistance),
        driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
        destination: {
          city: nextStop.city_name,
          state: nextStop.state
        },
        recommendedStops: segmentStops,
        attractions: segmentStops.map(stop => ({
          name: stop.name,
          title: stop.name,
          description: stop.description,
          city: stop.city_name
        })),
        driveTimeCategory: TripPlanUtils.getDriveTimeCategory(driveTimeHours),
        routeSection: TripPlanUtils.getRouteSection(day, tripDays)
      };
      
      segments.push(segment);
    }
    
    return segments;
  }
}
