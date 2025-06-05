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
   * Enhanced deduplication with major destination city protection
   */
  static deduplicateStops(stops: TripStop[]): TripStop[] {
    const deduplicated: TripStop[] = [];
    const PROXIMITY_THRESHOLD_MILES = 8; // Slightly reduced for better precision

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
          // Enhanced logic: prioritize major destination cities
          const currentIsMajorCity = stop.category === 'destination_city';
          const existingIsMajorCity = existing.category === 'destination_city';
          
          if (currentIsMajorCity && !existingIsMajorCity) {
            // Replace existing with current major city
            const existingIndex = deduplicated.indexOf(existing);
            deduplicated[existingIndex] = stop;
            console.log(`🏙️ Upgraded to major city: ${stop.name} replacing ${existing.name}`);
            shouldSkip = true;
            break;
          } else if (!currentIsMajorCity && existingIsMajorCity) {
            // Protect existing major city
            console.log(`🏙️ Protecting major city: ${existing.name} over ${stop.name}`);
            shouldSkip = true;
            break;
          } else if (currentIsMajorCity && existingIsMajorCity) {
            // Both are major cities - keep the one with higher overall priority
            const currentPriority = this.getMajorCityPriority(stop);
            const existingPriority = this.getMajorCityPriority(existing);
            
            if (currentPriority > existingPriority) {
              const existingIndex = deduplicated.indexOf(existing);
              deduplicated[existingIndex] = stop;
              console.log(`🏙️ Higher priority major city: ${stop.name} over ${existing.name}`);
              shouldSkip = true;
              break;
            } else {
              shouldSkip = true;
              break;
            }
          } else {
            // Regular deduplication for non-major cities
            shouldSkip = true;
            break;
          }
        } else if (locationClose) {
          // Similar logic for location-based proximity without image/name match
          const currentIsMajorCity = stop.category === 'destination_city';
          const existingIsMajorCity = existing.category === 'destination_city';
          
          if (currentIsMajorCity && !existingIsMajorCity) {
            const existingIndex = deduplicated.indexOf(existing);
            deduplicated[existingIndex] = stop;
            console.log(`🏙️ Location upgrade to major city: ${stop.name}`);
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

    console.log(`🔧 Enhanced deduplication: ${stops.length} → ${deduplicated.length} stops (major cities protected)`);
    return deduplicated;
  }

  /**
   * Get priority score for major cities to help with conflict resolution
   */
  private static getMajorCityPriority(stop: TripStop): number {
    let priority = 0;
    
    if (stop.category === 'destination_city') priority += 10;
    if (stop.is_major_stop) priority += 5;
    if (stop.category === 'route66_waypoint') priority += 3;
    
    // Bonus for well-known Route 66 cities
    const cityName = stop.name.toLowerCase();
    if (cityName.includes('joplin') || cityName.includes('springfield') || 
        cityName.includes('tulsa') || cityName.includes('oklahoma city') ||
        cityName.includes('amarillo') || cityName.includes('flagstaff')) {
      priority += 8;
    }
    
    return priority;
  }

  /**
   * Enhanced geographic diversity with major city preference
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

    // Ensure each section has at least one stop, prioritizing major cities
    const diverseStops: TripStop[] = [];
    
    for (const section of this.ROUTE_SECTIONS) {
      const sectionStops = stopsBySection[section.name] || [];
      if (sectionStops.length > 0) {
        // Separate major cities from other stops
        const majorCities = sectionStops.filter(stop => 
          stop.category === 'destination_city' || 
          (stop.category === 'route66_waypoint' && stop.is_major_stop)
        );
        
        const otherStops = sectionStops.filter(stop => 
          stop.category !== 'destination_city' && 
          !(stop.category === 'route66_waypoint' && stop.is_major_stop)
        );

        // Always include at least one major city per section if available
        if (majorCities.length > 0) {
          const prioritizedMajorCities = this.prioritizeStops(majorCities);
          diverseStops.push(...prioritizedMajorCities.slice(0, Math.max(1, Math.floor(majorCities.length * 0.8))));
        }

        // Add some other stops but fewer than before
        if (otherStops.length > 0) {
          const prioritizedOtherStops = this.prioritizeStops(otherStops);
          const maxOtherStops = Math.max(0, Math.floor(otherStops.length / 3));
          diverseStops.push(...prioritizedOtherStops.slice(0, maxOtherStops));
        }
      }
    }

    console.log(`🌍 Enhanced geographic diversity: ${diverseStops.length} stops with major city preference`);
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
   * Enhanced prioritization with major city emphasis
   */
  private static prioritizeStops(stops: TripStop[]): TripStop[] {
    return stops.sort((a, b) => {
      const getPriority = (stop: TripStop): number => {
        // Major destination cities get highest priority
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
   * Smart trip day calculation based on total distance
   */
  static calculateOptimalTripDays(totalDistanceMiles: number, requestedDays: number): number {
    const MILES_PER_DAY_COMFORTABLE = 350;
    const MILES_PER_DAY_MAXIMUM = 600;
    
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
