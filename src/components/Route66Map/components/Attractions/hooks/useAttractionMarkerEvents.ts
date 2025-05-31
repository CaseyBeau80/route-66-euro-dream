
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
  const { setActiveAttraction } = useAttractionHoverContext();

  useEffect(() => {
    if (!marker) return;

    // Clear any existing listeners
    listenersRef.current.forEach(listener => {
      google.maps.event.removeListener(listener);
    });
    listenersRef.current = [];

    // Add event listeners with global hover management
    const mouseEnterListener = marker.addListener('mouseover', (event: google.maps.MapMouseEvent) => {
      if (event.domEvent) {
        const mouseEvent = event.domEvent as MouseEvent;
        setActiveAttraction(attraction.name, { x: mouseEvent.clientX + 10, y: mouseEvent.clientY - 10 });
      }
    });

    const mouseLeaveListener = marker.addListener('mouseout', () => {
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
  }, [marker, attraction, setActiveAttraction, isHovered, onAttractionClick, listenersRef]);
};
