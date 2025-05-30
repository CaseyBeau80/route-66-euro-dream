
export interface DetailedWaypointData {
  lat: number;
  lng: number;
  stopover: boolean;
  description?: string;
  highway?: string; // Which highway/road this point follows
}
