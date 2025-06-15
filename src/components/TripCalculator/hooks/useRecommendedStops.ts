
import { useState, useEffect, useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { TripStop } from '../types/TripStop';
import { RecommendedStop, StopRecommendationService } from '../services/recommendations/StopRecommendationService';
import { SupabaseDataService } from '../services/data/SupabaseDataService';

export const useRecommendedStops = (segment: DailySegment, maxStops: number = 3) => {
  const [allStops, setAllStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🚨 [HOOK-DEBUG] useRecommendedStops called:', {
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
        console.log('🔍 [HOOK-DEBUG] Starting stops fetch...');
        setIsLoading(true);
        setError(null);
        
        const stops = await SupabaseDataService.fetchAllStops();
        
        if (!isMounted) {
          console.log('🚫 [HOOK-DEBUG] Component unmounted, ignoring result');
          return;
        }
        
        console.log('✅ [HOOK-DEBUG] Stops fetch completed:', {
          totalStops: stops.length,
          sampleStops: stops.slice(0, 3).map(s => ({ 
            id: s.id, 
            name: s.name, 
            category: s.category, 
            city: s.city_name || s.city,
            state: s.state
          })),
          categoryCounts: stops.reduce((acc, s) => {
            const cat = s.category || 'unknown';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        });
        
        if (stops.length === 0) {
          throw new Error('No stops data available from database');
        }

        setAllStops(stops);
      } catch (err) {
        if (!isMounted) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stops';
        console.error('❌ [HOOK-DEBUG] Stops fetch failed:', err);
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

  // Calculate recommended stops
  const recommendedStops = useMemo((): RecommendedStop[] => {
    console.log('🚨 [HOOK-DEBUG] Computing recommendations:', {
      hasSegment: !!segment,
      segmentDay: segment?.day,
      endCity: segment?.endCity,
      allStopsCount: allStops.length,
      isLoading,
      error: !!error,
      timestamp: new Date().toISOString()
    });

    // Wait for data to load
    if (isLoading) {
      console.log('⏳ [HOOK-DEBUG] Still loading data...');
      return [];
    }

    // Check for errors
    if (error) {
      console.log('❌ [HOOK-DEBUG] Error state:', error);
      return [];
    }

    // Validate segment
    if (!segment || !segment.endCity) {
      console.log('⚠️ [HOOK-DEBUG] Invalid segment data');
      return [];
    }

    // Validate stops data
    if (!allStops || allStops.length === 0) {
      console.log('⚠️ [HOOK-DEBUG] No stops data available');
      return [];
    }

    try {
      console.log('🚀 [HOOK-DEBUG] Calling StopRecommendationService...');
      
      const recommendations = StopRecommendationService.getRecommendedStopsForSegment(
        segment,
        allStops,
        maxStops
      );

      console.log('✅ [HOOK-DEBUG] Recommendations generated:', {
        count: recommendations.length,
        segmentDay: segment.day,
        endCity: segment.endCity,
        recommendations: recommendations.map(r => ({ 
          id: r.id,
          name: r.name, 
          city: r.city, 
          state: r.state,
          category: r.category,
          type: r.type,
          score: r.relevanceScore
        }))
      });

      return recommendations;
    } catch (err) {
      console.error('❌ [HOOK-DEBUG] Error generating recommendations:', err);
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

  console.log('📊 [HOOK-DEBUG] Final result:', {
    segmentDay: segment?.day,
    endCity: segment?.endCity,
    hasStops: result.hasStops,
    stopsCount: result.recommendedStops.length,
    isLoading: result.isLoading,
    error: result.error,
    stopDetails: result.recommendedStops.map(s => ({ 
      id: s.id, 
      name: s.name, 
      category: s.category, 
      city: s.city,
      state: s.state,
      score: s.relevanceScore
    }))
  });

  return result;
};
