
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
      // Vintage drive-in theater sign icon based on the provided image
      const iconSize = 32;
      const driveInSvgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
          <!-- Main sign background (red/orange gradient) -->
          <rect x="4" y="6" width="24" height="20" 
                fill="#D2691E" 
                stroke="#8B4513" 
                stroke-width="1" 
                rx="2"/>
          
          <!-- Sign border -->
          <rect x="5" y="7" width="22" height="18" 
                fill="none" 
                stroke="#FFFFFF" 
                stroke-width="1" 
                rx="1"/>
          
          <!-- DRIVE-IN text -->
          <text x="16" y="13" text-anchor="middle" 
                fill="#FFFFFF" 
                font-family="Arial, sans-serif" 
                font-size="4" 
                font-weight="bold">DRIVE-IN</text>
          
          <!-- THEATER text -->
          <text x="16" y="18" text-anchor="middle" 
                fill="#FFFFFF" 
                font-family="Arial, sans-serif" 
                font-size="3.5" 
                font-weight="bold">THEATER</text>
          
          <!-- Sign post -->
          <rect x="15" y="26" width="2" height="6" 
                fill="#8B4513"/>
          
          <!-- Decorative elements (small lights/bulbs) -->
          <circle cx="7" cy="9" r="0.8" fill="#FFFF00" opacity="0.8"/>
          <circle cx="25" cy="9" r="0.8" fill="#FFFF00" opacity="0.8"/>
          <circle cx="7" cy="23" r="0.8" fill="#FFFF00" opacity="0.8"/>
          <circle cx="25" cy="23" r="0.8" fill="#FFFF00" opacity="0.8"/>
          
          <!-- Arrow pointing down -->
          <path d="M13 20 L16 23 L19 20" 
                stroke="#FFFF00" 
                stroke-width="1.5" 
                fill="none" 
                stroke-linecap="round" 
                stroke-linejoin="round"/>
        </svg>
      `;

      return {
        position: { lat: attraction.latitude, lng: attraction.longitude },
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(driveInSvgContent)}`,
          scaledSize: new google.maps.Size(iconSize, iconSize),
          anchor: new google.maps.Point(iconSize/2, iconSize)
        },
        title: `${attraction.name} - ${attraction.state} (Drive-In Theater)`,
        zIndex: 30000,
        optimized: false,
        isDriveIn: true
      };
    } else {
      // Regular attraction icon - simple red circle
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

    console.log(`🎯 Creating attraction marker for ${attraction.name}${markerConfig.isDriveIn ? ' (DRIVE-IN THEATER)' : ''}`);

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
      console.log(`🧹 Cleaning up attraction marker: ${attraction.name}`);
      
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
  }, [map, attraction, markerConfig, handleMouseEnter, handleMouseLeave, updatePosition, cleanup, onAttractionClick]);

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
