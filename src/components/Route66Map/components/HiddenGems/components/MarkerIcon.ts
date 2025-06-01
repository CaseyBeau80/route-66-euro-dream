
import { createVintageRoute66Icon, createDriveInIcon } from '../VintageRoute66Icon';

export const getMarkerIcon = (gemTitle: string) => {
  const isDriveIn = gemTitle.toLowerCase().includes('drive-in');
  if (isDriveIn) {
    console.log(`🎬 Creating enhanced drive-in icon for: ${gemTitle}`);
    return createDriveInIcon();
  } else {
    return createVintageRoute66Icon();
  }
};

export const getMarkerTitle = (gemTitle: string) => {
  const isDriveIn = gemTitle.toLowerCase().includes('drive-in');
  return `${isDriveIn ? 'Drive-In Theater: ' : 'Hidden Gem: '}${gemTitle}`;
};

export const getMarkerZIndex = (gemTitle: string) => {
  const isDriveIn = gemTitle.toLowerCase().includes('drive-in');
  return isDriveIn ? 35000 : 30000;
};
