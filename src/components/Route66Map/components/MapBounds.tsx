
import { useCallback } from 'react';

interface MapBoundsProps {
  onMapLoad: (map: google.maps.Map) => void;
  setCurrentZoom: (zoom: number) => void;
  setIsDragging: (dragging: boolean) => void;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

export const useMapBounds = ({
  onMapLoad,
  setCurrentZoom,
  setIsDragging,
  mapRef
}: MapBoundsProps) => {
  const handleMapLoad = useCallback((map: google.maps.Map) => {
    console.log('🚀 MapBounds: Map loading callback triggered');
    mapRef.current = map;
    
    // Listen for zoom changes
    map.addListener("zoom_changed", () => {
      if (mapRef.current) {
        setCurrentZoom(mapRef.current.getZoom() || 5);
      }
    });
    
    // Listen for drag events
    map.addListener("dragstart", () => {
      setIsDragging(true);
    });
    
    map.addListener("dragend", () => {
      setTimeout(() => setIsDragging(false), 200);
    });
    
    // Set initial view optimized for Route 66
    console.log('🎯 Setting initial map view for Route 66');
    map.setZoom(5);
    map.setCenter({ lat: 35.5, lng: -97.5 }); // Centered on Route 66 corridor
    
    onMapLoad(map);
    console.log('✅ Route 66 map loaded and ready for enhanced Supabase rendering');
  }, [onMapLoad, setCurrentZoom, setIsDragging, mapRef]);

  return { handleMapLoad };
};
