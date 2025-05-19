
export interface Route66Town {
  latLng: [number, number]; // Explicitly defining as a tuple with 2 numbers
  name: string;
}

export const route66Towns: Route66Town[] = [
  { latLng: [41.8781, -87.6298], name: "Chicago, IL" },
  { latLng: [41.1399, -89.3636], name: "La Salle, IL" },
  { latLng: [39.8317, -89.6501], name: "Springfield, IL" },
  { latLng: [38.6272, -90.1978], name: "St. Louis, MO" },
  { latLng: [37.2090, -93.2923], name: "Springfield, MO" },
  { latLng: [36.9948, -94.7404], name: "Joplin, MO" },
  { latLng: [36.1540, -95.9928], name: "Tulsa, OK" },
  { latLng: [35.4676, -97.5164], name: "Oklahoma City, OK" },
  { latLng: [35.2226, -101.8313], name: "Amarillo, TX" },
  { latLng: [35.0844, -106.6504], name: "Albuquerque, NM" },
  { latLng: [35.1983, -111.6513], name: "Flagstaff, AZ" },
  { latLng: [35.1983, -114.0530], name: "Kingman, AZ" },
  { latLng: [34.8409, -117.0064], name: "Barstow, CA" },
  { latLng: [34.0522, -118.2437], name: "Los Angeles, CA" },
];
