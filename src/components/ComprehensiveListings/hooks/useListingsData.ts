
import { CategoryData } from '../types';
import { useAttractions } from './useAttractions';
import { useDriveIns } from './useDriveIns';
import { useHiddenGems } from './useHiddenGems';
import { useCategoryConfig } from './useCategoryConfig';

export const useListingsData = () => {
  const categoryConfig = useCategoryConfig();
  
  const attractions = useAttractions();
  const driveIns = useDriveIns();
  const hiddenGems = useHiddenGems();

  const categories: Record<string, CategoryData> = {
    attractions: {
      ...categoryConfig.attractions,
      items: attractions.items,
      loading: attractions.loading
    },
    drive_ins: {
      ...categoryConfig.drive_ins,
      items: driveIns.items,
      loading: driveIns.loading
    },
    hidden_gems: {
      ...categoryConfig.hidden_gems,
      items: hiddenGems.items,
      loading: hiddenGems.loading
    }
  };

  return { categories };
};
