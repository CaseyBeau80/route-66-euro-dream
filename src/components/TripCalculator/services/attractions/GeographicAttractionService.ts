
export interface NearbyAttraction {
  id: string;
  name: string;
  description?: string;
  category?: string;
  city_name?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  distanceFromCity: number;
  attractionType: "attraction" | "hidden_gem" | "drive_in" | "waypoint";
}

export class GeographicAttractionService {
  static async getAttractionsNearCity(cityName: string): Promise<NearbyAttraction[]> {
    // Implementation would go here
    console.log(`Getting attractions near ${cityName}`);
    return [];
  }
}
