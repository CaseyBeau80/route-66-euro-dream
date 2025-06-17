import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DatabaseAuditService } from '../data/DatabaseAuditService';

export class EnhancedStopSelectionService {
  /**
   * Select only destination cities with enhanced geographic filtering
   */
  static async selectStopsForSegment(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    maxStops: number = 5
  ): Promise<TripStop[]> {
    console.log(`🎯 ENHANCED SELECTION (Destination Cities Only): ${startStop.city_name} → ${endStop.city_name}`);
    
    // First, audit the data to understand what's available
    await DatabaseAuditService.auditStopsBetweenLocations(
      startStop.city_name,
      endStop.city_name,
      startStop.latitude,
      startStop.longitude,
      endStop.latitude,
      endStop.longitude
    );
    
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    // STEP 1: Filter to only destination cities
    const destinationCities = allStops.filter(stop => {
      if (stop.id === startStop.id || stop.id === endStop.id) return false;
      
      // CRITICAL: Only destination cities allowed
      if (stop.category !== 'destination_city') {
        console.log(`🚫 Rejecting non-destination city: ${stop.name} (${stop.category})`);
        return false;
      }
      
      return true;
    });
    
    console.log(`🏛️ Found ${destinationCities.length} destination cities to consider`);
    
    // STEP 2: Geographic filtering with generous tolerance for destination cities
    const candidateStops = this.getGeographicCandidates(
      startStop, endStop, destinationCities, segmentDistance
    );
    
    console.log(`📍 Geographic candidates: ${candidateStops.length} destination cities`);
    
    // STEP 3: Score and select destination cities
    const selectedStops = this.scoreAndSelectDestinationCities(
      candidateStops, startStop, maxStops
    );
    
    console.log(`✅ ENHANCED SELECTION RESULT: ${selectedStops.length} destination cities selected`);
    console.log(`🏛️ Selected: ${selectedStops.map(s => s.name).join(', ')}`);
    
    return selectedStops;
  }
  
  private static getGeographicCandidates(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    segmentDistance: number
  ): TripStop[] {
    return destinationCities.filter(stop => {
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );
      
      const distanceFromEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        endStop.latitude, endStop.longitude
      );
      
      // Very generous geographic filtering for destination cities
      const totalViaStop = distanceFromStart + distanceFromEnd;
      const detourFactor = totalViaStop / segmentDistance;
      
      // Allow up to 150% detour or 300 miles, whichever is larger for destination cities
      const maxDetour = Math.max(segmentDistance * 1.5, 300);
      const isWithinDetour = (totalViaStop - segmentDistance) <= maxDetour;
      
      // Also allow destination cities that are simply close to either endpoint
      const isCloseToRoute = distanceFromStart <= segmentDistance * 0.9 || distanceFromEnd <= segmentDistance * 0.9;
      
      return isWithinDetour || isCloseToRoute;
    });
  }
  
  private static scoreAndSelectDestinationCities(
    destinationCities: TripStop[],
    startStop: TripStop,
    maxStops: number
  ): TripStop[] {
    const scoredCities = destinationCities
      .map(stop => ({
        stop,
        score: this.calculateDestinationCityScore(stop, startStop)
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.stop);
    
    return scoredCities.slice(0, Math.min(maxStops, scoredCities.length));
  }
  
  private static calculateDestinationCityScore(stop: TripStop, startStop: TripStop): number {
    let score = 20; // Base score for being a destination city
    
    // Major stop bonus
    if (stop.is_major_stop) score += 10;
    
    // Official destination bonus
    if (stop.is_official_destination) score += 8;
    
    // Distance factor (prefer cities not too close to start)
    const distance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      stop.latitude, stop.longitude
    );
    
    if (distance > 30) score += 5; // Bonus for not being too close
    if (distance > 100) score += 3; // Additional bonus for reasonable distance
    
    // State capital or major city bonuses
    const name = stop.name.toLowerCase();
    if (name.includes('capital') || name.includes('city')) score += 3;
    
    return score;
  }
}
