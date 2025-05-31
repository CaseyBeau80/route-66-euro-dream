
import React, { useEffect, useRef, useState } from 'react';
import UltraSmoothRouteRenderer from '../services/UltraSmoothRouteRenderer';
import DestinationCitiesContainer from './DestinationCitiesContainer';
import AttractionsContainer from './AttractionsContainer';
import HiddenGemsContainer from './HiddenGemsContainer';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface MapCoreProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  isMapReady: boolean;
  visibleWaypoints: Route66Waypoint[];
  onMapLoad: (map: google.maps.Map) => void;
  onMapClick: () => void;
  onMapReady: () => void;
  onDestinationClick: (destination: Route66Waypoint) => void;
  onAttractionClick: (attraction: Route66Waypoint) => void;
}

const MapCore: React.FC<MapCoreProps> = ({
  mapRef,
  isMapReady,
  visibleWaypoints,
  onMapLoad,
  onMapClick,
  onMapReady,
  onDestinationClick,
  onAttractionClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (mapInitialized || !containerRef.current || mapRef.current) {
      return;
    }

    console.log('🗺️ MapCore: Initializing Google Map');

    try {
      const map = new google.maps.Map(containerRef.current, {
        zoom: 5,
        center: { lat: 35.2271, lng: -101.8313 }, // Center of Route 66
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: 'greedy',
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        clickableIcons: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      mapRef.current = map;
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

    } catch (error) {
      console.error('❌ Error initializing Google Map:', error);
    }
  }, [mapInitialized, onMapLoad, onMapClick, onMapReady]);

  console.log('🗺️ MapCore render:', {
    mapInitialized,
    isMapReady,
    hasMap: !!mapRef.current,
    visibleWaypoints: visibleWaypoints.length
  });

  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Route Renderer - Force re-mount when map is ready */}
      {mapRef.current && isMapReady && (
        <UltraSmoothRouteRenderer
          key={`route-${isMapReady}-${mapRef.current ? 'map-ready' : 'no-map'}`}
          map={mapRef.current}
          isMapReady={isMapReady}
        />
      )}

      {/* Destination Markers */}
      {mapRef.current && isMapReady && (
        <DestinationCitiesContainer
          map={mapRef.current}
          waypoints={visibleWaypoints}
          onDestinationClick={onDestinationClick}
        />
      )}

      {/* Attraction Markers */}
      {mapRef.current && isMapReady && (
        <AttractionsContainer
          map={mapRef.current}
          waypoints={visibleWaypoints}
          onAttractionClick={onAttractionClick}
        />
      )}

      {/* Hidden Gems */}
      {mapRef.current && isMapReady && (
        <HiddenGemsContainer map={mapRef.current} />
      )}
    </div>
  );
};

export default MapCore;
