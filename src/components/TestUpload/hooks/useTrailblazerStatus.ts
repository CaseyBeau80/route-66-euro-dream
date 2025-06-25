
import { useState, useEffect } from 'react';
import { TrailblazerService, LocationTrailblazer } from '@/services/trailblazerService';

interface UseTrailblazerStatusProps {
  stopId: string;
  enabled?: boolean;
}

export const useTrailblazerStatus = ({ stopId, enabled = true }: UseTrailblazerStatusProps) => {
  const [trailblazer, setTrailblazer] = useState<LocationTrailblazer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrailblazer = async () => {
    if (!stopId || !enabled) return;

    try {
      setLoading(true);
      setError(null);
      const data = await TrailblazerService.getLocationTrailblazer(stopId);
      setTrailblazer(data);
    } catch (err) {
      console.error('Failed to fetch trailblazer status:', err);
      setError(err instanceof Error ? err.message : 'Failed to load trailblazer status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrailblazer();
  }, [stopId, enabled]);

  const refetch = () => {
    fetchTrailblazer();
  };

  const hasTrailblazer = trailblazer?.has_trailblazer || false;
  const isUnclaimed = !hasTrailblazer;

  return {
    trailblazer,
    loading,
    error,
    hasTrailblazer,
    isUnclaimed,
    refetch
  };
};
