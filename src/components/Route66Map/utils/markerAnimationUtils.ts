
import { PerformantMarkerAnimations } from './PerformantMarkerAnimations';

export class MarkerAnimationUtils {
  /**
   * @deprecated Use PerformantMarkerAnimations.triggerOptimizedJiggle instead
   */
  static triggerEnhancedJiggle(marker: google.maps.Marker, markerName: string): void {
    console.log(`⚠️ Using deprecated triggerEnhancedJiggle for ${markerName} - switching to optimized version`);
    PerformantMarkerAnimations.triggerOptimizedJiggle(marker, markerName);
  }

  /**
   * @deprecated Use PerformantMarkerAnimations.triggerOptimizedJiggle instead
   */
  static triggerAdvancedMarkerJiggle(marker: google.maps.marker.AdvancedMarkerElement, markerName: string): void {
    console.log(`⚠️ Using deprecated triggerAdvancedMarkerJiggle for ${markerName} - switching to optimized version`);
    PerformantMarkerAnimations.triggerOptimizedJiggle(marker, markerName);
  }

  /**
   * New optimized animation method
   */
  static triggerOptimizedJiggle(
    marker: google.maps.Marker | google.maps.marker.AdvancedMarkerElement, 
    markerName: string
  ): void {
    PerformantMarkerAnimations.triggerOptimizedJiggle(marker, markerName);
  }

  /**
   * Clean up all animations
   */
  static cleanup(): void {
    PerformantMarkerAnimations.cleanupAllAnimations();
  }
}
