
import { createVintageRoute66Icon } from '../VintageRoute66Icon';

export const getMarkerIcon = (gemTitle: string) => {
  // Remove drive-in detection logic - all hidden gems use regular icon now
  // Drive-ins are now handled by the dedicated DriveInsContainer
  console.log(`💎 Creating regular hidden gem icon for: ${gemTitle}`);
  return createVintageRoute66Icon();
};

export const getMarkerTitle = (gemTitle: string) => {
  // Remove drive-in detection - all hidden gems are treated as regular gems
  return `Hidden Gem: ${gemTitle}`;
};

export const getMarkerZIndex = (gemTitle: string) => {
  // All hidden gems use the same z-index now
  return 30000;
};
