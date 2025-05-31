
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

    // Separate waypoints into destinations and regular stops
    const destinationCities = waypoints.filter(waypoint => waypoint.is_major_stop);
    const regularStops = waypoints.filter(waypoint => !waypoint.is_major_stop);
    
    console.log(`📍 RouteMarkers: Separating waypoints:`);
    console.log(`  - Destination cities: ${destinationCities.length}`);
    console.log(`  - Regular stops: ${regularStops.length}`);
    console.log(`  - Destinations:`, destinationCities.map(d => d.name));
    console.log(`  - Sample regular stops:`, regularStops.slice(0, 5).map(r => r.name));
    
    const markerRefs = { markersRef, infoWindowsRef };

    try {
      // Create destination city markers (higher zIndex)
      console.log('🏙️ Creating destination markers...');
      MarkerManager.createDestinationMarkers(destinationCities, map, markerRefs);

      // Create regular stop markers (lower zIndex)
      console.log('🛑 Creating regular stop markers...');
      MarkerManager.createRegularStopMarkers(regularStops, map, markerRefs);

      console.log(`✅ Route 66 markers fully displayed: ${destinationCities.length} destinations + ${regularStops.length} regular stops = ${markersRef.current.length} total markers created`);
      
      // Log current map state
      console.log('🗺️ Current map state:', {
        zoom: map.getZoom(),
        center: map.getCenter()?.toJSON(),
        markers: markersRef.current.length
      });

    } catch (error) {
      console.error('❌ Error creating Route 66 markers:', error);
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
