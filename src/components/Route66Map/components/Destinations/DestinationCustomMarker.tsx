
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
    
    console.log(`🏛️ Creating destination marker for: ${cityName}`);

    // Create the marker with LOWER z-index so attractions show on top
    const marker = new google.maps.Marker({
      position: { lat: destination.latitude, lng: destination.longitude },
      map: map,
      icon: IconCreator.createDestinationCityIcon(cityName),
      title: `${destination.name} - ${destination.state} (Destination)`,
      zIndex: 15000, // Reduced from 30000 to be below attractions (20000)
      visible: true
    });

    markerRef.current = marker;

    // Mouse enter event
    const mouseEnterListener = marker.addListener('mouseover', (event: google.maps.MapMouseEvent) => {
      console.log(`🏛️ Mouse enter on destination: ${cityName}`);
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
      console.log(`🏛️ Destination clicked: ${cityName}`);
      onDestinationClick(destination);
    });

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up destination marker: ${cityName}`);
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
