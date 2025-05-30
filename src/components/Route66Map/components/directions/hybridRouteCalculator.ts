
import { RouteSegment, RouteCalculationResult } from './types';
import { SegmentsService } from './segmentsService';
import { CityFallbackService } from './cityFallbackService';
import { WaypointOptimizer } from './waypointOptimizer';

export class HybridRouteCalculator {
  private directionsService: google.maps.DirectionsService;
  private map: google.maps.Map;
  private onRouteCalculated?: (success: boolean, fallbackUsed: boolean, segments: RouteSegment[]) => void;

  constructor(
    directionsService: google.maps.DirectionsService, 
    map: google.maps.Map, 
    onRouteCalculated?: (success: boolean, fallbackUsed: boolean, segments: RouteSegment[]) => void
  ) {
    this.directionsService = directionsService;
    this.map = map;
    this.onRouteCalculated = onRouteCalculated;
  }

  calculateHybridRoute(): google.maps.DirectionsRenderer[] {
    const segments = SegmentsService.getHighwaySegments();
    const renderers: google.maps.DirectionsRenderer[] = [];
    
    console.log(`🛣️ Starting hybrid calculation for ${segments.length} segments`);

    // Create renderers for each segment
    segments.forEach(() => {
      const renderer = SegmentsService.createDirectionsRenderer();
      renderer.setMap(this.map);
      renderers.push(renderer);
    });

    // Try precise coordinates first
    this.calculateWithPreciseCoordinates(segments, renderers);

    return renderers;
  }

  private calculateWithPreciseCoordinates(segments: RouteSegment[], renderers: google.maps.DirectionsRenderer[]): void {
    let successfulSegments = 0;
    let completedSegments = 0;
    let failedSegments: { segment: RouteSegment; index: number }[] = [];

    console.log('🎯 Attempting calculation with precise coordinates');

    segments.forEach((segment, index) => {
      const renderer = renderers[index];
      
      // Optimize waypoints for this segment
      const optimizedWaypoints = WaypointOptimizer.optimizeWaypoints(segment.waypoints);
      const optimizedSegment = { ...segment, waypoints: optimizedWaypoints };
      
      const request = this.createDirectionsRequest(optimizedSegment.waypoints);
      
      console.log(`🚗 Calculating ${segment.description} with ${optimizedWaypoints.length} optimized waypoints`);

      this.directionsService.route(request, (result, status) => {
        completedSegments++;
        
        if (status === google.maps.DirectionsStatus.OK && result) {
          console.log(`✅ ${segment.description} calculated successfully`);
          renderer.setDirections(result);
          successfulSegments++;
        } else {
          console.warn(`⚠️ ${segment.description} failed with precise coordinates (${status})`);
          failedSegments.push({ segment: optimizedSegment, index });
        }

        // Check if all segments are complete
        if (completedSegments === segments.length) {
          const successRate = successfulSegments / segments.length;
          
          if (failedSegments.length > 0 && successRate < 0.6) {
            console.log(`🔄 Success rate too low (${Math.round(successRate * 100)}%), trying city fallback for failed segments`);
            this.fallbackToCityNames(failedSegments, renderers, segments, successfulSegments);
          } else {
            this.reportCompletion(successfulSegments, segments.length, false, segments);
          }
        }
      });
    });
  }

  private fallbackToCityNames(
    failedSegments: { segment: RouteSegment; index: number }[], 
    renderers: google.maps.DirectionsRenderer[],
    allSegments: RouteSegment[],
    initialSuccessCount: number
  ): void {
    let fallbackSuccessCount = 0;
    let fallbackCompletedCount = 0;

    console.log(`🏙️ Attempting city fallback for ${failedSegments.length} failed segments`);

    failedSegments.forEach(({ segment, index }) => {
      const renderer = renderers[index];
      const cityWaypoints = CityFallbackService.convertToCityNames(segment.waypoints);
      const fallbackRequest = this.createCityFallbackRequest(cityWaypoints);
      
      console.log(`🏙️ Fallback calculation for ${segment.description} using city names`);

      this.directionsService.route(fallbackRequest, (result, status) => {
        fallbackCompletedCount++;
        
        if (status === google.maps.DirectionsStatus.OK && result) {
          console.log(`✅ ${segment.description} successful with city fallback`);
          renderer.setDirections(result);
          fallbackSuccessCount++;
        } else {
          console.warn(`❌ ${segment.description} failed even with city fallback (${status})`);
          // Create basic polyline as last resort
          SegmentsService.createFallbackPolyline(this.map, segment.waypoints);
        }

        // Check if all fallback attempts are complete
        if (fallbackCompletedCount === failedSegments.length) {
          const totalSuccessful = initialSuccessCount + fallbackSuccessCount;
          this.reportCompletion(totalSuccessful, allSegments.length, true, allSegments);
        }
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
      optimizeWaypoints: false,
      avoidHighways: false,
      avoidTolls: false,
      region: 'US'
    };
  }

  private createCityFallbackRequest(cityWaypoints: string[]): google.maps.DirectionsRequest {
    if (cityWaypoints.length < 2) {
      throw new Error('Need at least 2 city waypoints for fallback');
    }

    const origin = cityWaypoints[0];
    const destination = cityWaypoints[cityWaypoints.length - 1];
    const waypoints = cityWaypoints.slice(1, -1).map(city => ({
      location: city,
      stopover: false
    }));

    return {
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false,
      avoidHighways: false,
      avoidTolls: false,
      region: 'US'
    };
  }

  private reportCompletion(successfulSegments: number, totalSegments: number, fallbackUsed: boolean, segments: RouteSegment[]): void {
    const successRate = successfulSegments / totalSegments;
    console.log(`🏁 Hybrid route calculation complete: ${successfulSegments}/${totalSegments} segments successful (${Math.round(successRate * 100)}%)`);
    
    if (this.onRouteCalculated) {
      this.onRouteCalculated(successRate > 0.4, fallbackUsed, segments);
    }
  }
}
