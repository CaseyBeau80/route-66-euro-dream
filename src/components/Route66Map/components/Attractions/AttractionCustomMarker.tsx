
import React, { useEffect, useRef, useMemo } from 'react';
import { Attraction } from './types';
import { useAttractionHover } from './hooks/useAttractionHover';
import AttractionHoverPortal from './components/AttractionHoverPortal';
import DriveInHoverCard from './components/DriveInHoverCard';

interface AttractionCustomMarkerProps {
  attraction: Attraction;
  map: google.maps.Map;
  onAttractionClick?: (attraction: Attraction) => void;
  onWebsiteClick?: (website: string) => void;
}

const AttractionCustomMarker: React.FC<AttractionCustomMarkerProps> = React.memo(({
  attraction,
  map,
  onAttractionClick,
  onWebsiteClick
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup
  } = useAttractionHover();

  // Memoize marker properties to prevent unnecessary recreations
  const markerConfig = useMemo(() => {
    const isDriveIn = attraction.name.toLowerCase().includes('drive-in');
    const iconSize = 16;
    
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
        <circle cx="8" cy="8" r="7" 
                fill="${isDriveIn ? '#FFD700' : '#FEF3C7'}" 
                stroke="${isDriveIn ? '#8B4513' : '#DC2626'}" 
                stroke-width="2"/>
        <circle cx="8" cy="8" r="4" 
                fill="${isDriveIn ? '#8B4513' : '#DC2626'}" 
                opacity="0.9"/>
        ${isDriveIn ? '<text x="8" y="12" text-anchor="middle" font-size="8" fill="white">🎬</text>' : ''}
      </svg>
    `;

    return {
      position: { lat: attraction.latitude, lng: attraction.longitude },
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
        scaledSize: new google.maps.Size(iconSize, iconSize),
        anchor: new google.maps.Point(iconSize/2, iconSize/2)
      },
      title: `${attraction.name} - ${attraction.state}${isDriveIn ? ' (Drive-In Theater)' : ''}`,
      zIndex: 25000,
      optimized: false,
      isDriveIn
    };
  }, [attraction.latitude, attraction.longitude, attraction.name, attraction.state]);

  useEffect(() => {
    if (!map || !attraction) return;

    console.log(`🎯 Creating optimized attraction marker for ${attraction.name}`);

    // Create marker with memoized config
    const marker = new google.maps.Marker({
      position: markerConfig.position,
      map: map,
      icon: markerConfig.icon,
      title: markerConfig.title,
      zIndex: markerConfig.zIndex,
      optimized: markerConfig.optimized
    });

    markerRef.current = marker;

    if (markerConfig.isDriveIn) {
      console.log(`🎬 Optimized drive-in theater marker created: ${attraction.name}`);
    }

    // Clear any existing listeners
    listenersRef.current.forEach(listener => {
      google.maps.event.removeListener(listener);
    });
    listenersRef.current = [];

    // Add event listeners with proper cleanup tracking
    const mouseEnterListener = marker.addListener('mouseover', (event: google.maps.MapMouseEvent) => {
      if (event.domEvent) {
        const mouseEvent = event.domEvent as MouseEvent;
        updatePosition(mouseEvent.clientX + 10, mouseEvent.clientY - 10);
      }
      handleMouseEnter(attraction.name);
    });

    const mouseLeaveListener = marker.addListener('mouseout', () => {
      handleMouseLeave(attraction.name);
    });

    const mouseMoveListener = marker.addListener('mousemove', (event: google.maps.MapMouseEvent) => {
      if (event.domEvent && isHovered) {
        const mouseEvent = event.domEvent as MouseEvent;
        updatePosition(mouseEvent.clientX + 10, mouseEvent.clientY - 10);
      }
    });

    const clickListener = marker.addListener('click', () => {
      console.log(`🎯 Attraction marker clicked: ${attraction.name}`);
      onAttractionClick?.(attraction);
    });

    // Store listeners for cleanup
    listenersRef.current = [mouseEnterListener, mouseLeaveListener, mouseMoveListener, clickListener];

    return () => {
      console.log(`🧹 Cleaning up optimized attraction marker: ${attraction.name}`);
      
      // Remove all listeners
      listenersRef.current.forEach(listener => {
        google.maps.event.removeListener(listener);
      });
      listenersRef.current = [];
      
      // Remove marker from map
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      
      // Cleanup hover state
      cleanup();
    };
  }, [map, attraction, markerConfig, handleMouseEnter, handleMouseLeave, updatePosition, cleanup, onAttractionClick, isHovered]);

  // Use drive-in specific hover card for drive-ins, regular card for others
  return (
    <>
      {markerConfig.isDriveIn ? (
        <DriveInHoverCard
          attraction={attraction}
          isVisible={isHovered}
          position={hoverPosition}
          onWebsiteClick={onWebsiteClick}
        />
      ) : (
        <AttractionHoverPortal
          attraction={attraction}
          isVisible={isHovered}
          position={hoverPosition}
          onWebsiteClick={onWebsiteClick}
        />
      )}
    </>
  );
});

AttractionCustomMarker.displayName = 'AttractionCustomMarker';

export default AttractionCustomMarker;
