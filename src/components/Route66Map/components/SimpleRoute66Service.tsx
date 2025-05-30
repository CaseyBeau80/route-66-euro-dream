import React, { useEffect, useState } from 'react';
import { historicRoute66Waypoints, getHistoricRoute66Segments } from './HistoricRoute66Waypoints';

interface SimpleRoute66ServiceProps {
  map: google.maps.Map;
}

const SimpleRoute66Service: React.FC<SimpleRoute66ServiceProps> = ({ map }) => {
  const [routeRendered, setRouteRendered] = useState(false);

  useEffect(() => {
    if (!map || routeRendered) return;

    console.log('🚗 Starting Route 66 rendering process');

    // Always render the basic polyline first as a fallback
    renderBasicRoute66Polyline(map);

    // Then try to enhance with Directions API if available
    const directionsService = new google.maps.DirectionsService();
    
    const testRequest: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(41.8781, -87.6298), // Chicago
      destination: new google.maps.LatLng(41.5250, -88.0817), // Joliet
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(testRequest, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log('✅ Directions API available - enhancing with highway routing');
        // Keep the basic polyline and add highway segments on top
        renderHighwayEnhancedRoute(map, directionsService);
      } else {
        console.log('⚠️ Directions API not available - using basic polyline only');
      }
      setRouteRendered(true);
    });

    return () => {
      console.log('🧹 Cleaning up Route 66 service');
    };
  }, [map, routeRendered]);

  return null;
};

// Render a basic, always-visible Route 66 polyline
const renderBasicRoute66Polyline = (map: google.maps.Map) => {
  console.log('🗺️ Rendering basic Route 66 polyline for guaranteed visibility');
  
  // Create main route polyline with strong visibility
  const routePath = historicRoute66Waypoints.map(waypoint => ({
    lat: waypoint.lat,
    lng: waypoint.lng
  }));

  const route66Polyline = new google.maps.Polyline({
    path: routePath,
    geodesic: true,
    strokeColor: '#DC2626', // Strong red color
    strokeOpacity: 1.0, // Full opacity
    strokeWeight: 8, // Thick line for visibility
    zIndex: 1000 // High z-index to ensure visibility
  });

  route66Polyline.setMap(map);

  // Add start and end markers for context
  new google.maps.Marker({
    position: routePath[0],
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
    title: 'Route 66 Start - Chicago, IL',
    zIndex: 2000
  });

  new google.maps.Marker({
    position: routePath[routePath.length - 1],
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
    title: 'Route 66 End - Santa Monica, CA',
    zIndex: 2000
  });

  console.log('✅ Basic Route 66 polyline rendered with start/end markers');
};

// Enhance with highway-based routing if Directions API is available
const renderHighwayEnhancedRoute = (map: google.maps.Map, directionsService: google.maps.DirectionsService) => {
  const segments = getHistoricRoute66Segments();
  let successfulSegments = 0;

  console.log(`🛣️ Enhancing route with ${segments.length} highway segments`);

  segments.forEach((segment, index) => {
    const renderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: {
        strokeColor: '#DC2626',
        strokeOpacity: 0.9,
        strokeWeight: 6,
        zIndex: 1100 // Slightly higher than basic polyline
      }
    });
    
    renderer.setMap(map);

    // Get waypoints for this segment
    const segmentWaypoints = historicRoute66Waypoints.slice(segment.start, segment.end + 1);
    
    if (segmentWaypoints.length < 2) return;

    const origin = segmentWaypoints[0];
    const destination = segmentWaypoints[segmentWaypoints.length - 1];
    
    // Use fewer waypoints to avoid API limits
    const intermediateWaypoints = segmentWaypoints.slice(1, -1);
    const waypoints = intermediateWaypoints.length <= 8 ? 
      intermediateWaypoints.map(point => ({
        location: new google.maps.LatLng(point.lat, point.lng),
        stopover: false
      })) : 
      // Select key waypoints if too many
      intermediateWaypoints.filter((_, idx) => idx % Math.ceil(intermediateWaypoints.length / 8) === 0)
        .map(point => ({
          location: new google.maps.LatLng(point.lat, point.lng),
          stopover: false
        }));

    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(destination.lat, destination.lng),
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false,
      avoidHighways: false, // We want highways
      avoidTolls: false
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        console.log(`✅ Enhanced ${segment.description} with highway routing`);
        renderer.setDirections(result);
        successfulSegments++;
      } else {
        console.warn(`⚠️ Could not enhance ${segment.description}: ${status}`);
      }
    });
  });

  console.log(`🛣️ Highway enhancement process started for ${segments.length} segments`);
};

export default SimpleRoute66Service;
