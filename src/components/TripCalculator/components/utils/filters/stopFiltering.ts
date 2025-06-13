
import { TripStop } from '../../../types/TripStop';

// UPDATED filter function to only allow destination cities
export const isUserRelevantStop = (stop: TripStop): boolean => {
  // Only allow destination cities as stops
  return stop.category === 'destination_city';
};

// Additional filter to ensure only destination cities are used
export const isDestinationCity = (stop: TripStop): boolean => {
  return stop.category === 'destination_city';
};

// Legacy support for existing filters but enforce destination city restriction
export const isValidRouteStop = (stop: TripStop): boolean => {
  return stop.category === 'destination_city' && 
         stop.latitude !== undefined && 
         stop.longitude !== undefined &&
         stop.name && 
         stop.name.trim() !== '';
};
