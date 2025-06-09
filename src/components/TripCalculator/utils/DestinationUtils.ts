
// Utility functions for handling destination union types safely

export const getDestinationCity = (destination: string | { city: string; state?: string } | undefined): string => {
  if (!destination) return 'Unknown';
  if (typeof destination === 'string') return destination;
  return destination.city;
};

export const getDestinationState = (destination: string | { city: string; state?: string } | undefined): string | undefined => {
  if (!destination) return undefined;
  if (typeof destination === 'string') return undefined;
  return destination.state;
};

export const getDestinationCityWithState = (destination: string | { city: string; state?: string } | undefined): string => {
  if (!destination) return 'Unknown';
  if (typeof destination === 'string') return destination;
  return destination.state ? `${destination.city}, ${destination.state}` : destination.city;
};

export const isDestinationObject = (destination: string | { city: string; state?: string } | undefined): destination is { city: string; state?: string } => {
  return destination !== undefined && typeof destination === 'object';
};
