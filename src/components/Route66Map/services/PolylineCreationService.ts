
import { EnhancedPolylineStylesConfig } from './EnhancedPolylineStylesConfig';
import { EnhancedPathInterpolationService } from './EnhancedPathInterpolationService';

export class PolylineCreationService {
  static createMainPolyline(map: google.maps.Map, path: google.maps.LatLngLiteral[]): google.maps.Polyline {
    return new google.maps.Polyline({
      ...EnhancedPolylineStylesConfig.getFlowingRouteOptions(),
      path,
      map
    });
  }

  static createCenterLine(map: google.maps.Map, path: google.maps.LatLngLiteral[]): google.maps.Polyline {
    return new google.maps.Polyline({
      ...EnhancedPolylineStylesConfig.getEnhancedCenterLineOptions(),
      path,
      map
    });
  }

  static createEnhancedPolyline(map: google.maps.Map, waypoints: any[]): google.maps.Polyline[] {
    console.log('🛣️ Creating enhanced flowing polyline with waypoints:', waypoints.length);
    
    // Use flowing curved path interpolation
    const coordinates = waypoints.map(wp => ({ lat: wp.latitude, lng: wp.longitude }));
    const flowingPath = EnhancedPathInterpolationService.createFlowingCurvedPath(coordinates, 25);
    
    const mainPolyline = this.createMainPolyline(map, flowingPath);
    const centerLine = this.createCenterLine(map, flowingPath);
    
    return [mainPolyline, centerLine];
  }

  static createFallbackPolyline(map: google.maps.Map, path: google.maps.LatLngLiteral[]): google.maps.Polyline {
    return new google.maps.Polyline({
      geodesic: true,
      strokeColor: '#DC2626',
      strokeOpacity: 0.7,
      strokeWeight: 4,
      path,
      map
    });
  }
}
