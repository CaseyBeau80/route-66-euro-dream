
import React, { useEffect, useRef, useState } from 'react';
import UltraSmoothRouteRenderer from '../services/UltraSmoothRouteRenderer';
import DestinationCitiesContainer from './DestinationCitiesContainer';
import AttractionsContainer from './AttractionsContainer';
import HiddenGemsContainer from './HiddenGemsContainer';
import StateHighlighting from './StateHighlighting';
import { mapBounds, mapRestrictions } from '../config/MapConfig';
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

    console.log('🗺️ MapCore: Initializing Google Map with continental US view');

    try {
      const map = new google.maps.Map(containerRef.current, {
        zoom: 3, // Reduced zoom to show continental US
        center: { lat: 39.0, lng: -98.0 }, // Centered on continental US
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: 'greedy',
        zoomControl: true,
        mapTypeControl: false, // Disable map type control (Map/Satellite buttons)
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        clickableIcons: false,
        // Apply boundary restrictions for continental US
        restriction: mapRestrictions,
        minZoom: 3, // Minimum zoom to see the full continental US
        maxZoom: 10, // Maximum zoom for detailed viewing
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

      console.log('✅ Google Map initialized with continental US bounds:', mapBounds);
      onMapLoad(map);
      onMapReady();

      // Add click listener
      map.addListener('click', onMapClick);

      // Log boundary restriction status
      console.log('🌎 Continental US viewport enabled with bounds:', {
        bounds: mapBounds,
        strictBounds: mapRestrictions.strictBounds,
        minZoom: 3,
        maxZoom: 10
      });

    } catch (error) {
      console.error('❌ Error initializing Google Map:', error);
    }
  }, [mapInitialized, onMapLoad, onMapClick, onMapReady]);

  console.log('🗺️ MapCore render:', {
    mapInitialized,
    isMapReady,
    hasMap: !!mapRef.current,
    visibleWaypoints: visibleWaypoints.length,
    continentalUSView: true
  });

  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Orange State Highlighting */}
      {mapRef.current && isMapReady && (
        <StateHighlighting map={mapRef.current} />
      )}
      
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
