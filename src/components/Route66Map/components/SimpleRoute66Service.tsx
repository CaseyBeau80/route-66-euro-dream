
import React, { useEffect, useState } from 'react';
import { historicRoute66Waypoints, getHistoricRoute66Segments } from './HistoricRoute66Waypoints';

interface SimpleRoute66ServiceProps {
  map: google.maps.Map;
}

const SimpleRoute66Service: React.FC<SimpleRoute66ServiceProps> = ({ map }) => {
  const [routeRendered, setRouteRendered] = useState(false);

  useEffect(() => {
    if (!map || routeRendered) return;

    console.log('🚗 Rendering simplified Route 66 with highway-based routing');

    // Test if Directions API is available
    const directionsService = new google.maps.DirectionsService();
    
    const testRequest: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(41.8781, -87.6298), // Chicago
      destination: new google.maps.LatLng(41.5250, -88.0817), // Joliet
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(testRequest, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log('✅ Directions API available - using highway-based routing');
        renderHighwayBasedRoute(map, directionsService);
      } else {
        console.log('⚠️ Directions API not available - using static polyline fallback');
        renderStaticRoute(map);
      }
      setRouteRendered(true);
    });

    return () => {
      console.log('🧹 Cleaning up Route 66 service');
    };
  }, [map, routeRendered]);

  return null;
};

// Render highway-based route using Google Directions API
const renderHighwayBasedRoute = (map: google.maps.Map, directionsService: google.maps.DirectionsService) => {
  const segments = getHistoricRoute66Segments();
  const renderers: google.maps.DirectionsRenderer[] = [];

  segments.forEach((segment, index) => {
    const renderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: {
        strokeColor: '#DC2626',
        strokeOpacity: 0.9,
        strokeWeight: 6,
        zIndex: 1000
      }
    });
    
    renderer.setMap(map);
    renderers.push(renderer);

    // Get waypoints for this segment
    const segmentWaypoints = historicRoute66Waypoints.slice(segment.start, segment.end + 1);
    
    if (segmentWaypoints.length < 2) return;

    const origin = segmentWaypoints[0];
    const destination = segmentWaypoints[segmentWaypoints.length - 1];
    
    // Use key waypoints to force highway following
    const waypoints = segmentWaypoints.length > 2 ? 
      segmentWaypoints.slice(1, -1)
        .filter((_, idx) => idx % 2 === 0) // Take every other waypoint to stay under limit
        .slice(0, 20) // Google's waypoint limit
        .map(point => ({
          location: new google.maps.LatLng(point.lat, point.lng),
          stopover: false
        })) : [];

    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(destination.lat, destination.lng),
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false,
      avoidHighways: false, // We want to use highways
      avoidTolls: false
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        console.log(`✅ ${segment.description} highway route calculated`);
        renderer.setDirections(result);
      } else {
        console.warn(`⚠️ ${segment.description} failed, using direct path`);
        // Fallback to direct polyline for this segment
        createSegmentPolyline(map, segmentWaypoints, segment.highway);
      }
    });
  });
};

// Render static route as fallback
const renderStaticRoute = (map: google.maps.Map) => {
  console.log('🗺️ Creating static Route 66 polyline following highways');
  
  // Create main route polyline
  const routePath = historicRoute66Waypoints.map(waypoint => ({
    lat: waypoint.lat,
    lng: waypoint.lng
  }));

  const route66Polyline = new google.maps.Polyline({
    path: routePath,
    geodesic: true,
    strokeColor: '#DC2626',
    strokeOpacity: 0.9,
    strokeWeight: 6,
    zIndex: 1000
  });

  route66Polyline.setMap(map);

  // Add highway markers for context
  const segments = getHistoricRoute66Segments();
  segments.forEach((segment, index) => {
    const midPoint = Math.floor((segment.start + segment.end) / 2);
    const waypoint = historicRoute66Waypoints[midPoint];
    
    if (waypoint) {
      new google.maps.Marker({
        position: { lat: waypoint.lat, lng: waypoint.lng },
        map: map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="20" viewBox="0 0 60 20">
              <rect width="60" height="20" rx="10" fill="#1976D2" stroke="#fff" stroke-width="1"/>
              <text x="30" y="14" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="bold">${segment.highway}</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(60, 20),
          anchor: new google.maps.Point(30, 10)
        },
        title: `${segment.highway} - ${segment.description}`,
        zIndex: 500
      });
    }
  });

  console.log('✅ Static Route 66 polyline created with highway markers');
};

// Create polyline for a specific segment
const createSegmentPolyline = (map: google.maps.Map, waypoints: any[], highway: string) => {
  const path = waypoints.map(point => 
    new google.maps.LatLng(point.lat, point.lng)
  );
  
  new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#DC2626',
    strokeOpacity: 0.8,
    strokeWeight: 5,
    map: map,
    zIndex: 900
  });
};

export default SimpleRoute66Service;
