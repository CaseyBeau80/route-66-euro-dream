
import React, { useEffect, useRef } from 'react';
import { HiddenGem } from '../types';
import { getMarkerIcon, getMarkerTitle, getMarkerZIndex } from './MarkerIcon';
import { createMarkerEventHandlers } from './MarkerEventHandlers';
import { MarkerAnimationUtils } from '../../../utils/markerAnimationUtils';

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

    console.log(`💎 Creating hidden gem marker with new 💎 icon for: ${gem.title}`);

    const currentZoom = map.getZoom() || 6;
    const isCloseZoom = currentZoom >= 12;

    const marker = new google.maps.Marker({
      position: { lat: Number(gem.latitude), lng: Number(gem.longitude) },
      map: map,
      icon: getMarkerIcon(gem.title, isCloseZoom),
      title: getMarkerTitle(gem.title),
      zIndex: getMarkerZIndex(gem.title)
    });

    markerRef.current = marker;

    // Enhanced mouse enter with optimized animation
    const enhancedMouseEnter = (gemTitle: string) => {
      console.log(`💎 Enhanced mouse enter for ${gemTitle} - triggering optimized jiggle`);
      MarkerAnimationUtils.triggerOptimizedJiggle(marker, gemTitle);
      handleMouseEnter(gemTitle);
    };

    const eventHandlers = createMarkerEventHandlers({
      gem,
      map,
      marker,
      updatePosition,
      handleMouseEnter: enhancedMouseEnter,
      handleMouseLeave
    });

    // Add only hover event listeners
    const mouseOverListener = marker.addListener('mouseover', eventHandlers.handleMouseOver);
    const mouseOutListener = marker.addListener('mouseout', eventHandlers.handleMouseOut);

    listenersRef.current = [mouseOverListener, mouseOutListener];

    // Update position when map changes
    const boundsListener = map.addListener('bounds_changed', eventHandlers.updateMarkerPosition);
    const zoomListener = map.addListener('zoom_changed', () => {
      // Update icon size based on zoom
      const newZoom = map.getZoom() || 6;
      const newIsCloseZoom = newZoom >= 12;
      marker.setIcon(getMarkerIcon(gem.title, newIsCloseZoom));
      eventHandlers.updateMarkerPosition();
    });

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
