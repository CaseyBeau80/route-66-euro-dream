
import { RouteSegment } from './types';
import { route66HighwayWaypoints } from './waypointsData';

export class SegmentsService {
  static getHighwaySegments(): RouteSegment[] {
    return [
      {
        start: 0, end: 4, highway: "I-55", description: "Illinois via I-55 (Historic US-66)",
        waypoints: route66HighwayWaypoints.slice(0, 5)
      },
      {
        start: 4, end: 8, highway: "I-44", description: "Missouri via I-44 (Historic US-66)",
        waypoints: route66HighwayWaypoints.slice(4, 9)
      },
      {
        start: 8, end: 11, highway: "I-44/I-40", description: "Oklahoma via I-44 and I-40",
        waypoints: route66HighwayWaypoints.slice(8, 12)
      },
      {
        start: 11, end: 12, highway: "I-40", description: "Texas via I-40",
        waypoints: route66HighwayWaypoints.slice(11, 13)
      },
      {
        start: 12, end: 15, highway: "I-40", description: "New Mexico via I-40",
        waypoints: route66HighwayWaypoints.slice(12, 16)
      },
      {
        start: 15, end: 19, highway: "I-40/Historic US-66", description: "Arizona via I-40 and Historic US-66",
        waypoints: route66HighwayWaypoints.slice(15, 20)
      },
      {
        start: 19, end: 23, highway: "I-40/I-15/Local", description: "California via I-40, I-15, and Local Roads",
        waypoints: route66HighwayWaypoints.slice(19, 24)
      }
    ];
  }

  static createFallbackPolyline(map: google.maps.Map, segmentWaypoints: Array<{lat: number, lng: number, description: string}>): google.maps.Polyline {
    const fallbackPath = segmentWaypoints.map(point => 
      new google.maps.LatLng(point.lat, point.lng)
    );
    
    return new google.maps.Polyline({
      path: fallbackPath,
      geodesic: true,
      strokeColor: '#DC2626',
      strokeOpacity: 0.7,
      strokeWeight: 4,
      map: map,
      zIndex: 50
    });
  }

  static createDirectionsRenderer(): google.maps.DirectionsRenderer {
    return new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: {
        strokeColor: '#DC2626',
        strokeOpacity: 1.0,
        strokeWeight: 6,
        zIndex: 100
      }
    });
  }

  static prepareWaypoints(segmentWaypoints: Array<{lat: number, lng: number, description: string}>): google.maps.DirectionsWaypoint[] {
    if (segmentWaypoints.length < 2) return [];

    const intermediateWaypoints = segmentWaypoints.slice(1, -1);
    
    // Use intermediate waypoints strategically (max 8 per request)
    return intermediateWaypoints.length <= 8 ? 
      intermediateWaypoints.map(point => ({
        location: new google.maps.LatLng(point.lat, point.lng),
        stopover: false
      })) : 
      // If too many waypoints, select key ones
      intermediateWaypoints.filter((_, idx) => idx % Math.ceil(intermediateWaypoints.length / 6) === 0)
        .map(point => ({
          location: new google.maps.LatLng(point.lat, point.lng),
          stopover: false
        }));
  }
}
