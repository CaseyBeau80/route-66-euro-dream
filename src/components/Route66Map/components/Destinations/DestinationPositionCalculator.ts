
import type { Route66Waypoint } from '../../types/supabaseTypes';

export class DestinationPositionCalculator {
  static calculateHoverPosition(
    destination: Route66Waypoint,
    map: google.maps.Map,
    updatePosition: (x: number, y: number) => void
  ): void {
    console.log(`📍 Calculating hover position for ${destination.name}`);
    
    try {
      // Get the map container bounds
      const mapDiv = map.getDiv();
      const mapBounds = mapDiv.getBoundingClientRect();
      
      // Create LatLng object
      const latLng = new google.maps.LatLng(destination.latitude, destination.longitude);
      
      // Get the overlay view to convert lat/lng to pixel coordinates
      const overlayView = new google.maps.OverlayView();
      overlayView.setMap(map);
      
      // Wait for the overlay to be ready
      const checkOverlay = () => {
        const projection = overlayView.getProjection();
        if (projection) {
          // Convert lat/lng to container pixel coordinates
          const point = projection.fromLatLngToContainerPixel(latLng);
          
          if (point) {
            // Calculate absolute screen position
            const screenX = mapBounds.left + point.x;
            const screenY = mapBounds.top + point.y;
            
            console.log(`📍 Position calculated for ${destination.name}:`, {
              lat: destination.latitude,
              lng: destination.longitude,
              containerPixel: { x: point.x, y: point.y },
              mapBounds: { left: mapBounds.left, top: mapBounds.top },
              screenPosition: { x: screenX, y: screenY }
            });
            
            updatePosition(screenX, screenY);
          } else {
            console.warn(`⚠️ Could not get pixel coordinates for ${destination.name}`);
            // Fallback to approximate position
            const centerX = mapBounds.left + mapBounds.width / 2;
            const centerY = mapBounds.top + mapBounds.height / 2;
            updatePosition(centerX, centerY);
          }
          
          // Clean up the overlay
          overlayView.setMap(null);
        } else {
          // If projection not ready, try again in next frame
          requestAnimationFrame(checkOverlay);
        }
      };
      
      // Start checking for overlay readiness
      requestAnimationFrame(checkOverlay);
      
    } catch (error) {
      console.error(`❌ Error calculating position for ${destination.name}:`, error);
      
      // Fallback: use map center
      const mapDiv = map.getDiv();
      const mapBounds = mapDiv.getBoundingClientRect();
      const centerX = mapBounds.left + mapBounds.width / 2;
      const centerY = mapBounds.top + mapBounds.height / 2;
      updatePosition(centerX, centerY);
    }
  }
}
