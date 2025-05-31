
/**
 * Geographic coordinate offset utilities for positioning info windows
 */

export interface GeographicOffset {
  lat: number;
  lng: number;
}

/**
 * Calculate northeast coordinates from a given position
 * @param lat Original latitude
 * @param lng Original longitude
 * @param offsetMeters Distance in meters to offset (default 500m)
 * @returns New coordinates positioned northeast
 */
export function calculateNortheastOffset(
  lat: number, 
  lng: number, 
  offsetMeters: number = 500
): GeographicOffset {
  // Earth's radius in meters
  const earthRadius = 6378137;
  
  // Convert offset to degrees (approximate)
  // At the equator, 1 degree = ~111,320 meters
  const offsetDegrees = offsetMeters / 111320;
  
  // Adjust longitude offset based on latitude (longitude lines converge at poles)
  const latitudeRadians = lat * (Math.PI / 180);
  const longitudeAdjustment = Math.cos(latitudeRadians);
  
  // Calculate northeast offset (45 degrees)
  // Northeast means equal parts north and east
  const northOffset = offsetDegrees * Math.cos(Math.PI / 4); // cos(45°) = ~0.707
  const eastOffset = offsetDegrees * Math.sin(Math.PI / 4) / longitudeAdjustment; // sin(45°) = ~0.707, adjusted for longitude
  
  return {
    lat: lat + northOffset,
    lng: lng + eastOffset
  };
}

/**
 * Calculate dynamic offset based on zoom level
 * Higher zoom = smaller offset for better positioning
 * @param baseOffsetMeters Base offset in meters
 * @param zoomLevel Current map zoom level
 * @returns Adjusted offset in meters
 */
export function calculateDynamicOffset(
  baseOffsetMeters: number = 500, 
  zoomLevel: number = 10
): number {
  // Scale offset inversely with zoom level
  // Zoom 5 = large offset, Zoom 15 = small offset
  const scaleFactor = Math.max(0.1, (15 - zoomLevel) / 10);
  return baseOffsetMeters * scaleFactor;
}
