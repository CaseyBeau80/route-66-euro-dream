
import React, { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseRoute66Props {
  map: google.maps.Map;
}

interface Route66Waypoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  state: string;
  sequence_order: number;
  is_major_stop: boolean | null;
  highway_designation: string | null;
  description: string | null;
}

const SupabaseRoute66: React.FC<SupabaseRoute66Props> = ({ map }) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!map) {
      console.log("❌ No map provided to SupabaseRoute66");
      return;
    }

    const fetchAndDisplayRoute = async () => {
      try {
        console.log("🗺️ Fetching Route 66 waypoints from Supabase...");
        
        const { data: waypoints, error } = await supabase
          .from('route66_waypoints')
          .select('*')
          .order('sequence_order');

        if (error) {
          console.error("❌ Error fetching waypoints:", error);
          return;
        }

        if (!waypoints || waypoints.length === 0) {
          console.log("❌ No waypoints found in database");
          return;
        }

        console.log(`✅ Fetched ${waypoints.length} waypoints from Supabase`);

        // Convert waypoints to Google Maps LatLng objects
        const routePath = waypoints.map(waypoint => ({
          lat: waypoint.latitude,
          lng: waypoint.longitude
        }));

        // Create the Route 66 polyline with enhanced visibility
        const route66Polyline = new google.maps.Polyline({
          path: routePath,
          geodesic: true,
          strokeColor: '#FF0000', // Bright red for better visibility
          strokeOpacity: 0.9,
          strokeWeight: 8, // Thicker line
          zIndex: 10000, // Higher z-index to ensure visibility
          clickable: false
        });

        // Set the polyline on the map
        route66Polyline.setMap(map);
        polylineRef.current = route66Polyline;
        console.log("✅ Route 66 polyline added to map");

        // Create bounds for the entire route and fit map
        const bounds = new google.maps.LatLngBounds();
        routePath.forEach(point => {
          bounds.extend(new google.maps.LatLng(point.lat, point.lng));
        });

        // Fit the map to show the entire route with padding
        map.fitBounds(bounds, {
          top: 100,
          right: 100,
          bottom: 100,
          left: 100
        });

        console.log("✅ Map bounds adjusted to show Route 66");

        // Add markers for major stops only (to avoid clutter)
        const majorStops = waypoints.filter(waypoint => waypoint.is_major_stop);
        console.log(`Adding ${majorStops.length} major stop markers`);
        
        majorStops.forEach((waypoint, index) => {
          const marker = new google.maps.Marker({
            position: { lat: waypoint.latitude, lng: waypoint.longitude },
            map: map,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="#FF0000" stroke="#FFFFFF" stroke-width="2"/>
                  <text x="12" y="16" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">${index + 1}</text>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(24, 24),
              anchor: new google.maps.Point(12, 12)
            },
            title: `${waypoint.name} - ${waypoint.state}`,
            zIndex: 20000
          });

          // Add info window for major stops
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 200px; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 5px 0; color: #FF0000; font-size: 14px;">${waypoint.name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">
                  ${waypoint.state}${waypoint.highway_designation ? ` • ${waypoint.highway_designation}` : ''}
                </p>
                ${waypoint.description ? `<p style="margin: 5px 0 0 0; font-size: 11px; color: #333;">${waypoint.description}</p>` : ''}
              </div>
            `
          });

          marker.addListener('click', () => {
            // Close any other open info windows
            markersRef.current.forEach(m => {
              if (m.infoWindow) {
                m.infoWindow.close();
              }
            });
            infoWindow.open(map, marker);
          });

          // Store reference to info window for cleanup
          (marker as any).infoWindow = infoWindow;
          markersRef.current.push(marker);
        });

        // Add special start and end markers
        if (waypoints.length > 0) {
          const startPoint = waypoints[0];
          const endPoint = waypoints[waypoints.length - 1];

          const startMarker = new google.maps.Marker({
            position: { lat: startPoint.latitude, lng: startPoint.longitude },
            map: map,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="14" fill="#00AA00" stroke="#FFFFFF" stroke-width="3"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">START</text>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16)
            },
            title: `Route 66 Start - ${startPoint.name}`,
            zIndex: 30000
          });

          const endMarker = new google.maps.Marker({
            position: { lat: endPoint.latitude, lng: endPoint.longitude },
            map: map,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="14" fill="#FF0000" stroke="#FFFFFF" stroke-width="3"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">END</text>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16)
            },
            title: `Route 66 End - ${endPoint.name}`,
            zIndex: 30000
          });

          markersRef.current.push(startMarker, endMarker);
        }

        console.log(`✅ Route 66 fully displayed with polyline and ${markersRef.current.length} markers`);

      } catch (error) {
        console.error("❌ Error creating Route 66 display:", error);
      }
    };

    // Small delay to ensure map is fully loaded
    const timer = setTimeout(() => {
      fetchAndDisplayRoute();
    }, 500);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      console.log("🧹 Cleaning up Supabase Route 66 display");
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      markersRef.current.forEach(marker => {
        if ((marker as any).infoWindow) {
          (marker as any).infoWindow.close();
        }
        marker.setMap(null);
      });
      markersRef.current = [];
    };
  }, [map]);

  return null;
};

export default SupabaseRoute66;
