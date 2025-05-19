
export interface Route66Town {
  latLng: [number, number]; // Explicitly defining as a tuple with 2 numbers
  name: string;
}

export const route66Towns: Route66Town[] = [
  { latLng: [41.8781, -87.6298], name: "Chicago, IL" },
  { latLng: [41.5250, -88.0817], name: "Joliet, IL" },
  { latLng: [39.8317, -89.6501], name: "Springfield, IL" },
  { latLng: [38.6272, -90.1978], name: "St. Louis, MO" },
  { latLng: [37.2090, -93.2923], name: "Springfield, MO" },
  { latLng: [37.0947, -94.5133], name: "Joplin, MO" },
  { latLng: [36.1540, -95.9928], name: "Tulsa, OK" },
  { latLng: [35.4676, -97.5164], name: "Oklahoma City, OK" },
  { latLng: [35.2220, -101.8313], name: "Amarillo, TX" },
  { latLng: [35.1677, -103.7044], name: "Tucumcari, NM" },
  { latLng: [35.6869, -105.9378], name: "Santa Fe, NM" },
  { latLng: [35.0844, -106.6504], name: "Albuquerque, NM" },
  { latLng: [35.5280, -108.7426], name: "Gallup, NM" },
  { latLng: [35.0606, -110.6322], name: "Winslow, AZ" },
  { latLng: [34.8397, -110.1543], name: "Holbrook, AZ" },
  { latLng: [35.1983, -111.6513], name: "Flagstaff, AZ" },
  { latLng: [35.2677, -113.7558], name: "Seligman, AZ" },
  { latLng: [35.1894, -114.0530], name: "Kingman, AZ" },
  { latLng: [34.7361, -116.9954], name: "Needles, CA" },
  { latLng: [34.9983, -117.1858], name: "Barstow, CA" },
  { latLng: [34.7444, -117.2483], name: "Victorville, CA" },
  { latLng: [34.0529, -117.1822], name: "San Bernardino, CA" },
  { latLng: [34.1341, -118.3215], name: "Los Angeles, CA" },
  { latLng: [34.0099, -118.4960], name: "Santa Monica, CA" }
];

// Legacy export for backward compatibility
export { route66Towns as locations };
