
import { useEffect } from 'react';
import { Attraction } from '../types';
import { useAttractionHoverContext } from '../contexts/AttractionHoverContext';

interface UseAttractionMarkerEventsProps {
  marker: google.maps.Marker | null;
  attraction: Attraction;
  listenersRef: React.MutableRefObject<google.maps.MapsEventListener[]>;
  isHovered: boolean;
  onAttractionClick?: (attraction: Attraction) => void;
}

export const useAttractionMarkerEvents = ({
  marker,
  attraction,
  listenersRef,
  isHovered,
  onAttractionClick
}: UseAttractionMarkerEventsProps) => {
  const { setActiveAttraction, shouldShowIndividualMarkers } = useAttractionHoverContext();

  useEffect(() => {
    if (!marker) return;

    // Clear any existing listeners
    listenersRef.current.forEach(listener => {
      google.maps.event.removeListener(listener);
    });
    listenersRef.current = [];

    // Check current zoom level to determine if marker should be interactive
    const map = marker.getMap() as google.maps.Map;
    if (map) {
      const currentZoom = map.getZoom() || 10;
      const shouldShow = shouldShowIndividualMarkers(currentZoom);
      
      console.log(`🔧 Setting up attraction marker events for ${attraction.name}, zoom: ${currentZoom}, shouldShow: ${shouldShow}`);
      
      if (!shouldShow) {
        // If markers shouldn't be shown at this zoom, don't add hover events
        console.log(`🚫 Skipping hover events for ${attraction.name} at zoom ${currentZoom}`);
        return;
      }
    }

    // Add event listeners with improved hover management
    const mouseEnterListener = marker.addListener('mouseover', (event: google.maps.MapMouseEvent) => {
      if (event.domEvent) {
        const mouseEvent = event.domEvent as MouseEvent;
        console.log(`🎯 Attraction hover START: ${attraction.name}`);
        setActiveAttraction(attraction.name, { x: mouseEvent.clientX + 10, y: mouseEvent.clientY - 10 });
      }
    });

    const mouseLeaveListener = marker.addListener('mouseout', () => {
      console.log(`🎯 Attraction hover END: ${attraction.name}`);
      setActiveAttraction(null);
    });

    const mouseMoveListener = marker.addListener('mousemove', (event: google.maps.MapMouseEvent) => {
      if (event.domEvent && isHovered) {
        const mouseEvent = event.domEvent as MouseEvent;
        setActiveAttraction(attraction.name, { x: mouseEvent.clientX + 10, y: mouseEvent.clientY - 10 });
      }
    });

    const clickListener = marker.addListener('click', () => {
      console.log(`🎯 Attraction marker clicked: ${attraction.name}`);
      onAttractionClick?.(attraction);
    });

    // Store listeners for cleanup
    listenersRef.current = [mouseEnterListener, mouseLeaveListener, mouseMoveListener, clickListener];

    return () => {
      console.log(`🧹 Cleaning up attraction marker events: ${attraction.name}`);
      
      // Remove all listeners
      listenersRef.current.forEach(listener => {
        google.maps.event.removeListener(listener);
      });
      listenersRef.current = [];
    };
  }, [marker, attraction, setActiveAttraction, isHovered, onAttractionClick, listenersRef, shouldShowIndividualMarkers]);
};
