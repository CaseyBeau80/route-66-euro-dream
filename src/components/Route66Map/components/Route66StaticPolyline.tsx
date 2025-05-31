
import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { GlobalPolylineCleaner } from '../services/GlobalPolylineCleaner';

interface Route66StaticPolylineProps {
  map: google.maps.Map;
}

// Global singleton to prevent multiple instances
let globalPolylineInstance: google.maps.Polyline | null = null;
let globalCenterLineInstance: google.maps.Polyline | null = null;
let isGloballyRendering = false;
let renderingComponentId: string | null = null;

const Route66StaticPolyline: React.FC<Route66StaticPolylineProps> = ({ map }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const centerLineRef = useRef<google.maps.Polyline | null>(null);
  const isRenderingRef = useRef<boolean>(false);
  const componentIdRef = useRef<string>(`route66-${Date.now()}-${Math.random()}`);
  const hasRenderedRef = useRef<boolean>(false);
  
  const { waypoints, isLoading, error } = useSupabaseRoute66();

  useEffect(() => {
    // Immediate protection against multiple renders
    if (!map || isLoading || error || waypoints.length === 0) {
      console.log(`🚫 Route66StaticPolyline [${componentIdRef.current}]: Skipping render - missing requirements`);
      return;
    }

    // GLOBAL SINGLETON PROTECTION - only one instance can render at a time
    if (isGloballyRendering && renderingComponentId !== componentIdRef.current) {
      console.log(`🚫 Route66StaticPolyline [${componentIdRef.current}]: BLOCKED - another instance is already rendering [${renderingComponentId}]`);
      return;
    }

    // Component-level protection against re-renders
    if (isRenderingRef.current || hasRenderedRef.current) {
      console.log(`🚫 Route66StaticPolyline [${componentIdRef.current}]: BLOCKED - already rendered or rendering`);
      return;
    }

    console.log(`🗺️ Route66StaticPolyline [${componentIdRef.current}]: Starting EXCLUSIVE route rendering with NUCLEAR cleanup`);
    
    // Set global and local rendering flags
    isGloballyRendering = true;
    renderingComponentId = componentIdRef.current;
    isRenderingRef.current = true;

    // Use global cleaner for comprehensive cleanup
    GlobalPolylineCleaner.cleanupAllPolylines(map).then(() => {
      // Clear global instances after cleanup
      if (globalPolylineInstance) {
        console.log('🧹 Removing global main polyline');
        globalPolylineInstance.setMap(null);
        globalPolylineInstance = null;
      }
      if (globalCenterLineInstance) {
        console.log('🧹 Removing global center line');
        globalCenterLineInstance.setMap(null);
        globalCenterLineInstance = null;
      }

      // Clear local instances
      if (polylineRef.current) {
        console.log('🧹 Removing local main polyline');
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      if (centerLineRef.current) {
        console.log('🧹 Removing local center line');
        centerLineRef.current.setMap(null);
        centerLineRef.current = null;
      }

      // Convert Supabase waypoints to Google Maps format
      const route66Path = waypoints
        .sort((a, b) => a.sequence_order - b.sequence_order)
        .map(waypoint => ({
          lat: Number(waypoint.latitude),
          lng: Number(waypoint.longitude)
        }));

      console.log(`🛣️ Creating THE SINGLE Route 66 road [${componentIdRef.current}] with ${route66Path.length} waypoints`);

      // Create the main Route 66 polyline with dark asphalt appearance
      const route66Polyline = new google.maps.Polyline({
        path: route66Path,
        geodesic: true,
        strokeColor: '#2C2C2C', // Dark asphalt color
        strokeOpacity: 0.9,
        strokeWeight: 8,
        zIndex: 1000,
        clickable: false
      });

      // Set the polyline on the map and store globally
      route66Polyline.setMap(map);
      polylineRef.current = route66Polyline;
      globalPolylineInstance = route66Polyline;
      GlobalPolylineCleaner.registerPolyline(route66Polyline);

      // Create yellow dashed center line
      const centerLinePolyline = new google.maps.Polyline({
        path: route66Path,
        geodesic: true,
        strokeColor: '#FFD700', // Bright yellow for visibility
        strokeOpacity: 0,
        strokeWeight: 0,
        zIndex: 1001,
        clickable: false,
        icons: [{
          icon: {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            strokeColor: '#FFD700',
            strokeWeight: 4,
            scale: 1
          },
          offset: '0%',
          repeat: '40px'
        }]
      });

      centerLinePolyline.setMap(map);
      centerLineRef.current = centerLinePolyline;
      globalCenterLineInstance = centerLinePolyline;
      GlobalPolylineCleaner.registerPolyline(centerLinePolyline);

      console.log(`✅ THE SINGLE Route 66 polyline [${componentIdRef.current}] created successfully - NO OTHER ROUTES WILL RENDER`);

      // Mark as rendered to prevent future renders
      hasRenderedRef.current = true;

      // Fit map bounds after a delay
      setTimeout(() => {
        const bounds = new google.maps.LatLngBounds();
        route66Path.forEach(point => {
          bounds.extend(new google.maps.LatLng(point.lat, point.lng));
        });

        map.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50
        });

        console.log(`🎯 Map bounds fitted to THE SINGLE Route 66 [${componentIdRef.current}]`);
        
        // Release rendering locks
        isRenderingRef.current = false;
        isGloballyRendering = false;
        renderingComponentId = null;
      }, 500);
    });

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up THE SINGLE Route 66 polylines [${componentIdRef.current}]`);
      
      // Only clean up if this component owns the global instances
      if (renderingComponentId === componentIdRef.current) {
        if (globalPolylineInstance) {
          GlobalPolylineCleaner.unregisterPolyline(globalPolylineInstance);
          globalPolylineInstance.setMap(null);
          globalPolylineInstance = null;
        }
        if (globalCenterLineInstance) {
          GlobalPolylineCleaner.unregisterPolyline(globalCenterLineInstance);
          globalCenterLineInstance.setMap(null);
          globalCenterLineInstance = null;
        }
        isGloballyRendering = false;
        renderingComponentId = null;
      }
      
      if (polylineRef.current) {
        GlobalPolylineCleaner.unregisterPolyline(polylineRef.current);
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      if (centerLineRef.current) {
        GlobalPolylineCleaner.unregisterPolyline(centerLineRef.current);
        centerLineRef.current.setMap(null);
        centerLineRef.current = null;
      }
      
      isRenderingRef.current = false;
      hasRenderedRef.current = false;
    };
  }, [map, waypoints, isLoading, error]);

  return null;
};

export default Route66StaticPolyline;
