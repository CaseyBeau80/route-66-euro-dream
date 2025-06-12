import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { getWeatherDataForTripDate } from '../weather/getWeatherDataForTripDate';
import { WeatherCountingService } from '../weather/services/WeatherCountingService';
import { WeatherPersistenceService } from '../weather/services/WeatherPersistenceService';
import { WeatherDataNormalizer } from '../weather/services/WeatherDataNormalizer';
import { WeatherDebugService } from '../weather/services/WeatherDebugService';

export class PDFWeatherIntegrationService {
  static async enrichSegmentsWithWeather(
    segments: DailySegment[], 
    tripStartDate?: Date
  ): Promise<DailySegment[]> {
    // 🚨 DEBUG INJECTION: Service entry point logging
    console.log('🚨 DEBUG: PDFWeatherIntegrationService.enrichSegmentsWithWeather ENTRY', {
      segmentsCount: segments?.length || 0,
      hasTripStartDate: !!tripStartDate,
      tripStartDate: tripStartDate?.toISOString(),
      segmentDetails: segments?.map(s => ({
        day: s.day,
        endCity: s.endCity,
        hasExistingWeather: !!(s.weather || s.weatherData)
      })) || []
    });

    console.log('🌤️ PDFWeatherIntegrationService: Enhanced weather enrichment starting...');
    
    if (!segments || segments.length === 0) {
      // 🚨 DEBUG INJECTION: Early exit logging
      console.log('🚨 DEBUG: PDFWeatherIntegrationService early exit - no segments', {
        segments,
        segmentsLength: segments?.length
      });
      console.log('⚠️ No segments to enrich');
      return [];
    }

    if (!tripStartDate) {
      // 🚨 DEBUG INJECTION: No start date logging
      console.log('🚨 DEBUG: PDFWeatherIntegrationService no start date - checking existing weather', {
        reason: 'no_trip_start_date'
      });
      console.log('⚠️ No trip start date provided, checking for existing weather data');
      // Generate summary with existing data
      const summary = WeatherCountingService.generateWeatherSummary(segments);
      console.log('📊 Existing weather summary:', summary);
      return segments;
    }

    // Clean up expired cache entries
    WeatherPersistenceService.clearExpiredEntries();

    const enrichedSegments: DailySegment[] = [];

    for (const segment of segments) {
      try {
        const segmentDate = new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
        
        // 🚨 DEBUG INJECTION: Segment processing logging
        console.log('🚨 DEBUG: PDFWeatherIntegrationService processing segment', {
          day: segment.day,
          endCity: segment.endCity,
          segmentDate: segmentDate.toISOString(),
          tripStartDate: tripStartDate.toISOString(),
          dayOffset: segment.day - 1
        });
        
        console.log(`🌤️ Processing weather for Day ${segment.day} (${segment.endCity}) on ${segmentDate.toISOString()}`);
        
        // Check for cached data first
        let weatherData = null;
        const cachedWeather = WeatherPersistenceService.getWeatherData(segment.endCity, segmentDate);
        
        if (cachedWeather) {
          // 🚨 DEBUG INJECTION: Cached weather logging
          console.log('🚨 DEBUG: PDFWeatherIntegrationService using cached weather', {
            day: segment.day,
            endCity: segment.endCity,
            cachedData: {
              temperature: cachedWeather.temperature,
              highTemp: cachedWeather.highTemp,
              lowTemp: cachedWeather.lowTemp,
              isActualForecast: cachedWeather.isActualForecast,
              source: cachedWeather.source
            }
          });

          console.log(`💾 Using cached weather for Day ${segment.day}`);
          weatherData = {
            temperature: cachedWeather.temperature,
            highTemp: cachedWeather.highTemp,
            lowTemp: cachedWeather.lowTemp,
            description: cachedWeather.description,
            icon: cachedWeather.icon,
            humidity: cachedWeather.humidity,
            windSpeed: cachedWeather.windSpeed,
            precipitationChance: cachedWeather.precipitationChance,
            cityName: cachedWeather.cityName,
            isActualForecast: cachedWeather.isActualForecast,
            dateMatchInfo: cachedWeather.dateMatchInfo
          };
        } else {
          // 🚨 DEBUG INJECTION: Fresh fetch attempt logging
          console.log('🚨 DEBUG: PDFWeatherIntegrationService attempting fresh weather fetch', {
            day: segment.day,
            endCity: segment.endCity,
            segmentDate: segmentDate.toISOString()
          });

          // Attempt to fetch new weather data
          try {
            weatherData = await getWeatherDataForTripDate(segment.endCity, segmentDate);
            
            // 🚨 DEBUG INJECTION: Fresh fetch result logging
            console.log('🚨 DEBUG: PDFWeatherIntegrationService fresh fetch result', {
              day: segment.day,
              endCity: segment.endCity,
              hasWeatherData: !!weatherData,
              weatherData: weatherData ? {
                highTemp: weatherData.highTemp,
                lowTemp: weatherData.lowTemp,
                isActualForecast: weatherData.isActualForecast,
                source: weatherData.source
              } : null
            });
            
            // Normalize and persist the new data
            if (weatherData) {
              const normalized = WeatherDataNormalizer.normalizeWeatherData(
                weatherData, 
                segment.endCity, 
                segmentDate
              );
              
              if (normalized) {
                WeatherPersistenceService.storeWeatherData(segment.endCity, segmentDate, normalized);
                
                // 🚨 DEBUG INJECTION: Persistence success logging
                console.log('🚨 DEBUG: PDFWeatherIntegrationService data normalized and persisted', {
                  day: segment.day,
                  endCity: segment.endCity,
                  normalizedValid: normalized.isValid,
                  normalizedTemps: {
                    temperature: normalized.temperature,
                    high: normalized.highTemp,
                    low: normalized.lowTemp
                  }
                });

                // 🎯 NEW: Use specific debug marker for normalized forecast output
                WeatherDebugService.logNormalizedForecastOutput(segment.endCity, normalized);

                console.log(`💾 Persisted new weather data for Day ${segment.day}`);
              }
            }
          } catch (error) {
            // 🚨 DEBUG INJECTION: Fetch error logging
            console.log('🚨 DEBUG: PDFWeatherIntegrationService fetch error', {
              day: segment.day,
              endCity: segment.endCity,
              error: error instanceof Error ? error.message : 'Unknown error'
            });

            console.warn(`⚠️ Failed to fetch weather for Day ${segment.day}:`, error);
          }
        }
        
        const enrichedSegment = {
          ...segment,
          weather: weatherData,
          weatherData: weatherData // Backup property
        };
        
        // 🎯 NEW: Use specific debug marker for PDF export logging
        WeatherDebugService.logPdfWeatherExport(segment.endCity, segment.day, enrichedSegment);
        
        enrichedSegments.push(enrichedSegment);
        console.log(`✅ Weather data enriched for Day ${segment.day}`);
        
      } catch (error) {
        // 🚨 DEBUG INJECTION: Segment processing error logging
        console.log('🚨 DEBUG: PDFWeatherIntegrationService segment processing error', {
          day: segment.day,
          endCity: segment.endCity,
          error: error instanceof Error ? error.message : 'Unknown error'
        });

        console.warn(`⚠️ Failed to process weather for Day ${segment.day} (${segment.endCity}):`, error);
        
        // Add segment without weather data
        enrichedSegments.push({
          ...segment,
          weather: null,
          weatherData: null
        });
      }
    }

    // Generate final weather summary
    const finalSummary = WeatherCountingService.generateWeatherSummary(enrichedSegments, tripStartDate);
    
    // 🚨 DEBUG INJECTION: Final summary logging
    console.log('🚨 DEBUG: PDFWeatherIntegrationService FINAL SUMMARY', {
      enrichedSegmentsCount: enrichedSegments.length,
      finalSummary,
      weatherEnrichmentSuccess: enrichedSegments.filter(s => !!(s.weather || s.weatherData)).length,
      coveragePercentage: finalSummary.coveragePercentage
    });

    console.log('📊 Final weather enrichment summary:', finalSummary);

    console.log(`✅ Enhanced weather enrichment completed: ${enrichedSegments.length} segments processed`);
    console.log('📊 Weather coverage:', {
      total: finalSummary.totalSegments,
      withWeather: finalSummary.segmentsWithWeather,
      liveForecast: finalSummary.segmentsWithLiveForecast,
      coverage: finalSummary.coveragePercentage + '%'
    });

    return enrichedSegments;
  }

