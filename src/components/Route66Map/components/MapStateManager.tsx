
import React from 'react';
import { useMapEventHandlers } from './MapEventHandlers';
import { useMapBounds } from './MapBounds';
import { useRouteStatistics } from '../hooks/useRouteStatistics';
import { useGoogleMapsContext } from './GoogleMapsProvider';

interface MapStateManagerProps {
  selectedState: string | null;
  onClearSelection: () => void;
  children: (props: {
    mapEventHandlers: ReturnType<typeof useMapEventHandlers>;
    mapBounds: ReturnType<typeof useMapBounds>;
    showRouteStats: boolean;
    setShowRouteStats: (show: boolean) => void;
  }) => React.ReactNode;
}

export const MapStateManager: React.FC<MapStateManagerProps> = ({
  selectedState,
  onClearSelection,
  children
}) => {
  const { isDragging, setCurrentZoom, setIsDragging, mapRef } = useGoogleMapsContext();

  const mapEventHandlers = useMapEventHandlers({ 
    isDragging, 
    selectedState, 
    onClearSelection 
  });

  const mapBounds = useMapBounds({
    onMapLoad: (map: google.maps.Map) => {
      console.log('🗺️ Map loaded and bounds initialized');
    },
    setCurrentZoom,
    setIsDragging,
    mapRef
  });

  const { showRouteStats, setShowRouteStats } = useRouteStatistics({
    mapInitialized: true,
    isMapReady: mapEventHandlers.isMapReady
  });

  return (
    <>
      {children({
        mapEventHandlers,
        mapBounds,
        showRouteStats,
        setShowRouteStats
      })}
    </>
  );
};
