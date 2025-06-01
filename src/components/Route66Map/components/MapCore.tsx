
import React, { useEffect, useRef, useState } from 'react';
import UltraSmoothRouteRenderer from '../services/UltraSmoothRouteRenderer';
import DestinationCitiesContainer from './DestinationCitiesContainer';
import AttractionsContainer from './AttractionsContainer';
import HiddenGemsContainer from './HiddenGemsContainer';
import StateHighlighting from './StateHighlighting';
import ScrollZoomHint from './ScrollZoomHint';
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
  const [showScrollHint, setShowScrollHint] = useState(false);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (mapInitialized || !containerRef.current || mapRef.current) {
      return;
    }

    console.log('🗺️ MapCore: Initializing Google Map with continental US view and custom scroll handling');

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
        scrollwheel: false, // Disable default scroll wheel zoom
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

      // Custom scroll handling for Ctrl+Scroll zoom
      const handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
          // Allow zoom when Ctrl (or Cmd on Mac) is pressed
          e.preventDefault();
          const currentZoom = map.getZoom() || 3;
          const delta = e.deltaY > 0 ? -0.5 : 0.5;
          const newZoom = Math.max(3, Math.min(10, currentZoom + delta));
          map.setZoom(newZoom);
          console.log('🔍 Ctrl+Scroll zoom to:', newZoom);
        } else {
          // Show hint when scrolling without Ctrl
          e.preventDefault();
          setShowScrollHint(true);
          
          // Clear existing timeout
          if (hintTimeoutRef.current) {
            clearTimeout(hintTimeoutRef.current);
          }
          
          // Hide hint after 2 seconds
          hintTimeoutRef.current = setTimeout(() => {
            setShowScrollHint(false);
          }, 2000);
          
          console.log('📜 Scroll without Ctrl detected, showing hint');
        }
      };

      // Add wheel event listener to the map container
      const mapDiv = containerRef.current;
      if (mapDiv) {
        mapDiv.addEventListener('wheel', handleWheel, { passive: false });
      }

      console.log('✅ Google Map initialized with continental US bounds and custom scroll handling:', mapBounds);
      onMapLoad(map);
      onMapReady();

      // Add click listener
      map.addListener('click', onMapClick);

      // Log boundary restriction status
      console.log('🌎 Continental US viewport enabled with Ctrl+Scroll zoom:', {
        bounds: mapBounds,
        strictBounds: mapRestrictions.strictBounds,
        minZoom: 3,
        maxZoom: 10,
        scrollwheel: false,
        ctrlScrollEnabled: true
      });

      // Cleanup function for wheel event listener
      return () => {
        if (mapDiv) {
          mapDiv.removeEventListener('wheel', handleWheel);
        }
        if (hintTimeoutRef.current) {
          clearTimeout(hintTimeoutRef.current);
        }
      };

    } catch (error) {
      console.error('❌ Error initializing Google Map:', error);
    }
  }, [mapInitialized, onMapLoad, onMapClick, onMapReady]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
    };
  }, []);

  console.log('🗺️ MapCore render:', {
    mapInitialized,
    isMapReady,
    hasMap: !!mapRef.current,
    visibleWaypoints: visibleWaypoints.length,
    continentalUSView: true,
    ctrlScrollZoom: true,
    showScrollHint
  });

  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Scroll Zoom Hint Overlay */}
      <ScrollZoomHint show={showScrollHint} />
      
      {/* Permanent zoom instruction indicator */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-route66-vintage-yellow">⌨️</span>
          <span>Ctrl + scroll to zoom</span>
        </div>
      </div>
      
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
