
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

        // Create the Route 66 polyline
        const route66Polyline = new google.maps.Polyline({
          path: routePath,
          geodesic: true,
          strokeColor: '#DC2626', // Red color for Route 66
          strokeOpacity: 1.0,
          strokeWeight: 6,
          zIndex: 1000,
          clickable: false
        });

        // Set the polyline on the map
        route66Polyline.setMap(map);
        polylineRef.current = route66Polyline;

        // Create bounds for the entire route
        const bounds = new google.maps.LatLngBounds();
        routePath.forEach(point => {
          bounds.extend(new google.maps.LatLng(point.lat, point.lng));
        });

        // Fit the map to show the entire route
        map.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50
        });

        // Add markers for major stops
        const majorStops = waypoints.filter(waypoint => waypoint.is_major_stop);
        
        majorStops.forEach(waypoint => {
          const marker = new google.maps.Marker({
            position: { lat: waypoint.latitude, lng: waypoint.longitude },
            map: map,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                  <circle cx="15" cy="15" r="12" fill="#DC2626" stroke="#fff" stroke-width="2"/>
                  <text x="15" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">${waypoint.state}</text>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(30, 30),
              anchor: new google.maps.Point(15, 15)
            },
            title: `${waypoint.name} - ${waypoint.state}`,
            zIndex: 2000
          });

          // Add info window for major stops
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; max-width: 200px;">
                <h3 style="margin: 0 0 5px 0; color: #DC2626;">${waypoint.name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">
                  ${waypoint.state}${waypoint.highway_designation ? ` • ${waypoint.highway_designation}` : ''}
                </p>
                ${waypoint.description ? `<p style="margin: 5px 0 0 0; font-size: 12px;">${waypoint.description}</p>` : ''}
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          markersRef.current.push(marker);
        });

        // Add start and end markers
        const startPoint = waypoints[0];
        const endPoint = waypoints[waypoints.length - 1];

        const startMarker = new google.maps.Marker({
          position: { lat: startPoint.latitude, lng: startPoint.longitude },
          map: map,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="#22C55E" stroke="#fff" stroke-width="3"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">START</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
          },
          title: `Route 66 Start - ${startPoint.name}`,
          zIndex: 3000
        });

        const endMarker = new google.maps.Marker({
          position: { lat: endPoint.latitude, lng: endPoint.longitude },
          map: map,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="#fff" stroke-width="3"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">END</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
          },
          title: `Route 66 End - ${endPoint.name}`,
          zIndex: 3000
        });

        markersRef.current.push(startMarker, endMarker);

        console.log(`✅ Route 66 displayed with ${majorStops.length} major stops`);

      } catch (error) {
        console.error("❌ Error creating Route 66 display:", error);
      }
    };

    fetchAndDisplayRoute();

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up Supabase Route 66 display");
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [map]);

  return null;
};

export default SupabaseRoute66;
