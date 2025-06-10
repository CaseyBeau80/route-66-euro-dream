
export interface JourneyStop {
  id: string;
  city: string;
  state: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  backgroundVideo?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  highlights: string[];
  yearEstablished?: number;
  category: 'start' | 'major' | 'scenic' | 'cultural' | 'end';
  sequence: number;
}

export interface JourneyProgress {
  currentStop: number;
  scrollProgress: number;
  totalDistance: number;
  completedDistance: number;
}
