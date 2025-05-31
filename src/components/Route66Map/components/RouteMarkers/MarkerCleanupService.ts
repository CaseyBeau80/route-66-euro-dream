
import type { MarkerRefs } from './types';

export class MarkerCleanupService {
  static cleanupMarkers(markerRefs: MarkerRefs): void {
    console.log(`🧹 Cleaning up ${markerRefs.markersRef.current.length} markers`);
    
    markerRefs.markersRef.current.forEach((marker, index) => {
      try {
        this.cleanupSingleMarker(marker, index, markerRefs);
        console.log(`✅ Cleaned up marker ${index + 1}`);
      } catch (error) {
        console.error(`❌ Error cleaning up marker ${index + 1}:`, error);
      }
    });
    
    this.resetMarkerReferences(markerRefs);
    console.log('✅ Marker cleanup completed');
  }

  private static cleanupSingleMarker(
    marker: google.maps.Marker, 
    index: number, 
    markerRefs: MarkerRefs
  ): void {
    const infoWindow = markerRefs.infoWindowsRef.current.get(marker);
    if (infoWindow) {
      infoWindow.close();
    }
    
    // Clean up zoom listener if it exists
    if ((marker as any)._zoomListener) {
      google.maps.event.removeListener((marker as any)._zoomListener);
    }
    
    google.maps.event.clearInstanceListeners(marker);
    marker.setMap(null);
  }

  private static resetMarkerReferences(markerRefs: MarkerRefs): void {
    markerRefs.markersRef.current = [];
    markerRefs.infoWindowsRef.current = new WeakMap();
  }
}
