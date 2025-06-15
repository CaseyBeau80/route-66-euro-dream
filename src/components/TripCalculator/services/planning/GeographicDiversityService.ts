
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { ROUTE_SECTIONS, RouteSection } from './RouteSection';
import { StopDeduplicationService } from './StopDeduplicationService';

export class GeographicDiversityService {
  /**
   * Enhanced geographic diversity with destination city preference and route ordering
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

    // Sort stops by distance from start to ensure proper route progression
    const routeOrderedStops = this.sortStopsByRouteProgression(
      startStop, endStop, availableStops, totalDistance
    );

    // Categorize stops by route section based on their position along the route
    const stopsBySection = this.categorizeStopsBySection(
      startStop, endStop, routeOrderedStops, totalDistance
    );

    // Ensure each section has destination cities first, then other stops
    const diverseStops: TripStop[] = [];
    
    for (const section of ROUTE_SECTIONS) {
      const sectionStops = stopsBySection[section.name] || [];
      if (sectionStops.length > 0) {
        // Separate destination cities from other stops
        const destinationCities = sectionStops.filter(stop => 
          stop.category === 'destination_city'
        );
        
        const majorWaypoints = sectionStops.filter(stop => 
          stop.category === 'route66_waypoint' && stop.is_major_stop
        );
        
        const otherStops = sectionStops.filter(stop => 
          stop.category !== 'destination_city' && 
          !(stop.category === 'route66_waypoint' && stop.is_major_stop)
        );

        // ALWAYS include ALL destination cities in each section
        if (destinationCities.length > 0) {
          const prioritizedDestinations = this.prioritizeStops(destinationCities);
          diverseStops.push(...prioritizedDestinations);
          console.log(`🏙️ Added ${prioritizedDestinations.length} destination cities to ${section.name}`);
        }

        // Add major waypoints
        if (majorWaypoints.length > 0) {
          const prioritizedWaypoints = this.prioritizeStops(majorWaypoints);
          diverseStops.push(...prioritizedWaypoints.slice(0, Math.max(1, Math.floor(majorWaypoints.length * 0.7))));
        }

        // Add limited other stops to avoid overcrowding
        if (otherStops.length > 0) {
          const prioritizedOtherStops = this.prioritizeStops(otherStops);
          const maxOtherStops = Math.max(1, Math.floor(otherStops.length / 4));
          diverseStops.push(...prioritizedOtherStops.slice(0, maxOtherStops));
        }
      }
    }

    console.log(`🌍 Enhanced geographic diversity: ${diverseStops.length} stops with destination city priority`);
    return StopDeduplicationService.deduplicateStops(diverseStops);
  }

  /**
   * Sort stops by their progression along the route to prevent zigzagging
   */
  private static sortStopsByRouteProgression(
    startStop: TripStop,
    endStop: TripStop,
    stops: TripStop[],
    totalDistance: number
  ): TripStop[] {
    return stops.sort((a, b) => {
      const progressA = this.calculateRouteProgress(startStop, endStop, a, totalDistance);
      const progressB = this.calculateRouteProgress(startStop, endStop, b, totalDistance);
      return progressA - progressB;
    });
  }

  /**
   * Calculate how far along the route (0-100%) a stop is positioned
   */
  static calculateRouteProgress(
    startStop: TripStop,
    endStop: TripStop,
    stop: TripStop,
    totalDistance: number
  ): number {
    const distanceFromStart = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      stop.latitude, stop.longitude
    );
    
    return Math.min(100, (distanceFromStart / totalDistance) * 100);
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
    
    for (const section of ROUTE_SECTIONS) {
      sections[section.name] = [];
    }

    for (const stop of stops) {
      const progressPercent = this.calculateRouteProgress(startStop, endStop, stop, totalDistance);
      
      for (const section of ROUTE_SECTIONS) {
        if (progressPercent >= section.startPercent && progressPercent < section.endPercent) {
          sections[section.name].push(stop);
          break;
        }
      }
    }

    return sections;
  }

  /**
   * Enhanced prioritization with destination city emphasis
   */
  private static prioritizeStops(stops: TripStop[]): TripStop[] {
    return stops.sort((a, b) => {
      const getPriority = (stop: TripStop): number => {
        // Destination cities get absolute highest priority
        if (stop.category === 'destination_city' && stop.is_major_stop) return 1;
        if (stop.category === 'destination_city') return 2;
        
        // Major waypoints get high priority
        if (stop.category === 'route66_waypoint' && stop.is_major_stop) return 3;
        if (stop.category === 'route66_waypoint') return 4;
        
        // Other categories get lower priority
        if (stop.category === 'attraction') return 5;
        if (stop.category === 'hidden_gem') return 6;
        return 7;
      };

      return getPriority(a) - getPriority(b);
    });
  }
}
