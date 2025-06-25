
import { DestinationCityIconCreator } from './DestinationCityIconCreator';
import { RegularStopIconCreator } from './RegularStopIconCreator';
import { AttractionIconCreator } from './AttractionIconCreator';
import { HiddenGemIconCreator } from './HiddenGemIconCreator';

export class IconCreator {
  // Enhanced icon creators with improved designs
  static createDestinationCityIcon(cityName: string) {
    return DestinationCityIconCreator.createDestinationCityIcon(cityName);
  }

  /**
   * Creates enhanced professional attraction icon (📍)
   */
  static createAttractionIcon(isCloseZoom: boolean = false) {
    return AttractionIconCreator.createAttractionIcon(isCloseZoom);
  }

  /**
   * Creates premium hidden gem icon with realistic faceting (💎)
   */
  static createHiddenGemIcon(isCloseZoom: boolean = false) {
    return HiddenGemIconCreator.createHiddenGemIcon(isCloseZoom);
  }

  static createRegularStopIcon(isCloseZoom: boolean = false) {
    return RegularStopIconCreator.createRegularStopIcon(isCloseZoom);
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
        const attractionSize = isCloseZoom ? 36 : 28;
        return { width: attractionSize, height: attractionSize + 4 };
      case 'hiddenGem':
        const gemSize = isCloseZoom ? 40 : 32;
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
}
