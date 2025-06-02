
import React, { useEffect, useRef } from 'react';
import { DriveInData } from './hooks/useDriveInsData';
import { getDriveInMarkerIcon, getDriveInMarkerTitle, getDriveInMarkerZIndex } from './DriveInMarkerIcon';
import { createDriveInMarkerEventHandlers } from './DriveInMarkerEventHandlers';

interface DriveInMarkerCoreProps {
  driveIn: DriveInData;
  map: google.maps.Map;
  updatePosition: (x: number, y: number) => void;
  handleMouseEnter: (driveInName: string) => void;
  handleMouseLeave: (driveInName: string) => void;
  cleanup: () => void;
}

const DriveInMarkerCore: React.FC<DriveInMarkerCoreProps> = ({
  driveIn,
  map,
  updatePosition,
  handleMouseEnter,
  handleMouseLeave,
  cleanup
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

  useEffect(() => {
    if (!map || markerRef.current) return;

    console.log(`🎬 Creating ENHANCED DRIVE-IN marker for: ${driveIn.name} (${driveIn.status})`);

    const marker = new google.maps.Marker({
      position: { lat: Number(driveIn.latitude), lng: Number(driveIn.longitude) },
      map: map,
      icon: getDriveInMarkerIcon(driveIn.status),
      title: getDriveInMarkerTitle(driveIn),
      zIndex: getDriveInMarkerZIndex(driveIn.status)
    });

    markerRef.current = marker;

    const eventHandlers = createDriveInMarkerEventHandlers({
      driveIn,
      map,
      marker,
      updatePosition,
      handleMouseEnter,
      handleMouseLeave
    });

    // Add only hover event listeners
    const mouseOverListener = marker.addListener('mouseover', eventHandlers.handleMouseOver);
    const mouseOutListener = marker.addListener('mouseout', eventHandlers.handleMouseOut);

    listenersRef.current = [mouseOverListener, mouseOutListener];

    // Update position when map changes
    const boundsListener = map.addListener('bounds_changed', eventHandlers.updateMarkerPosition);
    const zoomListener = map.addListener('zoom_changed', eventHandlers.updateMarkerPosition);

    listenersRef.current.push(boundsListener, zoomListener);

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up DRIVE-IN marker for: ${driveIn.name}`);
      
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
  }, [map, driveIn.latitude, driveIn.longitude, driveIn.name]);

  return null;
};

export default DriveInMarkerCore;
