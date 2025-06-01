
import { useState, useCallback } from 'react';
import { mapBounds, mapRestrictions } from '../config/MapConfig';

interface UseMapInitializationProps {
  onMapLoad: (map: google.maps.Map) => void;
  onMapReady: () => void;
  onMapClick: () => void;
}

export const useMapInitialization = ({
  onMapLoad,
  onMapReady,
  onMapClick
}: UseMapInitializationProps) => {
  const [mapInitialized, setMapInitialized] = useState(false);

  const initializeMap = useCallback((containerRef: HTMLDivElement) => {
    if (mapInitialized) {
      console.log('⚠️ Map already initialized, skipping');
      return null;
    }

    // Check if Google Maps API is available
    if (!window.google || !window.google.maps) {
      console.log('⏳ Google Maps API not yet available, waiting...');
      return null;
    }

    console.log('🗺️ MapCore: Initializing Google Map with continental US view');

    try {
      const map = new google.maps.Map(containerRef, {
        zoom: 4,
        center: { lat: 39.0, lng: -98.0 },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: 'greedy',
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        clickableIcons: false,
        scrollwheel: false, // Disable default scrollwheel initially
        restriction: mapRestrictions,
        minZoom: 3,
        maxZoom: 10,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      setMapInitialized(true);

      // Add portal root for hover cards
      if (!document.getElementById('map-portal-root')) {
        const portalRoot = document.createElement('div');
        portalRoot.id = 'map-portal-root';
        portalRoot.style.position = 'fixed';
        portalRoot.style.top = '0';
        portalRoot.style.left = '0';
        portalRoot.style.pointerEvents = 'none';
        portalRoot.style.zIndex = '100000';
        document.body.appendChild(portalRoot);
        console.log('📍 Created map portal root for hover cards');
      }

      console.log('✅ Google Map initialized successfully');
      onMapLoad(map);
      onMapReady();

      // Add click listener
      map.addListener('click', onMapClick);

      return map;
    } catch (error) {
      console.error('❌ Error initializing Google Map:', error);
      return null;
    }
  }, [mapInitialized, onMapLoad, onMapReady, onMapClick]);

  return {
    mapInitialized,
    initializeMap
  };
};
