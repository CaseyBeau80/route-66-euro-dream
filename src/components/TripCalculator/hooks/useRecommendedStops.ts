
import { useState, useEffect, useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { TripStop } from '../types/TripStop';
import { RecommendedStop, StopRecommendationService } from '../services/recommendations/StopRecommendationService';
import { SupabaseDataService } from '../services/data/SupabaseDataService';

export const useRecommendedStops = (segment: DailySegment, maxStops: number = 3) => {
  const [allStops, setAllStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🎯 [DEBUG] useRecommendedStops hook called:', {
    segmentDay: segment?.day,
    endCity: segment?.endCity,
    maxStops,
    hookId: Math.random().toString(36).substr(2, 9)
  });

  // Fetch all stops data on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchStops = async () => {
      try {
        console.log('🔍 [DEBUG] Starting stops fetch...');
        setIsLoading(true);
        setError(null);
        
        const stops = await SupabaseDataService.fetchAllStops();
        
        if (!isMounted) {
          console.log('🚫 [DEBUG] Component unmounted, ignoring fetch result');
          return;
        }
        
        console.log('✅ [DEBUG] Stops fetch completed:', {
          totalStops: stops.length,
          categories: [...new Set(stops.map(s => s.category))],
          attractionsCount: stops.filter(s => s.category === 'attraction').length,
          hiddenGemsCount: stops.filter(s => s.category === 'hidden_gem').length,
          driveInsCount: stops.filter(s => s.category === 'drive_in').length
        });
        
        if (stops.length === 0) {
          throw new Error('No stops data available from database');
        }

        setAllStops(stops);
      } catch (err) {
        if (!isMounted) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stops';
        console.error('❌ [DEBUG] Stops fetch failed:', err);
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
  }, []);

  // Calculate recommended stops
  const recommendedStops = useMemo((): RecommendedStop[] => {
    console.log('🎯 [DEBUG] useMemo for recommendations triggered:', {
      hasSegment: !!segment,
      segmentDay: segment?.day,
      endCity: segment?.endCity,
      allStopsCount: allStops.length,
      isLoading,
      error: !!error
    });

    // Wait for data to load
    if (isLoading) {
      console.log('⏳ [DEBUG] Still loading, returning empty array');
      return [];
    }

    // Check for errors
    if (error) {
      console.log('❌ [DEBUG] Error state, returning empty array:', error);
      return [];
    }

    // Validate segment
    if (!segment || !segment.endCity) {
      console.log('⚠️ [DEBUG] Invalid segment, returning empty array');
      return [];
    }

    // Validate stops data
    if (!allStops || allStops.length === 0) {
      console.log('⚠️ [DEBUG] No stops data, returning empty array');
      return [];
    }

    try {
      console.log('🚀 [DEBUG] Calling StopRecommendationService...');
      
      const recommendations = StopRecommendationService.getRecommendedStopsForSegment(
        segment,
        allStops,
        maxStops
      );

      console.log('✅ [DEBUG] Recommendations generated:', {
        count: recommendations.length,
        segmentDay: segment.day,
        endCity: segment.endCity,
        recommendations: recommendations.map(r => ({ 
          name: r.name, 
          city: r.city, 
          category: r.category,
          score: r.relevanceScore
        }))
      });

      return recommendations;
    } catch (err) {
      console.error('❌ [DEBUG] Error generating recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations');
      return [];
    }
  }, [segment, allStops, maxStops, isLoading, error]);

  const result = {
    recommendedStops,
    isLoading,
    error,
    hasStops: recommendedStops.length > 0
  };

  console.log('📊 [DEBUG] useRecommendedStops returning:', {
    segmentDay: segment?.day,
    endCity: segment?.endCity,
    hasStops: result.hasStops,
    stopsCount: result.recommendedStops.length,
    isLoading: result.isLoading,
    error: result.error,
    stopNames: result.recommendedStops.map(s => s.name)
  });

  return result;
};
