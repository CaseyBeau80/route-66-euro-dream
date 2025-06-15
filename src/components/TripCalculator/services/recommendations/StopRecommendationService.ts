
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
    console.log(`🎯 [DEBUG] StopRecommendationService starting for ${segment.startCity} → ${segment.endCity}`);
    console.log(`📊 [DEBUG] Input validation:`, {
      hasSegment: !!segment,
      hasEndCity: !!segment?.endCity,
      totalStops: allStops?.length || 0,
      maxStops,
      segmentInfo: {
        day: segment?.day,
        startCity: segment?.startCity,
        endCity: segment?.endCity
      }
    });

    // CRITICAL: Basic validation
    if (!segment) {
      console.error('❌ [DEBUG] No segment provided');
      return [];
    }

    if (!segment.endCity) {
      console.error('❌ [DEBUG] Segment missing endCity');
      return [];
    }

    if (!allStops || allStops.length === 0) {
      console.error('❌ [DEBUG] No stops data provided');
      return [];
    }

    // Log sample of available stops
    console.log(`📊 [DEBUG] Available stops sample:`, {
      totalStops: allStops.length,
      categories: [...new Set(allStops.map(s => s.category))],
      sampleStops: allStops.slice(0, 5).map(s => ({ 
        id: s.id, 
        name: s.name, 
        category: s.category, 
        city: s.city_name,
        state: s.state
      }))
    });

    try {
      // Filter stops geographically
      const geographicallyRelevantStops = StopGeographyFilter.filterStopsByRouteGeography(segment, allStops);
      console.log(`📍 [DEBUG] Geographic filtering result: ${geographicallyRelevantStops.length} stops`);
      
      if (geographicallyRelevantStops.length === 0) {
        console.warn(`⚠️ [DEBUG] No geographically relevant stops found for ${segment.endCity}`);
        
        // FALLBACK: Try to find ANY stops in the same state as destination
        const fallbackStops = this.findFallbackStops(segment, allStops);
        console.log(`🔄 [DEBUG] Fallback search found ${fallbackStops.length} stops`);
        
        if (fallbackStops.length === 0) {
          return [];
        }
        
        // Use fallback stops for scoring
        const scoredFallbackStops = StopScoringService.scoreStopRelevance(segment, fallbackStops);
        const selectedFallbackStops = StopScoringService.selectDiverseStops(scoredFallbackStops, maxStops);
        
        console.log(`✅ [DEBUG] Fallback recommendation complete: ${selectedFallbackStops.length} stops`);
        return selectedFallbackStops;
      }
      
      // Score and select stops normally
      const scoredStops = StopScoringService.scoreStopRelevance(segment, geographicallyRelevantStops);
      console.log(`⭐ [DEBUG] Scoring complete: ${scoredStops.length} scored stops`);
      
      if (scoredStops.length === 0) {
        console.warn(`⚠️ [DEBUG] No scored stops found`);
        return [];
      }
      
      const selectedStops = StopScoringService.selectDiverseStops(scoredStops, maxStops);
      
      console.log(`✅ [DEBUG] Final recommendation complete:`, {
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
      console.error(`❌ [DEBUG] Error in recommendation service:`, error);
      return [];
    }
  }

  /**
   * Fallback method to find stops when geographic filtering fails
   */
  private static findFallbackStops(segment: DailySegment, allStops: TripStop[]): TripStop[] {
    console.log(`🔄 [DEBUG] Running fallback stop search for ${segment.endCity}`);
    
    // Extract state from destination city
    const destinationState = this.extractStateFromCity(segment.endCity);
    console.log(`🔍 [DEBUG] Destination state: ${destinationState}`);
    
    if (!destinationState) {
      console.warn(`⚠️ [DEBUG] Could not extract state from ${segment.endCity}`);
      // Ultimate fallback - return some attractions regardless of location
      return allStops.filter(stop => 
        stop.category === 'attraction' || stop.category === 'hidden_gem'
      ).slice(0, 10);
    }
    
    // Find stops in the same state
    const stateStops = allStops.filter(stop => {
      const stopState = stop.state?.toLowerCase();
      return stopState === destinationState.toLowerCase();
    });
    
    console.log(`🔍 [DEBUG] Found ${stateStops.length} stops in state ${destinationState}`);
    
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
