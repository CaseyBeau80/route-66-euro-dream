
import { DestinationCityIconCreator } from './DestinationCityIconCreator';
import { RegularStopIconCreator } from './RegularStopIconCreator';
import { AttractionIconCreator } from './AttractionIconCreator';
import { HiddenGemIconCreator } from './HiddenGemIconCreator';

export class IconCreator {
  static createDestinationCityIcon(cityName: string) {
    return DestinationCityIconCreator.createDestinationCityIcon(cityName);
  }

  static createRegularStopIcon(isCloseZoom: boolean = false) {
    return RegularStopIconCreator.createRegularStopIcon(isCloseZoom);
  }

  static createAttractionIcon(isCloseZoom: boolean = false) {
    return AttractionIconCreator.createAttractionIcon(isCloseZoom);
  }

  static createHiddenGemIcon(isCloseZoom: boolean = false) {
    return HiddenGemIconCreator.createHiddenGemIcon(isCloseZoom);
  }

  // Title creators
  static createAttractionTitle(attractionName: string): string {
    return AttractionIconCreator.createAttractionTitle(attractionName);
  }

  static createHiddenGemTitle(gemName: string): string {
    return HiddenGemIconCreator.createHiddenGemTitle(gemName);
  }

  // Z-index getters
  static getAttractionZIndex(): number {
    return AttractionIconCreator.getAttractionZIndex();
  }

  static getHiddenGemZIndex(): number {
    return HiddenGemIconCreator.getHiddenGemZIndex();
  }
}
