
/**
 * Map projection utilities to transform geographic coordinates to SVG coordinates
 */

// SVG viewBox dimensions
const SVG_WIDTH = 959;
const SVG_HEIGHT = 593;

// Geographic bounds of the US for the Albers projection
// These are approximate bounds for the continental US
const US_BOUNDS = {
  west: -124.848974, // Westernmost longitude
  east: -66.885444,  // Easternmost longitude
  north: 49.384358,  // Northernmost latitude
  south: 24.396308   // Southernmost latitude
};

/**
 * Simple Albers projection function to transform lat/lng to SVG coordinates
 * 
 * @param latLng Geographic coordinates [latitude, longitude]
 * @returns SVG coordinates {x, y}
 */
export function projectLatLngToSvgCoordinates(latLng: [number, number]): { x: number, y: number } {
  const [lat, lng] = latLng;
  
  // Normalize longitude to SVG x coordinate
  const longitudeRange = US_BOUNDS.east - US_BOUNDS.west;
  const normalizedLng = (lng - US_BOUNDS.west) / longitudeRange;
  // Map longitude to SVG coordinates (east-west direction)
  const x = SVG_WIDTH * normalizedLng; // Fixed: Don't invert X for correct east-west orientation
  
  // Normalize latitude to SVG y coordinate
  const latitudeRange = US_BOUNDS.north - US_BOUNDS.south;
  const normalizedLat = (lat - US_BOUNDS.south) / latitudeRange;
  // Map latitude to SVG coordinates (north-south direction)
  const y = SVG_HEIGHT * normalizedLat; // Fixed: Don't invert Y to keep north at top
  
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
