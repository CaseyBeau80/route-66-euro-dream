
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
      // Nostalgic drive-in theater icon inspired by vintage aesthetic
      const iconSize = 32;
      const driveInSvgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
          <!-- Vintage background circle -->
          <circle cx="16" cy="16" r="15" 
                  fill="#2c1810" 
                  stroke="#d4af37" 
                  stroke-width="2"/>
          
          <!-- Inner vintage border -->
          <circle cx="16" cy="16" r="12" 
                  fill="none" 
                  stroke="#8b4513" 
                  stroke-width="1"/>
          
          <!-- Drive-in screen -->
          <rect x="8" y="10" width="16" height="10" 
                fill="#1a1a1a" 
                stroke="#d4af37" 
                stroke-width="1.5" 
                rx="1"/>
          
          <!-- Screen glow effect -->
          <rect x="9" y="11" width="14" height="8" 
                fill="#87ceeb" 
                opacity="0.3" 
                rx="0.5"/>
          
          <!-- Vintage car silhouettes -->
          <rect x="5" y="21" width="4" height="2" 
                fill="#8b4513" 
                rx="1"/>
          <rect x="11" y="21" width="4" height="2" 
                fill="#8b4513" 
                rx="1"/>
          <rect x="17" y="21" width="4" height="2" 
                fill="#8b4513" 
                rx="1"/>
          <rect x="23" y="21" width="4" height="2" 
                fill="#8b4513" 
                rx="1"/>
          
          <!-- Speaker posts -->
          <line x1="6" y1="20" x2="6" y2="17" 
                stroke="#d4af37" 
                stroke-width="1"/>
          <line x1="26" y1="20" x2="26" y2="17" 
                stroke="#d4af37" 
                stroke-width="1"/>
          
          <!-- Vintage movie reel symbol in center -->
          <circle cx="16" cy="14" r="3" 
                  fill="none" 
                  stroke="#d4af37" 
                  stroke-width="1"/>
          <circle cx="16" cy="14" r="1" 
                  fill="#d4af37"/>
          <circle cx="13.5" cy="11.5" r="0.8" 
                  fill="none" 
                  stroke="#d4af37" 
                  stroke-width="0.5"/>
          <circle cx="18.5" cy="11.5" r="0.8" 
                  fill="none" 
                  stroke="#d4af37" 
                  stroke-width="0.5"/>
          <circle cx="13.5" cy="16.5" r="0.8" 
                  fill="none" 
                  stroke="#d4af37" 
                  stroke-width="0.5"/>
          <circle cx="18.5" cy="16.5" r="0.8" 
                  fill="none" 
                  stroke="#d4af37" 
                  stroke-width="0.5"/>
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
        zIndex: 30000, // Higher zIndex to prevent overlapping
        optimized: false,
        isDriveIn: true
      };
    } else {
      // Regular attraction icon with adjusted zIndex
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
        zIndex: 25000, // Lower than drive-ins but still high
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

    console.log(`🎯 Creating nostalgic attraction marker for ${attraction.name}`);

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
      console.log(`🎬 Nostalgic drive-in theater marker created: ${attraction.name}`);
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
      console.log(`🧹 Cleaning up nostalgic attraction marker: ${attraction.name}`);
      
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
