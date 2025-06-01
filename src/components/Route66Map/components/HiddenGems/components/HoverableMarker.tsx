
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { HiddenGem } from '../types';
import { createVintageRoute66Icon, createDriveInIcon } from '../VintageRoute66Icon';
import { useMarkerHover } from '../hooks/useMarkerHover';
import HoverCardPortal from './HoverCardPortal';
import HiddenGemClickableCard from '../HiddenGemClickableCard';

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
    cleanup,
    clearHover
  } = useMarkerHover();

  const markerRef = useRef<google.maps.Marker | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  // Enhanced icon selection for drive-ins
  const getMarkerIcon = useCallback(() => {
    const isDriveIn = gem.title.toLowerCase().includes('drive-in');
    if (isDriveIn) {
      console.log(`🎬 Creating enhanced drive-in icon for: ${gem.title}`);
      return createDriveInIcon();
    } else {
      return createVintageRoute66Icon();
    }
  }, [gem.title]);

  // Function to get marker screen position
  const getMarkerScreenPosition = useCallback(() => {
    if (!map || !markerRef.current) return null;

    const position = markerRef.current.getPosition();
    if (!position) return null;

    const mapDiv = map.getDiv();
    const mapRect = mapDiv.getBoundingClientRect();

    const bounds = map.getBounds();
    if (!bounds) return null;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const lat = position.lat();
    const lng = position.lng();

    const x = ((lng - sw.lng()) / (ne.lng() - sw.lng())) * mapRect.width;
    const y = ((ne.lat() - lat) / (ne.lat() - sw.lat())) * mapRect.height;

    const viewportX = mapRect.left + x;
    const viewportY = mapRect.top + y;

    return { x: viewportX, y: viewportY };
  }, [map, gem.title]);

  // Prevent hover card from disappearing when hovering over it
  const handleCardMouseEnter = useCallback(() => {
    console.log(`🐭 Mouse entered hover card for: ${gem.title}`);
    handleMouseEnter(gem.title);
  }, [handleMouseEnter, gem.title]);

  const handleCardMouseLeave = useCallback(() => {
    console.log(`🐭 Mouse left hover card for: ${gem.title}`);
    handleMouseLeave(gem.title);
  }, [handleMouseLeave, gem.title]);

  // Create marker only once
  useEffect(() => {
    if (!map || markerRef.current) return;

    const isDriveIn = gem.title.toLowerCase().includes('drive-in');
    console.log(`🎯 Creating ${isDriveIn ? 'ENHANCED DRIVE-IN' : 'hidden gem'} marker for: ${gem.title}`);

    const marker = new google.maps.Marker({
      position: { lat: Number(gem.latitude), lng: Number(gem.longitude) },
      map: map,
      icon: getMarkerIcon(),
      title: `${isDriveIn ? 'Drive-In Theater: ' : 'Hidden Gem: '}${gem.title}`,
      zIndex: isDriveIn ? 35000 : 30000
    });

    markerRef.current = marker;

    // Mouse event handlers
    const handleMouseOver = () => {
      if (!isClicked) { // Only show hover if not clicked
        console.log(`🐭 Mouse over ${isDriveIn ? 'DRIVE-IN' : 'gem'}: ${gem.title}`);
        const screenPos = getMarkerScreenPosition();
        if (screenPos) {
          updatePosition(screenPos.x, screenPos.y);
          handleMouseEnter(gem.title);
        }
      }
    };

    const handleMouseOut = () => {
      if (!isClicked) { // Only hide hover if not clicked
        console.log(`🐭 Mouse out ${isDriveIn ? 'DRIVE-IN' : 'gem'}: ${gem.title}`);
        // Add a small delay to allow mouse to move to the card
        setTimeout(() => {
          handleMouseLeave(gem.title);
        }, 100);
      }
    };

    const handleClick = () => {
      console.log(`🎯 Clicked ${isDriveIn ? 'DRIVE-IN' : 'gem'}: ${gem.title}`);
      
      // Calculate click position
      const screenPos = getMarkerScreenPosition();
      if (screenPos) {
        setClickPosition(screenPos);
      }
      
      setIsClicked(true);
      clearHover(); // Clear hover state on click
      onMarkerClick(gem);
    };

    // Add event listeners
    const mouseOverListener = marker.addListener('mouseover', handleMouseOver);
    const mouseOutListener = marker.addListener('mouseout', handleMouseOut);
    const clickListener = marker.addListener('click', handleClick);

    listenersRef.current = [mouseOverListener, mouseOutListener, clickListener];

    // Update position when map changes
    const updateMarkerPosition = () => {
      if (isHovered && !isClicked) {
        const screenPos = getMarkerScreenPosition();
        if (screenPos) {
          updatePosition(screenPos.x, screenPos.y);
        }
      }
    };

    const boundsListener = map.addListener('bounds_changed', updateMarkerPosition);
    const zoomListener = map.addListener('zoom_changed', updateMarkerPosition);

    listenersRef.current.push(boundsListener, zoomListener);

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up ${isDriveIn ? 'DRIVE-IN' : 'hidden gem'} marker for: ${gem.title}`);
      
      listenersRef.current.forEach(listener => {
        google.maps.event.removeListener(listener);
      });
      listenersRef.current = [];

      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }

      cleanup();
    };
  }, [map, gem.latitude, gem.longitude, gem.title, getMarkerIcon, isClicked]);

  const handleCloseClickableCard = () => {
    setIsClicked(false);
  };

  return (
    <>
      {/* Hover card - only show when hovering and not clicked */}
      {!isClicked && (
        <HoverCardPortal
          gem={gem}
          isVisible={isHovered}
          position={hoverPosition}
          onWebsiteClick={onWebsiteClick}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        />
      )}

      {/* Clickable card - show when clicked */}
      <HiddenGemClickableCard
        gem={gem}
        isVisible={isClicked}
        position={clickPosition}
        onClose={handleCloseClickableCard}
        onWebsiteClick={onWebsiteClick}
      />
    </>
  );
};

export default HoverableMarker;
