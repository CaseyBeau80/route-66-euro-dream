
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
  onMarkerClick?: (gem: HiddenGem) => void;
  cleanup: () => void;
}

const MarkerCore: React.FC<MarkerCoreProps> = ({
  gem,
  map,
  updatePosition,
  handleMouseEnter,
  handleMouseLeave,
  onMarkerClick,
  cleanup
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

  useEffect(() => {
    if (!map || markerRef.current) return;

    // Validate coordinates before creating marker
    const lat = Number(gem.latitude);
    const lng = Number(gem.longitude);
    
    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
      console.error(`❌ Invalid coordinates for ${gem.title}: lat=${lat}, lng=${lng}`);
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.error(`❌ Coordinates out of range for ${gem.title}: lat=${lat}, lng=${lng}`);
      return;
    }

    console.log(`💎 Creating hidden gem marker with 💎 icon for: ${gem.title} at ${lat}, ${lng}`);

    try {
      const currentZoom = map.getZoom() || 6;
      const isCloseZoom = currentZoom >= 12;

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        icon: getMarkerIcon(gem.title, isCloseZoom),
        title: getMarkerTitle(gem.title),
        zIndex: getMarkerZIndex(gem.title)
      });

      markerRef.current = marker;
      
      console.log(`✅ Hidden gem marker created successfully for: ${gem.title}`);

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
        handleMouseLeave,
        onMarkerClick
      });

      // Add hover and click event listeners
      const mouseOverListener = marker.addListener('mouseover', eventHandlers.handleMouseOver);
      const mouseOutListener = marker.addListener('mouseout', eventHandlers.handleMouseOut);
      
      const listeners = [mouseOverListener, mouseOutListener];
      
      // Add click listener if click handler provided
      if (onMarkerClick) {
        const clickListener = marker.addListener('click', eventHandlers.handleClick);
        listeners.push(clickListener);
      }

      listenersRef.current = listeners;

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

    } catch (error) {
      console.error(`❌ Error creating marker for ${gem.title}:`, error);
    }

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
