
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
   * Get recommended stops for a daily segment with enhanced processing
   */
  static getRecommendedStopsForSegment(
    segment: DailySegment,
    allStops: TripStop[],
    maxStops: number = this.DEFAULT_MAX_STOPS
  ): RecommendedStop[] {
    console.log(`🚨 [ENHANCED-SERVICE] Starting enhanced recommendation service for ${segment.startCity} → ${segment.endCity}`);
    console.log(`📊 [ENHANCED-SERVICE] Input validation:`, {
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
      console.error('❌ [ENHANCED-SERVICE] No segment provided');
      return [];
    }

    if (!segment.endCity) {
      console.error('❌ [ENHANCED-SERVICE] Segment missing endCity');
      return [];
    }

    if (!allStops || allStops.length === 0) {
      console.error('❌ [ENHANCED-SERVICE] No stops data provided');
      return [];
    }

    // Log data quality analysis
    this.analyzeDataQuality(allStops);

    try {
      // ENHANCED: Filter stops geographically with better fallbacks
      console.log(`🌍 [ENHANCED-SERVICE] Starting enhanced geographic filtering...`);
      const geographicallyRelevantStops = StopGeographyFilter.filterStopsByRouteGeography(segment, allStops);
      console.log(`📍 [ENHANCED-SERVICE] Enhanced geographic filtering result: ${geographicallyRelevantStops.length} stops`);
      
      if (geographicallyRelevantStops.length === 0) {
        console.warn(`⚠️ [ENHANCED-SERVICE] No geographically relevant stops found for ${segment.endCity}`);
        return [];
      }
      
      // ENHANCED: Score and select stops with improved algorithm
      console.log(`⭐ [ENHANCED-SERVICE] Starting enhanced scoring...`);
      const scoredStops = StopScoringService.scoreStopRelevance(segment, geographicallyRelevantStops);
      console.log(`⭐ [ENHANCED-SERVICE] Enhanced scoring complete: ${scoredStops.length} scored stops`);
      
      if (scoredStops.length === 0) {
        console.warn(`⚠️ [ENHANCED-SERVICE] No scored stops found`);
        return [];
      }
      
      console.log(`🎯 [ENHANCED-SERVICE] Selecting diverse stops with enhanced diversity algorithm...`);
      const selectedStops = StopScoringService.selectDiverseStops(scoredStops, maxStops);
      
      console.log(`✅ [ENHANCED-SERVICE] Enhanced recommendation complete:`, {
        selectedCount: selectedStops.length,
        averageScore: selectedStops.length > 0 ? (selectedStops.reduce((sum, s) => sum + s.relevanceScore, 0) / selectedStops.length).toFixed(1) : 0,
        categories: [...new Set(selectedStops.map(s => s.category))],
        stops: selectedStops.map(s => ({ 
          name: s.name, 
          city: s.city, 
          category: s.category, 
          score: s.relevanceScore,
          featured: s.originalStop.featured 
        }))
      });
      
      return selectedStops;
      
    } catch (error) {
      console.error(`❌ [ENHANCED-SERVICE] Error in enhanced recommendation service:`, error);
      return [];
    }
  }

  /**
   * Analyze data quality of available stops
   */
  private static analyzeDataQuality(allStops: TripStop[]): void {
    const analysis = {
      totalStops: allStops.length,
      withDescriptions: allStops.filter(s => s.description && s.description.length > 20).length,
      withImages: allStops.filter(s => s.image_url || s.thumbnail_url).length,
      featured: allStops.filter(s => s.featured).length,
      majorStops: allStops.filter(s => s.is_major_stop).length,
      officialDestinations: allStops.filter(s => s.is_official_destination).length,
      byCategory: allStops.reduce((acc, stop) => {
        const cat = stop.category || 'unknown';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    console.log(`📊 [ENHANCED-SERVICE] Data quality analysis:`, analysis);
  }

  /**
   * Format stop for display
   */
  static formatStopForDisplay = StopDisplayFormatter.formatStopForDisplay;
}
