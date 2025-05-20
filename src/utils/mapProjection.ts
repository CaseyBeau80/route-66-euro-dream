/**
 * Map projection utilities to transform geographic coordinates to SVG coordinates
 */

// SVG viewBox dimensions
const SVG_WIDTH = 959;
const SVG_HEIGHT = 593;

// Geographic bounds specifically calibrated for the Route 66 SVG map
// Adjusted bounds to better align with the SVG state paths
const US_BOUNDS = {
  west: -125.0, // Extended westernmost longitude 
  east: -66.0,  // Extended easternmost longitude
  north: 49.5,  // Extended northernmost latitude
  south: 24.0   // Extended southernmost latitude
};

// Calibration adjustments to fine-tune the projection
const X_OFFSET = -30; // Shift cities westward to better align with states
const Y_OFFSET = 15;  // Shift cities southward to better align with states
const X_SCALE = 1.0;  // Scale factor for x-coordinates
const Y_SCALE = 1.15; // Increase vertical scale slightly

/**
 * Enhanced Albers projection function to transform lat/lng to SVG coordinates
 * With scaling and offset parameters for fine-tuning
 * 
 * @param latLng Geographic coordinates [latitude, longitude]
 * @returns SVG coordinates {x, y}
 */
export function projectLatLngToSvgCoordinates(latLng: [number, number]): { x: number, y: number } {
  const [lat, lng] = latLng;
  
  // Normalize longitude to SVG x coordinate
  const longitudeRange = US_BOUNDS.east - US_BOUNDS.west;
  const normalizedLng = (lng - US_BOUNDS.west) / longitudeRange;
  // Apply scaling and offset to the x-coordinate
  const x = (SVG_WIDTH * normalizedLng * X_SCALE) + X_OFFSET;
  
  // Normalize latitude to SVG y coordinate
  const latitudeRange = US_BOUNDS.north - US_BOUNDS.south;
  const normalizedLat = (lat - US_BOUNDS.south) / latitudeRange;
  // Apply scaling and offset to the y-coordinate (keep inverted for SVG)
  const y = (SVG_HEIGHT * (1 - normalizedLat) * Y_SCALE) + Y_OFFSET;
  
  return { x, y };
}

/**
 * Transforms an array of Route66Town objects to SVG coordinate points
 */
export function transformTownsToSvgPoints(towns: Array<{latLng: [number, number], name: string}>) {
  return towns.map(town => ({
    ...projectLatLngToSvgCoordinates(town.latLng),
    name: town.name.split(',')[0] // Remove state part for display
  }));
}
