
import { DailySegment } from './TripPlanTypes';

// Helper function to safely get destination city name
export const getDestinationCityName = (destination: string | { city: string; state?: string } | undefined): string => {
  if (!destination) return 'Unknown';
  if (typeof destination === 'string') return destination;
  return destination.city;
};

// Helper function to safely get destination city with state
export const getDestinationCityWithState = (destination: string | { city: string; state?: string } | undefined): string => {
  if (!destination) return 'Unknown';
  if (typeof destination === 'string') return destination;
  return destination.state ? `${destination.city}, ${destination.state}` : destination.city;
};
