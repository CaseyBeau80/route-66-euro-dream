
import { CategoryData } from '../types';
import { useAttractions } from './useAttractions';
import { useDriveIns } from './useDriveIns';
import { useHiddenGems } from './useHiddenGems';
import { useCategoryConfig } from './useCategoryConfig';

export const useListingsData = () => {
  // Starting data fetch
  
  const categoryConfig = useCategoryConfig();
  
  const attractions = useAttractions();
  const driveIns = useDriveIns();
  const hiddenGems = useHiddenGems();

  // Data status check

  // Only include the categories we want to display
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

  // Final categories processed

  return { categories };
};
