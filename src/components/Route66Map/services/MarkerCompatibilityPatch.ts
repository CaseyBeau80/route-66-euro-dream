/**
 * Marker Compatibility Patch
 * Patches the global google.maps.Marker to use AdvancedMarkerElement under the hood
 * This provides immediate compatibility without changing any existing code
 */

import { CompatibleMarker } from './CompatibleMarkerService';

interface MarkerPatchConfig {
  enableLogging?: boolean;
}

export class MarkerCompatibilityPatch {
  private static isPatched = false;
  private static originalMarker: any = null;

  /**
   * Applies the compatibility patch to google.maps.Marker
   */
  static apply(config: MarkerPatchConfig = {}): void {
    if (this.isPatched) {
      console.log('🔧 MarkerCompatibilityPatch: Already applied');
      return;
    }

    // Wait for Google Maps to be loaded
    if (!window.google?.maps?.Marker) {
      console.log('⏳ MarkerCompatibilityPatch: Waiting for Google Maps to load...');
      setTimeout(() => this.apply(config), 100);
      return;
    }

    // Wait for marker library to be loaded
    if (!window.google?.maps?.marker?.AdvancedMarkerElement) {
      console.log('⏳ MarkerCompatibilityPatch: Waiting for marker library to load...');
      setTimeout(() => this.apply(config), 100);
      return;
    }

    try {
      console.log('🔧 MarkerCompatibilityPatch: Applying compatibility patch...');

      // Store the original Marker constructor
      this.originalMarker = window.google.maps.Marker;

      // Replace google.maps.Marker with our CompatibleMarker
      window.google.maps.Marker = function(options: any) {
        if (config.enableLogging) {
          console.log('🔄 MarkerCompatibilityPatch: Intercepted Marker creation, using CompatibleMarker');
        }
        
        const compatibleMarker = new CompatibleMarker(options);
        
        // Return an object that mimics the old Marker API but uses CompatibleMarker internally
        return {
          // Core properties
          getPosition: () => compatibleMarker.getPosition(),
          setPosition: (pos: any) => compatibleMarker.setPosition(pos),
          getMap: () => compatibleMarker.getMap(),
          setMap: (map: any) => compatibleMarker.setMap(map),
          getVisible: () => compatibleMarker.getVisible(),
          setVisible: (visible: boolean) => compatibleMarker.setVisible(visible),
          getTitle: () => compatibleMarker.getTitle(),
          setTitle: (title: string) => compatibleMarker.setTitle(title),
          getZIndex: () => compatibleMarker.getZIndex(),
          setZIndex: (zIndex: number) => compatibleMarker.setZIndex(zIndex),
          setAnimation: (animation: any) => compatibleMarker.setAnimation(animation),
          addListener: (event: string, callback: () => void) => compatibleMarker.addListener(event, callback),
          
          // Internal access for debugging
          _compatibleMarker: compatibleMarker,
          _isPatched: true
        };
      } as any;

      // Copy static properties from original Marker if they exist
      try {
        Object.defineProperty(window.google.maps.Marker, 'MAX_ZINDEX', {
          value: this.originalMarker.MAX_ZINDEX,
          writable: false,
          enumerable: true,
          configurable: true
        });
      } catch (e) {
        // Ignore if we can't copy static properties
      }

      this.isPatched = true;
      console.log('✅ MarkerCompatibilityPatch: Successfully applied! All Marker instances will now use AdvancedMarkerElement');

    } catch (error) {
      console.error('❌ MarkerCompatibilityPatch: Failed to apply patch:', error);
      throw error;
    }
  }

  /**
   * Removes the compatibility patch (for testing/debugging)
   */
  static remove(): void {
    if (!this.isPatched || !this.originalMarker) {
      console.log('🔧 MarkerCompatibilityPatch: No patch to remove');
      return;
    }

    try {
      window.google.maps.Marker = this.originalMarker;
      this.isPatched = false;
      this.originalMarker = null;
      console.log('✅ MarkerCompatibilityPatch: Successfully removed');
    } catch (error) {
      console.error('❌ MarkerCompatibilityPatch: Failed to remove patch:', error);
    }
  }

  /**
   * Checks if the patch is currently applied
   */
  static isPatchApplied(): boolean {
    return this.isPatched;
  }
}