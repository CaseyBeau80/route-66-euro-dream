
import { useState, useEffect, useRef } from 'react';

export interface MapState {
  mapInitialized: boolean;
  showRouteStats: boolean;
  useClusteringMode: boolean;
}

export const useMapState = () => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const [showRouteStats, setShowRouteStats] = useState(true);
  const [useClusteringMode, setUseClusteringMode] = useState(true);

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
    mapInitialized,
    setMapInitialized,
    showRouteStats,
    setShowRouteStats,
    useClusteringMode,
    setUseClusteringMode
  };
};
