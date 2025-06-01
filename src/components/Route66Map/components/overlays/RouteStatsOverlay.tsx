
import React from 'react';
import RouteStatisticsOverlay from '../RouteStatisticsOverlay';

interface RouteStatsOverlayProps {
  showRouteStats: boolean;
  isMapReady: boolean;
  onToggleRouteStats: () => void;
}

const RouteStatsOverlay: React.FC<RouteStatsOverlayProps> = ({
  showRouteStats,
  isMapReady,
  onToggleRouteStats
}) => {
  return (
    <RouteStatisticsOverlay 
      isVisible={showRouteStats && isMapReady}
      onToggle={onToggleRouteStats}
    />
  );
};

export default RouteStatsOverlay;
