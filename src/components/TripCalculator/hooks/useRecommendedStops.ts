
import { useState, useEffect, useMemo } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { TripStop } from '../types/TripStop';
import { RecommendedStop, StopRecommendationService } from '../services/recommendations/StopRecommendationService';
import { SupabaseDataService } from '../services/data/SupabaseDataService';

export const useRecommendedStops = (segment: DailySegment, maxStops: number = 3) => {
  const [allStops, setAllStops] = useState<TripStop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all stops data
  useEffect(() => {
    const fetchStops = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('🔍 useRecommendedStops: Fetching all stops...');
        const stops = await SupabaseDataService.fetchAllStops();
        console.log('✅ useRecommendedStops: Fetched stops:', {
          totalStops: stops.length,
          categories: [...new Set(stops.map(s => s.category))],
          sampleStops: stops.slice(0, 3).map(s => ({ id: s.id, name: s.name, city: s.city_name, category: s.category }))
        });
        setAllStops(stops);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stops';
        setError(errorMessage);
        console.error('❌ Failed to fetch stops for recommendations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStops();
  }, []);

  // Calculate recommended stops for the segment
  const recommendedStops = useMemo((): RecommendedStop[] => {
    if (!segment || !allStops.length) {
      console.log('⚠️ useRecommendedStops: No segment or stops available', {
        hasSegment: !!segment,
        stopsCount: allStops.length,
        segmentInfo: segment ? `${segment.startCity} → ${segment.endCity}` : 'none'
      });
      return [];
    }

    try {
      console.log('🎯 useRecommendedStops: Calculating recommendations for segment:', {
        day: segment.day,
        route: `${segment.startCity} → ${segment.endCity}`,
        availableStops: allStops.length,
        maxStops
      });

      const recommendations = StopRecommendationService.getRecommendedStopsForSegment(
        segment,
        allStops,
        maxStops
      );

      console.log('✅ useRecommendedStops: Generated recommendations:', {
        count: recommendations.length,
        stops: recommendations.map(r => ({ name: r.name, city: r.city, category: r.category, score: r.relevanceScore }))
      });

      return recommendations;
    } catch (err) {
      console.error('❌ Error calculating recommended stops:', err);
      return [];
    }
  }, [segment, allStops, maxStops]);

  return {
    recommendedStops,
    isLoading,
    error,
    hasStops: recommendedStops.length > 0
  };
};
