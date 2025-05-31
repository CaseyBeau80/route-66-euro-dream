
import { RouteGlobalState } from './RouteGlobalState';

export class RoutePolylineManager {
  constructor(private map: google.maps.Map) {}

  createPolylines(smoothRoutePath: google.maps.LatLngLiteral[]): void {
    if (smoothRoutePath.length === 0) {
      console.error('❌ Cannot create polylines with empty route path');
      return;
    }

    // Create main route polyline with enhanced styling
    const mainPolyline = new google.maps.Polyline({
      path: smoothRoutePath,
      geodesic: true,
      strokeColor: '#2C2C2C',
      strokeOpacity: 0.9,
      strokeWeight: 10,
      zIndex: 1000,
      clickable: false
    });

    // Create center dashed line for authentic Route 66 look
    const centerLine = new google.maps.Polyline({
      path: smoothRoutePath,
      geodesic: true,
      strokeColor: '#FFD700',
      strokeOpacity: 0,
      strokeWeight: 0,
      zIndex: 1001,
      clickable: false,
      icons: [{
        icon: {
          path: 'M 0,-2 0,2',
          strokeOpacity: 1,
          strokeColor: '#FFD700',
          strokeWeight: 3,
          scale: 1
        },
        offset: '0%',
        repeat: '30px'
      }]
    });

    // Add polylines to map
    mainPolyline.setMap(this.map);
    centerLine.setMap(this.map);

    // Store in global state
    RouteGlobalState.setSmoothPolyline(mainPolyline);
    RouteGlobalState.setCenterLine(centerLine);
  }

  fitMapToBounds(smoothRoutePath: google.maps.LatLngLiteral[]): void {
    if (smoothRoutePath.length === 0) return;

    setTimeout(() => {
      const bounds = new google.maps.LatLngBounds();
      smoothRoutePath.forEach(point => {
        bounds.extend(new google.maps.LatLng(point.lat, point.lng));
      });
      this.map.fitBounds(bounds, { 
        top: 60, 
        right: 60, 
        bottom: 60, 
        left: 60 
      });
    }, 1000);
  }

  cleanupPolylines(): void {
    const smoothPolyline = RouteGlobalState.getSmoothPolyline();
    const centerLine = RouteGlobalState.getCenterLine();

    if (smoothPolyline) {
      smoothPolyline.setMap(null);
      RouteGlobalState.setSmoothPolyline(null);
    }
    
    if (centerLine) {
      centerLine.setMap(null);
      RouteGlobalState.setCenterLine(null);
    }
  }
}
