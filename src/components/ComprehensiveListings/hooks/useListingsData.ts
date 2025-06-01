
import { CategoryData } from '../types';
import { useAttractions } from './useAttractions';
import { useDriveIns } from './useDriveIns';
import { useHiddenGems } from './useHiddenGems';
import { useCategoryConfig } from './useCategoryConfig';

export const useListingsData = () => {
  console.log('🔍 useListingsData: Starting data fetch...');
  
  const categoryConfig = useCategoryConfig();
  
  const attractions = useAttractions();
  const driveIns = useDriveIns();
  const hiddenGems = useHiddenGems();

  console.log('🔍 useListingsData: Data status:', {
    attractions: { loading: attractions.loading, count: attractions.items.length },
    driveIns: { loading: driveIns.loading, count: driveIns.items.length },
    hiddenGems: { loading: hiddenGems.loading, count: hiddenGems.items.length }
  });

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

  console.log('🔍 useListingsData: Final categories:', Object.keys(categories));

  return { categories };
};
