
export class IconQualityManager {
  private static readonly PERFORMANCE_THRESHOLDS = {
    HIGH_MARKER_COUNT: 100,
    MEDIUM_MARKER_COUNT: 50,
    LOW_MARKER_COUNT: 20
  };

  private static readonly QUALITY_LEVELS = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
  } as const;

  type QualityLevel = typeof IconQualityManager.QUALITY_LEVELS[keyof typeof IconQualityManager.QUALITY_LEVELS];

  /**
   * Determines the appropriate quality level based on performance metrics
   */
  static determineQualityLevel(
    markerCount: number,
    mapZoom: number,
    devicePixelRatio: number = window.devicePixelRatio || 1
  ): QualityLevel {
    // High-DPI displays get better quality when possible
    const isHighDPI = devicePixelRatio > 1.5;
    
    // Adjust for close zoom - always use high quality when zoomed in
    if (mapZoom >= 12) {
      return this.QUALITY_LEVELS.HIGH;
    }
    
    // Performance-based quality scaling
    if (markerCount <= this.PERFORMANCE_THRESHOLDS.LOW_MARKER_COUNT) {
      return this.QUALITY_LEVELS.HIGH;
    } else if (markerCount <= this.PERFORMANCE_THRESHOLDS.MEDIUM_MARKER_COUNT) {
      return isHighDPI ? this.QUALITY_LEVELS.HIGH : this.QUALITY_LEVELS.MEDIUM;
    } else if (markerCount <= this.PERFORMANCE_THRESHOLDS.HIGH_MARKER_COUNT) {
      return this.QUALITY_LEVELS.MEDIUM;
    } else {
      return this.QUALITY_LEVELS.LOW;
    }
  }

  /**
   * Gets SVG rendering quality attributes based on quality level
   */
  static getSVGQualityAttributes(qualityLevel: QualityLevel): string {
    switch (qualityLevel) {
      case this.QUALITY_LEVELS.HIGH:
        return 'style="shape-rendering: geometricPrecision; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;"';
      case this.QUALITY_LEVELS.MEDIUM:
        return 'style="shape-rendering: optimizeSpeed; image-rendering: auto;"';
      case this.QUALITY_LEVELS.LOW:
        return 'style="shape-rendering: optimizeSpeed; image-rendering: pixelated;"';
      default:
        return 'style="shape-rendering: auto;"';
    }
  }

  /**
   * Applies accessibility enhancements to icons
   */
  static enhanceIconAccessibility(
    iconSvg: string,
    iconType: 'attraction' | 'hiddenGem',
    itemName: string
  ): string {
    const ariaLabel = iconType === 'attraction' 
      ? `Attraction: ${itemName}` 
      : `Hidden Gem: ${itemName}`;
    
    // Add ARIA attributes and title for screen readers
    const enhancedSvg = iconSvg.replace(
      '<svg',
      `<svg role="img" aria-label="${ariaLabel}" focusable="false"`
    );
    
    // Add title element for tooltip accessibility
    return enhancedSvg.replace(
      '</defs>',
      `</defs><title>${ariaLabel}</title>`
    );
  }

  /**
   * Optimizes icon size for touch devices
   */
  static getAccessibleIconSize(baseSize: number, isTouch: boolean = false): number {
    if (isTouch) {
      // Ensure minimum 44px touch target (iOS/Android accessibility guidelines)
      const minTouchSize = 44;
      return Math.max(baseSize, minTouchSize);
    }
    return baseSize;
  }

  /**
   * Gets color contrast adjustments for better visibility
   */
  static getContrastEnhancements(backgroundLuminance: number): {
    strokeWidth: number;
    strokeColor: string;
    shadowOpacity: number;
  } {
    // Adjust contrast based on map background
    if (backgroundLuminance > 0.7) {
      // Light background - darker strokes and shadows
      return {
        strokeWidth: 2,
        strokeColor: '#333333',
        shadowOpacity: 0.6
      };
    } else if (backgroundLuminance < 0.3) {
      // Dark background - lighter strokes
      return {
        strokeWidth: 2,
        strokeColor: '#ffffff',
        shadowOpacity: 0.8
      };
    } else {
      // Medium background - standard contrast
      return {
        strokeWidth: 1.5,
        strokeColor: '#ffffff',
        shadowOpacity: 0.4
      };
    }
  }

  /**
   * Checks if reduced motion is preferred (accessibility)
   */
  static shouldReduceMotion(): boolean {
    if (typeof window === 'undefined') return false;
    
    return window.matchMedia && 
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Gets animation settings based on accessibility preferences
   */
  static getAnimationSettings(): {
    enableAnimations: boolean;
    animationDuration: number;
    animationEasing: string;
  } {
    const reduceMotion = this.shouldReduceMotion();
    
    return {
      enableAnimations: !reduceMotion,
      animationDuration: reduceMotion ? 0 : 200,
      animationEasing: reduceMotion ? 'linear' : 'ease-out'
    };
  }

  /**
   * Validates icon meets accessibility standards
   */
  static validateIconAccessibility(
    iconElement: google.maps.Icon,
    iconType: 'attraction' | 'hiddenGem'
  ): {
    isAccessible: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check minimum size requirements
    if (iconElement.scaledSize) {
      const minSize = this.getAccessibleIconSize(24, true);
      if (iconElement.scaledSize.width < minSize || iconElement.scaledSize.height < minSize) {
        issues.push('Icon size below minimum touch target (44px)');
        recommendations.push('Increase icon size for better touch accessibility');
      }
    }

    // Check for proper anchor positioning
    if (!iconElement.anchor) {
      issues.push('Missing anchor point for precise positioning');
      recommendations.push('Add anchor point for better marker alignment');
    }

    return {
      isAccessible: issues.length === 0,
      issues,
      recommendations
    };
  }
}
