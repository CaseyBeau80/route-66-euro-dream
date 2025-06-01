
import React, { useCallback } from 'react';
import { Attraction } from './types';
import { useAttractionHover } from './hooks/useAttractionHover';
import DriveInHoverCard from './components/DriveInHoverCard';
import AttractionHoverCard from './AttractionHoverCard';
import { createDriveInIcon, createVintageRoute66Icon } from '../HiddenGems/VintageRoute66Icon';

interface AttractionCustomMarkerProps {
  attraction: Attraction;
  map: google.maps.Map;
  onAttractionClick: (attraction: Attraction) => void;
  onWebsiteClick: (website: string) => void;
}

const AttractionCustomMarker: React.FC<AttractionCustomMarkerProps> = ({
  attraction,
  map,
  onAttractionClick,
  onWebsiteClick
}) => {
  const {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup
  } = useAttractionHover();

  // Enhanced drive-in detection matching Hidden Gems logic
  const isDriveIn = React.useMemo(() => {
    const name = attraction.name.toLowerCase();
    const desc = attraction.description?.toLowerCase() || '';
    return name.includes('drive-in') || 
           name.includes('drive in') ||
           name.includes('theater') ||
           name.includes('theatre') ||
           desc.includes('drive-in') ||
           desc.includes('drive in') ||
           desc.includes('theater') ||
           desc.includes('theatre');
  }, [attraction.name, attraction.description]);

  // Create marker with appropriate icon
  React.useEffect(() => {
    if (!map) return;

    console.log(`🎯 Creating ${isDriveIn ? 'ENHANCED DRIVE-IN' : 'attraction'} marker for: ${attraction.name}`);

    const marker = new google.maps.Marker({
      position: { lat: Number(attraction.latitude), lng: Number(attraction.longitude) },
      map: map,
      icon: isDriveIn ? createDriveInIcon() : createVintageRoute66Icon(),
      title: `${isDriveIn ? 'Drive-In Theater: ' : 'Attraction: '}${attraction.name}`,
      zIndex: isDriveIn ? 35000 : 30000
    });

    // Enhanced hover detection for drive-ins
    const handleMouseOver = () => {
      console.log(`🐭 Mouse over ${isDriveIn ? 'DRIVE-IN' : 'attraction'}: ${attraction.name}`);
      const bounds = map.getBounds();
      if (!bounds) return;

      const mapDiv = map.getDiv();
      const mapRect = mapDiv.getBoundingClientRect();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const lat = Number(attraction.latitude);
      const lng = Number(attraction.longitude);

      const x = ((lng - sw.lng()) / (ne.lng() - sw.lng())) * mapRect.width;
      const y = ((ne.lat() - lat) / (ne.lat() - sw.lat())) * mapRect.height;

      const viewportX = mapRect.left + x;
      const viewportY = mapRect.top + y;

      updatePosition(viewportX, viewportY);
      handleMouseEnter(attraction.name);
    };

    const handleMouseOut = () => {
      console.log(`🐭 Mouse out ${isDriveIn ? 'DRIVE-IN' : 'attraction'}: ${attraction.name}`);
      setTimeout(() => {
        handleMouseLeave(attraction.name);
      }, 300);
    };

    // Add event listeners
    const mouseOverListener = marker.addListener('mouseover', handleMouseOver);
    const mouseOutListener = marker.addListener('mouseout', handleMouseOut);

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up ${isDriveIn ? 'DRIVE-IN' : 'attraction'} marker for: ${attraction.name}`);
      google.maps.event.removeListener(mouseOverListener);
      google.maps.event.removeListener(mouseOutListener);
      if (marker) {
        marker.setMap(null);
      }
      cleanup();
    };
  }, [map, attraction, isDriveIn, updatePosition, handleMouseEnter, handleMouseLeave, cleanup]);

  // Prevent hover card from disappearing when hovering over it
  const handleCardMouseEnter = useCallback(() => {
    console.log(`🐭 Mouse entered hover card for: ${attraction.name} - keeping card visible`);
    handleMouseEnter(attraction.name);
  }, [handleMouseEnter, attraction.name]);

  const handleCardMouseLeave = useCallback(() => {
    console.log(`🐭 Mouse left hover card for: ${attraction.name} - starting hide delay`);
    handleMouseLeave(attraction.name);
  }, [handleMouseLeave, attraction.name]);

  console.log(`🔍 AttractionCustomMarker render - ${attraction.name}:`, {
    isDriveIn,
    isHovered,
    shouldShowHover: isHovered
  });

  return (
    <>
      {/* Hover card - show when hovering, use drive-in card for drive-ins */}
      {isHovered && (
        isDriveIn ? (
          <DriveInHoverCard
            attraction={attraction}
            isVisible={true}
            position={hoverPosition}
            onWebsiteClick={onWebsiteClick}
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
          />
        ) : (
          <AttractionHoverCard
            attraction={attraction}
            isVisible={true}
            position={hoverPosition}
            onWebsiteClick={onWebsiteClick}
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
          />
        )
      )}
    </>
  );
};

export default AttractionCustomMarker;
