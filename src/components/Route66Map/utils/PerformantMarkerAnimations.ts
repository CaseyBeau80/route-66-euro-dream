
export class PerformantMarkerAnimations {
  private static activeAnimations = new Map<string, number>();
  private static animationFrames = new Map<string, number>();

  /**
   * Optimized jiggle animation with performance optimizations
   */
  static triggerOptimizedJiggle(
    marker: google.maps.Marker | google.maps.marker.AdvancedMarkerElement, 
    markerName: string,
    intensity: number = 3,
    duration: number = 400
  ): void {
    // Cancel any existing animation for this marker
    this.cancelAnimation(markerName);

    console.log(`✨ Starting optimized jiggle animation for ${markerName}`);

    const startTime = performance.now();
    const originalPosition = this.getMarkerPosition(marker);
    
    if (!originalPosition) {
      console.warn(`⚠️ Could not get position for marker: ${markerName}`);
      return;
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Eased animation with bounce effect
      const easeOutBounce = (t: number): number => {
        if (t < 1/2.75) {
          return 7.5625 * t * t;
        } else if (t < 2/2.75) {
          return 7.5625 * (t -= 1.5/2.75) * t + 0.75;
        } else if (t < 2.5/2.75) {
          return 7.5625 * (t -= 2.25/2.75) * t + 0.9375;
        } else {
          return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
        }
      };
      
      const bounceProgress = easeOutBounce(progress);
      const reverseProgress = 1 - progress;
      
      // Calculate jiggle offset with decreasing intensity
      const offsetX = Math.sin(elapsed * 0.02) * intensity * reverseProgress;
      const offsetY = Math.cos(elapsed * 0.025) * intensity * 0.5 * reverseProgress;
      
      // Apply position with micro-offset for jiggle effect
      const newPosition = {
        lat: originalPosition.lat + (offsetY * 0.00001),
        lng: originalPosition.lng + (offsetX * 0.00001)
      };
      
      this.setMarkerPosition(marker, newPosition);
      
      if (progress < 1) {
        const frameId = requestAnimationFrame(animate);
        this.animationFrames.set(markerName, frameId);
      } else {
        // Reset to original position
        this.setMarkerPosition(marker, originalPosition);
        this.cleanupAnimation(markerName);
        console.log(`✅ Completed optimized jiggle for ${markerName}`);
      }
    };

    const frameId = requestAnimationFrame(animate);
    this.animationFrames.set(markerName, frameId);
    this.activeAnimations.set(markerName, Date.now());
  }

  /**
   * Get marker position in a compatible way
   */
  private static getMarkerPosition(
    marker: google.maps.Marker | google.maps.marker.AdvancedMarkerElement
  ): google.maps.LatLngLiteral | null {
    try {
      if (marker instanceof google.maps.Marker) {
        const position = marker.getPosition();
        return position ? { lat: position.lat(), lng: position.lng() } : null;
      } else if (marker instanceof google.maps.marker.AdvancedMarkerElement) {
        const position = marker.position;
        if (position && typeof position === 'object' && 'lat' in position) {
          return position as google.maps.LatLngLiteral;
        }
      }
    } catch (error) {
      console.warn('Error getting marker position:', error);
    }
    return null;
  }

  /**
   * Set marker position in a compatible way
   */
  private static setMarkerPosition(
    marker: google.maps.Marker | google.maps.marker.AdvancedMarkerElement,
    position: google.maps.LatLngLiteral
  ): void {
    try {
      if (marker instanceof google.maps.Marker) {
        marker.setPosition(position);
      } else if (marker instanceof google.maps.marker.AdvancedMarkerElement) {
        marker.position = position;
      }
    } catch (error) {
      console.warn('Error setting marker position:', error);
    }
  }

  /**
   * Cancel animation for a specific marker
   */
  private static cancelAnimation(markerName: string): void {
    const frameId = this.animationFrames.get(markerName);
    if (frameId) {
      cancelAnimationFrame(frameId);
      this.animationFrames.delete(markerName);
    }
    this.activeAnimations.delete(markerName);
  }

  /**
   * Clean up animation tracking
   */
  private static cleanupAnimation(markerName: string): void {
    this.animationFrames.delete(markerName);
    this.activeAnimations.delete(markerName);
  }

  /**
   * Clean up all animations (useful for component unmounting)
   */
  static cleanupAllAnimations(): void {
    console.log('🧹 Cleaning up all marker animations');
    
    // Cancel all animation frames
    this.animationFrames.forEach((frameId) => {
      cancelAnimationFrame(frameId);
    });
    
    // Clear all tracking
    this.animationFrames.clear();
    this.activeAnimations.clear();
  }

  /**
   * Check if an animation is currently running
   */
  static isAnimating(markerName: string): boolean {
    return this.activeAnimations.has(markerName);
  }

  /**
   * Get performance statistics
   */
  static getPerformanceStats(): {
    activeAnimations: number;
    totalAnimationFrames: number;
  } {
    return {
      activeAnimations: this.activeAnimations.size,
      totalAnimationFrames: this.animationFrames.size
    };
  }
}
