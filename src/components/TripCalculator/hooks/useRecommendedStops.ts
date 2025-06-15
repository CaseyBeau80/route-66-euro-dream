
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
        const stops = await SupabaseDataService.fetchAllStops();
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
      return [];
    }

    try {
      return StopRecommendationService.getRecommendedStopsForSegment(
        segment,
        allStops,
        maxStops
      );
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
