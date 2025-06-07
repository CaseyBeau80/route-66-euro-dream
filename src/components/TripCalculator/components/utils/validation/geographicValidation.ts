
import { TripStop } from '../../../types/TripStop';

// ENHANCED geographic filtering with more generous boundaries
export const isGeographicallyRelevant = (
  stop: TripStop,
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  segmentDistance: number
): boolean => {
  // Only check geographic relevance if coordinates are available
  if (!stop.latitude || !stop.longitude) {
    return true; // Include stops without coordinates by default
  }
  
  const distanceFromStart = Math.sqrt(
    Math.pow(stop.latitude - startLat, 2) + Math.pow(stop.longitude - startLng, 2)
  ) * 69; // Rough miles conversion
  
  const distanceFromEnd = Math.sqrt(
    Math.pow(stop.latitude - endLat, 2) + Math.pow(stop.longitude - endLng, 2)
  ) * 69;
  
  // More generous geographic boundaries
  const maxDetourDistance = Math.max(segmentDistance * 0.5, 150); // At least 150 miles or 50% of segment
  const totalViaStop = distanceFromStart + distanceFromEnd;
  const detour = totalViaStop - segmentDistance;
  
  return detour <= maxDetourDistance && distanceFromStart <= segmentDistance * 1.2;
};
