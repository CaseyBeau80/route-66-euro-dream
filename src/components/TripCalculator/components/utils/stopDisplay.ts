
import { Star, Camera, Utensils, Bed, MapPin } from 'lucide-react';

// Get appropriate icon for stop category
export const getStopIcon = (category?: string) => {
  switch (category?.toLowerCase()) {
    case 'attraction':
    case 'historic_site':
      return Star;
    case 'restaurant':
    case 'diner':
      return Utensils;
    case 'lodging':
    case 'hotel':
    case 'motel':
      return Bed;
    case 'scenic_viewpoint':
    case 'photo_opportunity':
      return Camera;
    default:
      return MapPin;
  }
};

// Get category color for badges
export const getCategoryColor = (category?: string) => {
  switch (category?.toLowerCase()) {
    case 'attraction':
    case 'historic_site':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'restaurant':
    case 'diner':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'lodging':
    case 'hotel':
    case 'motel':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'scenic_viewpoint':
    case 'photo_opportunity':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'destination_city':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'hidden_gem':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
