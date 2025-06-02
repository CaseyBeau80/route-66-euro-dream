
import React, { useEffect, useRef } from 'react';
import { HiddenGem } from '../types';
import { getMarkerIcon, getMarkerTitle, getMarkerZIndex } from './MarkerIcon';
import { createMarkerEventHandlers } from './MarkerEventHandlers';

interface MarkerCoreProps {
  gem: HiddenGem;
  map: google.maps.Map;
  updatePosition: (x: number, y: number) => void;
  handleMouseEnter: (gemTitle: string) => void;
  handleMouseLeave: (gemTitle: string) => void;
  cleanup: () => void;
}

const MarkerCore: React.FC<MarkerCoreProps> = ({
  gem,
  map,
  updatePosition,
  handleMouseEnter,
  handleMouseLeave,
  cleanup
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

  useEffect(() => {
    if (!map || markerRef.current) return;

    // Remove drive-in detection - all hidden gems are regular gems now
    console.log(`💎 Creating hidden gem marker for: ${gem.title}`);

    const marker = new google.maps.Marker({
      position: { lat: Number(gem.latitude), lng: Number(gem.longitude) },
      map: map,
      icon: getMarkerIcon(gem.title),
      title: getMarkerTitle(gem.title),
      zIndex: getMarkerZIndex(gem.title)
    });

    markerRef.current = marker;

    const eventHandlers = createMarkerEventHandlers({
      gem,
      map,
      marker,
      updatePosition,
      handleMouseEnter,
      handleMouseLeave
    });

    // Add only hover event listeners
    const mouseOverListener = marker.addListener('mouseover', eventHandlers.handleMouseOver);
    const mouseOutListener = marker.addListener('mouseout', eventHandlers.handleMouseOut);

    listenersRef.current = [mouseOverListener, mouseOutListener];

    // Update position when map changes
    const boundsListener = map.addListener('bounds_changed', eventHandlers.updateMarkerPosition);
    const zoomListener = map.addListener('zoom_changed', eventHandlers.updateMarkerPosition);

    listenersRef.current.push(boundsListener, zoomListener);

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up hidden gem marker for: ${gem.title}`);
      
      listenersRef.current.forEach(listener => {
        google.maps.event.removeListener(listener);
      });
      listenersRef.current = [];

      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }

      cleanup();
    };
  }, [map, gem.latitude, gem.longitude, gem.title]);

  return null;
};

export default MarkerCore;
