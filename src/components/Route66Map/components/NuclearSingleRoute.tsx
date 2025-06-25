
import React, { useEffect, useRef } from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface NuclearSingleRouteProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

const NuclearSingleRoute: React.FC<NuclearSingleRouteProps> = ({ map, waypoints }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);

  console.log('☢️ NUCLEAR SINGLE ROUTE: Initializing ultimate cleanup system', {
    waypointsCount: waypoints.length,
    hasMap: !!map
  });

  // Nuclear cleanup function - removes ALL polylines from map
  const nuclearCleanup = () => {
    if (!map) return;

    console.log('☢️ NUCLEAR CLEANUP: Removing ALL polylines from map');
    
    // Get all overlays and remove any polylines
    const overlays = (map as any).overlayMapTypes;
    if (overlays) {
      overlays.clear();
    }

    // Access internal Google Maps polylines storage and clear it
    const mapData = (map as any);
    if (mapData.__gm && mapData.__gm.Fc) {
      // Clear internal polylines array
      const overlayView = mapData.__gm.Fc;
      if (overlayView && overlayView.overlays_) {
        overlayView.overlays_.clear();
      }
    }

    // Additional cleanup: iterate through all potential polyline references
    try {
      // Clear our own polyline first
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }

      // Force cleanup of any lingering polylines by setting map to null on all potential polylines
      const polylines = document.querySelectorAll('[data-polyline]');
      polylines.forEach(element => {
        const polylineInstance = (element as any).__polylineInstance;
        if (polylineInstance && polylineInstance.setMap) {
          polylineInstance.setMap(null);
        }
      });

    } catch (error) {
      console.log('☢️ Cleanup error (expected):', error);
    }

    console.log('☢️ NUCLEAR CLEANUP: Complete');
  };

  useEffect(() => {
    // Immediate nuclear cleanup
    nuclearCleanup();

    // Set up continuous cleanup to prevent other systems from interfering
    cleanupIntervalRef.current = setInterval(() => {
      // Only cleanup if we're not the active polyline
      const allPolylines = document.querySelectorAll('[data-polyline]');
      if (allPolylines.length > 1) {
        console.log('☢️ DETECTED MULTIPLE POLYLINES: Cleaning up competitors');
        allPolylines.forEach((element, index) => {
          if (index > 0) { // Keep only the first one (ours)
            const polylineInstance = (element as any).__polylineInstance;
            if (polylineInstance && polylineInstance.setMap) {
              polylineInstance.setMap(null);
            }
          }
        });
      }
    }, 1000);

    if (!map || !waypoints.length) {
      console.log('☢️ Missing map or waypoints');
      return;
    }

    // Wait a moment for cleanup to complete, then create our single route
    setTimeout(() => {
      createSingleRoute();
    }, 100);

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
      nuclearCleanup();
    };
  }, [map, waypoints]);

  const createSingleRoute = () => {
    // Final cleanup before creating route
    nuclearCleanup();

    // Filter and sort waypoints - use only major stops to prevent ping-ponging
    const majorStops = waypoints
      .filter(wp => 
        wp.latitude && 
        wp.longitude && 
        wp.sequence_order !== null &&
        wp.is_major_stop === true
      )
      .sort((a, b) => a.sequence_order - b.sequence_order);

    console.log('☢️ Creating route with major stops only:', {
      totalWaypoints: waypoints.length,
      majorStops: majorStops.length,
      stops: majorStops.map(s => `${s.sequence_order}. ${s.name}, ${s.state}`)
    });

    if (majorStops.length < 2) {
      console.warn('☢️ Not enough major stops for route');
      return;
    }

    // Create clean path
    const path: google.maps.LatLngLiteral[] = majorStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    console.log('☢️ Creating THE SINGLE POLYLINE:', {
      pathLength: path.length,
      start: `${path[0].lat}, ${path[0].lng}`,
      end: `${path[path.length - 1].lat}, ${path[path.length - 1].lng}`
    });

    // Create the ONE AND ONLY polyline
    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 8,
      zIndex: 99999 // Highest possible z-index
    });

    // Mark it as our official polyline
    const polylineElement = document.createElement('div');
    polylineElement.setAttribute('data-polyline', 'nuclear-single-route');
    (polylineElement as any).__polylineInstance = polyline;
    document.body.appendChild(polylineElement);

    // Add to map
    polyline.setMap(map);
    polylineRef.current = polyline;

    console.log('☢️ SUCCESS: THE SINGLE ROUTE 66 POLYLINE IS CREATED');
    console.log('☢️ Path verification:', polyline.getPath().getLength(), 'points');
  };

  return null;
};

export default NuclearSingleRoute;
