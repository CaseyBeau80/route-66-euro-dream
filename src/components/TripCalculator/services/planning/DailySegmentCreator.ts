
import { TripStop } from '../../types/TripStop';
import { DailySegment } from './TripPlanBuilder';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { OvernightStopValidator } from './OvernightStopValidator';
import { OvernightStopSelector } from './OvernightStopSelector';
import { SegmentFactory } from './SegmentFactory';

export class DailySegmentCreator {
  /**
   * Create balanced daily segments ensuring only destination cities are used for overnight stops
   */
  static createBalancedDailySegments(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    totalDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log(`🏗️ STRICT: Creating ${totalDays} daily segments with destination city enforcement`);
    
    // Filter to only use destination cities for overnight stops
    const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    
    console.log(`🏛️ STRICT: Available destination cities for overnight stops: ${destinationCities.length}`);
    console.log(`🏛️ STRICT: Destination cities: ${destinationCities.map(stop => stop.name).join(', ')}`);
    
    // Calculate average distance per day
    const avgDistancePerDay = totalDistance / totalDays;
    console.log(`📏 STRICT: Target average distance per day: ${Math.round(avgDistancePerDay)} miles`);
    
    // Find intermediate overnight stops (destination cities only)
    const overnightStops = OvernightStopSelector.selectDestinationCityOvernightStops(
      startStop,
      endStop,
      destinationCities,
      totalDays,
      totalDistance
    );
    
    // Validate the overnight stops and collect warnings
    const warnings = OvernightStopValidator.validateOvernightStops(overnightStops);
    
    if (warnings.length > 0) {
      console.warn('🛡️ STRICT: Overnight stop validation warnings:', warnings);
    }
    
    // Create segments
    const segments: DailySegment[] = [];
    let currentStop = startStop;
    
    for (let day = 1; day <= totalDays; day++) {
      const isLastDay = day === totalDays;
      const dayEndStop = isLastDay ? endStop : overnightStops[day - 1];
      
      if (!dayEndStop) {
        console.error(`❌ STRICT: No end stop found for day ${day}`);
        continue;
      }
      
      // Create segment with strict validation
      const segment = SegmentFactory.createStrictSegment(
        currentStop,
        dayEndStop,
        allStops,
        day,
        totalDistance
      );
      
      if (segment) {
        segments.push(segment);
        currentStop = dayEndStop;
      }
    }
    
    console.log(`✅ STRICT: Created ${segments.length} validated daily segments`);
    return segments;
  }
}
