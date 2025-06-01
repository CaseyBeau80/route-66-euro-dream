
// Enhanced global polyline cleanup service to prevent multiple overlapping routes
export class GlobalPolylineCleaner {
  private static activePolylines: Set<google.maps.Polyline> = new Set();
  private static isCleaningInProgress = false;
  private static cleanupCallbacks: Set<() => void> = new Set();

  static registerPolyline(polyline: google.maps.Polyline) {
    console.log('📝 GlobalPolylineCleaner: Registering new polyline');
    this.activePolylines.add(polyline);
  }

  static unregisterPolyline(polyline: google.maps.Polyline) {
    console.log('📝 GlobalPolylineCleaner: Unregistering polyline');
    this.activePolylines.delete(polyline);
  }

  static registerCleanupCallback(callback: () => void) {
    this.cleanupCallbacks.add(callback);
  }

  static unregisterCleanupCallback(callback: () => void) {
    this.cleanupCallbacks.delete(callback);
  }

  static async cleanupAllPolylines(map: google.maps.Map): Promise<void> {
    if (this.isCleaningInProgress) {
      console.log('🧹 GlobalPolylineCleaner: Cleanup already in progress, waiting...');
      // Wait for current cleanup to complete
      while (this.isCleaningInProgress) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      return;
    }

    this.isCleaningInProgress = true;
    console.log(`🧹 GlobalPolylineCleaner: Starting ENHANCED nuclear cleanup of ${this.activePolylines.size} registered polylines`);

    try {
      // STEP 1: Execute all cleanup callbacks
      console.log(`🧹 Executing ${this.cleanupCallbacks.size} cleanup callbacks`);
      this.cleanupCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('❌ Error in cleanup callback:', error);
        }
      });

      // STEP 2: Remove all registered polylines
      let index = 0;
      this.activePolylines.forEach((polyline) => {
        index++;
        console.log(`🧹 Removing registered polyline ${index}`);
        try {
          polyline.setMap(null);
        } catch (error) {
          console.error(`❌ Error removing polyline ${index}:`, error);
        }
      });
      this.activePolylines.clear();

      // STEP 3: Clear map overlays and event listeners
      const mapInstance = map as any;
      if (mapInstance.overlayMapTypes) {
        mapInstance.overlayMapTypes.clear();
        console.log('🧹 Cleared map overlay types');
      }

      // STEP 4: Clear Google Maps event listeners
      if (window.google?.maps?.event) {
        try {
          google.maps.event.clearInstanceListeners(map);
          console.log('🧹 Cleared Google Maps event listeners');
        } catch (error) {
          console.error('❌ Error clearing event listeners:', error);
        }
      }

      // STEP 5: Additional safety cleanup delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // STEP 6: Secondary overlay cleanup (belt and suspenders)
      if (mapInstance.overlayMapTypes) {
        mapInstance.overlayMapTypes.clear();
        console.log('🧹 Secondary overlay cleanup completed');
      }

      // STEP 7: Force garbage collection hints
      if (mapInstance.overlayMapTypes) {
        mapInstance.overlayMapTypes.forEach((overlay: any, index: number) => {
          try {
            mapInstance.overlayMapTypes.removeAt(index);
          } catch (error) {
            // Ignore errors - this is belt and suspenders cleanup
          }
        });
      }

      console.log('✅ GlobalPolylineCleaner: ENHANCED nuclear cleanup completed successfully');
    } catch (error) {
      console.error('❌ GlobalPolylineCleaner: Error during ENHANCED cleanup:', error);
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

  static forceReset(): void {
    console.log('🚨 GlobalPolylineCleaner: FORCE RESET - clearing all state');
    this.activePolylines.clear();
    this.cleanupCallbacks.clear();
    this.isCleaningInProgress = false;
  }
}
