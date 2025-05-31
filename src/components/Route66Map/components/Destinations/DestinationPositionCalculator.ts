
import type { Route66Waypoint } from '../../types/supabaseTypes';

export class DestinationPositionCalculator {
  static calculateHoverPosition(
    destination: Route66Waypoint,
    map: google.maps.Map,
    updatePosition: (x: number, y: number) => void
  ): void {
    console.log(`📍 Calculating hover position for ${destination.name}`);
    
    // Calculate position for hover card
    const rect = map.getDiv().getBoundingClientRect();
    const projection = map.getProjection();
    
    if (projection) {
      const point = projection.fromLatLngToPoint(
        new google.maps.LatLng(destination.latitude, destination.longitude)
      );
      
      if (point) {
        const scale = Math.pow(2, map.getZoom());
        const worldCoordinate = new google.maps.Point(
          point.x * scale,
          point.y * scale
        );
        
        const pixelOffset = new google.maps.Point(
          Math.floor(worldCoordinate.x),
          Math.floor(worldCoordinate.y)
        );
        
        const viewportX = pixelOffset.x + rect.left;
        const viewportY = pixelOffset.y + rect.top;
        
        updatePosition(viewportX, viewportY);
      }
    }
  }
}
