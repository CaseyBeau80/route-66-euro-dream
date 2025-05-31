
import React, { useEffect, useRef } from 'react';
import type { RouteMarkersProps } from './types';
import { MarkerManager } from './MarkerManager';

const RouteMarkers: React.FC<RouteMarkersProps> = ({ map, waypoints }) => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<WeakMap<google.maps.Marker, google.maps.InfoWindow>>(new WeakMap());

  useEffect(() => {
    console.log('🎯 RouteMarkers useEffect triggered');
    console.log('🗺️ Map object:', map);
    console.log('📊 Waypoints:', {
      total: waypoints?.length || 0,
      hasWaypoints: !!waypoints,
      sample: waypoints?.slice(0, 3)
    });

    if (!map) {
      console.warn('⚠️ RouteMarkers: No map provided');
      return;
    }

    if (!waypoints || waypoints.length === 0) {
      console.warn('⚠️ RouteMarkers: No waypoints provided');
      return;
    }

    // Only handle destination cities - regular stops are now handled by AttractionsContainer
    const destinationCities = waypoints.filter(waypoint => waypoint.is_major_stop);
    
    console.log(`📍 RouteMarkers: Handling destination cities only:`);
    console.log(`  - Destination cities: ${destinationCities.length}`);
    console.log(`  - Destinations:`, destinationCities.map(d => d.name));
    
    const markerRefs = { markersRef, infoWindowsRef };

    try {
      // Create destination city markers only
      console.log('🏙️ Creating destination markers...');
      MarkerManager.createDestinationMarkers(destinationCities, map, markerRefs);

      console.log(`✅ Route 66 destination markers displayed: ${destinationCities.length} destination cities = ${markersRef.current.length} total markers created`);
      
      // Log current map state
      console.log('🗺️ Current map state:', {
        zoom: map.getZoom(),
        center: map.getCenter()?.toJSON(),
        markers: markersRef.current.length
      });

    } catch (error) {
      console.error('❌ Error creating Route 66 destination markers:', error);
    }

    return () => {
      console.log('🧹 RouteMarkers cleanup triggered');
      MarkerManager.cleanupMarkers(markerRefs);
    };
  }, [map, waypoints]);

  // Log render
  console.log('🎨 RouteMarkers rendering (returns null)');
  return null;
};

export default RouteMarkers;
