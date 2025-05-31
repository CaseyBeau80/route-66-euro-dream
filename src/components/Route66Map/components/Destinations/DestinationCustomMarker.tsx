import React, { useEffect, useRef } from 'react';
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
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
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

    // Create marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'destination-marker';
    markerElement.style.cssText = `
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
      border: 3px solid #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 10px;
      transition: all 0.2s ease;
    `;

    // Add Route 66 shield number
    markerElement.textContent = '66';

    // Add hover effects
    markerElement.addEventListener('mouseenter', () => {
      markerElement.style.transform = 'scale(1.1)';
      markerElement.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
    });

    markerElement.addEventListener('mouseleave', () => {
      markerElement.style.transform = 'scale(1)';
      markerElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    });

    // Create advanced marker
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat: destination.latitude, lng: destination.longitude },
      content: markerElement,
      title: destination.name
    });

    markerRef.current = marker;

    // Add event listeners for hover
    const handleMarkerMouseEnter = (event: MouseEvent) => {
      const rect = map.getDiv().getBoundingClientRect();
      const projection = map.getProjection();
      
      if (projection) {
        const point = projection.fromLatLngToPoint(
          new google.maps.LatLng(destination.latitude, destination.longitude)
        );
        
        if (point) {
          const scale = Math.pow(2, map.getZoom());
          const worldCoordinate = new google.maps.Point(
            point.x * scale,
            point.y * scale
          );
          
          const pixelOffset = new google.maps.Point(
            Math.floor(worldCoordinate.x),
            Math.floor(worldCoordinate.y)
          );
          
          const viewportX = pixelOffset.x - rect.left;
          const viewportY = pixelOffset.y - rect.top;
          
          console.log(`📍 Marker screen position for ${destination.name}:`, {
            viewportX,
            viewportY
          });
          
          updatePosition(viewportX, viewportY);
        }
      }
      
      handleMouseEnter(destination.name);
    };

    const handleMarkerMouseLeave = () => {
      handleMouseLeave(destination.name);
    };

    const handleMarkerClick = () => {
      console.log(`🏛️ Destination marker clicked: ${destination.name}`);
      onDestinationClick(destination);
    };

    markerElement.addEventListener('mouseenter', handleMarkerMouseEnter);
    markerElement.addEventListener('mouseleave', handleMarkerMouseLeave);
    markerElement.addEventListener('click', handleMarkerClick);

    return () => {
      if (marker) {
        marker.map = null;
      }
      cleanup();
    };
  }, [map, destination, onDestinationClick, handleMouseEnter, handleMouseLeave, updatePosition, cleanup]);

  // Handle hover card mouse events to keep it visible when interacting with it
  const handleHoverCardMouseEnter = () => {
    console.log(`🏛️ Mouse entered hover card for ${destination.name}`);
    // Keep the card visible by calling mouse enter again
    handleMouseEnter(destination.name);
  };

  const handleHoverCardMouseLeave = () => {
    console.log(`🏛️ Mouse left hover card for ${destination.name}`);
    // Start the hide timer
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
