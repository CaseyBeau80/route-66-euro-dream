
import React, { useEffect, useRef } from 'react';
import { RoutePolylineRenderer } from '../services/RoutePolylineRenderer';
import { RouteMarkersManager } from '../services/RouteMarkersManager';
import { MapBoundsHelper } from '../services/MapBoundsHelper';
import { RouteCleanupHelper } from '../services/RouteCleanupHelper';

interface SimpleRoute66ServiceProps {
  map: google.maps.Map;
}

const SimpleRoute66Service: React.FC<SimpleRoute66ServiceProps> = ({ map }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const startMarkerRef = useRef<google.maps.Marker | null>(null);
  const endMarkerRef = useRef<google.maps.Marker | null>(null);
  const initializationRef = useRef<boolean>(false);

  useEffect(() => {
    if (!map) {
      console.log('⚠️ SimpleRoute66Service: Map not available yet');
      return;
    }

    // Prevent multiple initializations
    if (initializationRef.current) {
      console.log('⚠️ SimpleRoute66Service: Route already initialized, skipping');
      return;
    }

    console.log('🚗 SimpleRoute66Service: Initializing Route 66 rendering service');
    initializationRef.current = true;

    // Small delay to ensure map is fully ready
    setTimeout(() => {
      renderRoute66();
    }, 500);

    function renderRoute66() {
      console.log('🎯 SimpleRoute66Service: Starting Route 66 rendering');

      // Clean up any existing elements first
      RouteCleanupHelper.cleanup({
        polylineRef,
        startMarkerRef,
        endMarkerRef
      });

      // Create the route polyline
      const routePath = RoutePolylineRenderer.createPolyline({
        map,
        polylineRef
      });

      if (!routePath) {
        console.error('❌ Failed to create route path');
        return;
      }

      // Verify polyline visibility
      RoutePolylineRenderer.verifyPolylineVisibility(polylineRef);

      // Add click listener to polyline
      RoutePolylineRenderer.addClickListener(polylineRef, map);

      // Create start and end markers
      RouteMarkersManager.createStartEndMarkers({
        map,
        routePath,
        startMarkerRef,
        endMarkerRef
      });

      // Fit map bounds to show the entire route
      MapBoundsHelper.fitMapToRoute(map, routePath);

      console.log('✅ SimpleRoute66Service: Route 66 initialization complete');
    }

    // Cleanup function
    return () => {
      console.log('🧹 SimpleRoute66Service: Component unmounting - cleaning up Route 66 service');
      RouteCleanupHelper.cleanup({
        polylineRef,
        startMarkerRef,
        endMarkerRef
      });
      initializationRef.current = false;
    };
  }, [map]);

  return null;
};

export default SimpleRoute66Service;
