
export interface RecommendedStop {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  distanceFromRoute: number;
  relevanceScore: number;
  type: 'attraction' | 'hidden_gem' | 'waypoint';
}

export interface StopFormattingResult {
  name: string;
  location: string;
  category: string;
  icon: string;
}
