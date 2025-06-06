
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DatabaseAuditService } from '../data/DatabaseAuditService';

export class EnhancedStopSelectionService {
  /**
   * Select stops with lowered quality thresholds and enhanced geographic filtering
   */
  static async selectStopsForSegment(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    maxStops: number = 5
  ): Promise<TripStop[]> {
    console.log(`🎯 ENHANCED SELECTION: ${startStop.city_name} → ${endStop.city_name}`);
    
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
    
    // STEP 1: Generous geographic filtering
    const candidateStops = this.getGeographicCandidates(
      startStop, endStop, allStops, segmentDistance
    );
    
    console.log(`📍 Geographic candidates: ${candidateStops.length}`);
    
    // STEP 2: Category prioritization with inclusive filtering
    const categorizedStops = this.categorizeStops(candidateStops);
    
    // STEP 3: Score and select with lowered thresholds
    const selectedStops = this.scoreAndSelectStops(
      categorizedStops, startStop, maxStops
    );
    
    console.log(`✅ ENHANCED SELECTION RESULT: ${selectedStops.length} stops selected`);
    return selectedStops;
  }
  
  private static getGeographicCandidates(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    segmentDistance: number
  ): TripStop[] {
    return allStops.filter(stop => {
      if (stop.id === startStop.id || stop.id === endStop.id) return false;
      
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );
      
      const distanceFromEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        endStop.latitude, endStop.longitude
      );
      
      // MUCH more generous geographic filtering
      const totalViaStop = distanceFromStart + distanceFromEnd;
      const detourFactor = totalViaStop / segmentDistance;
      
      // Allow up to 100% detour or 200 miles, whichever is larger
      const maxDetour = Math.max(segmentDistance * 1.0, 200);
      const isWithinDetour = (totalViaStop - segmentDistance) <= maxDetour;
      
      // Also allow stops that are simply close to either endpoint
      const isCloseToRoute = distanceFromStart <= segmentDistance * 0.8 || distanceFromEnd <= segmentDistance * 0.8;
      
      return isWithinDetour || isCloseToRoute;
    });
  }
  
  private static categorizeStops(stops: TripStop[]): {
    priority1: TripStop[];
    priority2: TripStop[];
    priority3: TripStop[];
  } {
    const priority1 = stops.filter(stop => 
      ['destination_city', 'attraction', 'hidden_gem'].includes(stop.category)
    );
    
    const priority2 = stops.filter(stop => 
      ['diner', 'restaurant', 'motel', 'hotel', 'museum'].includes(stop.category)
    );
    
    const priority3 = stops.filter(stop => 
      !priority1.includes(stop) && !priority2.includes(stop)
    );
    
    console.log(`📊 Categorized stops:`, {
      priority1: priority1.length,
      priority2: priority2.length, 
      priority3: priority3.length
    });
    
    return { priority1, priority2, priority3 };
  }
  
  private static scoreAndSelectStops(
    categorized: { priority1: TripStop[]; priority2: TripStop[]; priority3: TripStop[] },
    startStop: TripStop,
    maxStops: number
  ): TripStop[] {
    const selectedStops: TripStop[] = [];
    
    // Take from priority 1 first
    const scored1 = this.scoreStops(categorized.priority1, startStop);
    selectedStops.push(...scored1.slice(0, Math.min(maxStops, scored1.length)));
    
    // Fill remaining slots with priority 2
    if (selectedStops.length < maxStops) {
      const remaining = maxStops - selectedStops.length;
      const scored2 = this.scoreStops(categorized.priority2, startStop);
      selectedStops.push(...scored2.slice(0, Math.min(remaining, scored2.length)));
    }
    
    // Fill remaining slots with priority 3 if needed
    if (selectedStops.length < maxStops) {
      const remaining = maxStops - selectedStops.length;
      const scored3 = this.scoreStops(categorized.priority3, startStop);
      selectedStops.push(...scored3.slice(0, Math.min(remaining, scored3.length)));
    }
    
    return selectedStops;
  }
  
  private static scoreStops(stops: TripStop[], startStop: TripStop): TripStop[] {
    return stops
      .map(stop => ({
        stop,
        score: this.calculateScore(stop, startStop)
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.stop);
  }
  
  private static calculateScore(stop: TripStop, startStop: TripStop): number {
    let score = 0;
    
    // Category bonuses
    switch (stop.category) {
      case 'destination_city': score += 15; break;
      case 'attraction': score += 12; break;
      case 'hidden_gem': score += 10; break;
      case 'museum': score += 8; break;
      case 'diner': score += 6; break;
      default: score += 3; break;
    }
    
    // Major stop bonus
    if (stop.is_major_stop) score += 5;
    
    // Distance factor (prefer stops not too close to start)
    const distance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      stop.latitude, stop.longitude
    );
    
    if (distance > 20) score += 3; // Bonus for not being too close
    if (distance > 50) score += 2; // Additional bonus for reasonable distance
    
    return score;
  }
}
