
import { useState, useEffect, useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { TripStop } from '../types/TripStop';
import { RecommendedStop, StopRecommendationService } from '../services/recommendations/StopRecommendationService';
import { SupabaseDataService } from '../services/data/SupabaseDataService';

export const useRecommendedStops = (segment: DailySegment, maxStops: number = 3) => {
  const [allStops, setAllStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🚀 [DEBUG-HOOK] useRecommendedStops called:', {
    segmentDay: segment?.day,
    endCity: segment?.endCity,
    maxStops,
    hookInitialized: true
  });

  // Fetch all stops data once on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchStops = async () => {
      try {
        console.log('🔍 [DEBUG-HOOK] Starting data fetch...');
        setIsLoading(true);
        setError(null);
        
        const stops = await SupabaseDataService.fetchAllStops();
        
        if (!isMounted) {
          console.log('🚫 [DEBUG-HOOK] Component unmounted, ignoring result');
          return;
        }
        
        console.log('📊 [DEBUG-HOOK] Data fetch result:', {
          totalStops: stops.length,
          hasStops: stops.length > 0,
          firstFewStops: stops.slice(0, 3).map(s => ({
            id: s.id,
            name: s.name,
            city: s.city_name || s.city,
            category: s.category,
            featured: s.featured
          }))
        });
        
        if (stops.length === 0) {
          const errorMsg = 'No stops data available from database';
          console.error('❌ [DEBUG-HOOK]', errorMsg);
          setError(errorMsg);
          setAllStops([]);
        } else {
          console.log('✅ [DEBUG-HOOK] Setting stops data');
          setAllStops(stops);
        }
      } catch (err) {
        if (!isMounted) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stops';
        console.error('❌ [DEBUG-HOOK] Fetch error:', err);
        setError(errorMessage);
        setAllStops([]);
      } finally {
        if (isMounted) {
          console.log('🏁 [DEBUG-HOOK] Fetch complete, setting loading to false');
          setIsLoading(false);
        }
      }
    };

    fetchStops();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - fetch once

  // Memoize segment key to prevent unnecessary recalculations
  const segmentKey = useMemo(() => {
    if (!segment?.endCity) return null;
    return `${segment.day}-${segment.endCity}`;
  }, [segment?.day, segment?.endCity]);

  // Calculate recommended stops with comprehensive logging
  const recommendedStops = useMemo((): RecommendedStop[] => {
    console.log('🧮 [DEBUG-HOOK] Computing recommendations:', {
      segmentKey,
      hasSegment: !!segment,
      segmentEndCity: segment?.endCity,
      allStopsCount: allStops.length,
      isLoading,
      hasError: !!error,
      step: 'START_CALCULATION'
    });

    // Wait for data to load
    if (isLoading) {
      console.log('⏳ [DEBUG-HOOK] Still loading, returning empty array');
      return [];
    }

    // Check for errors
    if (error) {
      console.log('❌ [DEBUG-HOOK] Error state, returning empty array:', error);
      return [];
    }

    // Validate segment
    if (!segment || !segment.endCity || !segmentKey) {
      console.log('⚠️ [DEBUG-HOOK] Invalid segment data:', {
        hasSegment: !!segment,
        hasEndCity: !!segment?.endCity,
        segmentKey
      });
      return [];
    }

    // Validate stops data
    if (!allStops || allStops.length === 0) {
      console.log('⚠️ [DEBUG-HOOK] No stops data available for processing');
      return [];
    }

    console.log('🚀 [DEBUG-HOOK] All validations passed, calling recommendation service...');
    
    try {
      const recommendations = StopRecommendationService.getRecommendedStopsForSegment(
        segment,
        allStops,
        maxStops
      );

      console.log('✅ [DEBUG-HOOK] Recommendations generated successfully:', {
        count: recommendations.length,
        segmentKey,
        maxStops,
        recommendations: recommendations.map(r => ({ 
          id: r.id,
          name: r.name, 
          city: r.city, 
          category: r.category,
          score: r.relevanceScore,
          hasOriginalData: !!r.originalStop
        }))
      });

      return recommendations;
    } catch (serviceError) {
      console.error('❌ [DEBUG-HOOK] Error in recommendation service:', serviceError);
      setError(`Recommendation service error: ${serviceError instanceof Error ? serviceError.message : 'Unknown error'}`);
      return [];
    }
  }, [segmentKey, allStops, maxStops, isLoading, error, segment]);

  const result = {
    recommendedStops,
    isLoading,
    error,
    hasStops: recommendedStops.length > 0
  };

  console.log('📊 [DEBUG-HOOK] Final hook result:', {
    segmentKey,
    hasStops: result.hasStops,
    stopsCount: result.recommendedStops.length,
    isLoading: result.isLoading,
    error: result.error,
    allStopsAvailable: allStops.length
  });

  return result;
};
