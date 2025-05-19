
// mapTypes.ts - Types and data for maps

// Define the structure for each location
export interface Location {
  latLng: [number, number];
  name: string;
}

// Example array of coordinate pairs for Route 66 towns
const coordinatesData: [number, number][] = [
  [34.0522, -118.2437], // Los Angeles (start of Route 66)
  [35.1983, -111.6513], // Flagstaff, AZ
  [35.0845, -106.6511], // Albuquerque, NM
  [35.2220, -101.8313], // Amarillo, TX
  [35.4676, -97.5164],  // Oklahoma City, OK
  [38.6273, -90.1979],  // St. Louis, MO
  [41.8781, -87.6298],  // Chicago, IL (end of Route 66)
];

// Transform the array of coordinate pairs into the desired structure
export const locations: Location[] = coordinatesData.map(
  ([lat, lng], index) => ({
    latLng: [lat, lng],
    name: `Route 66 Stop ${index + 1}`,
  })
);
