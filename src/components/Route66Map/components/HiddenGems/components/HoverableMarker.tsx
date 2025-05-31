
import React from 'react';
import { HiddenGem } from '../types';
import { createVintageRoute66Icon } from '../VintageRoute66Icon';
import { useMarkerHover } from '../hooks/useMarkerHover';
import HoverCardPortal from './HoverCardPortal';

interface HoverableMarkerProps {
  gem: HiddenGem;
  onMarkerClick: (gem: HiddenGem) => void;
  onWebsiteClick: (website: string) => void;
  map: google.maps.Map;
}

const HoverableMarker: React.FC<HoverableMarkerProps> = ({
  gem,
  onMarkerClick,
  onWebsiteClick,
  map
}) => {
  const {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup
  } = useMarkerHover();

  React.useEffect(() => {
    if (!map) return;

    console.log(`🎯 Creating hoverable marker for: ${gem.title}`);

    // Create the visual marker
    const marker = new google.maps.Marker({
      position: { lat: Number(gem.latitude), lng: Number(gem.longitude) },
      map: map,
      icon: createVintageRoute66Icon(),
      title: `Hidden Gem: ${gem.title}`,
      zIndex: 1000
    });

    // Function to get marker screen position
    const getMarkerScreenPosition = () => {
      const projection = map.getProjection();
      if (!projection) return null;

      const position = marker.getPosition();
      if (!position) return null;

      // Get the map div and its bounds
      const mapDiv = map.getDiv();
      const mapRect = mapDiv.getBoundingClientRect();

      // Get map bounds
      const bounds = map.getBounds();
      if (!bounds) return null;

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      // Calculate relative position within the map viewport
      const lat = position.lat();
      const lng = position.lng();

      // Convert to pixel coordinates relative to map container
      const x = ((lng - sw.lng()) / (ne.lng() - sw.lng())) * mapRect.width;
      const y = ((ne.lat() - lat) / (ne.lat() - sw.lat())) * mapRect.height;

      // Convert to viewport coordinates
      const viewportX = mapRect.left + x;
      const viewportY = mapRect.top + y;

      console.log(`📍 Marker screen position for ${gem.title}:`, { viewportX, viewportY });

      return { x: viewportX, y: viewportY };
    };

    // Mouse event handlers
    const handleMouseOver = () => {
      console.log(`🐭 Mouse over gem: ${gem.title}`);
      const screenPos = getMarkerScreenPosition();
      if (screenPos) {
        updatePosition(screenPos.x, screenPos.y);
        handleMouseEnter();
      }
    };

    const handleMouseOut = () => {
      console.log(`🐭 Mouse out gem: ${gem.title}`);
      handleMouseLeave();
    };

    const handleClick = () => {
      console.log(`🎯 Clicked gem: ${gem.title}`);
      onMarkerClick(gem);
    };

    // Add event listeners
    marker.addListener('mouseover', handleMouseOver);
    marker.addListener('mouseout', handleMouseOut);
    marker.addListener('click', handleClick);

    // Update position when map changes
    const updateMarkerPosition = () => {
      if (isHovered) {
        const screenPos = getMarkerScreenPosition();
        if (screenPos) {
          updatePosition(screenPos.x, screenPos.y);
        }
      }
    };

    const boundsListener = map.addListener('bounds_changed', updateMarkerPosition);
    const zoomListener = map.addListener('zoom_changed', updateMarkerPosition);

    // Initial position update
    setTimeout(() => {
      const screenPos = getMarkerScreenPosition();
      if (screenPos) {
        updatePosition(screenPos.x, screenPos.y);
      }
    }, 100);

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up marker for: ${gem.title}`);
      marker.setMap(null);
      google.maps.event.removeListener(boundsListener);
      google.maps.event.removeListener(zoomListener);
      cleanup();
    };
  }, [gem, map, onMarkerClick, handleMouseEnter, handleMouseLeave, updatePosition, cleanup, isHovered]);

  return (
    <HoverCardPortal
      gem={gem}
      isVisible={isHovered}
      position={hoverPosition}
      onWebsiteClick={onWebsiteClick}
    />
  );
};

export default HoverableMarker;
