
// Enhanced global polyline cleanup service with comprehensive overlay error handling
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
    console.log(`🧹 GlobalPolylineCleaner: Starting COMPREHENSIVE cleanup of ${this.activePolylines.size} registered polylines`);

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

      // STEP 3: Enhanced overlay cleanup with comprehensive error handling
      const mapInstance = map as any;
      if (mapInstance.overlayMapTypes) {
        console.log('🧹 Starting enhanced overlay cleanup');
        
        // Log overlay information for debugging
        const overlayCount = mapInstance.overlayMapTypes.getLength();
        console.log(`🔍 Found ${overlayCount} overlays to clean`);
        
        for (let i = 0; i < overlayCount; i++) {
          try {
            const overlay = mapInstance.overlayMapTypes.getAt(i);
            console.log(`🔍 Overlay ${i} inspection:`, {
              type: typeof overlay,
              hasRemove: typeof overlay?.remove === 'function',
              hasSetMap: typeof overlay?.setMap === 'function',
              constructor: overlay?.constructor?.name
            });
          } catch (inspectionError) {
            console.warn(`⚠️ Error inspecting overlay ${i}:`, inspectionError);
          }
        }
        
        // Enhanced overlay removal with multiple strategies
        for (let i = overlayCount - 1; i >= 0; i--) {
          try {
            const overlay = mapInstance.overlayMapTypes.getAt(i);
            console.log(`🧹 Cleaning overlay ${i}`);
            
            if (overlay) {
              // Strategy 1: Try overlay.remove() if available
              if (typeof overlay.remove === 'function') {
                console.log(`🧹 Using overlay.remove() for overlay ${i}`);
                overlay.remove();
              }
              // Strategy 2: Try overlay.setMap(null) if available
              else if (typeof overlay.setMap === 'function') {
                console.log(`🧹 Using overlay.setMap(null) for overlay ${i}`);
                overlay.setMap(null);
              }
              // Strategy 3: Remove from overlayMapTypes collection
              else {
                console.log(`🧹 Removing overlay ${i} from collection`);
                mapInstance.overlayMapTypes.removeAt(i);
              }
            }
          } catch (overlayError) {
            console.error(`❌ Error cleaning overlay ${i}:`, overlayError);
            
            // Fallback: try to remove from collection
            try {
              mapInstance.overlayMapTypes.removeAt(i);
              console.log(`✅ Fallback removal successful for overlay ${i}`);
            } catch (fallbackError) {
              console.error(`❌ Fallback removal failed for overlay ${i}:`, fallbackError);
            }
          }
        }
        
        // Final safety clear
        try {
          mapInstance.overlayMapTypes.clear();
          console.log('🧹 Final overlay collection clear completed');
        } catch (clearError) {
          console.warn('⚠️ Error during final overlay clear:', clearError);
        }
      }

      // STEP 4: Enhanced Google Maps event listener cleanup
      if (window.google?.maps?.event) {
        try {
          console.log('🧹 Clearing Google Maps event listeners');
          google.maps.event.clearInstanceListeners(map);
          console.log('✅ Event listeners cleared successfully');
        } catch (eventError) {
          console.error('❌ Error clearing event listeners:', eventError);
        }
      }

      // STEP 5: Additional safety cleanup delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // STEP 6: Secondary overlay cleanup (belt and suspenders)
      if (mapInstance.overlayMapTypes) {
        try {
          const remainingCount = mapInstance.overlayMapTypes.getLength();
          if (remainingCount > 0) {
            console.log(`🧹 Secondary cleanup: ${remainingCount} overlays still present`);
            mapInstance.overlayMapTypes.clear();
            console.log('🧹 Secondary overlay cleanup completed');
          }
        } catch (secondaryError) {
          console.warn('⚠️ Error during secondary overlay cleanup:', secondaryError);
        }
      }

      // STEP 7: Force garbage collection hints
      if (mapInstance.overlayMapTypes) {
        try {
          // Try to remove any remaining overlays by index
          for (let i = mapInstance.overlayMapTypes.getLength() - 1; i >= 0; i--) {
            try {
              mapInstance.overlayMapTypes.removeAt(i);
            } catch (indexError) {
              // Ignore errors - this is belt and suspenders cleanup
            }
          }
        } catch (indexCleanupError) {
          console.warn('⚠️ Error during index-based cleanup:', indexCleanupError);
        }
      }

      console.log('✅ GlobalPolylineCleaner: COMPREHENSIVE cleanup completed successfully');
    } catch (error) {
      console.error('❌ GlobalPolylineCleaner: Error during COMPREHENSIVE cleanup:', error);
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
