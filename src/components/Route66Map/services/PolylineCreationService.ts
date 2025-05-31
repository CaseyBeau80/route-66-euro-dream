
import { RouteGlobalState } from './RouteGlobalState';
import { PathInterpolationService } from './PathInterpolationService';
import { PolylineStylesConfig } from './PolylineStylesConfig';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class PolylineCreationService {
  private pathInterpolator: PathInterpolationService;

  constructor(private map: google.maps.Map) {
    this.pathInterpolator = new PathInterpolationService();
  }

  createRouteSegments(sortedMajorStops: Route66Waypoint[]): void {
    console.log(`🏛️ Creating ${sortedMajorStops.length - 1} ASPHALT-COLORED road segments with YELLOW stripes:`);

    // Create curved segments between consecutive major stops (city-to-city)
    for (let i = 0; i < sortedMajorStops.length - 1; i++) {
      const startCity = sortedMajorStops[i];
      const endCity = sortedMajorStops[i + 1];
      const prevCity = i > 0 ? sortedMajorStops[i - 1] : undefined;
      const nextCity = i < sortedMajorStops.length - 2 ? sortedMajorStops[i + 2] : undefined;
      
      console.log(`🛣️ Creating ASPHALT segment ${i + 1}: ${startCity.name} → ${endCity.name}`);
      
      // Generate windy, curved path between cities
      const windyPath = this.pathInterpolator.generateWindyPath(startCity, endCity, prevCity, nextCity);

      this.createSegmentPolylines(windyPath, startCity.name, endCity.name);
    }
  }

  private createSegmentPolylines(path: google.maps.LatLngLiteral[], startCityName: string, endCityName: string): void {
    // Create main route polyline with realistic old asphalt appearance
    const mainPolylineOptions = PolylineStylesConfig.getMainPolylineOptions();
    const mainPolyline = new google.maps.Polyline({
      ...mainPolylineOptions,
      path: path,
      map: this.map // Add directly to map
    });

    // Create BRIGHT YELLOW center line for authentic Route 66 look
    const centerLineOptions = PolylineStylesConfig.getCenterLineOptions();
    const centerLine = new google.maps.Polyline({
      ...centerLineOptions,
      path: path,
      map: this.map // Add directly to map
    });

    // Store in global state for cleanup
    RouteGlobalState.addPolylineSegment(mainPolyline);
    RouteGlobalState.addPolylineSegment(centerLine);

    console.log(`✅ ASPHALT Route 66 segment with YELLOW stripes created: ${startCityName} → ${endCityName} with ${path.length} points`);
  }
}
