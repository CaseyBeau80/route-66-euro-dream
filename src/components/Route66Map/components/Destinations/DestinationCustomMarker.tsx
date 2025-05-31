
import React, { useEffect, useRef } from 'react';
import { useDestinationHover } from './hooks/useDestinationHover';
import DestinationHoverPortal from './DestinationHoverPortal';
import { DestinationCityIconCreator } from '../RouteMarkers/DestinationCityIconCreator';
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

    console.log(`🛡️ Creating wooden post marker for ${destination.name} at ${destination.latitude}, ${destination.longitude}`);

    const cityName = destination.name.split(',')[0].split(' - ')[0].trim();

    try {
      const position = { lat: destination.latitude, lng: destination.longitude };
      let marker: google.maps.marker.AdvancedMarkerElement | google.maps.Marker;

      // Try to create AdvancedMarkerElement first
      if (window.google?.maps?.marker?.AdvancedMarkerElement) {
        console.log(`✅ Creating AdvancedMarkerElement with wooden post for ${destination.name}`);
        
        // Create the wooden post icon using the existing creator
        const iconData = DestinationCityIconCreator.createDestinationCityIcon(cityName);
        
        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.innerHTML = `
          <div style="
            width: 50px;
            height: 60px;
            background-image: url('${iconData.url}');
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
        
        // Fallback to regular marker with wooden post icon
        const iconData = DestinationCityIconCreator.createDestinationCityIcon(cityName);
        
        marker = new google.maps.Marker({
          position,
          map,
          title: destination.name,
          icon: iconData,
          zIndex: 30000
        });
      }

      markerRef.current = marker;

      // Add event listeners for hover and click
      const handleMarkerMouseEnter = (event?: any) => {
        console.log(`🏛️ Mouse entered marker for ${destination.name}`);
        
        // Calculate position for hover card
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
            
            const viewportX = pixelOffset.x + rect.left;
            const viewportY = pixelOffset.y + rect.top;
            
            updatePosition(viewportX, viewportY);
          }
        }
        
        handleMouseEnter(destination.name);
      };

      const handleMarkerMouseLeave = () => {
        console.log(`🏛️ Mouse left marker for ${destination.name}`);
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

      console.log(`✅ Wooden post marker created successfully for ${destination.name}`);
    } catch (error) {
      console.error(`❌ Error creating wooden post marker for ${destination.name}:`, error);
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
