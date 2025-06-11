
export enum AttractionSearchStatus {
  SUCCESS = 'SUCCESS',
  CITY_NOT_FOUND = 'CITY_NOT_FOUND', 
  NO_ATTRACTIONS = 'NO_ATTRACTIONS',
  TIMEOUT = 'TIMEOUT',
  ERROR = 'ERROR'
}

export interface AttractionSearchResult {
  status: AttractionSearchStatus;
  attractions: import('./GeographicAttractionService').NearbyAttraction[];
  message?: string;
  citySearched?: string;
  stateSearched?: string;
}
