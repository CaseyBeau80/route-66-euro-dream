
// Route data management for Route 66 markers
export interface MarkerData {
  position: { lat: number; lng: number };
  text: string;
  state: string;
  description: string;
}

export interface StopData {
  position: { lat: number; lng: number };
  name: string;
  description: string;
}

// Enhanced highway markers with more detail
export const enhancedHighwayMarkers: MarkerData[] = [
  { position: { lat: 41.5, lng: -88.5 }, text: "I-55", state: "Illinois", description: "Historic US-66 Corridor" },
  { position: { lat: 38.7, lng: -90.4 }, text: "I-44", state: "Missouri", description: "Route 66 Superslab" },
  { position: { lat: 35.2, lng: -97.5 }, text: "I-40", state: "Oklahoma", description: "Will Rogers Highway" },
  { position: { lat: 35.2, lng: -101.8 }, text: "I-40", state: "Texas", description: "Route 66 Corridor" },
  { position: { lat: 35.1, lng: -106.7 }, text: "I-40", state: "New Mexico", description: "Historic Route 66" },
  { position: { lat: 35.2, lng: -111.7 }, text: "I-40", state: "Arizona", description: "Route 66 Historic" },
  { position: { lat: 34.1, lng: -117.6 }, text: "Local", state: "California", description: "Santa Monica Blvd" }
];

// Informational markers for major stops
export const majorStops: StopData[] = [
  { position: { lat: 41.8781, lng: -87.6298 }, name: "Chicago", description: "Route 66 Begins" },
  { position: { lat: 38.7067, lng: -90.3990 }, name: "St. Louis", description: "Gateway Arch" },
  { position: { lat: 35.4676, lng: -97.5164 }, name: "Oklahoma City", description: "Route 66 Museum" },
  { position: { lat: 35.2220, lng: -101.8313 }, name: "Amarillo", description: "Cadillac Ranch" },
  { position: { lat: 35.0844, lng: -106.6504 }, name: "Albuquerque", description: "Old Town Plaza" },
  { position: { lat: 35.1983, lng: -111.6513 }, name: "Flagstaff", description: "Historic Downtown" },
  { position: { lat: 34.0195, lng: -118.4912 }, name: "Santa Monica", description: "Route 66 Ends" }
];

// Basic highway markers (existing functionality)
export const basicHighwayMarkers: MarkerData[] = [
  { position: { lat: 41.5, lng: -88.5 }, text: "I-55", state: "Illinois", description: "Interstate 55" },
  { position: { lat: 38.7, lng: -90.4 }, text: "I-44", state: "Missouri", description: "Interstate 44" },
  { position: { lat: 35.2, lng: -97.5 }, text: "I-40", state: "Oklahoma", description: "Interstate 40" },
  { position: { lat: 35.2, lng: -106.7 }, text: "I-40", state: "New Mexico", description: "Interstate 40" },
  { position: { lat: 35.2, lng: -111.7 }, text: "I-40", state: "Arizona", description: "Interstate 40" },
  { position: { lat: 34.1, lng: -117.6 }, text: "I-15", state: "California", description: "Interstate 15" }
];
