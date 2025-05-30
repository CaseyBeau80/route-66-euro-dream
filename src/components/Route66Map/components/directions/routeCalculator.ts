
import { RouteSegment, RouteCalculationResult } from './types';
import { SegmentsService } from './segmentsService';

export class RouteCalculator {
  private directionsService: google.maps.DirectionsService;
  private map: google.maps.Map;
  private onRouteCalculated?: (success: boolean) => void;

  constructor(
    directionsService: google.maps.DirectionsService, 
    map: google.maps.Map, 
    onRouteCalculated?: (success: boolean) => void
  ) {
    this.directionsService = directionsService;
    this.map = map;
    this.onRouteCalculated = onRouteCalculated;
  }

  calculateRoutes(segments: RouteSegment[], renderers: google.maps.DirectionsRenderer[]): void {
    let successfulSegments = 0;
    let completedSegments = 0;

    console.log(`🛣️ Calculating ${segments.length} highway-specific Route 66 segments`);

    segments.forEach((segment, index) => {
      const renderer = renderers[index];
      const segmentWaypoints = segment.waypoints;
      
      if (segmentWaypoints.length < 2) {
        completedSegments++;
        this.checkCompletion(completedSegments, segments.length, successfulSegments);
        return;
      }

      const request = this.createDirectionsRequest(segmentWaypoints);
      
      console.log(`🚗 Calculating ${segment.description} (${segmentWaypoints.length} waypoints)`);

      this.directionsService.route(request, (result, status) => {
        completedSegments++;
        
        if (status === google.maps.DirectionsStatus.OK && result) {
          console.log(`✅ ${segment.description} calculated successfully via ${segment.highway}`);
          renderer.setDirections(result);
          successfulSegments++;
        } else {
          console.warn(`⚠️ ${segment.description} failed (${status}), creating fallback polyline`);
          SegmentsService.createFallbackPolyline(this.map, segmentWaypoints);
        }

        this.checkCompletion(completedSegments, segments.length, successfulSegments);
      });
    });
  }

  private createDirectionsRequest(segmentWaypoints: Array<{lat: number, lng: number, description: string}>): google.maps.DirectionsRequest {
    const origin = segmentWaypoints[0];
    const destination = segmentWaypoints[segmentWaypoints.length - 1];
    const waypoints = SegmentsService.prepareWaypoints(segmentWaypoints);

    return {
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(destination.lat, destination.lng),
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false, // Maintain historic Route 66 order
      avoidHighways: false, // We WANT to use highways
      avoidTolls: false,
      provideRouteAlternatives: false,
      region: 'US'
    };
  }

  private checkCompletion(completedSegments: number, totalSegments: number, successfulSegments: number): void {
    if (completedSegments === totalSegments) {
      const successRate = successfulSegments / totalSegments;
      console.log(`🏁 Route 66 calculation complete: ${successfulSegments}/${totalSegments} segments successful (${Math.round(successRate * 100)}%)`);
      
      if (this.onRouteCalculated) {
        this.onRouteCalculated(successRate > 0.4); // Success if more than 40% worked
      }
    }
  }
}
