
import { TripStop } from '../../types/TripStop';

export interface RecommendedStop {
  id: string;
  name: string;
  city: string;
  state: string;
  category: string;
  type: 'destination' | 'major' | 'featured' | 'attraction';
  relevanceScore: number;
  originalStop: TripStop;
}
