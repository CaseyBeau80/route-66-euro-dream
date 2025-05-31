
import { useState, useEffect } from 'react';

interface UseRouteStatisticsProps {
  mapInitialized: boolean;
  isMapReady: boolean;
}

export const useRouteStatistics = ({ mapInitialized, isMapReady }: UseRouteStatisticsProps) => {
  const [showRouteStats, setShowRouteStats] = useState(true);

  // Auto-hide route stats after 10 seconds
  useEffect(() => {
    if (showRouteStats && mapInitialized) {
      const timer = setTimeout(() => {
        setShowRouteStats(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showRouteStats, mapInitialized]);

  return {
    showRouteStats,
    setShowRouteStats
  };
};