  /**
   * Get weather statistics for PDF export validation
   */
  static getWeatherExportStats(segments: DailySegment[], tripStartDate?: Date) {
    // 🚨 DEBUG INJECTION: Export stats logging
    console.log('🚨 DEBUG: PDFWeatherIntegrationService.getWeatherExportStats', {
      segmentsCount: segments?.length || 0,
      hasTripStartDate: !!tripStartDate
    });

    const summary = WeatherCountingService.generateWeatherSummary(segments, tripStartDate);
    const isReady = WeatherCountingService.isWeatherReadyForExport(summary);
    const quality = WeatherCountingService.getWeatherQuality(summary);

    const result = {
      summary,
      isReady,
      quality,
      message: this.getWeatherStatusMessage(summary, quality)
    };

    // 🚨 DEBUG INJECTION: Export stats result logging
    console.log('🚨 DEBUG: PDFWeatherIntegrationService export stats result', {
      summary,
      isReady,
      quality,
      message: result.message
    });

    return result;
  }

  private static getWeatherStatusMessage(
    summary: { coveragePercentage: number; liveForecastPercentage: number },
    quality: string
  ): string {
    if (quality === 'excellent') {
      return `Excellent weather coverage (${summary.liveForecastPercentage}% live forecasts)`;
    } else if (quality === 'good') {
      return `Good weather coverage (${summary.liveForecastPercentage}% live forecasts)`;
    } else if (quality === 'fair') {
      return `Fair weather coverage (${summary.coveragePercentage}% coverage)`;
    } else {
      return `Limited weather data available (${summary.coveragePercentage}% coverage)`;
    }
  }
}
