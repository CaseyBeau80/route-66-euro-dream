
export class IconScalingService {
  private static readonly ZOOM_THRESHOLDS = {
    CLOSE_ZOOM: 12,
    MEDIUM_ZOOM: 8,
    FAR_ZOOM: 5
  };

  private static readonly SIZE_MULTIPLIERS = {
    MOBILE: 1.2,
    TABLET: 1.1,
    DESKTOP: 1.0
  };

  private static iconCache = new Map<string, google.maps.Icon>();

  /**
   * Determines if close zoom scaling should be applied
   */
  static shouldUseCloseZoom(currentZoom: number): boolean {
    return currentZoom >= this.ZOOM_THRESHOLDS.CLOSE_ZOOM;
  }

  /**
   * Gets the appropriate size multiplier based on device type
   */
  static getDeviceSizeMultiplier(): number {
    if (typeof window === 'undefined') return this.SIZE_MULTIPLIERS.DESKTOP;
    
    const width = window.innerWidth;
    if (width < 768) return this.SIZE_MULTIPLIERS.MOBILE;
    if (width < 1024) return this.SIZE_MULTIPLIERS.TABLET;
    return this.SIZE_MULTIPLIERS.DESKTOP;
  }

  /**
   * Creates a cache key for icon optimization
   */
  static createCacheKey(iconType: string, isCloseZoom: boolean, deviceMultiplier: number): string {
    return `${iconType}-${isCloseZoom ? 'close' : 'normal'}-${deviceMultiplier}`;
  }

  /**
   * Gets or creates a cached icon for performance
   */
  static getCachedIcon(
    iconType: 'attraction' | 'hiddenGem',
    isCloseZoom: boolean,
    iconCreator: () => google.maps.Icon
  ): google.maps.Icon {
    const deviceMultiplier = this.getDeviceSizeMultiplier();
    const cacheKey = this.createCacheKey(iconType, isCloseZoom, deviceMultiplier);
    
    if (this.iconCache.has(cacheKey)) {
      return this.iconCache.get(cacheKey)!;
    }
    
    const icon = iconCreator();
    
    // Apply device-specific scaling
    if (icon.scaledSize && deviceMultiplier !== 1.0) {
      const originalSize = icon.scaledSize;
      icon.scaledSize = new google.maps.Size(
        Math.round(originalSize.width * deviceMultiplier),
        Math.round(originalSize.height * deviceMultiplier)
      );
      
      // Adjust anchor point proportionally
      if (icon.anchor) {
        icon.anchor = new google.maps.Point(
          Math.round(icon.anchor.x * deviceMultiplier),
          Math.round(icon.anchor.y * deviceMultiplier)
        );
      }
    }
    
    this.iconCache.set(cacheKey, icon);
    return icon;
  }

  /**
   * Clears the icon cache to free memory
   */
  static clearCache(): void {
    console.log('🧹 IconScalingService: Clearing icon cache');
    this.iconCache.clear();
  }

  /**
   * Gets cache statistics for debugging
   */
  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.iconCache.size,
      keys: Array.from(this.iconCache.keys())
    };
  }

  /**
   * Preloads icons for better performance
   */
  static preloadIcons(): void {
    console.log('🚀 IconScalingService: Preloading common icon combinations');
    
    const iconTypes: Array<'attraction' | 'hiddenGem'> = ['attraction', 'hiddenGem'];
    const zoomLevels = [false, true];
    
    iconTypes.forEach(iconType => {
      zoomLevels.forEach(isCloseZoom => {
        // Preload for current device
        const cacheKey = this.createCacheKey(iconType, isCloseZoom, this.getDeviceSizeMultiplier());
        if (!this.iconCache.has(cacheKey)) {
          // This would be implemented by the calling component with the appropriate creator
          console.log(`📦 Preloading ${iconType} icon for ${isCloseZoom ? 'close' : 'normal'} zoom`);
        }
      });
    });
  }

  /**
   * Optimizes icon rendering based on map performance
   */
  static shouldSkipIconOptimization(mapBounds: google.maps.LatLngBounds, markerCount: number): boolean {
    // Skip heavy optimizations if there are too many markers visible
    const MAX_OPTIMIZED_MARKERS = 50;
    return markerCount > MAX_OPTIMIZED_MARKERS;
  }

  /**
   * Gets recommended icon update frequency based on zoom speed
   */
  static getIconUpdateFrequency(zoomSpeed: number): number {
    // Throttle icon updates during rapid zooming
    if (zoomSpeed > 2) return 300; // 300ms delay
    if (zoomSpeed > 1) return 150; // 150ms delay
    return 50; // 50ms delay for smooth transitions
  }
}
