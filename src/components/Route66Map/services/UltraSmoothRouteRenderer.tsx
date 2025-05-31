import React, { useEffect, useRef } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import { RouteInterpolationService } from './RouteInterpolationService';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface UltraSmoothRouteRendererProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

// Global variables to ensure single route instance
let GLOBAL_SMOOTH_POLYLINE: google.maps.Polyline | null = null;
let GLOBAL_CENTER_LINE: google.maps.Polyline | null = null;
let GLOBAL_ROUTE_MARKERS: google.maps.Marker[] = [];
let IS_SMOOTH_ROUTE_CREATED = false;

const UltraSmoothRouteRenderer: React.FC<UltraSmoothRouteRendererProps> = ({ 
  map, 
  isMapReady 
}) => {
  const hasRendered = useRef(false);
  const { waypoints, isLoading, error } = useSupabaseRoute66();
  const interpolationServiceRef = useRef<RouteInterpolationService | null>(null);

  // Nuclear cleanup function
  const cleanupExistingRoute = () => {
    console.log('🧹 UltraSmoothRouteRenderer: Cleaning up existing route');
    
    if (GLOBAL_SMOOTH_POLYLINE) {
      GLOBAL_SMOOTH_POLYLINE.setMap(null);
      GLOBAL_SMOOTH_POLYLINE = null;
    }
    
    if (GLOBAL_CENTER_LINE) {
      GLOBAL_CENTER_LINE.setMap(null);
      GLOBAL_CENTER_LINE = null;
    }

    // Clean up route markers
    GLOBAL_ROUTE_MARKERS.forEach(marker => {
      marker.setMap(null);
    });
    GLOBAL_ROUTE_MARKERS = [];

    IS_SMOOTH_ROUTE_CREATED = false;
  };

  // Create route markers for major stops
  const createRouteMarkers = (waypoints: Route66Waypoint[]) => {
    const majorStops = waypoints.filter(wp => wp.is_major_stop);
    
    majorStops.forEach((waypoint, index) => {
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map,
        title: waypoint.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#FFD700',
          fillOpacity: 1,
          strokeColor: '#2C2C2C',
          strokeWeight: 2
        },
        zIndex: 2000
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 4px 0; color: #2C2C2C; font-size: 14px; font-weight: bold;">
              ${waypoint.name}
            </h3>
            <p style="margin: 0; color: #666; font-size: 12px;">
              ${waypoint.state} • ${waypoint.highway_designation || 'Route 66'}
            </p>
            ${waypoint.description ? `
              <p style="margin: 4px 0 0 0; color: #666; font-size: 11px;">
                ${waypoint.description}
              </p>
            ` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        // Close any open info windows
        GLOBAL_ROUTE_MARKERS.forEach(m => {
          const iw = (m as any).infoWindow;
          if (iw) iw.close();
        });
        
        infoWindow.open(map, marker);
      });

      (marker as any).infoWindow = infoWindow;
      GLOBAL_ROUTE_MARKERS.push(marker);
    });

    console.log(`📍 Created ${GLOBAL_ROUTE_MARKERS.length} route markers for major stops`);
  };

  useEffect(() => {
    if (!map || !isMapReady || isLoading || error || waypoints.length === 0) {
      return;
    }

    if (hasRendered.current || IS_SMOOTH_ROUTE_CREATED) {
      console.log('🎯 UltraSmoothRouteRenderer: Route already exists, skipping');
      return;
    }

    console.log('🚀 UltraSmoothRouteRenderer: Creating ultra-smooth Route 66');
    
    // Step 1: Clean up any existing routes
    cleanupExistingRoute();
    
    // Step 2: Initialize interpolation service
    interpolationServiceRef.current = new RouteInterpolationService(waypoints);
    
    // Step 3: Generate smooth route with ~2000 points
    const smoothRoutePath = interpolationServiceRef.current.generateSmoothRoute();
    
    if (smoothRoutePath.length === 0) {
      console.error('❌ Failed to generate smooth route path');
      return;
    }

    // Step 4: Get statistics
    const stats = interpolationServiceRef.current.getRouteStatistics();
    console.log('📊 Route Statistics:', stats);

    // Step 5: Create main route polyline with enhanced styling
    GLOBAL_SMOOTH_POLYLINE = new google.maps.Polyline({
      path: smoothRoutePath,
      geodesic: true,
      strokeColor: '#2C2C2C',
      strokeOpacity: 0.9,
      strokeWeight: 10,
      zIndex: 1000,
      clickable: false
    });

    // Step 6: Create center dashed line for authentic Route 66 look
    GLOBAL_CENTER_LINE = new google.maps.Polyline({
      path: smoothRoutePath,
      geodesic: true,
      strokeColor: '#FFD700',
      strokeOpacity: 0,
      strokeWeight: 0,
      zIndex: 1001,
      clickable: false,
      icons: [{
        icon: {
          path: 'M 0,-2 0,2',
          strokeOpacity: 1,
          strokeColor: '#FFD700',
          strokeWeight: 3,
          scale: 1
        },
        offset: '0%',
        repeat: '30px'
      }]
    });

    // Step 7: Add polylines to map
    GLOBAL_SMOOTH_POLYLINE.setMap(map);
    GLOBAL_CENTER_LINE.setMap(map);

    // Step 8: Create route markers for major stops
    createRouteMarkers(waypoints);

    // Step 9: Mark as created and set bounds
    IS_SMOOTH_ROUTE_CREATED = true;
    hasRendered.current = true;

    console.log(`✅ Ultra-smooth Route 66 created with ${stats.totalPoints} points!`);
    console.log(`📏 Total distance: ${stats.totalDistance.toFixed(2)} km`);
    console.log(`🎯 Average points per segment: ${stats.averagePointsPerSegment}`);

    // Step 10: Fit map to route bounds
    setTimeout(() => {
      const bounds = new google.maps.LatLngBounds();
      smoothRoutePath.forEach(point => {
        bounds.extend(new google.maps.LatLng(point.lat, point.lng));
      });
      map.fitBounds(bounds, { 
        top: 60, 
        right: 60, 
        bottom: 60, 
        left: 60 
      });
    }, 1000);

    // Cleanup function
    return () => {
      console.log('🧹 UltraSmoothRouteRenderer: Component unmounting');
    };
  }, [map, isMapReady, waypoints, isLoading, error]);

  // Provide access to route statistics for debugging
  useEffect(() => {
    if (interpolationServiceRef.current && IS_SMOOTH_ROUTE_CREATED) {
      const stats = interpolationServiceRef.current.getRouteStatistics();
      console.log('📈 Current Route Statistics:', stats);
    }
  }, [IS_SMOOTH_ROUTE_CREATED]);

  return null;
};

export default UltraSmoothRouteRenderer;
