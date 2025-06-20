
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
      
      const finalStartStop = startStop || validStops[0];
      const finalEndStop = endStop || validStops[validStops.length - 1];
      
      // Create segments based on available days
      const segments = this.createHeritageCitiesSegments(
        finalStartStop,
        finalEndStop,
        validStops,
        travelDays
      );
      
      // Calculate total distance and driving time
      const totalDistance = this.calculateTotalDistance(segments);
      const totalDrivingTime = segments.reduce((total, segment) => total + (segment.driveTimeHours || 0), 0);
      
      // Create complete TripPlan object with all required properties
      const tripPlan: TripPlan = {
        id: `heritage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `${startLocation} to ${endLocation} Heritage Cities Route 66 Adventure`,
        startCity: finalStartStop.name,
        endCity: finalEndStop.name,
        startLocation: startLocation,
        endLocation: endLocation,
        startDate: new Date(),
        totalDays: travelDays,
        totalDistance: totalDistance,
        totalMiles: totalDistance,
        totalDrivingTime: totalDrivingTime,
        segments: segments,
        dailySegments: segments, // Ensure both properties are set
        stops: validStops,
        tripStyle: 'destination-focused',
        lastUpdated: new Date()
      };
      
      console.log(`✅ HERITAGE CITIES: Created complete trip plan with ${segments.length} segments`);
      return tripPlan;
      
    } catch (error) {
      console.error('❌ HERITAGE CITIES: Planning failed:', error);
      throw new Error(`Heritage cities trip planning failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create segments for heritage cities trip with proper structure
   */
  private static createHeritageCitiesSegments(
    startStop: TripStop,
    endStop: TripStop,
    validStops: TripStop[],
    travelDays: number
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    
    for (let day = 1; day <= travelDays; day++) {
      const isLastDay = day === travelDays;
      const currentStop = day === 1 ? startStop : validStops[Math.min(day - 1, validStops.length - 1)];
      const nextStop = isLastDay ? endStop : validStops[Math.min(day, validStops.length - 1)];
      
      // Get safe coordinates for the destination
      const destinationCoordinates = CoordinateAccessSafety.safeGetCoordinates(nextStop, `segment-${day}`);
      
      const segment: DailySegment = {
        day,
        title: `${currentStop.name} to ${nextStop.name}`,
        startCity: currentStop.name,
        endCity: nextStop.name,
        distance: 150, // Placeholder distance
        approximateMiles: 150,
        driveTimeHours: 3, // Placeholder drive time
        destination: {
          city: nextStop.city || nextStop.name,
          state: nextStop.state || 'Unknown'
        },
        recommendedStops: [{
          stopId: nextStop.id,
          id: nextStop.id,
          name: nextStop.name,
          description: nextStop.description || '',
          latitude: destinationCoordinates?.latitude || 0,
          longitude: destinationCoordinates?.longitude || 0,
          category: nextStop.category || 'destination_city',
          city_name: nextStop.city || nextStop.name,
          state: nextStop.state || 'Unknown',
          city: nextStop.city || nextStop.name
        }],
        attractions: [{
          name: nextStop.name,
          title: nextStop.name,
          description: nextStop.description || 'Historic Route 66 destination',
          city: nextStop.city || nextStop.name,
          category: nextStop.category || 'heritage_site'
        }]
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
