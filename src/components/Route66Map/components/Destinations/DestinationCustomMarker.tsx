
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

    // Create SVG icon for Route 66 shield
    const createRoute66ShieldSVG = () => {
      const cityName = destination.name.split(',')[0].split(' - ')[0].trim();
      const displayName = cityName.length > 8 ? cityName.substring(0, 8) : cityName;
      
      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="50" height="60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 60">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
            </filter>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#FFF8DC;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#DEB887;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Route 66 Shield Shape -->
          <path d="M25 4 L12 4 C9 4 6.5 6.5 6.5 9.5 L6.5 16 C6.5 19.5 8.5 22.5 12 24 C17 26 21 27 25 27 C29 27 33 26 38 24 C41.5 22.5 43.5 19.5 43.5 16 L43.5 9.5 C43.5 6.5 41 4 38 4 L25 4 Z" 
                fill="url(#shieldGrad)" 
                stroke="#8B4513" 
                stroke-width="2"
                filter="url(#shadow)"/>
          
          <!-- City name -->
          <text x="25" y="13" text-anchor="middle" 
                fill="#654321" 
                font-family="Arial, sans-serif" 
                font-size="5" 
                font-weight="bold">${displayName.toUpperCase()}</text>
          
          <!-- Dividing line -->
          <line x1="12" y1="15.5" x2="38" y2="15.5" stroke="#654321" stroke-width="1"/>
          
          <!-- Route 66 numbers -->
          <text x="25" y="22" text-anchor="middle" 
                fill="#654321" 
                font-family="Arial, sans-serif" 
                font-size="10" 
                font-weight="900">66</text>
        </svg>
      `)}`;
    };

    try {
      const position = { lat: destination.latitude, lng: destination.longitude };
      let marker: google.maps.marker.AdvancedMarkerElement | google.maps.Marker;

      // Try to create AdvancedMarkerElement first
      if (window.google?.maps?.marker?.AdvancedMarkerElement) {
        console.log(`✅ Creating AdvancedMarkerElement for ${destination.name}`);
        
        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.innerHTML = `
          <div style="
            width: 50px;
            height: 60px;
            background-image: url('${createRoute66ShieldSVG()}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            cursor: pointer;
            transition: transform 0.2s ease;
          "></div>
        `;
        
        const imgElement = markerElement.firstElementChild as HTMLElement;
        
        // Add hover effects
        imgElement.addEventListener('mouseenter', () => {
          imgElement.style.transform = 'scale(1.1)';
        });
        
        imgElement.addEventListener('mouseleave', () => {
          imgElement.style.transform = 'scale(1)';
        });

        marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position,
          content: markerElement,
          title: destination.name,
          zIndex: 30000
        });
      } else {
        console.log(`⚠️ AdvancedMarkerElement not available, using regular Marker for ${destination.name}`);
        
        // Fallback to regular marker with SVG icon
        marker = new google.maps.Marker({
          position,
          map,
          title: destination.name,
          icon: {
            url: createRoute66ShieldSVG(),
            scaledSize: new google.maps.Size(50, 60),
            anchor: new google.maps.Point(25, 55)
          },
          zIndex: 30000
        });
      }

      markerRef.current = marker;

      // Add event listeners for hover and click
      const handleMarkerMouseEnter = () => {
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

      // Add listeners based on marker type
      if (marker instanceof google.maps.marker.AdvancedMarkerElement) {
        const element = marker.content as HTMLElement;
        element.addEventListener('mouseenter', handleMarkerMouseEnter);
        element.addEventListener('mouseleave', handleMarkerMouseLeave);
        element.addEventListener('click', handleMarkerClick);
      } else {
        marker.addListener('mouseover', handleMarkerMouseEnter);
        marker.addListener('mouseout', handleMarkerMouseLeave);
        marker.addListener('click', handleMarkerClick);
      }

      console.log(`✅ Route 66 shield marker created successfully for ${destination.name}`);
    } catch (error) {
      console.error(`❌ Error creating marker for ${destination.name}:`, error);
    }

    return () => {
      if (markerRef.current) {
        console.log(`🧹 Cleaning up destination marker: ${destination.name}`);
        
        try {
          if (window.google?.maps?.marker?.AdvancedMarkerElement && 
              markerRef.current instanceof google.maps.marker.AdvancedMarkerElement) {
            markerRef.current.map = null;
          } else if (window.google?.maps?.Marker && 
                     markerRef.current instanceof google.maps.Marker) {
            markerRef.current.setMap(null);
          }
        } catch (cleanupError) {
          console.warn(`⚠️ Error during marker cleanup for ${destination.name}:`, cleanupError);
        }
        
        markerRef.current = null;
      }
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
