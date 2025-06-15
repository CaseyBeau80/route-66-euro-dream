
import { useState, useEffect, useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { TripStop } from '../types/TripStop';
import { RecommendedStop, StopRecommendationService } from '../services/recommendations/StopRecommendationService';
import { SupabaseDataService } from '../services/data/SupabaseDataService';

export const useRecommendedStops = (segment: DailySegment, maxStops: number = 3) => {
  const [allStops, setAllStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🔥 [FIXED-HOOK-V2] useRecommendedStops initialized:', {
    segmentDay: segment?.day,
    endCity: segment?.endCity,
    maxStops
  });

  // Fetch data once on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchStops = async () => {
      try {
        console.log('🔥 [FIXED-HOOK-V2] Starting data fetch...');
        setIsLoading(true);
        setError(null);
        
        const stops = await SupabaseDataService.fetchAllStops();
        
        if (!isMounted) {
          console.log('🔥 [FIXED-HOOK-V2] Component unmounted, ignoring result');
          return;
        }
        
        console.log('🔥 [FIXED-HOOK-V2] Data fetch SUCCESS:', {
          totalStops: stops.length,
          categoriesFound: [...new Set(stops.map(s => s.category))],
          featuredCount: stops.filter(s => s.featured).length
        });
        
        setAllStops(stops);
      } catch (err) {
        if (!isMounted) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stops';
        console.error('🔥 [FIXED-HOOK-V2] Fetch error:', err);
        setError(errorMessage);
        setAllStops([]);
      } finally {
        if (isMounted) {
          console.log('🔥 [FIXED-HOOK-V2] Setting loading to false');
          setIsLoading(false);
        }
      }
    };

    fetchStops();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - fetch once only

  // Calculate recommendations
  const recommendedStops = useMemo((): RecommendedStop[] => {
    console.log('🔥 [FIXED-HOOK-V2] Computing recommendations with:', {
      hasSegment: !!segment,
      segmentEndCity: segment?.endCity,
      allStopsCount: allStops.length,
      isLoading,
      hasError: !!error
    });

    // Don't calculate if still loading, has error, or missing data
    if (isLoading || error || !segment?.endCity || allStops.length === 0) {
      console.log('🔥 [FIXED-HOOK-V2] Skipping calculation - conditions not met');
      return [];
    }

    console.log('🔥 [FIXED-HOOK-V2] All conditions met, calling recommendation service...');
    
    try {
      const recommendations = StopRecommendationService.getRecommendedStopsForSegment(
        segment,
        allStops,
        maxStops
      );

      console.log('🔥 [FIXED-HOOK-V2] Recommendations generated successfully:', {
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
      console.error('🔥 [FIXED-HOOK-V2] Recommendation service error:', serviceError);
      return [];
    }
  }, [segment?.endCity, segment?.day, allStops, maxStops, isLoading, error]);

  const result = {
    recommendedStops,
    isLoading,
    error,
    hasStops: recommendedStops.length > 0
  };

  console.log('🔥 [FIXED-HOOK-V2] Final hook result:', {
    hasStops: result.hasStops,
    stopsCount: result.recommendedStops.length,
    isLoading: result.isLoading,
    error: result.error
  });

  return result;
};
