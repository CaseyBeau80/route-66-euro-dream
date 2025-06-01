
import { PolylineStylesConfig } from './PolylineStylesConfig';
import { PathInterpolationService } from './PathInterpolationService';

export class PolylineCreationService {
  static createMainPolyline(map: google.maps.Map, path: google.maps.LatLngLiteral[]): google.maps.Polyline {
    return new google.maps.Polyline({
      ...PolylineStylesConfig.getMainPolylineOptions(),
      path,
      map
    });
  }

  static createCenterLine(map: google.maps.Map, path: google.maps.LatLngLiteral[]): google.maps.Polyline {
    return new google.maps.Polyline({
      ...PolylineStylesConfig.getCenterLineOptions(),
      path,
      map
    });
  }

  static createEnhancedPolyline(map: google.maps.Map, waypoints: any[]): google.maps.Polyline[] {
    console.log('🛣️ Creating enhanced polyline with waypoints:', waypoints.length);
    
    // Use smooth path interpolation instead of the missing generateWindyPath method
    const coordinates = waypoints.map(wp => ({ lat: wp.latitude, lng: wp.longitude }));
    const smoothPath = PathInterpolationService.createSmoothPath(coordinates, 50);
    
    const mainPolyline = this.createMainPolyline(map, smoothPath);
    const centerLine = this.createCenterLine(map, smoothPath);
    
    return [mainPolyline, centerLine];
  }

  static createFallbackPolyline(map: google.maps.Map, path: google.maps.LatLngLiteral[]): google.maps.Polyline {
    return new google.maps.Polyline({
      ...PolylineStylesConfig.getFallbackPolylineOptions(),
      path,
      map
    });
  }
}
