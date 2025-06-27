
import { DestinationCityIconCreator } from './DestinationCityIconCreator';
import { RegularStopIconCreator } from './RegularStopIconCreator';
import { AttractionIconCreator } from './AttractionIconCreator';
import { HiddenGemIconCreator } from './HiddenGemIconCreator';
import { IconScalingService } from '../../services/IconScalingService';

export class IconCreator {
  // Enhanced icon creators with improved designs and scaling
  static createDestinationCityIcon(cityName: string) {
    return DestinationCityIconCreator.createDestinationCityIcon(cityName);
  }

  /**
   * Creates enhanced professional attraction icon (📍) with scaling optimization
   */
  static createAttractionIcon(isCloseZoom: boolean = false) {
    return IconScalingService.getCachedIcon(
      'attraction',
      isCloseZoom,
      () => AttractionIconCreator.createAttractionIcon(isCloseZoom)
    );
  }

  /**
   * Creates premium hidden gem icon with realistic faceting (💎) with scaling optimization
   */
  static createHiddenGemIcon(isCloseZoom: boolean = false) {
    return IconScalingService.getCachedIcon(
      'hiddenGem',
      isCloseZoom,
      () => HiddenGemIconCreator.createHiddenGemIcon(isCloseZoom)
    );
  }

  static createRegularStopIcon(isCloseZoom: boolean = false) {
    return RegularStopIconCreator.createRegularStopIcon(isCloseZoom);
  }

  // Enhanced zoom-aware icon creation
  static createZoomAwareAttractionIcon(currentZoom: number) {
    const isCloseZoom = IconScalingService.shouldUseCloseZoom(currentZoom);
    return this.createAttractionIcon(isCloseZoom);
  }

  static createZoomAwareHiddenGemIcon(currentZoom: number) {
    const isCloseZoom = IconScalingService.shouldUseCloseZoom(currentZoom);
    return this.createHiddenGemIcon(isCloseZoom);
  }

  // Title creators with enhanced formatting
  static createAttractionTitle(attractionName: string): string {
    return AttractionIconCreator.createAttractionTitle(attractionName);
  }

  static createHiddenGemTitle(gemName: string): string {
    return HiddenGemIconCreator.createHiddenGemTitle(gemName);
  }

  // Z-index getters for proper layering
  static getAttractionZIndex(): number {
    return AttractionIconCreator.getAttractionZIndex();
  }

  static getHiddenGemZIndex(): number {
    return HiddenGemIconCreator.getHiddenGemZIndex();
  }

  // Utility methods for icon management
  static getIconDimensions(iconType: 'attraction' | 'hiddenGem', isCloseZoom: boolean = false): { width: number, height: number } {
    switch (iconType) {
      case 'attraction':
        const attractionSize = isCloseZoom ? 42 : 32;
        return { width: attractionSize, height: attractionSize * 1.2 };
      case 'hiddenGem':
        const gemSize = isCloseZoom ? 44 : 36;
        return { width: gemSize, height: gemSize };
      default:
        return { width: 24, height: 24 };
    }
  }

  /**
   * Validates icon creation parameters
   */
  static validateIconParameters(isCloseZoom?: boolean): boolean {
    return typeof isCloseZoom === 'undefined' || typeof isCloseZoom === 'boolean';
  }

  /**
   * Performance optimization methods
   */
  static preloadIcons(): void {
    IconScalingService.preloadIcons();
  }

  static clearIconCache(): void {
    IconScalingService.clearCache();
  }

  static getIconCacheStats(): { size: number; keys: string[] } {
    return IconScalingService.getCacheStats();
  }
}
