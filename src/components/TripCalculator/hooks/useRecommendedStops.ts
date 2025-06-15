
import { useState, useEffect, useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { TripStop } from '../types/TripStop';
import { RecommendedStop, StopRecommendationService } from '../services/recommendations/StopRecommendationService';
import { SupabaseDataService } from '../services/data/SupabaseDataService';

export const useRecommendedStops = (segment: DailySegment, maxStops: number = 3) => {
  const [allStops, setAllStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const [error, setError] = useState<string | null>(null);

  console.log('🎯 [FIXED] useRecommendedStops: Hook called for segment:', {
    segmentDay: segment?.day,
    endCity: segment?.endCity,
    maxStops,
    hasSegment: !!segment
  });

  // Fetch all stops data
  useEffect(() => {
    const fetchStops = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('🔍 [FIXED] useRecommendedStops: Starting fetch...');
        
        const stops = await SupabaseDataService.fetchAllStops();
        
        console.log('✅ [FIXED] useRecommendedStops: Fetched stops successfully:', {
          totalStops: stops.length,
          categories: [...new Set(stops.map(s => s.category))],
          attractionsCount: stops.filter(s => s.category === 'attraction').length,
          hiddenGemsCount: stops.filter(s => s.category === 'hidden_gem').length,
          driveInsCount: stops.filter(s => s.category === 'drive_in').length,
          sampleAttractions: stops.filter(s => s.category === 'attraction').slice(0, 3).map(s => s.name),
          sampleHiddenGems: stops.filter(s => s.category === 'hidden_gem').slice(0, 3).map(s => s.name)
        });
        
        // CRITICAL FIX: Validate the fetched data
        if (!stops || stops.length === 0) {
          throw new Error('No stops data received from Supabase');
        }

        // Validate that we have actual attraction data
        const hasAttractions = stops.some(s => s.category === 'attraction' && s.name && s.name.length > 0);
        const hasHiddenGems = stops.some(s => s.category === 'hidden_gem' && s.name && s.name.length > 0);
        
        if (!hasAttractions && !hasHiddenGems) {
          throw new Error('No valid attraction or hidden gem data found');
        }

        setAllStops(stops);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stops';
        setError(errorMessage);
        console.error('❌ [FIXED] useRecommendedStops: Failed to fetch stops:', err);
        setAllStops([]); // Ensure we have a valid array
      } finally {
        setIsLoading(false);
      }
    };

    fetchStops();
  }, []);

  // Calculate recommended stops for the segment
  const recommendedStops = useMemo((): RecommendedStop[] => {
    // CRITICAL FIX: Enhanced validation
    if (!segment) {
      console.log('⚠️ [FIXED] useRecommendedStops: No segment provided');
      return [];
    }

    if (!segment.endCity) {
      console.log('⚠️ [FIXED] useRecommendedStops: Segment missing endCity');
      return [];
    }

    if (!allStops || allStops.length === 0) {
      console.log('⚠️ [FIXED] useRecommendedStops: No stops data available', {
        allStopsLength: allStops?.length || 0,
        isLoading
      });
      return [];
    }

    try {
      console.log('🎯 [FIXED] useRecommendedStops: Calculating recommendations with validated data:', {
        day: segment.day,
        route: `${segment.startCity} → ${segment.endCity}`,
        availableStops: allStops.length,
        maxStops,
        dataValidation: {
          hasAttractions: allStops.filter(s => s.category === 'attraction').length,
          hasHiddenGems: allStops.filter(s => s.category === 'hidden_gem').length,
          hasDriveIns: allStops.filter(s => s.category === 'drive_in').length
        }
      });

      const recommendations = StopRecommendationService.getRecommendedStopsForSegment(
        segment,
        allStops,
        maxStops
      );

      console.log('✅ [FIXED] useRecommendedStops: Generated recommendations:', {
        count: recommendations.length,
        segmentDay: segment.day,
        endCity: segment.endCity,
        stops: recommendations.map(r => ({ 
          name: r.name, 
          city: r.city, 
          category: r.category, 
          score: r.relevanceScore,
          type: r.type
        }))
      });

      return recommendations;
    } catch (err) {
      console.error('❌ [FIXED] useRecommendedStops: Error calculating recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate recommendations');
      return [];
    }
  }, [segment, allStops, maxStops]);

  const result = {
    recommendedStops,
    isLoading,
    error,
    hasStops: recommendedStops.length > 0
  };

  console.log('📊 [FIXED] useRecommendedStops: Returning result:', {
    segmentDay: segment?.day,
    endCity: segment?.endCity,
    hasStops: result.hasStops,
    stopsCount: result.recommendedStops.length,
    isLoading: result.isLoading,
    error: result.error,
    actualStopNames: result.recommendedStops.map(s => s.name)
  });

  return result;
};
