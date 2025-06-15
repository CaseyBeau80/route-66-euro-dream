import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class StopDeduplicationService {
  private static readonly PROXIMITY_THRESHOLD_MILES = 5;

  /**
   * Enhanced deduplication with strict major destination city protection
   */
  static deduplicateStops(stops: TripStop[]): TripStop[] {
    const deduplicated: TripStop[] = [];

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
        const locationClose = distance < this.PROXIMITY_THRESHOLD_MILES;
        
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
}
