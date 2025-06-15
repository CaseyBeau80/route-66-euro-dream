
import { useState, useEffect, useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { TripStop } from '../types/TripStop';
import { RecommendedStop, StopRecommendationService } from '../services/recommendations/StopRecommendationService';
import { SupabaseDataService } from '../services/data/SupabaseDataService';

export const useRecommendedStops = (segment: DailySegment, maxStops: number = 3) => {
  const [allStops, setAllStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🎯 [CRITICAL] useRecommendedStops hook called:', {
    segmentDay: segment?.day,
    endCity: segment?.endCity,
    maxStops,
    timestamp: new Date().toISOString()
  });

  // Fetch all stops data on mount - PRIORITY FRESH FETCH
  useEffect(() => {
    let isMounted = true;
    
    const fetchStops = async () => {
      try {
        console.log('🔍 [CRITICAL] Starting PRIORITY stops fetch...');
        setIsLoading(true);
        setError(null);
        
        const stops = await SupabaseDataService.fetchAllStops();
        
        if (!isMounted) {
          console.log('🚫 [CRITICAL] Component unmounted, ignoring fetch result');
          return;
        }
        
        console.log('✅ [CRITICAL] PRIORITY stops fetch completed:', {
          totalStops: stops.length,
          sampleStops: stops.slice(0, 5).map(s => ({ 
            id: s.id, 
            name: s.name, 
            category: s.category, 
            city: s.city_name,
            state: s.state
          }))
        });
        
        if (stops.length === 0) {
          throw new Error('No stops data available from database');
        }

        setAllStops(stops);
      } catch (err) {
        if (!isMounted) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stops';
        console.error('❌ [CRITICAL] Stops fetch failed:', err);
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
  }, []); // Empty dependency array to fetch once

  // Calculate recommended stops - PRIORITY CALCULATION
  const recommendedStops = useMemo((): RecommendedStop[] => {
    console.log('🎯 [CRITICAL] PRIORITY calculation of recommendations:', {
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
      console.log('⏳ [CRITICAL] Still loading, returning empty array');
      return [];
    }

    // Check for errors
    if (error) {
      console.log('❌ [CRITICAL] Error state, returning empty array:', error);
      return [];
    }

    // Validate segment
    if (!segment || !segment.endCity) {
      console.log('⚠️ [CRITICAL] Invalid segment, returning empty array');
      return [];
    }

    // Validate stops data
    if (!allStops || allStops.length === 0) {
      console.log('⚠️ [CRITICAL] No stops data, returning empty array');
      return [];
    }

    try {
      console.log('🚀 [CRITICAL] Calling StopRecommendationService with PRIORITY...');
      
      const recommendations = StopRecommendationService.getRecommendedStopsForSegment(
        segment,
        allStops,
        maxStops
      );

      console.log('✅ [CRITICAL] PRIORITY recommendations generated:', {
        count: recommendations.length,
        segmentDay: segment.day,
        endCity: segment.endCity,
        detailedRecommendations: recommendations.map(r => ({ 
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
      console.error('❌ [CRITICAL] Error generating recommendations:', err);
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

  console.log('📊 [CRITICAL] useRecommendedStops PRIORITY result:', {
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
      state: s.state
    }))
  });

  return result;
};
