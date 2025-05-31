
import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';

interface SingleRouteManagerProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

// Global singleton to absolutely prevent multiple route instances
let globalSingleRoute: google.maps.Polyline | null = null;
let globalCenterLine: google.maps.Polyline | null = null;
let isGlobalRouteActive = false;
let activeManagerId: string | null = null;

const SingleRouteManager: React.FC<SingleRouteManagerProps> = ({ map, isMapReady }) => {
  const managerId = useRef(`single-manager-${Date.now()}-${Math.random()}`);
  const hasInitialized = useRef(false);
  const { waypoints, isLoading, error } = useSupabaseRoute66();

  useEffect(() => {
    // Absolute protection against multiple managers
    if (!map || !isMapReady || isLoading || error || waypoints.length === 0) {
      return;
    }

    // If another manager is already active, block this one completely
    if (isGlobalRouteActive && activeManagerId !== managerId.current) {
      console.log(`🚫 SingleRouteManager [${managerId.current}]: BLOCKED - route already exists by [${activeManagerId}]`);
      return;
    }

    // If this manager has already initialized, don't do it again
    if (hasInitialized.current) {
      console.log(`🚫 SingleRouteManager [${managerId.current}]: Already initialized, skipping`);
      return;
    }

    console.log(`🛣️ SingleRouteManager [${managerId.current}]: Creating THE ONLY Route 66 road`);
    
    // Mark as active globally
    isGlobalRouteActive = true;
    activeManagerId = managerId.current;
    hasInitialized.current = true;

    // Nuclear cleanup first - remove any existing polylines
    if (globalSingleRoute) {
      console.log('🧹 Nuclear cleanup: removing existing main route');
      globalSingleRoute.setMap(null);
      globalSingleRoute = null;
    }
    if (globalCenterLine) {
      console.log('🧹 Nuclear cleanup: removing existing center line');
      globalCenterLine.setMap(null);
      globalCenterLine = null;
    }

    // Convert waypoints to path
    const routePath = waypoints
      .sort((a, b) => a.sequence_order - b.sequence_order)
      .map(waypoint => ({
        lat: Number(waypoint.latitude),
        lng: Number(waypoint.longitude)
      }));

    console.log(`🛣️ Creating THE SINGLE Route 66 with ${routePath.length} waypoints`);

    // Create main road polyline
    globalSingleRoute = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#2C2C2C',
      strokeOpacity: 0.9,
      strokeWeight: 8,
      zIndex: 1000,
      clickable: false
    });

    // Create center line
    globalCenterLine = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#FFD700',
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

    // Add to map
    globalSingleRoute.setMap(map);
    globalCenterLine.setMap(map);

    console.log(`✅ THE SINGLE Route 66 created successfully by [${managerId.current}]`);

    // Fit bounds
    setTimeout(() => {
      const bounds = new google.maps.LatLngBounds();
      routePath.forEach(point => {
        bounds.extend(new google.maps.LatLng(point.lat, point.lng));
      });
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }, 500);

    // Cleanup function
    return () => {
      // Only cleanup if this manager created the route
      if (activeManagerId === managerId.current) {
        console.log(`🧹 SingleRouteManager [${managerId.current}]: Cleaning up THE SINGLE route`);
        
        if (globalSingleRoute) {
          globalSingleRoute.setMap(null);
          globalSingleRoute = null;
        }
        if (globalCenterLine) {
          globalCenterLine.setMap(null);
          globalCenterLine = null;
        }
        
        isGlobalRouteActive = false;
        activeManagerId = null;
      }
      hasInitialized.current = false;
    };
  }, [map, isMapReady, waypoints, isLoading, error]);

  return null;
};

export default SingleRouteManager;
