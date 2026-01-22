
import { CategoryData } from '../types';

export const useCategoryConfig = (): Record<string, Omit<CategoryData, 'items' | 'loading'>> => {
  return {
    destination_cities: {
      title: 'Destination Cities',
      color: 'bg-blue-500',
      icon: '🏙️'
    },
    attractions: {
      title: 'Historic Attractions',
      color: 'bg-green-500',
      icon: '🏛️'
    },
    drive_ins: {
      title: 'Drive-In Theaters',
      color: 'bg-purple-500',
      icon: '🎬'
    },
    hidden_gems: {
      title: 'Hidden Gems',
      color: 'bg-orange-500',
      icon: '💎'
    },
    native_american: {
      title: 'Native American Heritage',
      color: 'bg-amber-700',
      icon: '🪶'
    },
    route66_waypoints: {
      title: 'Route 66 Waypoints',
      color: 'bg-red-500',
      icon: '🛣️'
    }
  };
};
