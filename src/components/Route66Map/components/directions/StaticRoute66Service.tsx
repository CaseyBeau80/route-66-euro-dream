
import React, { useEffect } from 'react';
import { route66HighwayWaypoints } from './waypointsData';

interface StaticRoute66ServiceProps {
  map: google.maps.Map;
  onRouteReady: (success: boolean) => void;
}

const StaticRoute66Service = ({ map, onRouteReady }: StaticRoute66ServiceProps) => {
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;

    console.log('🛣️ StaticRoute66Service: Creating static Route 66 polyline');

    try {
      // Create the Route 66 path using all waypoints
      const routePath = route66HighwayWaypoints.map(waypoint => 
        new google.maps.LatLng(waypoint.lat, waypoint.lng)
      );

      // Create the main Route 66 polyline
      const route66Polyline = new google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: '#DC2626', // Route 66 red
        strokeOpacity: 1.0,
        strokeWeight: 6,
        map: map,
        zIndex: 100
      });

      // Add click listener for route information
      route66Polyline.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold text-red-600 mb-1">Historic Route 66</h3>
                <p class="text-sm text-gray-700">The Mother Road - Chicago to Santa Monica</p>
                <p class="text-xs text-gray-500">2,448 miles of American history</p>
              </div>
            `,
            position: event.latLng
          });
          infoWindow.open(map);
        }
      });

      console.log('✅ Static Route 66 polyline created successfully');
      onRouteReady(true);

      // Cleanup function
      return () => {
        route66Polyline.setMap(null);
      };
    } catch (error) {
      console.error('❌ Error creating static Route 66 polyline:', error);
      onRouteReady(false);
    }
  }, [map, onRouteReady]);

  return null;
};

export default StaticRoute66Service;
