
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFetchCoordinator, WeatherFetchCallbacks } from './WeatherFetchCoordinator';
import { DateNormalizationService } from '../DateNormalizationService';

export class SimplifiedWeatherFetchingService {
  static async fetchWeatherForSegment(
    cityName: string,
    segmentDate: Date,
    onLoadingChange: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onWeatherSet: (weather: ForecastWeatherData | null) => void
  ): Promise<void> {
    console.log('🔧 SimplifiedWeatherFetchingService: Delegating to WeatherFetchCoordinator', {
      cityName,
      segmentDate: segmentDate.toISOString()
    });

    const callbacks: WeatherFetchCallbacks = {
      onLoadingChange,
      onError,
      onWeatherSet
    };

    await WeatherFetchCoordinator.fetchWeatherForSegment(
      cityName,
      segmentDate,
      callbacks
    );
  }

  static cancelRequest(cityName: string, segmentDate: Date): void {
    WeatherFetchCoordinator.cancelRequest(cityName, segmentDate);
  }

  static cancelAllRequests(): void {
    WeatherFetchCoordinator.cancelAllRequests();
  }
}
