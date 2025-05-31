
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
    if (!map || !destination) {
      console.log('⚠️ Missing map or destination data');
      return;
    }

    console.log(`🛡️ Creating Route 66 shield marker for ${destination.name} at ${destination.latitude}, ${destination.longitude}`);

    // Create marker element with Route 66 shield styling
    const markerElement = document.createElement('div');
    markerElement.className = 'destination-marker';
    markerElement.style.cssText = `
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
      border: 3px solid #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 12px;
      transition: all 0.2s ease;
      z-index: 1000;
    `;

    // Add Route 66 text
    markerElement.textContent = '66';

    // Add hover effects
    markerElement.addEventListener('mouseenter', () => {
      markerElement.style.transform = 'scale(1.2)';
      markerElement.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.6)';
    });

    markerElement.addEventListener('mouseleave', () => {
      markerElement.style.transform = 'scale(1)';
      markerElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
    });

    try {
      // Try to create AdvancedMarkerElement if available, fallback to regular Marker
      if (window.google?.maps?.marker?.AdvancedMarkerElement) {
        console.log(`✅ Creating AdvancedMarkerElement for ${destination.name}`);
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: destination.latitude, lng: destination.longitude },
          content: markerElement,
          title: destination.name
        });

        markerRef.current = marker;
      } else {
        console.log(`⚠️ AdvancedMarkerElement not available, using regular Marker for ${destination.name}`);
        // Fallback to regular marker with custom icon
        const marker = new google.maps.Marker({
          position: { lat: destination.latitude, lng: destination.longitude },
          map: map,
          title: destination.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="17" fill="#DC2626" stroke="white" stroke-width="3"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-size="12" font-weight="bold">66</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
          },
          zIndex: 1000
        });

        markerRef.current = marker;
      }

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
            
            console.log(`📍 Destination marker screen position for ${destination.name}:`, {
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

      console.log(`✅ Route 66 shield marker created successfully for ${destination.name}`);
    } catch (error) {
      console.error(`❌ Error creating marker for ${destination.name}:`, error);
    }

    return () => {
      if (markerRef.current) {
        console.log(`🧹 Cleaning up destination marker: ${destination.name}`);
        
        try {
          // Safely check if Google Maps API is still available
          if (window.google?.maps?.marker?.AdvancedMarkerElement && 
              markerRef.current instanceof google.maps.marker.AdvancedMarkerElement) {
            // For AdvancedMarkerElement, set map property to null
            markerRef.current.map = null;
          } else if (window.google?.maps?.Marker && 
                     markerRef.current instanceof google.maps.Marker) {
            // For regular Marker, use setMap method
            markerRef.current.setMap(null);
          } else {
            // Fallback cleanup - try both methods safely
            console.log('⚠️ Google Maps API not available during cleanup, attempting fallback cleanup');
            if ('map' in markerRef.current && markerRef.current.map !== undefined) {
              (markerRef.current as any).map = null;
            } else if ('setMap' in markerRef.current && typeof markerRef.current.setMap === 'function') {
              (markerRef.current as any).setMap(null);
            }
          }
        } catch (cleanupError) {
          console.warn(`⚠️ Error during marker cleanup for ${destination.name}:`, cleanupError);
          // Even if cleanup fails, we should continue to avoid blocking the unmount
        }
        
        markerRef.current = null;
      }
      cleanup();
    };
  }, [map, destination, onDestinationClick, handleMouseEnter, handleMouseLeave, updatePosition, cleanup]);

  // Handle hover card mouse events to keep it visible when interacting with it
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
