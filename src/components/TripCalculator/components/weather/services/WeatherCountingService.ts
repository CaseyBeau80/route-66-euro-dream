
import { DailySegment } from '../../../services/planning/TripPlanBuilder';
import { WeatherPersistenceService } from './WeatherPersistenceService';
import { DateNormalizationService } from '../DateNormalizationService';

export interface WeatherSegmentStatus {
  day: number;
  cityName: string;
  hasWeather: boolean;
  isActualForecast: boolean;
  temperature?: number;
  segmentDate?: Date;
}

export interface WeatherSummary {
  totalSegments: number;
  segmentsWithWeather: number;
  segmentsWithLiveForecast: number;
  segmentsWithSeasonalData: number;
  coveragePercentage: number;
  liveForecastPercentage: number;
  segmentStatuses: WeatherSegmentStatus[];
}

export class WeatherCountingService {
  /**
   * Generate comprehensive weather summary for trip segments
   */
  static generateWeatherSummary(
    segments: DailySegment[],
    tripStartDate?: Date
  ): WeatherSummary {
    console.log('📊 WeatherCountingService: Generating weather summary for', segments.length, 'segments');

    if (!segments.length) {
      return {
        totalSegments: 0,
        segmentsWithWeather: 0,
        segmentsWithLiveForecast: 0,
        segmentsWithSeasonalData: 0,
        coveragePercentage: 0,
        liveForecastPercentage: 0,
        segmentStatuses: []
      };
    }

    const segmentStatuses: WeatherSegmentStatus[] = [];
    let segmentsWithWeather = 0;
    let segmentsWithLiveForecast = 0;
    let segmentsWithSeasonalData = 0;

    segments.forEach(segment => {
      const segmentDate = tripStartDate 
        ? DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day)
        : null;

      const cityName = segment.endCity || 'Unknown';
      
      // Check for weather data in multiple sources
      const hasPersistedWeather = segmentDate 
        ? WeatherPersistenceService.hasWeatherData(cityName, segmentDate)
        : false;

      const hasSegmentWeather = !!(segment.weather || segment.weatherData || hasPersistedWeather);
      const weatherData = segment.weather || segment.weatherData || 
        (segmentDate ? WeatherPersistenceService.getWeatherData(cityName, segmentDate) : null);

      const isActualForecast = weatherData?.isActualForecast || false;

      const status: WeatherSegmentStatus = {
        day: segment.day,
        cityName,
        hasWeather: hasSegmentWeather,
        isActualForecast,
        temperature: weatherData?.temperature || weatherData?.highTemp,
        segmentDate
      };

      segmentStatuses.push(status);

      if (hasSegmentWeather) {
        segmentsWithWeather++;
        if (isActualForecast) {
          segmentsWithLiveForecast++;
        } else {
          segmentsWithSeasonalData++;
        }
      }

      console.log(`📊 Weather status for Day ${segment.day} (${cityName}):`, {
        hasWeather: hasSegmentWeather,
        isActualForecast,
        hasPersistedWeather,
        temperature: status.temperature
      });
    });

    const totalSegments = segments.length;
    const coveragePercentage = Math.round((segmentsWithWeather / totalSegments) * 100);
    const liveForecastPercentage = totalSegments > 0 
      ? Math.round((segmentsWithLiveForecast / totalSegments) * 100)
      : 0;

    const summary: WeatherSummary = {
      totalSegments,
      segmentsWithWeather,
      segmentsWithLiveForecast,
      segmentsWithSeasonalData,
      coveragePercentage,
      liveForecastPercentage,
      segmentStatuses
    };

    console.log('✅ WeatherCountingService: Weather summary generated:', {
      totalSegments,
      coveragePercentage,
      liveForecastPercentage,
      detailedBreakdown: {
        withWeather: segmentsWithWeather,
        withLiveForecast: segmentsWithLiveForecast,
        withSeasonalData: segmentsWithSeasonalData
      }
    });

    return summary;
  }

  /**
   * Check if weather data is sufficient for export
   */
  static isWeatherReadyForExport(summary: WeatherSummary): boolean {
    // Consider ready if we have weather for at least 70% of segments
    return summary.coveragePercentage >= 70;
  }

  /**
   * Get weather quality assessment
   */
  static getWeatherQuality(summary: WeatherSummary): 'excellent' | 'good' | 'fair' | 'poor' {
    if (summary.liveForecastPercentage >= 80) return 'excellent';
    if (summary.liveForecastPercentage >= 60) return 'good';
    if (summary.coveragePercentage >= 70) return 'fair';
    return 'poor';
  }
}
