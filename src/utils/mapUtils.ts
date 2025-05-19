// src/utils/mapUtils.ts

// Define the structure for each location
export interface Location {
  latLng: [number, number];
  name: string;
}

// Example array of coordinate pairs
const coordinates: [number, number][] = [
  [34.0522, -118.2437], // Los Angeles
  [36.1699, -115.1398], // Las Vegas
  [35.4676, -97.5164],  // Oklahoma City
  [41.8781, -87.6298],  // Chicago
  // Add more coordinates as needed
];

// Transform the array of coordinate pairs into the desired structure
export const locations: Location[] = coordinates.map(
  ([lat, lng], index) => ({
    latLng: [lat, lng],
    name: `Location ${index + 1}`,
  })
);
