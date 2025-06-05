
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface RouteSection {
  name: string;
  startPercent: number;
  endPercent: number;
}

export class StopEnhancementService {
  private static readonly ROUTE_SECTIONS: RouteSection[] = [
    { name: 'Early Route', startPercent: 0, endPercent: 33 },
    { name: 'Mid Route', startPercent: 33, endPercent: 66 },
    { name: 'Final Stretch', startPercent: 66, endPercent: 100 }
  ];

  /**
   * Deduplicate stops based on name similarity, location proximity, and image URL
   */
  static deduplicateStops(stops: TripStop[]): TripStop[] {
    const deduplicated: TripStop[] = [];
    const PROXIMITY_THRESHOLD_MILES = 5;

    for (const stop of stops) {
      let isDuplicate = false;

      for (const existing of deduplicated) {
        // Check name similarity (case-insensitive)
        const nameSimilar = existing.name.toLowerCase() === stop.name.toLowerCase();
        
        // Check location proximity
        const distance = DistanceCalculationService.calculateDistance(
          existing.latitude, existing.longitude,
          stop.latitude, stop.longitude
        );
        const locationClose = distance < PROXIMITY_THRESHOLD_MILES;
        
        // Check same image URL
        const sameImage = existing.image_url && stop.image_url && 
                         existing.image_url === stop.image_url;

        if (nameSimilar || (locationClose && sameImage)) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        deduplicated.push(stop);
      }
    }

    console.log(`🔧 Deduplicated ${stops.length} stops to ${deduplicated.length} unique stops`);
    return deduplicated;
  }

  /**
   * Ensure geographic diversity across route sections
   */
  static ensureGeographicDiversity(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[]
  ): TripStop[] {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Categorize stops by route section
    const stopsBySection = this.categorizeStopsBySection(
      startStop, endStop, availableStops, totalDistance
    );

    // Ensure each section has at least one stop
    const diverseStops: TripStop[] = [];
    
    for (const section of this.ROUTE_SECTIONS) {
      const sectionStops = stopsBySection[section.name] || [];
      if (sectionStops.length > 0) {
        // Add best stops from this section (prioritized)
        const prioritizedStops = this.prioritizeStops(sectionStops);
        diverseStops.push(...prioritizedStops.slice(0, Math.max(1, Math.floor(sectionStops.length / 2))));
      }
    }

    console.log(`🌍 Geographic diversity: ${diverseStops.length} stops distributed across route sections`);
    return this.deduplicateStops(diverseStops);
  }

  /**
   * Categorize stops by route section based on distance from start
   */
  private static categorizeStopsBySection(
    startStop: TripStop,
    endStop: TripStop,
    stops: TripStop[],
    totalDistance: number
  ): Record<string, TripStop[]> {
    const sections: Record<string, TripStop[]> = {};
    
    for (const section of this.ROUTE_SECTIONS) {
      sections[section.name] = [];
    }

    for (const stop of stops) {
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );
      
      const progressPercent = (distanceFromStart / totalDistance) * 100;
      
      for (const section of this.ROUTE_SECTIONS) {
        if (progressPercent >= section.startPercent && progressPercent < section.endPercent) {
          sections[section.name].push(stop);
          break;
        }
      }
    }

    return sections;
  }

  /**
   * Prioritize stops based on category and importance
   */
  private static prioritizeStops(stops: TripStop[]): TripStop[] {
    return stops.sort((a, b) => {
      const getPriority = (stop: TripStop): number => {
        if (stop.category === 'route66_waypoint' && stop.is_major_stop) return 1;
        if (stop.category === 'destination_city') return 2;
        if (stop.category === 'route66_waypoint') return 3;
        if (stop.category === 'attraction') return 4;
        if (stop.category === 'hidden_gem') return 5;
        return 6;
      };

      return getPriority(a) - getPriority(b);
    });
  }

  /**
   * Smart trip day calculation based on total distance
   */
  static calculateOptimalTripDays(totalDistanceMiles: number, requestedDays: number): number {
    const MILES_PER_DAY_COMFORTABLE = 350;
    const MILES_PER_DAY_MAXIMUM = 600;
    
    // If requested days would result in too much driving per day, suggest more days
    const milesPerDay = totalDistanceMiles / requestedDays;
    
    if (milesPerDay > MILES_PER_DAY_MAXIMUM) {
      const suggestedDays = Math.ceil(totalDistanceMiles / MILES_PER_DAY_COMFORTABLE);
      console.log(`🚗 Adjusting trip from ${requestedDays} to ${suggestedDays} days for safer daily distances`);
      return suggestedDays;
    }
    
    return requestedDays;
  }

  /**
   * Validate segment to ensure it's meaningful
   */
  static isValidSegment(fromStop: TripStop, toStop: TripStop, minDistanceMiles: number = 10): boolean {
    if (fromStop.id === toStop.id) {
      return false;
    }
    
    const distance = DistanceCalculationService.calculateDistance(
      fromStop.latitude, fromStop.longitude,
      toStop.latitude, toStop.longitude
    );
    
    return distance >= minDistanceMiles;
  }
}
