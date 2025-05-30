
import React, { useEffect, useRef } from 'react';
import { comprehensiveRoute66Waypoints, validateComprehensiveWaypoints } from './waypoints/ComprehensiveRoute66Waypoints';

interface SimpleRoute66ServiceProps {
  map: google.maps.Map;
}

const SimpleRoute66Service: React.FC<SimpleRoute66ServiceProps> = ({ map }) => {
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const initializationRef = useRef<boolean>(false);

  useEffect(() => {
    if (!map) {
      console.log('⚠️ SimpleRoute66Service: Map not available yet');
      return;
    }

    if (initializationRef.current) {
      console.log('⚠️ SimpleRoute66Service: Route already initialized, skipping');
      return;
    }

    console.log('🚗 SimpleRoute66Service: Initializing Route 66 with Google Directions API');
    initializationRef.current = true;

    // Validate waypoints before proceeding
    if (!validateComprehensiveWaypoints()) {
      console.error('❌ Waypoint validation failed');
      return;
    }

    calculateRoute66();

    function calculateRoute66() {
      console.log('🛣️ SimpleRoute66Service: Calculating drivable Route 66 using Directions API');

      cleanup();

      // Initialize Google Maps Directions Service
      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: false, // Show start/end markers
        preserveViewport: false, // Let the route adjust the viewport
        polylineOptions: {
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 6,
          zIndex: 1000
        },
        markerOptions: {
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="12" fill="#FF0000" stroke="#fff" stroke-width="2"/>
                <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">66</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16)
          }
        }
      });

      directionsRendererRef.current.setMap(map);

      // Select key waypoints for the route - Google Directions API has limitations on waypoint count
      const keyWaypoints = [
        comprehensiveRoute66Waypoints[0],  // Chicago, IL (start)
        comprehensiveRoute66Waypoints.find(w => w.description.includes('Springfield') && w.state === 'IL'), // Springfield, IL
        comprehensiveRoute66Waypoints.find(w => w.description.includes('St. Louis')), // St. Louis, MO
        comprehensiveRoute66Waypoints.find(w => w.description.includes('Springfield') && w.state === 'MO'), // Springfield, MO
        comprehensiveRoute66Waypoints.find(w => w.description.includes('Tulsa')), // Tulsa, OK
        comprehensiveRoute66Waypoints.find(w => w.description.includes('Oklahoma City')), // Oklahoma City, OK
        comprehensiveRoute66Waypoints.find(w => w.description.includes('Amarillo')), // Amarillo, TX
        comprehensiveRoute66Waypoints.find(w => w.description.includes('Albuquerque')), // Albuquerque, NM
        comprehensiveRoute66Waypoints.find(w => w.description.includes('Flagstaff')), // Flagstaff, AZ
        comprehensiveRoute66Waypoints.find(w => w.description.includes('Barstow')), // Barstow, CA
        comprehensiveRoute66Waypoints[comprehensiveRoute66Waypoints.length - 1] // Santa Monica, CA (end)
      ].filter(Boolean); // Remove any undefined waypoints

      console.log('🎯 Key Route 66 waypoints selected:', {
        total: keyWaypoints.length,
        cities: keyWaypoints.map(w => w?.description).join(' → ')
      });

      // Prepare the directions request
      const origin = new google.maps.LatLng(keyWaypoints[0].lat, keyWaypoints[0].lng);
      const destination = new google.maps.LatLng(
        keyWaypoints[keyWaypoints.length - 1].lat, 
        keyWaypoints[keyWaypoints.length - 1].lng
      );
      
      // Use intermediate waypoints (excluding origin and destination)
      const waypoints = keyWaypoints.slice(1, -1).map(waypoint => ({
        location: new google.maps.LatLng(waypoint.lat, waypoint.lng),
        stopover: true
      }));

      const request: google.maps.DirectionsRequest = {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false, // Keep historic Route 66 order
        avoidHighways: false, // We want to use highways like I-44, I-40
        avoidTolls: false,
        region: 'US'
      };

      console.log('📍 Directions API request:', {
        origin: keyWaypoints[0].description,
        destination: keyWaypoints[keyWaypoints.length - 1].description,
        waypointCount: waypoints.length,
        travelMode: 'DRIVING'
      });

      // Calculate the route
      directionsServiceRef.current!.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          console.log('✅ Route 66 calculated successfully via Google Directions API');
          console.log('🛣️ Route follows actual highways and roads');
          
          // Display the route
          directionsRendererRef.current!.setDirections(result);
          
          // Log route details
          const route = result.routes[0];
          const totalDistance = route.legs.reduce((sum, leg) => sum + (leg.distance?.value || 0), 0);
          const totalDuration = route.legs.reduce((sum, leg) => sum + (leg.duration?.value || 0), 0);
          
          console.log('📊 Route 66 details:', {
            totalDistance: `${Math.round(totalDistance / 1609.34)} miles`,
            estimatedDriveTime: `${Math.round(totalDuration / 3600)} hours`,
            legs: route.legs.length,
            highways: 'Following I-55, I-44, I-40, and local roads'
          });
          
        } else {
          console.error('❌ Failed to calculate Route 66:', status);
          console.log('🔄 Falling back to polyline method');
          
          // Fallback to polyline if Directions API fails
          createFallbackPolyline();
        }
      });
    }

    function createFallbackPolyline() {
      console.log('🎨 Creating fallback polyline for Route 66');
      
      const routePath = comprehensiveRoute66Waypoints.map(waypoint => ({
        lat: waypoint.lat,
        lng: waypoint.lng
      }));

      const polyline = new google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        zIndex: 500
      });

      polyline.setMap(map);
      
      // Fit bounds to show the route
      const bounds = new google.maps.LatLngBounds();
      routePath.forEach(point => bounds.extend(point));
      map.fitBounds(bounds);
      
      console.log('✅ Fallback polyline created');
    }

    function cleanup() {
      console.log('🧹 Cleaning up existing Route 66 elements');
      
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
      
      directionsServiceRef.current = null;
    }

    return () => {
      console.log('🧹 SimpleRoute66Service: Component unmounting - cleaning up Directions API service');
      cleanup();
      initializationRef.current = false;
    };
  }, [map]);

  return null;
};

export default SimpleRoute66Service;
