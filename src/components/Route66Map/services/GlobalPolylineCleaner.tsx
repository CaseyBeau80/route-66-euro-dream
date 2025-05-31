
// Global polyline cleanup service to prevent multiple overlapping routes
export class GlobalPolylineCleaner {
  private static activePolylines: Set<google.maps.Polyline> = new Set();
  private static isCleaningInProgress = false;

  static registerPolyline(polyline: google.maps.Polyline) {
    console.log('📝 GlobalPolylineCleaner: Registering new polyline');
    this.activePolylines.add(polyline);
  }

  static unregisterPolyline(polyline: google.maps.Polyline) {
    console.log('📝 GlobalPolylineCleaner: Unregistering polyline');
    this.activePolylines.delete(polyline);
  }

  static async cleanupAllPolylines(map: google.maps.Map): Promise<void> {
    if (this.isCleaningInProgress) {
      console.log('🧹 GlobalPolylineCleaner: Cleanup already in progress, skipping');
      return;
    }

    this.isCleaningInProgress = true;
    console.log(`🧹 GlobalPolylineCleaner: Starting nuclear cleanup of ${this.activePolylines.size} registered polylines`);

    try {
      // Remove all registered polylines
      let index = 0;
      this.activePolylines.forEach((polyline) => {
        index++;
        console.log(`🧹 Removing registered polyline ${index}`);
        polyline.setMap(null);
      });
      this.activePolylines.clear();

      // Clear map overlays
      const mapInstance = map as any;
      if (mapInstance.overlayMapTypes) {
        mapInstance.overlayMapTypes.clear();
        console.log('🧹 Cleared map overlay types');
      }

      // Additional cleanup after a delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (mapInstance.overlayMapTypes) {
        mapInstance.overlayMapTypes.clear();
        console.log('🧹 Secondary overlay cleanup completed');
      }

      console.log('✅ GlobalPolylineCleaner: Nuclear cleanup completed successfully');
    } catch (error) {
      console.error('❌ GlobalPolylineCleaner: Error during cleanup:', error);
    } finally {
      this.isCleaningInProgress = false;
    }
  }

  static getActivePolylineCount(): number {
    return this.activePolylines.size;
  }

  static isCleaningActive(): boolean {
    return this.isCleaningInProgress;
  }
}
