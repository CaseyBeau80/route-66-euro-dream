
import { useState, useEffect, useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { TripStop } from '../types/TripStop';
import { RecommendedStop, StopRecommendationService } from '../services/recommendations/StopRecommendationService';
import { SupabaseDataService } from '../services/data/SupabaseDataService';

export const useRecommendedStops = (segment: DailySegment, maxStops: number = 3) => {
  const [allStops, setAllStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🔥 [FIXED-HOOK] useRecommendedStops initialized:', {
    segmentDay: segment?.day,
    endCity: segment?.endCity,
    maxStops
  });

  // Fetch all stops data once on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchStops = async () => {
      try {
        console.log('🔥 [FIXED-HOOK] Starting data fetch...');
        setIsLoading(true);
        setError(null);
        
        const stops = await SupabaseDataService.fetchAllStops();
        
        if (!isMounted) {
          console.log('🔥 [FIXED-HOOK] Component unmounted, ignoring result');
          return;
        }
        
        console.log('🔥 [FIXED-HOOK] Data fetch result:', {
          totalStops: stops.length,
          categoriesFound: [...new Set(stops.map(s => s.category))],
          featuredCount: stops.filter(s => s.featured).length
        });
        
        setAllStops(stops);
      } catch (err) {
        if (!isMounted) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stops';
        console.error('🔥 [FIXED-HOOK] Fetch error:', err);
        setError(errorMessage);
        setAllStops([]);
      } finally {
        if (isMounted) {
          console.log('🔥 [FIXED-HOOK] Setting loading to false');
          setIsLoading(false);
        }
      }
    };

    fetchStops();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - fetch once

  // Calculate recommended stops
  const recommendedStops = useMemo((): RecommendedStop[] => {
    console.log('🔥 [FIXED-HOOK] Computing recommendations:', {
      hasSegment: !!segment,
      segmentEndCity: segment?.endCity,
      allStopsCount: allStops.length,
      isLoading,
      hasError: !!error
    });

    // Wait for data and validate
    if (isLoading || error || !segment?.endCity || allStops.length === 0) {
      console.log('🔥 [FIXED-HOOK] Skipping calculation - not ready');
      return [];
    }

    console.log('🔥 [FIXED-HOOK] All conditions met, calling recommendation service...');
    
    try {
      const recommendations = StopRecommendationService.getRecommendedStopsForSegment(
        segment,
        allStops,
        maxStops
      );

      console.log('🔥 [FIXED-HOOK] Recommendations generated:', {
        count: recommendations.length,
        stops: recommendations.map(r => ({ 
          name: r.name, 
          city: r.city, 
          category: r.category,
          score: r.relevanceScore 
        }))
      });

      return recommendations;
    } catch (serviceError) {
      console.error('🔥 [FIXED-HOOK] Recommendation service error:', serviceError);
      return [];
    }
  }, [segment?.endCity, segment?.day, allStops, maxStops, isLoading, error]);

  const result = {
    recommendedStops,
    isLoading,
    error,
    hasStops: recommendedStops.length > 0
  };

  console.log('🔥 [FIXED-HOOK] Final result:', {
    hasStops: result.hasStops,
    stopsCount: result.recommendedStops.length,
    isLoading: result.isLoading,
    error: result.error
  });

  return result;
};
