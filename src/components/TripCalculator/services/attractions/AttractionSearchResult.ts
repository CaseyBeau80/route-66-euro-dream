
export enum AttractionSearchStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  TIMEOUT = 'TIMEOUT',
  CITY_NOT_FOUND = 'CITY_NOT_FOUND',
  NO_ATTRACTIONS = 'NO_ATTRACTIONS'
}

export interface AttractionSearchResult {
  status: AttractionSearchStatus;
  attractions: any[];
  message: string;
  citySearched: string;
  stateSearched: string;
}
