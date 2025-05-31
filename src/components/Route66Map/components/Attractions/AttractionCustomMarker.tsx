
import React, { useEffect, useRef } from 'react';
import { Attraction } from './types';
import { useAttractionHover } from './hooks/useAttractionHover';
import AttractionHoverPortal from './components/AttractionHoverPortal';

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

    // Create simple red dot marker for attractions
    const iconSize = 14;
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
        <circle cx="7" cy="7" r="6" 
                fill="#FEF3C7" 
                stroke="#DC2626" 
                stroke-width="2"/>
        <circle cx="7" cy="7" r="3" 
                fill="#DC2626" 
                opacity="0.8"/>
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
      title: `${attraction.name} - ${attraction.state}`,
      zIndex: 20000
    });

    markerRef.current = marker;

    // Mouse enter handler
    const mouseEnterListener = marker.addListener('mouseover', () => {
      console.log(`🐭 Mouse over attraction: ${attraction.name}`);
      
      // Calculate screen position
      const projection = map.getProjection();
      if (projection) {
        const position = new google.maps.LatLng(attraction.latitude, attraction.longitude);
        const pixel = projection.fromLatLngToPoint(position);
        if (pixel) {
          const scale = Math.pow(2, map.getZoom() || 0);
          const worldPoint = new google.maps.Point(
            pixel.x * scale,
            pixel.y * scale
          );
          
          const mapDiv = map.getDiv();
          const mapBounds = mapDiv.getBoundingClientRect();
          const mapCenter = map.getCenter();
          const mapCenterPixel = projection.fromLatLngToPoint(mapCenter!);
          
          if (mapCenterPixel) {
            const mapCenterWorld = new google.maps.Point(
              mapCenterPixel.x * scale,
              mapCenterPixel.y * scale
            );
            
            const viewportX = mapBounds.left + mapBounds.width / 2 + (worldPoint.x - mapCenterWorld.x);
            const viewportY = mapBounds.top + mapBounds.height / 2 + (worldPoint.y - mapCenterWorld.y);
            
            console.log(`📍 Marker screen position for ${attraction.name}:`, { viewportX, viewportY });
            updatePosition(viewportX, viewportY);
          }
        }
      }
      
      handleMouseEnter(attraction.name);
    });

    // Mouse leave handler
    const mouseLeaveListener = marker.addListener('mouseout', () => {
      console.log(`🐭 Mouse out attraction: ${attraction.name}`);
      handleMouseLeave(attraction.name);
    });

    // Click handler
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
      google.maps.event.removeListener(clickListener);
      marker.setMap(null);
      cleanup();
    };
  }, [map, attraction, handleMouseEnter, handleMouseLeave, updatePosition, cleanup, onAttractionClick]);

  return (
    <AttractionHoverPortal
      attraction={attraction}
      isVisible={isHovered}
      position={hoverPosition}
      onWebsiteClick={onWebsiteClick}
    />
  );
};

export default AttractionCustomMarker;
