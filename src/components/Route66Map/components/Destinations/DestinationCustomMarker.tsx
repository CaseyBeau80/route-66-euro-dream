
import React, { useEffect, useRef } from 'react';
import { IconCreator } from '../RouteMarkers/IconCreator';
import { useDestinationHoverContext } from './contexts/DestinationHoverContext';
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
  const { activeDestination, hoverPosition, setActiveDestination } = useDestinationHoverContext();

  // Check if this destination is currently being hovered
  const isHovered = activeDestination === destination.name;

  useEffect(() => {
    if (!map || !destination) return;

    const cityName = destination.name.split(',')[0].split(' - ')[0].trim();
    
    console.log(`🏛️ Creating ONLY Route 66 shield marker for: ${cityName} (NO YELLOW CIRCLE)`);

    // Create the marker with ONLY the Route 66 shield icon (no yellow background)
    const marker = new google.maps.Marker({
      position: { lat: destination.latitude, lng: destination.longitude },
      map: map,
      icon: IconCreator.createDestinationCityIcon(cityName),
      title: `${destination.name} - ${destination.state} (Destination)`,
      zIndex: 15000,
      visible: true,
      optimized: false
    });

    markerRef.current = marker;

    // Mouse enter event with improved hover management
    const mouseEnterListener = marker.addListener('mouseover', (event: google.maps.MapMouseEvent) => {
      console.log(`🏛️ Mouse enter on destination: ${cityName}`);
      
      if (event.domEvent) {
        const mouseEvent = event.domEvent as MouseEvent;
        setActiveDestination(destination.name, { x: mouseEvent.clientX + 10, y: mouseEvent.clientY - 10 });
      }
    });

    // Mouse leave event with improved hover management
    const mouseLeaveListener = marker.addListener('mouseout', () => {
      console.log(`🏛️ Mouse leave on destination: ${cityName}`);
      setActiveDestination(null);
    });

    // Mouse move event for position updates
    const mouseMoveListener = marker.addListener('mousemove', (event: google.maps.MapMouseEvent) => {
      if (event.domEvent && isHovered) {
        const mouseEvent = event.domEvent as MouseEvent;
        setActiveDestination(destination.name, { x: mouseEvent.clientX + 10, y: mouseEvent.clientY - 10 });
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
    };
  }, [map, destination, onDestinationClick, setActiveDestination, isHovered]);

  return (
    <DestinationHoverPortal
      destination={destination}
      position={hoverPosition}
      isVisible={isHovered}
    />
  );
};

export default DestinationCustomMarker;
