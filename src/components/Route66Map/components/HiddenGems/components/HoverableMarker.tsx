
import React, { useEffect, useRef, useCallback } from 'react';
import { HiddenGem } from '../types';
import { createVintageRoute66Icon } from '../VintageRoute66Icon';
import { useMarkerHover } from '../hooks/useMarkerHover';
import HoverCardPortal from './HoverCardPortal';

interface HoverableMarkerProps {
  gem: HiddenGem;
  onMarkerClick: (gem: HiddenGem) => void;
  onWebsiteClick: (website: string) => void;
  map: google.maps.Map;
}

const HoverableMarker: React.FC<HoverableMarkerProps> = ({
  gem,
  onMarkerClick,
  onWebsiteClick,
  map
}) => {
  const {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup,
    clearHover
  } = useMarkerHover();

  const markerRef = useRef<google.maps.Marker | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

  // Function to get marker screen position
  const getMarkerScreenPosition = useCallback(() => {
    if (!map || !markerRef.current) return null;

    const position = markerRef.current.getPosition();
    if (!position) return null;

    // Get the map div and its bounds
    const mapDiv = map.getDiv();
    const mapRect = mapDiv.getBoundingClientRect();

    // Get map bounds
    const bounds = map.getBounds();
    if (!bounds) return null;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    // Calculate relative position within the map viewport
    const lat = position.lat();
    const lng = position.lng();

    // Convert to pixel coordinates relative to map container
    const x = ((lng - sw.lng()) / (ne.lng() - sw.lng())) * mapRect.width;
    const y = ((ne.lat() - lat) / (ne.lat() - sw.lat())) * mapRect.height;

    // Convert to viewport coordinates
    const viewportX = mapRect.left + x;
    const viewportY = mapRect.top + y;

    console.log(`📍 Marker screen position for ${gem.title}:`, { viewportX, viewportY });

    return { x: viewportX, y: viewportY };
  }, [map, gem.title]);

  // Create marker only once
  useEffect(() => {
    if (!map || markerRef.current) return;

    console.log(`🎯 Creating stable marker for: ${gem.title}`);

    // Create the visual marker
    const marker = new google.maps.Marker({
      position: { lat: Number(gem.latitude), lng: Number(gem.longitude) },
      map: map,
      icon: createVintageRoute66Icon(),
      title: `Hidden Gem: ${gem.title}`,
      zIndex: 1000
    });

    markerRef.current = marker;

    // Mouse event handlers
    const handleMouseOver = () => {
      console.log(`🐭 Mouse over gem: ${gem.title}`);
      const screenPos = getMarkerScreenPosition();
      if (screenPos) {
        updatePosition(screenPos.x, screenPos.y);
        handleMouseEnter(gem.title);
      }
    };

    const handleMouseOut = () => {
      console.log(`🐭 Mouse out gem: ${gem.title}`);
      handleMouseLeave(gem.title);
    };

    const handleClick = () => {
      console.log(`🎯 Clicked gem: ${gem.title}`);
      clearHover(); // Clear hover state on click
      onMarkerClick(gem);
    };

    // Add event listeners
    const mouseOverListener = marker.addListener('mouseover', handleMouseOver);
    const mouseOutListener = marker.addListener('mouseout', handleMouseOut);
    const clickListener = marker.addListener('click', handleClick);

    // Store listeners for cleanup
    listenersRef.current = [mouseOverListener, mouseOutListener, clickListener];

    // Update position when map changes
    const updateMarkerPosition = () => {
      if (isHovered) {
        const screenPos = getMarkerScreenPosition();
        if (screenPos) {
          updatePosition(screenPos.x, screenPos.y);
        }
      }
    };

    const boundsListener = map.addListener('bounds_changed', updateMarkerPosition);
    const zoomListener = map.addListener('zoom_changed', updateMarkerPosition);

    listenersRef.current.push(boundsListener, zoomListener);

    // Initial position update
    setTimeout(() => {
      const screenPos = getMarkerScreenPosition();
      if (screenPos) {
        updatePosition(screenPos.x, screenPos.y);
      }
    }, 100);

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up stable marker for: ${gem.title}`);
      
      // Remove all listeners
      listenersRef.current.forEach(listener => {
        google.maps.event.removeListener(listener);
      });
      listenersRef.current = [];

      // Remove marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }

      cleanup();
    };
  }, [map, gem.latitude, gem.longitude, gem.title]); // Only depend on static values

  // Update position when hover state changes
  useEffect(() => {
    if (isHovered) {
      const screenPos = getMarkerScreenPosition();
      if (screenPos) {
        updatePosition(screenPos.x, screenPos.y);
      }
    }
  }, [isHovered, getMarkerScreenPosition, updatePosition]);

  return (
    <HoverCardPortal
      gem={gem}
      isVisible={isHovered}
      position={hoverPosition}
      onWebsiteClick={onWebsiteClick}
    />
  );
};

export default HoverableMarker;
