
import { useState, useEffect, useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { TripStop } from '../types/TripStop';
import { RecommendedStop, StopRecommendationService } from '../services/recommendations/StopRecommendationService';
import { SupabaseDataService } from '../services/data/SupabaseDataService';

export const useRecommendedStops = (segment: DailySegment, maxStops: number = 3) => {
  const [allStops, setAllStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('🎯 useRecommendedStops: Hook called for segment:', {
    segmentDay: segment?.day,
    endCity: segment?.endCity,
    maxStops
  });

  // Fetch all stops data
  useEffect(() => {
    const fetchStops = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('🔍 useRecommendedStops: Starting fetch...');
        const stops = await SupabaseDataService.fetchAllStops();
        console.log('✅ useRecommendedStops: Fetched stops successfully:', {
          totalStops: stops.length,
          categories: [...new Set(stops.map(s => s.category))],
          attractionsCount: stops.filter(s => s.category === 'attraction').length,
          hiddenGemsCount: stops.filter(s => s.category === 'hidden_gem').length,
          sampleStops: stops.slice(0, 5).map(s => ({ 
            id: s.id, 
            name: s.name, 
            city: s.city_name, 
            category: s.category 
          }))
        });
        setAllStops(stops);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stops';
        setError(errorMessage);
        console.error('❌ useRecommendedStops: Failed to fetch stops:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStops();
  }, []);

  // Calculate recommended stops for the segment
  const recommendedStops = useMemo((): RecommendedStop[] => {
    if (!segment || !allStops.length) {
      console.log('⚠️ useRecommendedStops: Missing data:', {
        hasSegment: !!segment,
        stopsCount: allStops.length,
        segmentInfo: segment ? `Day ${segment.day}: ${segment.startCity} → ${segment.endCity}` : 'none'
      });
      return [];
    }

    try {
      console.log('🎯 useRecommendedStops: Calculating recommendations:', {
        day: segment.day,
        route: `${segment.startCity} → ${segment.endCity}`,
        availableStops: allStops.length,
        maxStops,
        endCityForMatching: segment.endCity
      });

      const recommendations = StopRecommendationService.getRecommendedStopsForSegment(
        segment,
        allStops,
        maxStops
      );

      console.log('✅ useRecommendedStops: Generated recommendations:', {
        count: recommendations.length,
        segmentDay: segment.day,
        endCity: segment.endCity,
        stops: recommendations.map(r => ({ 
          name: r.name, 
          city: r.city, 
          category: r.category, 
          score: r.relevanceScore 
        }))
      });

      return recommendations;
    } catch (err) {
      console.error('❌ useRecommendedStops: Error calculating recommendations:', err);
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

  console.log('📊 useRecommendedStops: Returning result:', {
    segmentDay: segment?.day,
    endCity: segment?.endCity,
    hasStops: result.hasStops,
    stopsCount: result.recommendedStops.length,
    isLoading: result.isLoading,
    error: result.error
  });

  return result;
};
