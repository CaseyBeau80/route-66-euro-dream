
import React, { useEffect, useRef } from 'react';
import { IconCreator } from '../RouteMarkers/IconCreator';
import { useDestinationHover } from './hooks/useDestinationHover';
import DestinationHoverPortal from './DestinationHoverPortal';
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
  const markerRef = useRef<google.maps.Marker | null>(null);
  const {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup
  } = useDestinationHover();

  useEffect(() => {
    if (!map || !destination) return;

    const cityName = destination.name.split(',')[0].split(' - ')[0].trim();
    
    console.log(`🏛️ Creating ONLY Route 66 shield marker for: ${cityName} (NO YELLOW CIRCLE)`);
    console.log(`🚫 Ensuring no yellow circle base for: ${cityName}`);

    // Create the marker with ONLY the Route 66 shield icon (no yellow background)
    const marker = new google.maps.Marker({
      position: { lat: destination.latitude, lng: destination.longitude },
      map: map,
      icon: IconCreator.createDestinationCityIcon(cityName),
      title: `${destination.name} - ${destination.state} (Destination)`,
      zIndex: 15000, // Lower than attractions to prevent conflicts
      visible: true,
      optimized: false // Force custom rendering to prevent any default yellow circles
    });

    markerRef.current = marker;

    // Mouse enter event
    const mouseEnterListener = marker.addListener('mouseover', (event: google.maps.MapMouseEvent) => {
      console.log(`🏛️ Mouse enter on destination: ${cityName} (shield only, no yellow)`);
      handleMouseEnter(cityName);
      
      if (event.domEvent) {
        const mouseEvent = event.domEvent as MouseEvent;
        updatePosition(mouseEvent.clientX + 10, mouseEvent.clientY - 10);
      }
    });

    // Mouse leave event
    const mouseLeaveListener = marker.addListener('mouseout', () => {
      console.log(`🏛️ Mouse leave on destination: ${cityName}`);
      handleMouseLeave(cityName);
    });

    // Mouse move event for position updates
    const mouseMoveListener = marker.addListener('mousemove', (event: google.maps.MapMouseEvent) => {
      if (event.domEvent) {
        const mouseEvent = event.domEvent as MouseEvent;
        updatePosition(mouseEvent.clientX + 10, mouseEvent.clientY - 10);
      }
    });

    // Click event
    const clickListener = marker.addListener('click', () => {
      console.log(`🏛️ Destination clicked: ${cityName} (shield marker only)`);
      onDestinationClick(destination);
    });

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up destination marker: ${cityName} (removing shield, no yellow to clean)`);
      google.maps.event.removeListener(mouseEnterListener);
      google.maps.event.removeListener(mouseLeaveListener);
      google.maps.event.removeListener(mouseMoveListener);
      google.maps.event.removeListener(clickListener);
      marker.setMap(null);
      cleanup();
    };
  }, [map, destination, onDestinationClick, handleMouseEnter, handleMouseLeave, updatePosition, cleanup]);

  return (
    <DestinationHoverPortal
      destination={destination}
      position={hoverPosition}
      isVisible={isHovered}
    />
  );
};

export default DestinationCustomMarker;
