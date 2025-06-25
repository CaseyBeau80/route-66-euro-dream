
export class PerformantMarkerAnimations {
  private static animationTimeouts = new Map<string, NodeJS.Timeout>();
  private static animationFrames = new Map<string, number>();

  /**
   * Optimized jiggle animation that prevents performance issues
   */
  static triggerOptimizedJiggle(
    marker: google.maps.Marker | google.maps.marker.AdvancedMarkerElement, 
    markerName: string
  ): void {
    console.log(`🎨 Starting optimized jiggle for: ${markerName}`);
    
    // Clear any existing animations for this marker
    this.clearMarkerAnimation(markerName);

    if ('content' in marker && marker.content) {
      this.animateAdvancedMarker(marker, markerName);
    } else if ('getIcon' in marker) {
      this.animateRegularMarker(marker as google.maps.Marker, markerName);
    }
  }

  private static animateAdvancedMarker(
    marker: google.maps.marker.AdvancedMarkerElement, 
    markerName: string
  ): void {
    const element = marker.content as HTMLElement;
    if (!element) return;

    let frame = 0;
    const maxFrames = 8; // Reduced from potentially infinite loop
    const originalTransform = element.style.transform || '';

    const animate = () => {
      if (frame >= maxFrames) {
        // Reset to original state
        element.style.transform = originalTransform;
        this.animationFrames.delete(markerName);
        console.log(`✅ Advanced marker jiggle completed for: ${markerName}`);
        return;
      }

      const intensity = Math.sin(frame * 0.8) * 2;
      element.style.transform = `${originalTransform} translateX(${intensity}px) scale(${1 + intensity * 0.05})`;
      
      frame++;
      const animationId = requestAnimationFrame(animate);
      this.animationFrames.set(markerName, animationId);
    };

    const animationId = requestAnimationFrame(animate);
    this.animationFrames.set(markerName, animationId);
  }

  private static animateRegularMarker(
    marker: google.maps.Marker, 
    markerName: string
  ): void {
    const originalIcon = marker.getIcon() as google.maps.Icon;
    if (!originalIcon || typeof originalIcon === 'string') return;

    let frame = 0;
    const maxFrames = 6; // Reduced animation frames
    const baseSize = originalIcon.scaledSize;

    const animate = () => {
      if (frame >= maxFrames) {
        // Reset to original size
        if (baseSize) {
          marker.setIcon({
            ...originalIcon,
            scaledSize: baseSize
          });
        }
        this.animationFrames.delete(markerName);
        console.log(`✅ Regular marker jiggle completed for: ${markerName}`);
        return;
      }

      if (baseSize) {
        const scale = 1 + Math.sin(frame * 0.8) * 0.1;
        marker.setIcon({
          ...originalIcon,
          scaledSize: new google.maps.Size(
            baseSize.width * scale,
            baseSize.height * scale
          )
        });
      }

      frame++;
      const animationId = requestAnimationFrame(animate);
      this.animationFrames.set(markerName, animationId);
    };

    const animationId = requestAnimationFrame(animate);
    this.animationFrames.set(markerName, animationId);
  }

  /**
   * Clear any existing animation for a marker
   */
  private static clearMarkerAnimation(markerName: string): void {
    // Clear timeout if exists
    const timeout = this.animationTimeouts.get(markerName);
    if (timeout) {
      clearTimeout(timeout);
      this.animationTimeouts.delete(markerName);
    }

    // Clear animation frame if exists
    const frameId = this.animationFrames.get(markerName);
    if (frameId) {
      cancelAnimationFrame(frameId);
      this.animationFrames.delete(markerName);
    }
  }

  /**
   * Clean up all animations (for component unmount)
   */
  static cleanupAllAnimations(): void {
    console.log('🧹 Cleaning up all marker animations');
    
    this.animationTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.animationFrames.forEach((frameId) => cancelAnimationFrame(frameId));
    
    this.animationTimeouts.clear();
    this.animationFrames.clear();
  }
}
