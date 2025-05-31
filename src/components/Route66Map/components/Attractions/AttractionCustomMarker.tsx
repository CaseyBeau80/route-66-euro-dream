
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
    
    if (isDriveIn) {
      // Custom SVG drive-in theater icon that nests well with other icons
      const iconSize = 24;
      const driveInSvgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
          <!-- Outer circle with drive-in themed colors -->
          <circle cx="12" cy="12" r="11" 
                  fill="#1a1a2e" 
                  stroke="#ffd700" 
                  stroke-width="2"/>
          <!-- Inner screen/projection area -->
          <rect x="6" y="8" width="12" height="8" 
                fill="#333333" 
                stroke="#ffd700" 
                stroke-width="1" 
                rx="1"/>
          <!-- Screen content indicator -->
          <rect x="7" y="9" width="10" height="6" 
                fill="#4a4a4a" 
                rx="0.5"/>
          <!-- Small projection beam effect -->
          <polygon points="12,16 10,20 14,20" 
                   fill="#ffd700" 
                   opacity="0.6"/>
          <!-- Movie symbol -->
          <circle cx="12" cy="12" r="2" 
                  fill="#ffd700" 
                  opacity="0.8"/>
          <text x="12" y="13.5" text-anchor="middle" font-size="3" fill="#1a1a2e">▶</text>
        </svg>
      `;

      return {
        position: { lat: attraction.latitude, lng: attraction.longitude },
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(driveInSvgContent)}`,
          scaledSize: new google.maps.Size(iconSize, iconSize),
          anchor: new google.maps.Point(iconSize/2, iconSize/2)
        },
        title: `${attraction.name} - ${attraction.state} (Drive-In Theater)`,
        zIndex: 25000,
        optimized: false,
        isDriveIn: true
      };
    } else {
      // Regular attraction icon
      const iconSize = 16;
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
          <circle cx="8" cy="8" r="7" 
                  fill="#FEF3C7" 
                  stroke="#DC2626" 
                  stroke-width="2"/>
          <circle cx="8" cy="8" r="4" 
                  fill="#DC2626" 
                  opacity="0.9"/>
        </svg>
      `;

      return {
        position: { lat: attraction.latitude, lng: attraction.longitude },
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
          scaledSize: new google.maps.Size(iconSize, iconSize),
          anchor: new google.maps.Point(iconSize/2, iconSize/2)
        },
        title: `${attraction.name} - ${attraction.state}`,
        zIndex: 25000,
        optimized: false,
        isDriveIn: false
      };
    }
  }, [attraction.latitude, attraction.longitude, attraction.name, attraction.state]);

  // FIXED: Removed isHovered from dependencies to prevent re-render loop
  useEffect(() => {
    if (!map || !attraction) return;

    // Prevent marker recreation if it already exists with same position
    if (markerRef.current) {
      const currentPos = markerRef.current.getPosition();
      if (currentPos && 
          Math.abs(currentPos.lat() - markerConfig.position.lat) < 0.0001 &&
          Math.abs(currentPos.lng() - markerConfig.position.lng) < 0.0001) {
        console.log(`🔒 Marker already exists for ${attraction.name}, skipping recreation`);
        return;
      }
    }

    console.log(`🎯 Creating stable attraction marker for ${attraction.name}`);

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
      console.log(`🎬 Enhanced drive-in theater marker created with new icon: ${attraction.name}`);
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
      if (event.domEvent) {
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
      console.log(`🧹 Cleaning up stable attraction marker: ${attraction.name}`);
      
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
  }, [map, attraction, markerConfig, handleMouseEnter, handleMouseLeave, updatePosition, cleanup, onAttractionClick]); // REMOVED isHovered

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
