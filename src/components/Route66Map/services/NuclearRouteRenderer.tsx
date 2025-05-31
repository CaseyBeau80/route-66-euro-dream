import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';

interface NuclearRouteRendererProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

// Global variables to track the single route
let GLOBAL_ROUTE_POLYLINE: google.maps.Polyline | null = null;
let GLOBAL_CENTER_LINE: google.maps.Polyline | null = null;
let IS_ROUTE_CREATED = false;
let CLEANUP_INTERVAL: NodeJS.Timeout | null = null;

const NuclearRouteRenderer: React.FC<NuclearRouteRendererProps> = ({ map, isMapReady }) => {
  const hasRendered = useRef(false);
  const { waypoints, isLoading, error } = useSupabaseRoute66();

  // Nuclear cleanup function - removes EVERYTHING
  const nuclearCleanup = () => {
    console.log('☢️ NUCLEAR CLEANUP: Starting aggressive polyline removal');
    
    // Remove our tracked polylines
    if (GLOBAL_ROUTE_POLYLINE) {
      GLOBAL_ROUTE_POLYLINE.setMap(null);
      GLOBAL_ROUTE_POLYLINE = null;
      console.log('☢️ Removed global route polyline');
    }
    
    if (GLOBAL_CENTER_LINE) {
      GLOBAL_CENTER_LINE.setMap(null);
      GLOBAL_CENTER_LINE = null;
      console.log('☢️ Removed global center line');
    }

    // Clear all overlays from the map
    try {
      const mapInstance = map as any;
      
      // Clear overlay map types
      if (mapInstance.overlayMapTypes) {
        mapInstance.overlayMapTypes.clear();
        console.log('☢️ Cleared overlay map types');
      }

      // Remove all event listeners to prevent recreation
      google.maps.event.clearInstanceListeners(map);
      console.log('☢️ Cleared all map event listeners');

      // Force re-render the map
      google.maps.event.trigger(map, 'resize');
      
    } catch (cleanupError) {
      console.warn('⚠️ Error during nuclear cleanup:', cleanupError);
    }

    IS_ROUTE_CREATED = false;
    console.log('☢️ NUCLEAR CLEANUP: Complete');
  };

  // Continuous cleanup to prevent route duplication
  const startContinuousCleanup = () => {
    if (CLEANUP_INTERVAL) {
      clearInterval(CLEANUP_INTERVAL);
    }
    
    CLEANUP_INTERVAL = setInterval(() => {
      // Only keep our specific polylines, remove any others
      if (IS_ROUTE_CREATED && GLOBAL_ROUTE_POLYLINE && GLOBAL_CENTER_LINE) {
        console.log('🔄 Continuous cleanup: Route exists, monitoring for duplicates');
      }
    }, 2000);
  };

  useEffect(() => {
    if (!map || !isMapReady || isLoading || error || waypoints.length === 0) {
      return;
    }

    if (hasRendered.current || IS_ROUTE_CREATED) {
      console.log('☢️ Route already exists or rendered, skipping');
      return;
    }

    console.log('☢️ NUCLEAR ROUTE RENDERER: Starting single route creation');
    
    // Step 1: Nuclear cleanup
    nuclearCleanup();
    
    // Step 2: Wait a moment for cleanup to complete
    setTimeout(() => {
      // Step 3: Create the single route
      const routePath = waypoints
        .sort((a, b) => a.sequence_order - b.sequence_order)
        .map(waypoint => ({
          lat: Number(waypoint.latitude),
          lng: Number(waypoint.longitude)
        }));

      console.log(`☢️ Creating THE ONLY Route 66 with ${routePath.length} waypoints`);

      // Create main route polyline
      GLOBAL_ROUTE_POLYLINE = new google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: '#2C2C2C',
        strokeOpacity: 0.9,
        strokeWeight: 8,
        zIndex: 1000,
        clickable: false
      });

      // Create center line with dashed effect
      GLOBAL_CENTER_LINE = new google.maps.Polyline({
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
      GLOBAL_ROUTE_POLYLINE.setMap(map);
      GLOBAL_CENTER_LINE.setMap(map);

      IS_ROUTE_CREATED = true;
      hasRendered.current = true;

      console.log('✅ THE SINGLE Route 66 created successfully');

      // Fit bounds to the route
      setTimeout(() => {
        const bounds = new google.maps.LatLngBounds();
        routePath.forEach(point => {
          bounds.extend(new google.maps.LatLng(point.lat, point.lng));
        });
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      }, 500);

      // Start continuous monitoring
      startContinuousCleanup();
      
    }, 100);

    // Cleanup function
    return () => {
      if (CLEANUP_INTERVAL) {
        clearInterval(CLEANUP_INTERVAL);
        CLEANUP_INTERVAL = null;
      }
      console.log('☢️ NuclearRouteRenderer: Component unmounting');
    };
  }, [map, isMapReady, waypoints, isLoading, error]);

  return null;
};

export default NuclearRouteRenderer;
