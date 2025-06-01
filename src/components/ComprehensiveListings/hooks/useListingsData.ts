
import { CategoryData } from '../types';
import { useDestinationCities } from './useDestinationCities';
import { useAttractions } from './useAttractions';
import { useDriveIns } from './useDriveIns';
import { useHiddenGems } from './useHiddenGems';
import { useRoute66Waypoints } from './useRoute66Waypoints';
import { useCategoryConfig } from './useCategoryConfig';

export const useListingsData = () => {
  const categoryConfig = useCategoryConfig();
  
  const destinationCities = useDestinationCities();
  const attractions = useAttractions();
  const driveIns = useDriveIns();
  const hiddenGems = useHiddenGems();
  const route66Waypoints = useRoute66Waypoints();

  const categories: Record<string, CategoryData> = {
    destination_cities: {
      ...categoryConfig.destination_cities,
      items: destinationCities.items,
      loading: destinationCities.loading
    },
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
    },
    route66_waypoints: {
      ...categoryConfig.route66_waypoints,
      items: route66Waypoints.items,
      loading: route66Waypoints.loading
    }
  };

  return { categories };
};
