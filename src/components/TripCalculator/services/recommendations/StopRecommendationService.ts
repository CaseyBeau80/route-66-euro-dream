
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';
import { RecommendedStop } from './RecommendedStopTypes';
import { StopGeographyFilter } from './StopGeographyFilter';
import { StopScoringService } from './StopScoringService';
import { StopDisplayFormatter } from './StopDisplayFormatter';

export type { RecommendedStop } from './RecommendedStopTypes';

export class StopRecommendationService {
  private static readonly DEFAULT_MAX_STOPS = 3;

  /**
   * Get recommended stops for a daily segment
   */
  static getRecommendedStopsForSegment(
    segment: DailySegment,
    allStops: TripStop[],
    maxStops: number = this.DEFAULT_MAX_STOPS
  ): RecommendedStop[] {
    console.log(`🚨 [CRITICAL-DEBUG] StopRecommendationService starting for ${segment.startCity} → ${segment.endCity}`);
    console.log(`📊 [CRITICAL-DEBUG] Input validation:`, {
      hasSegment: !!segment,
      hasEndCity: !!segment?.endCity,
      totalStops: allStops?.length || 0,
      maxStops,
      segmentInfo: {
        day: segment?.day,
        startCity: segment?.startCity,
        endCity: segment?.endCity
      },
      sampleStops: allStops?.slice(0, 3).map(s => ({ 
        id: s.id, 
        name: s.name, 
        category: s.category, 
        city: s.city_name,
        state: s.state
      })) || []
    });

    // CRITICAL: Basic validation
    if (!segment) {
      console.error('❌ [CRITICAL-DEBUG] No segment provided');
      return [];
    }

    if (!segment.endCity) {
      console.error('❌ [CRITICAL-DEBUG] Segment missing endCity');
      return [];
    }

    if (!allStops || allStops.length === 0) {
      console.error('❌ [CRITICAL-DEBUG] No stops data provided');
      return [];
    }

    // Log ALL available stops by category
    const stopsByCategory = allStops.reduce((acc, stop) => {
      const category = stop.category || 'unknown';
      if (!acc[category]) acc[category] = [];
      acc[category].push(stop.name);
      return acc;
    }, {} as Record<string, string[]>);
    
    console.log(`📊 [CRITICAL-DEBUG] ALL Available stops by category:`, stopsByCategory);

    try {
      // Filter stops geographically
      console.log(`🌍 [CRITICAL-DEBUG] Starting geographic filtering...`);
      const geographicallyRelevantStops = StopGeographyFilter.filterStopsByRouteGeography(segment, allStops);
      console.log(`📍 [CRITICAL-DEBUG] Geographic filtering result: ${geographicallyRelevantStops.length} stops`, 
        geographicallyRelevantStops.map(s => ({ name: s.name, category: s.category, city: s.city_name }))
      );
      
      if (geographicallyRelevantStops.length === 0) {
        console.warn(`⚠️ [CRITICAL-DEBUG] No geographically relevant stops found for ${segment.endCity}`);
        
        // FALLBACK: Try to find ANY stops in the same state as destination
        const fallbackStops = this.findFallbackStops(segment, allStops);
        console.log(`🔄 [CRITICAL-DEBUG] Fallback search found ${fallbackStops.length} stops`);
        
        if (fallbackStops.length === 0) {
          console.error(`❌ [CRITICAL-DEBUG] Even fallback search found no stops`);
          return [];
        }
        
        // Use fallback stops for scoring
        console.log(`⭐ [CRITICAL-DEBUG] Scoring fallback stops...`);
        const scoredFallbackStops = StopScoringService.scoreStopRelevance(segment, fallbackStops);
        const selectedFallbackStops = StopScoringService.selectDiverseStops(scoredFallbackStops, maxStops);
        
        console.log(`✅ [CRITICAL-DEBUG] Fallback recommendation complete: ${selectedFallbackStops.length} stops`);
        return selectedFallbackStops;
      }
      
      // Score and select stops normally
      console.log(`⭐ [CRITICAL-DEBUG] Scoring geographically relevant stops...`);
      const scoredStops = StopScoringService.scoreStopRelevance(segment, geographicallyRelevantStops);
      console.log(`⭐ [CRITICAL-DEBUG] Scoring complete: ${scoredStops.length} scored stops with scores:`, 
        scoredStops.map(s => ({ name: s.name, score: s.relevanceScore, category: s.category }))
      );
      
      if (scoredStops.length === 0) {
        console.warn(`⚠️ [CRITICAL-DEBUG] No scored stops found`);
        return [];
      }
      
      console.log(`🎯 [CRITICAL-DEBUG] Selecting diverse stops from ${scoredStops.length} scored stops...`);
      const selectedStops = StopScoringService.selectDiverseStops(scoredStops, maxStops);
      
      console.log(`✅ [CRITICAL-DEBUG] Final recommendation complete:`, {
        selectedCount: selectedStops.length,
        stops: selectedStops.map(s => ({ 
          name: s.name, 
          city: s.city, 
          category: s.category, 
          score: s.relevanceScore 
        }))
      });
      
      return selectedStops;
      
    } catch (error) {
      console.error(`❌ [CRITICAL-DEBUG] Error in recommendation service:`, error);
      return [];
    }
  }

  /**
   * Fallback method to find stops when geographic filtering fails
   */
  private static findFallbackStops(segment: DailySegment, allStops: TripStop[]): TripStop[] {
    console.log(`🔄 [CRITICAL-DEBUG] Running fallback stop search for ${segment.endCity}`);
    
    // Extract state from destination city
    const destinationState = this.extractStateFromCity(segment.endCity);
    console.log(`🔍 [CRITICAL-DEBUG] Destination state extracted: ${destinationState}`);
    
    if (!destinationState) {
      console.warn(`⚠️ [CRITICAL-DEBUG] Could not extract state from ${segment.endCity}`);
      // Ultimate fallback - return some attractions regardless of location
      const attractions = allStops.filter(stop => 
        stop.category === 'attraction' || stop.category === 'hidden_gem'
      ).slice(0, 10);
      console.log(`🆘 [CRITICAL-DEBUG] Ultimate fallback: returning ${attractions.length} attractions`);
      return attractions;
    }
    
    // Find stops in the same state
    const stateStops = allStops.filter(stop => {
      const stopState = stop.state?.toLowerCase();
      return stopState === destinationState.toLowerCase();
    });
    
    console.log(`🔍 [CRITICAL-DEBUG] Found ${stateStops.length} stops in state ${destinationState}:`, 
      stateStops.slice(0, 5).map(s => ({ name: s.name, category: s.category, city: s.city_name }))
    );
    
    return stateStops;
  }

  /**
   * Extract state from city string
   */
  private static extractStateFromCity(cityWithState: string): string | null {
    if (!cityWithState || !cityWithState.includes(',')) {
      return null;
    }
    
    const parts = cityWithState.split(',');
    if (parts.length < 2) {
      return null;
    }
    
    return parts[1].trim();
  }

  /**
   * Format stop for display
   */
  static formatStopForDisplay = StopDisplayFormatter.formatStopForDisplay;
}
