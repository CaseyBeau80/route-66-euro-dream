
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
    console.log(`🎯 [DEBUG] Starting getRecommendedStopsForSegment for ${segment.startCity} → ${segment.endCity}`);
    console.log(`📊 [DEBUG] Input data:`, {
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

    // Filter stops that are geographically relevant to this segment
    const geographicallyRelevantStops = StopGeographyFilter.filterStopsByRouteGeography(segment, allStops);
    console.log(`📍 [DEBUG] Geographically relevant stops: ${geographicallyRelevantStops.length}`);
    console.log(`📍 [DEBUG] Geographic filter results:`, 
      geographicallyRelevantStops.map(s => ({ 
        name: s.name, 
        category: s.category, 
        city: s.city_name, 
        state: s.state 
      }))
    );
    
    // Score and rank stops by relevance
    const scoredStops = StopScoringService.scoreStopRelevance(segment, geographicallyRelevantStops);
    console.log(`⭐ [DEBUG] Scored stops: ${scoredStops.length}`);
    console.log(`⭐ [DEBUG] Top scored stops:`, 
      scoredStops.slice(0, 10).map(s => ({ 
        name: s.name, 
        category: s.category, 
        city: s.city_name, 
        score: s.relevanceScore 
      }))
    );
    
    // Select diverse and high-quality stops
    const selectedStops = StopScoringService.selectDiverseStops(scoredStops, maxStops);
    
    console.log(`✅ [DEBUG] Final selected ${selectedStops.length} recommended stops:`, 
      selectedStops.map(s => ({ 
        name: s.name, 
        city: s.city, 
        category: s.category, 
        score: s.relevanceScore,
        type: s.type
      }))
    );
    
    if (selectedStops.length === 0) {
      console.error(`❌ [DEBUG] NO STOPS SELECTED! Debug info:`, {
        originalStopsCount: allStops.length,
        afterGeographicFilter: geographicallyRelevantStops.length,
        afterScoring: scoredStops.length,
        segmentEndCity: segment.endCity,
        availableCategories: allStops.map(s => s.category).filter((v, i, a) => a.indexOf(v) === i)
      });
    }
    
    return selectedStops;
  }

  /**
   * Format stop for display
   */
  static formatStopForDisplay = StopDisplayFormatter.formatStopForDisplay;
}
