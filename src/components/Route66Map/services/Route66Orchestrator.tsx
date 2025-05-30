
import React, { useEffect, useRef, useState } from 'react';
import { PolylineService } from './PolylineService';
import { MarkerService } from './MarkerService';
import { BoundsService } from './BoundsService';
import { CleanupService } from './CleanupService';

interface Route66OrchestratorProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const Route66Orchestrator: React.FC<Route66OrchestratorProps> = ({ 
  map, 
  isMapReady 
}) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const startMarkerRef = useRef<google.maps.Marker | null>(null);
  const endMarkerRef = useRef<google.maps.Marker | null>(null);
  const [routeRendered, setRouteRendered] = useState(false);
  const renderAttemptRef = useRef(0);

  useEffect(() => {
    if (!map || !isMapReady || routeRendered) {
      console.log('🔍 Route orchestrator conditions:', {
        hasMap: !!map,
        isMapReady,
        routeRendered,
        shouldRender: !!(map && isMapReady && !routeRendered)
      });
      return;
    }

    renderAttemptRef.current += 1;
    const attemptNumber = renderAttemptRef.current;
    
    console.log(`🎨 Route66Orchestrator: Starting render attempt #${attemptNumber}`);

    // Add a small delay to ensure map is fully stabilized
    const renderTimeout = setTimeout(() => {
      renderRoute66(attemptNumber);
    }, 200);

    return () => {
      clearTimeout(renderTimeout);
    };
  }, [map, isMapReady, routeRendered]);

  const renderRoute66 = (attemptNumber: number) => {
    try {
      console.log(`🚗 Rendering Route 66 (attempt #${attemptNumber})`);
      
      // Clean up existing elements
      CleanupService.cleanupMapElements({
        polylineRef,
        startMarkerRef,
        endMarkerRef
      });

      // Create the route polyline
      const routePath = PolylineService.createRoutePolyline({
        map,
        polylineRef
      });

      if (!routePath) {
        console.error('❌ Failed to create route path');
        return;
      }

      // Verify polyline visibility
      PolylineService.verifyVisibility(polylineRef);

      // Add click listener to polyline
      PolylineService.addClickListener(polylineRef, map);

      // Create start and end markers
      MarkerService.createStartEndMarkers({
        map,
        routePath,
        startMarkerRef,
        endMarkerRef
      });

      // Set map bounds to show route
      BoundsService.fitMapToRoute(map, routePath);

      // Mark as rendered
      setRouteRendered(true);
      console.log('✅ Route 66 rendering completed successfully');

    } catch (error) {
      console.error('❌ Error rendering Route 66:', error);
      
      // Retry after a delay if this was the first attempt
      if (attemptNumber === 1) {
        console.log('🔄 Retrying route rendering in 1 second...');
        setTimeout(() => {
          renderRoute66(2);
        }, 1000);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Route66Orchestrator unmounting - cleaning up');
      CleanupService.cleanupMapElements({
        polylineRef,
        startMarkerRef,
        endMarkerRef
      });
    };
  }, []);

  return null;
};

export default Route66Orchestrator;
