
import { DestinationCityIconCreator } from './DestinationCityIconCreator';
import { RegularStopIconCreator } from './RegularStopIconCreator';

export class IconCreator {
  static createDestinationCityIcon(cityName: string) {
    return DestinationCityIconCreator.createDestinationCityIcon(cityName);
  }

  static createRegularStopIcon(isCloseZoom: boolean = false) {
    return RegularStopIconCreator.createRegularStopIcon(isCloseZoom);
  }
}
