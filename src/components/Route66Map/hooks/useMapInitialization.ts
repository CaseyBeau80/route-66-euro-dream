
import { useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

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

    console.log('🗺️ MapCore: Initializing Google Map with device-aware gesture handling');

    // Use device-aware gesture handling
    // Desktop: 'cooperative' requires Ctrl+scroll to zoom
    // Mobile: 'greedy' allows normal touch gestures
    const gestureHandling = isMobile ? 'greedy' : 'cooperative';

    try {
      const map = new google.maps.Map(containerRef, {
        zoom: 4,
        center: { lat: 39.0, lng: -98.0 },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling,
        zoomControl: false, // Disable default zoom controls since we have custom ones
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        clickableIcons: false,
        scrollwheel: true, // Enable scroll wheel zoom
        restriction: mapRestrictions,
        minZoom: 3,
        maxZoom: 18,
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

      console.log(`✅ Google Map initialized with ${gestureHandling} gesture handling (${isMobile ? 'mobile' : 'desktop'})`);
      onMapLoad(map);
      onMapReady();

      // Add click listener
      map.addListener('click', onMapClick);

      return map;
    } catch (error) {
      console.error('❌ Error initializing Google Map:', error);
      return null;
    }
  }, [mapInitialized, onMapLoad, onMapReady, onMapClick, isMobile]);

  return {
    mapInitialized,
    initializeMap
  };
};
