
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
    console.log(`🎯 [FIXED] StopRecommendationService starting for ${segment.startCity} → ${segment.endCity}`);
    console.log(`📊 [FIXED] Input data:`, {
      totalStops: allStops.length,
      maxStops,
      segmentInfo: {
        day: segment.day,
        startCity: segment.startCity,
        endCity: segment.endCity
      },
      categoryCounts: allStops.reduce((acc, stop) => {
        acc[stop.category] = (acc[stop.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      sampleStops: allStops.slice(0, 5).map(s => ({ 
        id: s.id, 
        name: s.name, 
        category: s.category, 
        city: s.city_name 
      }))
    });

    // CRITICAL FIX: Validate input data
    if (!allStops || allStops.length === 0) {
      console.error('❌ [FIXED] No stops data provided to recommendation service');
      return [];
    }

    if (!segment?.endCity) {
      console.error('❌ [FIXED] Invalid segment data - missing endCity');
      return [];
    }

    // Filter stops that are geographically relevant to this segment
    const geographicallyRelevantStops = StopGeographyFilter.filterStopsByRouteGeography(segment, allStops);
    console.log(`📍 [FIXED] Geographic filter results: ${geographicallyRelevantStops.length} stops`, 
      geographicallyRelevantStops.map(s => ({ 
        name: s.name, 
        category: s.category, 
        city: s.city_name, 
        state: s.state 
      }))
    );
    
    // CRITICAL FIX: Early return if no relevant stops found
    if (geographicallyRelevantStops.length === 0) {
      console.warn(`⚠️ [FIXED] No geographically relevant stops found for ${segment.endCity}`);
      return [];
    }
    
    // Score and rank stops by relevance
    const scoredStops = StopScoringService.scoreStopRelevance(segment, geographicallyRelevantStops);
    console.log(`⭐ [FIXED] Scored stops: ${scoredStops.length}`, 
      scoredStops.slice(0, 5).map(s => ({ 
        name: s.name, 
        category: s.category, 
        city: s.city_name, 
        score: s.relevanceScore 
      }))
    );
    
    // CRITICAL FIX: Early return if no scored stops
    if (scoredStops.length === 0) {
      console.warn(`⚠️ [FIXED] No scored stops found for ${segment.endCity}`);
      return [];
    }
    
    // Select diverse and high-quality stops
    const selectedStops = StopScoringService.selectDiverseStops(scoredStops, maxStops);
    
    console.log(`✅ [FIXED] Final selected ${selectedStops.length} recommended stops:`, 
      selectedStops.map(s => ({ 
        name: s.name, 
        city: s.city, 
        category: s.category, 
        score: s.relevanceScore,
        type: s.type
      }))
    );
    
    // CRITICAL FIX: Enhanced validation of final results
    const validStops = selectedStops.filter(stop => {
      const isValid = stop && stop.name && stop.name !== segment.endCity && !stop.name.toLowerCase().includes('destination');
      if (!isValid) {
        console.warn(`⚠️ [FIXED] Filtering out invalid stop: ${stop?.name}`);
      }
      return isValid;
    });

    console.log(`🔍 [FIXED] After validation: ${validStops.length} valid stops remain`);
    
    return validStops;
  }

  /**
   * Format stop for display
   */
  static formatStopForDisplay = StopDisplayFormatter.formatStopForDisplay;
}
