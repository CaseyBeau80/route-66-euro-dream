
import { TripStop } from '../types/TripStop';

export interface SimpleAttraction {
  name: string;
  title?: string;
  description: string;
  city: string;
}

export class TripStopConverter {
  static convertSimpleAttractionToTripStop(attraction: SimpleAttraction): TripStop {
    return {
      id: `attraction-${Math.random().toString(36).substr(2, 9)}`,
      name: attraction.name,
      description: attraction.description,
      category: 'attraction',
      city_name: attraction.city,
      city: attraction.city,
      state: 'Unknown',
      latitude: 0,
      longitude: 0,
      image_url: undefined,
      is_major_stop: false,
      is_official_destination: false
    };
  }

  static convertSimpleAttractionsToTripStops(attractions: SimpleAttraction[]): TripStop[] {
    return attractions.map(attraction => this.convertSimpleAttractionToTripStop(attraction));
  }
}
