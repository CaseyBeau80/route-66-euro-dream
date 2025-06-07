
import { TripStop } from '../../../types/TripStop';

// EXPANDED filter function to include more user-relevant categories
export const isUserRelevantStop = (stop: TripStop): boolean => {
  const userRelevantCategories = [
    'attraction',
    'hidden_gem', 
    'diner',
    'motel',
    'museum',
    'destination_city',
    'restaurant',
    'lodging',
    'hotel',
    'historic_site',
    'scenic_viewpoint',
    'photo_opportunity',
    'landmark',
    'cultural_site',
    'venue',
    'music venue',
    'quirky',
    'Museum',
    'Diner',
    'Attraction',
    'Hidden Gem',
    'Restaurant',
    'Motel',
    'Hotel',
    'Venue',
    'Music Venue',
    'Quirky'
  ];
  
  // Make the comparison case-insensitive
  const stopCategory = (stop.category || '').toLowerCase();
  return userRelevantCategories.some(cat => cat.toLowerCase() === stopCategory);
};
