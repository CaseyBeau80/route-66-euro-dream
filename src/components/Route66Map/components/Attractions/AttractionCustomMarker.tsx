
import React, { useEffect, useRef } from 'react';
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

const AttractionCustomMarker: React.FC<AttractionCustomMarkerProps> = ({
  attraction,
  map,
  onAttractionClick,
  onWebsiteClick
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup
  } = useAttractionHover();

  useEffect(() => {
    if (!map || !attraction) return;

    console.log(`🎯 Creating attraction marker for ${attraction.name}`);

    const iconSize = 16;
    const isDriveIn = attraction.name.toLowerCase().includes('drive-in');
    
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

    const marker = new google.maps.Marker({
      position: { lat: attraction.latitude, lng: attraction.longitude },
      map: map,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
        scaledSize: new google.maps.Size(iconSize, iconSize),
        anchor: new google.maps.Point(iconSize/2, iconSize/2)
      },
      title: `${attraction.name} - ${attraction.state}${isDriveIn ? ' (Drive-In Theater)' : ''}`,
      zIndex: 25000,
      optimized: false
    });

    markerRef.current = marker;

    if (isDriveIn) {
      console.log(`🎬 Drive-in theater marker created: ${attraction.name} at ${attraction.latitude}, ${attraction.longitude}`);
    }

    // Improved hover detection with larger hit area
    const mouseEnterListener = marker.addListener('mouseover', (event: google.maps.MapMouseEvent) => {
      console.log(`🐭 Mouse over attraction: ${attraction.name}`);
      
      if (event.domEvent) {
        const mouseEvent = event.domEvent as MouseEvent;
        // Use the actual mouse position for more accurate hover positioning
        updatePosition(mouseEvent.clientX + 10, mouseEvent.clientY - 10);
      }
      
      handleMouseEnter(attraction.name);
    });

    const mouseLeaveListener = marker.addListener('mouseout', () => {
      console.log(`🐭 Mouse out attraction: ${attraction.name}`);
      handleMouseLeave(attraction.name);
    });

    // Track mouse movement for smooth hover card positioning
    const mouseMoveListener = marker.addListener('mousemove', (event: google.maps.MapMouseEvent) => {
      if (event.domEvent && isHovered) {
        const mouseEvent = event.domEvent as MouseEvent;
        updatePosition(mouseEvent.clientX + 10, mouseEvent.clientY - 10);
      }
    });

    const clickListener = marker.addListener('click', () => {
      console.log(`🎯 Attraction marker clicked: ${attraction.name}`);
      if (onAttractionClick) {
        onAttractionClick(attraction);
      }
    });

    return () => {
      console.log(`🧹 Cleaning up attraction marker: ${attraction.name}`);
      google.maps.event.removeListener(mouseEnterListener);
      google.maps.event.removeListener(mouseLeaveListener);
      google.maps.event.removeListener(mouseMoveListener);
      google.maps.event.removeListener(clickListener);
      marker.setMap(null);
      cleanup();
    };
  }, [map, attraction, handleMouseEnter, handleMouseLeave, updatePosition, cleanup, onAttractionClick, isHovered]);

  const isDriveIn = attraction.name.toLowerCase().includes('drive-in');

  // Use drive-in specific hover card for drive-ins, regular card for others
  return (
    <>
      {isDriveIn ? (
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
};

export default AttractionCustomMarker;
