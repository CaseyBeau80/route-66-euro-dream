
import { useState, useEffect, useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { TripStop } from '../types/TripStop';
import { RecommendedStop, StopRecommendationService } from '../services/recommendations/StopRecommendationService';
import { SupabaseDataService } from '../services/data/SupabaseDataService';

export const useRecommendedStops = (segment: DailySegment, maxStops: number = 3) => {
  const [allStops, setAllStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🚨 [CRITICAL-DEBUG] useRecommendedStops called:', {
    segmentDay: segment?.day,
    endCity: segment?.endCity,
    maxStops,
    timestamp: new Date().toISOString()
  });

  // Fetch all stops data on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchStops = async () => {
      try {
        console.log('🔍 [CRITICAL-DEBUG] Starting stops fetch...');
        setIsLoading(true);
        setError(null);
        
        const stops = await SupabaseDataService.fetchAllStops();
        
        if (!isMounted) {
          console.log('🚫 [CRITICAL-DEBUG] Component unmounted, ignoring result');
          return;
        }
        
        console.log('✅ [CRITICAL-DEBUG] Stops fetch completed:', {
          totalStops: stops.length,
          stopsWithDescriptions: stops.filter(s => s.description && s.description.length > 20).length,
          stopsWithImages: stops.filter(s => s.image_url || s.thumbnail_url).length,
          featuredStops: stops.filter(s => s.featured).length,
          sampleStops: stops.slice(0, 3).map(s => ({ 
            id: s.id, 
            name: s.name, 
            category: s.category, 
            city: s.city_name || s.city,
            state: s.state,
            featured: s.featured,
            hasDescription: !!s.description,
            hasImage: !!(s.image_url || s.thumbnail_url)
          }))
        });
        
        if (stops.length === 0) {
          throw new Error('No stops data available from database');
        }

        setAllStops(stops);
      } catch (err) {
        if (!isMounted) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stops';
        console.error('❌ [CRITICAL-DEBUG] Stops fetch failed:', err);
        setError(errorMessage);
        setAllStops([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStops();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array

  // Calculate recommended stops with enhanced debugging
  const recommendedStops = useMemo((): RecommendedStop[] => {
    console.log('🚨 [CRITICAL-DEBUG] Computing recommendations with detailed analysis:', {
      hasSegment: !!segment,
      segmentDay: segment?.day,
      endCity: segment?.endCity,
      allStopsCount: allStops.length,
      isLoading,
      error: !!error,
      CRITICAL_PATHS: {
        willReturnEarly_loading: isLoading,
        willReturnEarly_error: !!error,
        willReturnEarly_noSegment: !segment || !segment.endCity,
        willReturnEarly_noStops: !allStops || allStops.length === 0,
        willCallRecommendationService: !isLoading && !error && segment && segment.endCity && allStops && allStops.length > 0
      }
    });

    // Wait for data to load
    if (isLoading) {
      console.log('⏳ [CRITICAL-DEBUG] Still loading data, returning empty array');
      return [];
    }

    // Check for errors
    if (error) {
      console.log('❌ [CRITICAL-DEBUG] Error state, returning empty array:', error);
      return [];
    }

    // Validate segment
    if (!segment || !segment.endCity) {
      console.log('⚠️ [CRITICAL-DEBUG] Invalid segment data, returning empty array');
      return [];
    }

    // Validate stops data
    if (!allStops || allStops.length === 0) {
      console.log('⚠️ [CRITICAL-DEBUG] No stops data available, returning empty array');
      return [];
    }

    try {
      console.log('🚀 [CRITICAL-DEBUG] CALLING StopRecommendationService with valid data:', {
        segmentEndCity: segment.endCity,
        allStopsCount: allStops.length,
        maxStops,
        firstFewStops: allStops.slice(0, 5).map(s => ({ 
          name: s.name, 
          category: s.category, 
          city: s.city_name || s.city,
          state: s.state 
        }))
      });
      
      const recommendations = StopRecommendationService.getRecommendedStopsForSegment(
        segment,
        allStops,
        maxStops
      );

      console.log('✅ [CRITICAL-DEBUG] StopRecommendationService returned:', {
        recommendationsCount: recommendations.length,
        segmentDay: segment.day,
        endCity: segment.endCity,
        SUCCESS: recommendations.length > 0,
        recommendationDetails: recommendations.map(r => ({ 
          id: r.id,
          name: r.name, 
          city: r.city, 
          state: r.state,
          category: r.category,
          type: r.type,
          score: r.relevanceScore,
          featured: r.originalStop.featured,
          hasDescription: !!r.originalStop.description,
          hasImage: !!(r.originalStop.image_url || r.originalStop.thumbnail_url),
          originalStopName: r.originalStop.name,
          originalStopCategory: r.originalStop.category
        }))
      });

      return recommendations;
    } catch (err) {
      console.error('❌ [CRITICAL-DEBUG] CRITICAL ERROR in StopRecommendationService:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations');
      return [];
    }
  }, [segment?.day, segment?.endCity, allStops, maxStops, isLoading, error]);

  const result = {
    recommendedStops,
    isLoading,
    error,
    hasStops: recommendedStops.length > 0
  };

  console.log('📊 [CRITICAL-DEBUG] FINAL HOOK RESULT:', {
    segmentDay: segment?.day,
    endCity: segment?.endCity,
    hasStops: result.hasStops,
    stopsCount: result.recommendedStops.length,
    isLoading: result.isLoading,
    error: result.error,
    CRITICAL_SUCCESS_INDICATORS: {
      dataLoaded: !result.isLoading,
      noErrors: !result.error,
      hasRecommendations: result.hasStops,
      recommendationsCount: result.recommendedStops.length
    },
    stopDetails: result.recommendedStops.map(s => ({ 
      id: s.id, 
      name: s.name, 
      category: s.category, 
      city: s.city,
      state: s.state,
      score: s.relevanceScore,
      featured: s.originalStop.featured,
      hasRichData: !!(s.originalStop.description || s.originalStop.image_url)
    }))
  });

  return result;
};
