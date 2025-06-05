
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
   * Enhanced deduplication with strict major destination city protection
   */
  static deduplicateStops(stops: TripStop[]): TripStop[] {
    const deduplicated: TripStop[] = [];
    const PROXIMITY_THRESHOLD_MILES = 5; // Reduced for more precision

    for (const stop of stops) {
      let shouldSkip = false;

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
          // ALWAYS prioritize destination cities over any other category
          const currentIsMajorCity = stop.category === 'destination_city';
          const existingIsMajorCity = existing.category === 'destination_city';
          
          if (currentIsMajorCity && !existingIsMajorCity) {
            // Replace existing with current major city
            const existingIndex = deduplicated.indexOf(existing);
            deduplicated[existingIndex] = stop;
            console.log(`🏙️ Upgraded to destination city: ${stop.name} replacing ${existing.name}`);
            shouldSkip = true;
            break;
          } else if (!currentIsMajorCity && existingIsMajorCity) {
            // Protect existing major city
            console.log(`🏙️ Protecting destination city: ${existing.name} over ${stop.name}`);
            shouldSkip = true;
            break;
          } else if (currentIsMajorCity && existingIsMajorCity) {
            // Both are major cities - keep the one with higher overall priority
            const currentPriority = this.getMajorCityPriority(stop);
            const existingPriority = this.getMajorCityPriority(existing);
            
            if (currentPriority > existingPriority) {
              const existingIndex = deduplicated.indexOf(existing);
              deduplicated[existingIndex] = stop;
              console.log(`🏙️ Higher priority destination city: ${stop.name} over ${existing.name}`);
              shouldSkip = true;
              break;
            } else {
              shouldSkip = true;
              break;
            }
          } else {
            // Regular deduplication for non-destination cities
            shouldSkip = true;
            break;
          }
        } else if (locationClose) {
          // Location-based proximity without name/image match
          const currentIsMajorCity = stop.category === 'destination_city';
          const existingIsMajorCity = existing.category === 'destination_city';
          
          if (currentIsMajorCity && !existingIsMajorCity) {
            const existingIndex = deduplicated.indexOf(existing);
            deduplicated[existingIndex] = stop;
            console.log(`🏙️ Location upgrade to destination city: ${stop.name}`);
            shouldSkip = true;
            break;
          } else if (!currentIsMajorCity && existingIsMajorCity) {
            shouldSkip = true;
            break;
          }
        }
      }

      if (!shouldSkip) {
        deduplicated.push(stop);
      }
    }

    console.log(`🔧 Enhanced deduplication: ${stops.length} → ${deduplicated.length} stops (destination cities protected)`);
    return deduplicated;
  }

  /**
   * Get priority score for major cities to help with conflict resolution
   */
  private static getMajorCityPriority(stop: TripStop): number {
    let priority = 0;
    
    // Destination cities get massive priority boost
    if (stop.category === 'destination_city') priority += 20;
    if (stop.is_major_stop) priority += 10;
    if (stop.category === 'route66_waypoint') priority += 5;
    
    // Bonus for well-known Route 66 destination cities
    const cityName = stop.name.toLowerCase();
    if (cityName.includes('chicago') || cityName.includes('st. louis') || 
        cityName.includes('springfield') || cityName.includes('tulsa') || 
        cityName.includes('oklahoma city') || cityName.includes('amarillo') ||
        cityName.includes('albuquerque') || cityName.includes('flagstaff') ||
        cityName.includes('santa monica')) {
      priority += 15;
    }
    
    return priority;
  }

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
    
    for (const section of this.ROUTE_SECTIONS) {
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
    return this.deduplicateStops(diverseStops);
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
  private static calculateRouteProgress(
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
    
    for (const section of this.ROUTE_SECTIONS) {
      sections[section.name] = [];
    }

    for (const stop of stops) {
      const progressPercent = this.calculateRouteProgress(startStop, endStop, stop, totalDistance);
      
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

  /**
   * Smart trip day calculation based on total distance with conservative limits
   */
  static calculateOptimalTripDays(totalDistanceMiles: number, requestedDays: number): number {
    const MILES_PER_DAY_COMFORTABLE = 300; // Reduced for better experience
    const MILES_PER_DAY_MAXIMUM = 500; // Reduced maximum
    
    const milesPerDay = totalDistanceMiles / requestedDays;
    
    if (milesPerDay > MILES_PER_DAY_MAXIMUM) {
      const suggestedDays = Math.ceil(totalDistanceMiles / MILES_PER_DAY_COMFORTABLE);
      console.log(`🚗 Adjusting trip from ${requestedDays} to ${suggestedDays} days for comfortable daily distances`);
      return suggestedDays;
    }
    
    return requestedDays;
  }

  /**
   * Validate segment to ensure it's meaningful
   */
  static isValidSegment(fromStop: TripStop, toStop: TripStop, minDistanceMiles: number = 5): boolean {
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
