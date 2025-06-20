
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { CoordinateAccessSafety } from './CoordinateAccessSafety';

export class EnhancedHeritageCitiesService {
  /**
   * Plan enhanced heritage cities trip with coordinate safety
   */
  static async planEnhancedHeritageCitiesTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`🏛️ ENHANCED HERITAGE: Planning ${travelDays} day trip from ${startLocation} to ${endLocation}`);
    
    try {
      // Validate coordinates for all stops
      const validStops = allStops.filter(stop => 
        CoordinateAccessSafety.canSafelyAccessCoordinates(stop, `heritage-validation-${stop.id}`)
      );
      
      console.log(`✅ COORDINATE SAFETY: ${validStops.length} stops passed validation from ${allStops.length} total`);
      
      if (validStops.length === 0) {
        throw new Error('No valid stops available for heritage cities trip planning');
      }
      
      // Find start and end stops
      const startStop = validStops.find(stop => 
        stop.name.toLowerCase().includes(startLocation.toLowerCase()) ||
        stop.city?.toLowerCase().includes(startLocation.toLowerCase())
      );
      
      const endStop = validStops.find(stop => 
        stop.name.toLowerCase().includes(endLocation.toLowerCase()) ||
        stop.city?.toLowerCase().includes(endLocation.toLowerCase())
      );
      
      if (!startStop || !endStop) {
        console.warn(`⚠️ Could not find exact matches for start/end locations, using fallback`);
      }
      
      // Create segments based on available days
      const segments = this.createHeritageCitiesSegments(
        startStop || validStops[0],
        endStop || validStops[validStops.length - 1],
        validStops,
        travelDays
      );
      
      const tripPlan: TripPlan = {
        title: `${startLocation} to ${endLocation} Heritage Cities Route 66 Adventure`,
        segments,
        totalDistance: this.calculateTotalDistance(segments),
        totalDays: travelDays,
        tripStyle: 'destination-focused'
      };
      
      console.log(`✅ HERITAGE CITIES: Created ${segments.length} day trip plan`);
      return tripPlan;
      
    } catch (error) {
      console.error('❌ HERITAGE CITIES: Planning failed:', error);
      throw new Error(`Heritage cities trip planning failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create segments for heritage cities trip
   */
  private static createHeritageCitiesSegments(
    startStop: TripStop,
    endStop: TripStop,
    validStops: TripStop[],
    travelDays: number
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    
    // For now, create basic segments without the invalid 'startStop' property
    for (let day = 1; day <= travelDays; day++) {
      const isLastDay = day === travelDays;
      const currentStop = day === 1 ? startStop : validStops[Math.min(day - 1, validStops.length - 1)];
      const nextStop = isLastDay ? endStop : validStops[Math.min(day, validStops.length - 1)];
      
      const segment: DailySegment = {
        day,
        from: currentStop.name,
        to: nextStop.name,
        distance: 150, // Placeholder distance
        estimatedDriveTime: 3, // Placeholder drive time
        destinationCity: nextStop.name,
        state: nextStop.state,
        coordinates: CoordinateAccessSafety.safeGetCoordinates(nextStop, `segment-${day}`),
        recommendedStops: [],
        nearbyAttractionsCount: 0
      };
      
      segments.push(segment);
    }
    
    return segments;
  }

  /**
   * Calculate total distance for segments
   */
  private static calculateTotalDistance(segments: DailySegment[]): number {
    return segments.reduce((total, segment) => total + segment.distance, 0);
  }

  /**
   * Placeholder method for geographic progression fix
   */
  static fixGeographicProgressionSafe(
    segments: DailySegment[],
    allStops: TripStop[]
  ): DailySegment[] {
    console.log(`🔧 GEOGRAPHIC FIX: Processing ${segments.length} segments`);
    
    // For now, return segments as-is
    // This method can be enhanced later with actual geographic progression logic
    return segments;
  }
}
