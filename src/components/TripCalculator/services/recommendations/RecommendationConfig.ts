
/**
 * Unified configuration for the enhanced recommendation system
 * Ensures consistency across all trip views
 */
export class RecommendationConfig {
  // Maximum number of stops to show per segment
  static readonly MAX_STOPS_DEFAULT = 3;
  static readonly MAX_STOPS_SUMMARY = 2;
  static readonly MAX_STOPS_FULL = 5;

  // Geographic search radiuses (in miles)
  static readonly EXACT_CITY_RADIUS = 25;
  static readonly STATE_SEARCH_RADIUS = 100;
  static readonly REGIONAL_SEARCH_RADIUS = 200;

  // Scoring weights
  static readonly FEATURED_BONUS = 40;
  static readonly MAJOR_STOP_BONUS = 35;
  static readonly RICH_DESCRIPTION_BONUS = 25;
  static readonly IMAGE_BONUS = 20;
  static readonly ROUTE66_KEYWORD_BONUS = 20;
  static readonly SCARCITY_BONUS = 15;
  static readonly WEBSITE_BONUS = 10;
  static readonly MINIMUM_SCORE = 10;

  // Display preferences
  static readonly SHOW_LOCATION = true;
  static readonly SHOW_CATEGORY = true;
  static readonly SHOW_RELEVANCE_SCORE = true;
  static readonly SHOW_ENHANCED_METADATA = true;

  /**
   * Get max stops for context
   */
  static getMaxStopsForContext(context: string): number {
    if (context.includes('summary') || context.includes('PDF-summary')) {
      return this.MAX_STOPS_SUMMARY;
    }
    if (context.includes('full') || context.includes('PDF-full')) {
      return this.MAX_STOPS_FULL;
    }
    return this.MAX_STOPS_DEFAULT;
  }

  /**
   * Check if context should use enhanced system
   */
  static shouldUseEnhancedSystem(context: string): boolean {
    // Always use enhanced system for consistency
    return true;
  }

  /**
   * Get debug prefix for context
   */
  static getDebugPrefix(context: string): string {
    if (context.includes('PDF')) return '📄 [CONSISTENT-PDF]';
    if (context.includes('Shared')) return '🔗 [CONSISTENT-SHARED]';
    if (context.includes('Preview')) return '👁️ [CONSISTENT-PREVIEW]';
    return '🎯 [CONSISTENT]';
  }
}
