
import { useState } from 'react';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';
import { PDFWeatherIntegrationService } from '../PDFWeatherIntegrationService';

interface WeatherPreloadResult {
  enrichedSegments: DailySegment[];
  weatherLoadingComplete: boolean;
  weatherErrors: string[];
}

export const usePDFWeatherPreloader = () => {
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);

  const preloadWeatherData = async (
    segments: DailySegment[],
    tripStartDate?: Date
  ): Promise<WeatherPreloadResult> => {
    console.log('🌤️ PDFWeatherPreloader: Starting weather data preload...');
    setIsPreloading(true);
    setPreloadProgress(0);

    try {
      // Use the existing weather integration service
      const enrichedSegments = await PDFWeatherIntegrationService.enrichSegmentsWithWeather(
        segments,
        tripStartDate
      );

      // Simulate progress for user feedback
      for (let i = 0; i <= 100; i += 20) {
        setPreloadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log('✅ PDFWeatherPreloader: Weather preload completed');
      
      return {
        enrichedSegments,
        weatherLoadingComplete: true,
        weatherErrors: []
      };

    } catch (error) {
      console.error('❌ PDFWeatherPreloader: Error during preload:', error);
      
      return {
        enrichedSegments: segments, // Return original segments on error
        weatherLoadingComplete: false,
        weatherErrors: [error instanceof Error ? error.message : 'Weather preload failed']
      };
    } finally {
      setIsPreloading(false);
      setPreloadProgress(100);
    }
  };

  return {
    preloadWeatherData,
    isPreloading,
    preloadProgress
  };
};
