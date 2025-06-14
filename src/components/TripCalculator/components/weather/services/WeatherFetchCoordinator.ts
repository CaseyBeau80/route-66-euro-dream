
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { CoreWeatherFetcher } from './CoreWeatherFetcher';
import { DateNormalizationService } from '../DateNormalizationService';

export interface WeatherFetchCallbacks {
  onLoadingChange: (loading: boolean) => void;
  onError: (error: string | null) => void;
  onWeatherSet: (weather: ForecastWeatherData | null) => void;
}

export class WeatherFetchCoordinator {
  private static activeRequests = new Map<string, AbortController>();

  static async fetchWeatherForSegment(
    cityName: string,
    segmentDate: Date,
    callbacks: WeatherFetchCallbacks
  ): Promise<void> {
    const { onLoadingChange, onError, onWeatherSet } = callbacks;
    
    console.log('🔧 WeatherFetchCoordinator: Starting fetch for', cityName);

    const requestKey = `${cityName}-${segmentDate.getTime()}`;
    
    // Cancel existing request
    if (this.activeRequests.has(requestKey)) {
      this.activeRequests.get(requestKey)?.abort();
    }

    const abortController = new AbortController();
    this.activeRequests.set(requestKey, abortController);

    try {
      onLoadingChange(true);
      onError(null);

      const hasApiKey = !!localStorage.getItem('weather_api_key');
      
      if (abortController.signal.aborted) return;

      const weather = await CoreWeatherFetcher.fetchWeatherForCity({
        cityName,
        targetDate: segmentDate,
        hasApiKey,
        isSharedView: true
      });

      if (abortController.signal.aborted) return;

      onLoadingChange(false);
      onWeatherSet(weather);

    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error('❌ Weather fetch error for', cityName, ':', error);
        onLoadingChange(false);
        onError(error instanceof Error ? error.message : 'Weather fetch failed');
      }
    } finally {
      this.activeRequests.delete(requestKey);
    }
  }

  static cancelRequest(cityName: string, segmentDate: Date): void {
    const requestKey = `${cityName}-${segmentDate.getTime()}`;
    const controller = this.activeRequests.get(requestKey);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestKey);
    }
  }

  static cancelAllRequests(): void {
    this.activeRequests.forEach(controller => controller.abort());
    this.activeRequests.clear();
  }
}
