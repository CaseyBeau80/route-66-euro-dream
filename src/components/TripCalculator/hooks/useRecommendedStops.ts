
import { useState, useEffect, useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { TripStop } from '../types/TripStop';
import { RecommendedStop, StopRecommendationService } from '../services/recommendations/StopRecommendationService';
import { SupabaseDataService } from '../services/data/SupabaseDataService';

export const useRecommendedStops = (segment: DailySegment, maxStops: number = 3) => {
  const [allStops, setAllStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🚀 [ENHANCED] useRecommendedStops called for:', {
    segmentDay: segment?.day,
    endCity: segment?.endCity,
    maxStops
  });

  // Fetch all stops data once on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchStops = async () => {
      try {
        console.log('🔍 [ENHANCED] Fetching stops data from Supabase...');
        setIsLoading(true);
        setError(null);
        
        const stops = await SupabaseDataService.fetchAllStops();
        
        if (!isMounted) {
          console.log('🚫 [ENHANCED] Component unmounted, ignoring result');
          return;
        }
        
        console.log('✅ [ENHANCED] Stops fetch successful:', {
          totalStops: stops.length,
          stopsWithDescriptions: stops.filter(s => s.description && s.description.length > 20).length,
          stopsWithImages: stops.filter(s => s.image_url || s.thumbnail_url).length,
          featuredStops: stops.filter(s => s.featured).length,
          sampleStops: stops.slice(0, 3).map(s => ({
            id: s.id,
            name: s.name,
            city: s.city_name,
            hasDescription: !!s.description,
            hasImage: !!(s.image_url || s.thumbnail_url),
            featured: s.featured
          }))
        });
        
        if (stops.length === 0) {
          throw new Error('No stops data available from database');
        }

        setAllStops(stops);
      } catch (err) {
        if (!isMounted) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stops';
        console.error('❌ [ENHANCED] Stops fetch failed:', err);
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
  }, []); // Empty dependency array - fetch once

  // Memoize segment key to prevent unnecessary recalculations
  const segmentKey = useMemo(() => {
    if (!segment?.endCity) return null;
    return `${segment.day}-${segment.endCity}`;
  }, [segment?.day, segment?.endCity]);

  // Calculate recommended stops with stable dependencies
  const recommendedStops = useMemo((): RecommendedStop[] => {
    console.log('🧮 [ENHANCED] Computing recommendations:', {
      segmentKey,
      hasSegment: !!segment,
      segmentEndCity: segment?.endCity,
      allStopsCount: allStops.length,
      isLoading,
      hasError: !!error
    });

    // Wait for data to load
    if (isLoading) {
      console.log('⏳ [ENHANCED] Still loading, returning empty array');
      return [];
    }

    // Check for errors
    if (error) {
      console.log('❌ [ENHANCED] Error state, returning empty array:', error);
      return [];
    }

    // Validate segment
    if (!segment || !segment.endCity || !segmentKey) {
      console.log('⚠️ [ENHANCED] Invalid segment data');
      return [];
    }

    // Validate stops data
    if (!allStops || allStops.length === 0) {
      console.log('⚠️ [ENHANCED] No stops data available');
      return [];
    }

    try {
      console.log('🚀 [ENHANCED] Calling StopRecommendationService with data:', {
        segmentCity: segment.endCity,
        availableStops: allStops.length,
        maxStops,
        sampleData: allStops.slice(0, 2).map(s => ({
          name: s.name,
          city: s.city_name,
          category: s.category,
          hasDescription: !!s.description
        }))
      });
      
      const recommendations = StopRecommendationService.getRecommendedStopsForSegment(
        segment,
        allStops,
        maxStops
      );

      console.log('✅ [ENHANCED] Recommendations generated:', {
        count: recommendations.length,
        segmentKey,
        recommendations: recommendations.map(r => ({ 
          id: r.id,
          name: r.name, 
          city: r.city, 
          category: r.category,
          score: r.relevanceScore,
          featured: r.originalStop.featured,
          hasDescription: !!r.originalStop.description,
          hasImage: !!(r.originalStop.image_url || r.originalStop.thumbnail_url),
          originalStopData: {
            city_name: r.originalStop.city_name,
            description: r.originalStop.description?.substring(0, 50) + '...'
          }
        }))
      });

      return recommendations;
    } catch (err) {
      console.error('❌ [ENHANCED] Error in recommendation service:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations');
      return [];
    }
  }, [segmentKey, allStops, maxStops, isLoading, error, segment]);

  const result = {
    recommendedStops,
    isLoading,
    error,
    hasStops: recommendedStops.length > 0
  };

  console.log('📊 [ENHANCED] Final hook result:', {
    segmentKey,
    hasStops: result.hasStops,
    stopsCount: result.recommendedStops.length,
    isLoading: result.isLoading,
    error: result.error,
    stopsWithRichData: result.recommendedStops.filter(s => 
      s.originalStop.description || s.originalStop.image_url || s.originalStop.thumbnail_url
    ).length
  });

  return result;
};
