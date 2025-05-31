
import React, { useEffect, useRef } from 'react';
import { HiddenGem } from '../types';
import { VintageRoute66Icon } from '../VintageRoute66Icon';
import HoverCardPortal from './HoverCardPortal';
import { useHiddenGemHoverContext } from '../contexts/HiddenGemHoverContext';

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
  const markerRef = useRef<google.maps.Marker | null>(null);
  const { activeGem, hoverPosition, setActiveGem } = useHiddenGemHoverContext();

  // Check if this gem is currently being hovered
  const isHovered = activeGem === gem.title;

  useEffect(() => {
    if (!map || !gem) return;

    console.log(`💎 Creating hidden gem marker for: ${gem.title}`);

    // Create marker
    const marker = new google.maps.Marker({
      position: { lat: gem.latitude, lng: gem.longitude },
      map: map,
      icon: VintageRoute66Icon.create(),
      title: gem.title,
      zIndex: 20000,
      optimized: false
    });

    markerRef.current = marker;

    // Mouse enter event with improved hover management
    const mouseEnterListener = marker.addListener('mouseover', (event: google.maps.MapMouseEvent) => {
      console.log(`💎 Mouse enter on hidden gem: ${gem.title}`);
      
      if (event.domEvent) {
        const mouseEvent = event.domEvent as MouseEvent;
        setActiveGem(gem.title, { x: mouseEvent.clientX + 10, y: mouseEvent.clientY - 10 });
      }
    });

    // Mouse leave event with improved hover management
    const mouseLeaveListener = marker.addListener('mouseout', () => {
      console.log(`💎 Mouse leave on hidden gem: ${gem.title}`);
      setActiveGem(null);
    });

    // Mouse move event for position updates
    const mouseMoveListener = marker.addListener('mousemove', (event: google.maps.MapMouseEvent) => {
      if (event.domEvent && isHovered) {
        const mouseEvent = event.domEvent as MouseEvent;
        setActiveGem(gem.title, { x: mouseEvent.clientX + 10, y: mouseEvent.clientY - 10 });
      }
    });

    // Click event
    const clickListener = marker.addListener('click', () => {
      console.log(`💎 Hidden gem clicked: ${gem.title}`);
      onMarkerClick(gem);
    });

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up hidden gem marker: ${gem.title}`);
      google.maps.event.removeListener(mouseEnterListener);
      google.maps.event.removeListener(mouseLeaveListener);
      google.maps.event.removeListener(mouseMoveListener);
      google.maps.event.removeListener(clickListener);
      marker.setMap(null);
    };
  }, [map, gem, onMarkerClick, setActiveGem, isHovered]);

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
