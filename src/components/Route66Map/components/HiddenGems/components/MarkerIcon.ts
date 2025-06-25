
import { IconCreator } from '../../RouteMarkers/IconCreator';

export const getMarkerIcon = (gemTitle: string, isCloseZoom: boolean = false) => {
  console.log(`💎 Creating hidden gem icon for: ${gemTitle}`);
  return IconCreator.createHiddenGemIcon(isCloseZoom);
};

export const getMarkerTitle = (gemTitle: string) => {
  return IconCreator.createHiddenGemTitle(gemTitle);
};

export const getMarkerZIndex = (gemTitle: string) => {
  return IconCreator.getHiddenGemZIndex();
};
