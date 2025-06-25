
import { PerformantMarkerAnimations } from './PerformantMarkerAnimations';

export class MarkerAnimationUtils {
  /**
   * @deprecated Use triggerOptimizedJiggle instead
   */
  static triggerEnhancedJiggle(marker: google.maps.Marker, markerName: string): void {
    console.log(`⚠️ Using deprecated triggerEnhancedJiggle for ${markerName} - switching to optimized version`);
    PerformantMarkerAnimations.triggerOptimizedJiggle(marker, markerName);
  }

  /**
   * @deprecated Use triggerOptimizedJiggle instead
   */
  static triggerAdvancedMarkerJiggle(marker: google.maps.marker.AdvancedMarkerElement, markerName: string): void {
    console.log(`⚠️ Using deprecated triggerAdvancedMarkerJiggle for ${markerName} - switching to optimized version`);
    PerformantMarkerAnimations.triggerOptimizedJiggle(marker, markerName);
  }

  /**
   * New optimized animation method - PREFERRED METHOD
   */
  static triggerOptimizedJiggle(
    marker: google.maps.Marker | google.maps.marker.AdvancedMarkerElement, 
    markerName: string,
    options?: {
      intensity?: number;
      duration?: number;
    }
  ): void {
    PerformantMarkerAnimations.triggerOptimizedJiggle(
      marker, 
      markerName, 
      options?.intensity, 
      options?.duration
    );
  }

  /**
   * Enhanced jiggle with custom parameters
   */
  static triggerCustomJiggle(
    marker: google.maps.Marker | google.maps.marker.AdvancedMarkerElement,
    markerName: string,
    intensity: number = 3,
    duration: number = 400
  ): void {
    PerformantMarkerAnimations.triggerOptimizedJiggle(marker, markerName, intensity, duration);
  }

  /**
   * Subtle animation for professional interactions
   */
  static triggerSubtleJiggle(
    marker: google.maps.Marker | google.maps.marker.AdvancedMarkerElement,
    markerName: string
  ): void {
    PerformantMarkerAnimations.triggerOptimizedJiggle(marker, markerName, 2, 300);
  }

  /**
   * Intensive animation for important markers
   */
  static triggerIntenseJiggle(
    marker: google.maps.Marker | google.maps.marker.AdvancedMarkerElement,
    markerName: string
  ): void {
    PerformantMarkerAnimations.triggerOptimizedJiggle(marker, markerName, 5, 600);
  }

  /**
   * Check if marker is currently animating
   */
  static isAnimating(markerName: string): boolean {
    return PerformantMarkerAnimations.isAnimating(markerName);
  }

  /**
   * Clean up all animations
   */
  static cleanup(): void {
    PerformantMarkerAnimations.cleanupAllAnimations();
  }

  /**
   * Get animation performance statistics
   */
  static getPerformanceStats(): {
    activeAnimations: number;
    totalAnimationFrames: number;
  } {
    return PerformantMarkerAnimations.getPerformanceStats();
  }
}
