
export interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
  subscribers: Set<string>;
}

export interface CachedData {
  data: any;
  timestamp: number;
}

export interface DeduplicationStats {
  pending: number;
  cached: number;
}
