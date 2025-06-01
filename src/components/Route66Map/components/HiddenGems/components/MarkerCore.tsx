
import React, { useEffect, useRef } from 'react';
import { HiddenGem } from '../types';
import { getMarkerIcon, getMarkerTitle, getMarkerZIndex } from './MarkerIcon';
import { createMarkerEventHandlers } from './MarkerEventHandlers';

interface MarkerCoreProps {
  gem: HiddenGem;
  map: google.maps.Map;
  isClicked: boolean;
  updatePosition: (x: number, y: number) => void;
  handleMouseEnter: (gemTitle: string) => void;
  handleMouseLeave: (gemTitle: string) => void;
  clearHover: () => void;
  cleanup: () => void;
  onMarkerClick: (gem: HiddenGem) => void;
  setIsClicked: (clicked: boolean) => void;
  setClickPosition: (position: { x: number; y: number }) => void;
}

const MarkerCore: React.FC<MarkerCoreProps> = ({
  gem,
  map,
  isClicked,
  updatePosition,
  handleMouseEnter,
  handleMouseLeave,
  clearHover,
  cleanup,
  onMarkerClick,
  setIsClicked,
  setClickPosition
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

  useEffect(() => {
    if (!map || markerRef.current) return;

    const isDriveIn = gem.title.toLowerCase().includes('drive-in');
    console.log(`🎯 Creating ${isDriveIn ? 'ENHANCED DRIVE-IN' : 'hidden gem'} marker for: ${gem.title}`);

    const marker = new google.maps.Marker({
      position: { lat: Number(gem.latitude), lng: Number(gem.longitude) },
      map: map,
      icon: getMarkerIcon(gem.title),
      title: getMarkerTitle(gem.title),
      zIndex: getMarkerZIndex(gem.title)
    });

    markerRef.current = marker;

    const eventHandlers = createMarkerEventHandlers({
      gem,
      map,
      marker,
      isClicked,
      updatePosition,
      handleMouseEnter,
      handleMouseLeave,
      clearHover,
      onMarkerClick,
      setIsClicked,
      setClickPosition
    });

    // Add event listeners
    const mouseOverListener = marker.addListener('mouseover', eventHandlers.handleMouseOver);
    const mouseOutListener = marker.addListener('mouseout', eventHandlers.handleMouseOut);
    const clickListener = marker.addListener('click', eventHandlers.handleClick);

    listenersRef.current = [mouseOverListener, mouseOutListener, clickListener];

    // Update position when map changes
    const boundsListener = map.addListener('bounds_changed', eventHandlers.updateMarkerPosition);
    const zoomListener = map.addListener('zoom_changed', eventHandlers.updateMarkerPosition);

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
  }, [map, gem.latitude, gem.longitude, gem.title, isClicked]);

  return null;
};

export default MarkerCore;
