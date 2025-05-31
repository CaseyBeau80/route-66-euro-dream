
import React, { useEffect, useRef } from 'react';
import { useDestinationHover } from './hooks/useDestinationHover';
import DestinationHoverPortal from './DestinationHoverPortal';
import { DestinationMarkerCreator } from './DestinationMarkerCreator';
import { DestinationMarkerEvents } from './DestinationMarkerEvents';
import type { Route66Waypoint } from '../../types/supabaseTypes';

interface DestinationCustomMarkerProps {
  destination: Route66Waypoint;
  map: google.maps.Map;
  onDestinationClick: (destination: Route66Waypoint) => void;
}

const DestinationCustomMarker: React.FC<DestinationCustomMarkerProps> = ({
  destination,
  map,
  onDestinationClick
}) => {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | google.maps.Marker | null>(null);
  const {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup
  } = useDestinationHover();

  useEffect(() => {
    // Check if Google Maps API is available before proceeding
    if (!window.google?.maps || !map || !destination) {
      console.log('⚠️ Google Maps API, map, or destination not available yet');
      return;
    }

    // Create the marker with proper error handling
    const marker = DestinationMarkerCreator.createMarker(destination, map);
    
    if (!marker) {
      console.warn(`⚠️ Failed to create marker for ${destination.name}`);
      return;
    }

    markerRef.current = marker;

    // Attach event listeners with proper error handling
    try {
      DestinationMarkerEvents.attachEventListeners(
        marker,
        destination,
        map,
        handleMouseEnter,
        handleMouseLeave,
        updatePosition,
        onDestinationClick
      );

      console.log(`✅ Wooden post marker created successfully for ${destination.name}`);
    } catch (eventError) {
      console.error(`❌ Error attaching events for ${destination.name}:`, eventError);
    }

    return () => {
      DestinationMarkerCreator.cleanupMarker(markerRef.current, destination.name);
      markerRef.current = null;
      cleanup();
    };
  }, [map, destination, onDestinationClick, handleMouseEnter, handleMouseLeave, updatePosition, cleanup]);

  // Handle hover card mouse events
  const handleHoverCardMouseEnter = () => {
    console.log(`🏛️ Mouse entered hover card for ${destination.name}`);
    handleMouseEnter(destination.name);
  };

  const handleHoverCardMouseLeave = () => {
    console.log(`🏛️ Mouse left hover card for ${destination.name}`);
    handleMouseLeave(destination.name);
  };

  return (
    <DestinationHoverPortal
      destination={destination}
      position={hoverPosition}
      isVisible={isHovered}
      onMouseEnter={handleHoverCardMouseEnter}
      onMouseLeave={handleHoverCardMouseLeave}
    />
  );
};

export default DestinationCustomMarker;
