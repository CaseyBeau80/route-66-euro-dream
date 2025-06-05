
import { TripStop } from '../data/SupabaseDataService';

export interface StopCurationConfig {
  maxStops: number;
  attractionRatio: number; // 0.5 = 50% attractions, 50% waypoints
  preferDestinationCities: boolean;
  diversityBonus: boolean;
}

export interface CuratedStopSelection {
  attractions: TripStop[];
  waypoints: TripStop[];
  hiddenGems: TripStop[];
  totalSelected: number;
}

export interface TargetNumbers {
  attractions: number;
  waypoints: number;
  hiddenGems: number;
}

export const DEFAULT_CURATION_CONFIG: StopCurationConfig = {
  maxStops: 4,
  attractionRatio: 0.6, // Prefer attractions slightly
  preferDestinationCities: true,
  diversityBonus: true
};
