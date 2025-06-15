
import { TripStop } from '../../types/TripStop';

export interface RecommendedStop {
  id: string;
  name: string;
  city: string;
  state: string;
  category: string;
  type: string;
  relevanceScore: number;
  originalStop: TripStop;
}
