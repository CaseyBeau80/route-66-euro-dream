
export class MarkerAnimationUtils {
  /**
   * Triggers an enhanced jiggle animation on a Google Maps marker
   * Combines bounce animation with custom scaling for better visibility
   */
  static triggerEnhancedJiggle(marker: google.maps.Marker, markerName: string) {
    if (!marker) return;

    console.log(`🎯 Enhanced jiggle animation for: ${markerName}`);

    // Method 1: Use Google Maps bounce animation for immediate effect
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => {
      marker.setAnimation(null);
    }, 1000); // Longer duration for more noticeable effect

    // Method 2: Enhanced DOM targeting with improved scaling
    this.applyCustomJiggleAnimation(marker, markerName);
  }

  /**
   * Applies custom CSS animation to marker DOM elements
   */
  private static applyCustomJiggleAnimation(marker: google.maps.Marker, markerName: string) {
    const position = marker.getPosition();
    if (!position) return;

    const map = marker.getMap() as google.maps.Map;
    if (!map) return;

    const mapDiv = map.getDiv();
    
    // Enhanced timing for better coordination with bounce
    setTimeout(() => {
      // Target all potential marker elements
      const markerElements = mapDiv.querySelectorAll('img[src*="data:image/svg+xml"], div[style*="transform"]');
      
      markerElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        
        // Check if this element is within the map bounds
        if (this.isElementInMapBounds(htmlElement, mapDiv)) {
          console.log(`🎨 Applying enhanced jiggle to marker element for: ${markerName}`);
          
          // Apply enhanced jiggle animation with scaling
          htmlElement.style.animation = 'none';
          htmlElement.offsetHeight; // Force reflow
          htmlElement.style.animation = 'marker-jiggle 1.2s ease-in-out';
          htmlElement.style.transformOrigin = 'center bottom'; // Scale from bottom center
          
          // Clean up animation
          setTimeout(() => {
            htmlElement.style.animation = '';
            htmlElement.style.transformOrigin = '';
          }, 1200);
        }
      });
    }, 100); // Slight delay to coordinate with bounce
  }

  /**
   * Check if an element is within the map bounds
   */
  private static isElementInMapBounds(element: HTMLElement, mapDiv: HTMLElement): boolean {
    try {
      const rect = element.getBoundingClientRect();
      const mapRect = mapDiv.getBoundingClientRect();
      
      return (
        rect.top >= mapRect.top && 
        rect.bottom <= mapRect.bottom &&
        rect.left >= mapRect.left && 
        rect.right <= mapRect.right &&
        rect.width > 10 && // Ensure it's not a tiny element
        rect.height > 10
      );
    } catch (error) {
      console.warn('Error checking element bounds:', error);
      return false;
    }
  }

  /**
   * Triggers jiggle animation for Advanced Marker Elements (if available)
   */
  static triggerAdvancedMarkerJiggle(marker: google.maps.marker.AdvancedMarkerElement | google.maps.Marker, markerName: string) {
    console.log(`🎯 Advanced marker jiggle for: ${markerName}`);
    
    // Check if it's an AdvancedMarkerElement
    if ('content' in marker) {
      const content = marker.content as HTMLElement;
      if (content) {
        content.style.animation = 'marker-jiggle 1.2s ease-in-out';
        content.style.transformOrigin = 'center bottom';
        
        setTimeout(() => {
          content.style.animation = '';
          content.style.transformOrigin = '';
        }, 1200);
      }
    } else {
      // Fallback to regular marker animation
      this.triggerEnhancedJiggle(marker as google.maps.Marker, markerName);
    }
  }
}
