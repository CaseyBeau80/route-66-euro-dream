
import { PendingRequest } from './WeatherDeduplicationTypes';

export class WeatherRequestManager {
  private pendingRequests = new Map<string, PendingRequest>();
  private readonly REQUEST_TIMEOUT = 8000; // 8 seconds

  hasPendingRequest(key: string): boolean {
    return this.pendingRequests.has(key);
  }

  getPendingRequest(key: string): PendingRequest | undefined {
    return this.pendingRequests.get(key);
  }

  addSubscriberToPendingRequest(key: string, subscriberId: string): void {
    const existing = this.pendingRequests.get(key);
    if (existing) {
      existing.subscribers.add(subscriberId);
    }
  }

  createPendingRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    subscriberId: string,
    timeoutMs: number = this.REQUEST_TIMEOUT
  ): Promise<T> {
    console.log(`🆕 WeatherRequestManager: Creating new request for ${key}`);
    const subscribers = new Set([subscriberId]);
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        console.log(`⏰ WeatherRequestManager: Request timeout for ${key}`);
        this.pendingRequests.delete(key);
        reject(new Error(`Request timeout after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    const requestPromise = Promise.race([
      requestFn(),
      timeoutPromise
    ]);

    // Store the pending request
    this.pendingRequests.set(key, {
      promise: requestPromise,
      timestamp: Date.now(),
      subscribers
    });

    return requestPromise;
  }

  removePendingRequest(key: string): void {
    this.pendingRequests.delete(key);
  }

  clearPendingRequests(): void {
    console.log('🧹 WeatherRequestManager: Clearing pending requests');
    this.pendingRequests.clear();
  }

  getPendingRequestsCount(): number {
    return this.pendingRequests.size;
  }
}
