
export interface StopCurationConfig {
  maxStops: number;
  attractionRatio: number; // 0-1, percentage of attractions vs waypoints/gems
  preferDestinationCities: boolean;
  diversityBonus: boolean;
}

export interface TargetNumbers {
  attractions: number;
  waypoints: number;
  hiddenGems: number;
}

export interface CuratedStopSelection {
  attractions: any[];
  waypoints: any[];
  hiddenGems: any[];
  totalSelected: number;
}

export const DEFAULT_CURATION_CONFIG: StopCurationConfig = {
  maxStops: 3,
  attractionRatio: 0.6,
  preferDestinationCities: true,
  diversityBonus: true
};
