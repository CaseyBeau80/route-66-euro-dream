
import type { MarkerRefs } from './types';

export class MarkerCleanupService {
  static cleanupMarkers(markerRefs: MarkerRefs): void {
    console.log(`🧹 Cleaning up ${markerRefs.markersRef.current.length} markers and removing ALL info windows`);
    
    markerRefs.markersRef.current.forEach((marker, index) => {
      try {
        this.cleanupSingleMarker(marker, index, markerRefs);
        console.log(`✅ Cleaned up marker ${index + 1} and removed any info windows`);
      } catch (error) {
        console.error(`❌ Error cleaning up marker ${index + 1}:`, error);
      }
    });
    
    this.resetMarkerReferences(markerRefs);
    console.log('✅ Marker cleanup completed - all old info windows removed');
  }

  private static cleanupSingleMarker(
    marker: google.maps.Marker, 
    index: number, 
    markerRefs: MarkerRefs
  ): void {
    // Close and remove any associated info windows
    const infoWindow = markerRefs.infoWindowsRef.current.get(marker);
    if (infoWindow) {
      infoWindow.close();
      infoWindow.setMap(null);
    }
    
    // Clean up zoom listener if it exists
    if ((marker as any)._zoomListener) {
      google.maps.event.removeListener((marker as any)._zoomListener);
    }
    
    // Clear ALL event listeners from the marker
    google.maps.event.clearInstanceListeners(marker);
    
    // Remove marker from map
    marker.setMap(null);
  }

  private static resetMarkerReferences(markerRefs: MarkerRefs): void {
    markerRefs.markersRef.current = [];
    markerRefs.infoWindowsRef.current = new WeakMap();
  }
}
