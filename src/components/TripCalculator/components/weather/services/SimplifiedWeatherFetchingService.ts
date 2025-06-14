
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { EnhancedApiKeyDetector } from './EnhancedApiKeyDetector';
import { WeatherSourceVerifier } from './WeatherSourceVerifier';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

export class SimplifiedWeatherFetchingService {
  static async fetchWeatherForSegment(
    cityName: string,
    segmentDate: Date,
    onLoadingChange: (loading: boolean) => void,
    onError: (error: string | null) => void,
    onWeatherSet: (weather: ForecastWeatherData | null) => void
  ): Promise<void> {
    console.log('🔧 PLAN: SimplifiedWeatherFetchingService enhanced fetch starting:', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      enhancedLogic: true
    });

    try {
      onLoadingChange(true);
      onError(null);

      // STEP 1: Enhanced API key detection
      const apiKeyResult = EnhancedApiKeyDetector.detectApiKey();
      EnhancedApiKeyDetector.logDetectionResult(apiKeyResult, `fetch-${cityName}`);

      // STEP 2: Attempt live forecast if conditions are met
      if (apiKeyResult.hasApiKey && apiKeyResult.isValid) {
        console.log('🚀 PLAN: Attempting live forecast with direct API call');
        
        const liveResult = await this.attemptDirectLiveForecast(cityName, segmentDate);

        if (liveResult) {
          // STEP 3: Verify weather source
          const verification = WeatherSourceVerifier.verifyWeatherSource(
            liveResult,
            segmentDate,
            apiKeyResult.hasApiKey
          );
          
          WeatherSourceVerifier.logVerificationResult(verification, cityName);

          console.log('✅ PLAN: Live forecast successful:', {
            cityName,
            temperature: liveResult.temperature,
            source: liveResult.source,
            isActualForecast: liveResult.isActualForecast
          });

          onLoadingChange(false);
          onWeatherSet(liveResult);
          return;
        } else {
          console.log('⚠️ PLAN: Direct live forecast failed, using fallback');
        }
      } else {
        console.log('ℹ️ PLAN: No valid API key, using fallback weather');
      }

      // STEP 4: Fallback to historical weather
      const targetDateString = segmentDate.toISOString().split('T')[0];
      const daysFromToday = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

      const fallbackWeather = WeatherFallbackService.createFallbackForecast(
        cityName,
        segmentDate,
        targetDateString,
        daysFromToday
      );

      // STEP 5: Verify fallback source
      const fallbackVerification = WeatherSourceVerifier.verifyWeatherSource(
        fallbackWeather,
        segmentDate,
        apiKeyResult.hasApiKey
      );
      
      WeatherSourceVerifier.logVerificationResult(fallbackVerification, cityName);

      onLoadingChange(false);
      onWeatherSet(fallbackWeather);

    } catch (error) {
      console.error('❌ PLAN: SimplifiedWeatherFetchingService error:', error);
      onLoadingChange(false);
      onError(error instanceof Error ? error.message : 'Weather fetch failed');
    }
  }

  private static async attemptDirectLiveForecast(
    cityName: string,
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    try {
      const apiKey = localStorage.getItem('openweathermap_api_key') || localStorage.getItem('weather_api_key');
      if (!apiKey) {
        console.log('❌ No API key found for direct forecast');
        return null;
      }

      // Step 1: Get coordinates
      const coords = await this.getCoordinates(cityName, apiKey);
      if (!coords) {
        console.log('❌ Could not get coordinates for', cityName);
        return null;
      }

      console.log('✅ Got coordinates for', cityName, coords);

      // Step 2: Check if date is within forecast range
      const today = new Date();
      const daysFromNow = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

      if (daysFromNow < 0 || daysFromNow > 5) {
        console.log('📅 Date outside forecast range for', cityName, { daysFromNow });
        return null;
      }

      // Step 3: Fetch live weather
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      const response = await fetch(weatherUrl);

      if (!response.ok) {
        console.log('❌ Weather API failed for', cityName, response.status);
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.log('❌ No forecast data for', cityName);
        return null;
      }

      // Step 4: Find best match for target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      
      let bestMatch = null;
      let bestScore = Infinity;
      
      for (const item of data.list) {
        const itemDate = new Date(item.dt * 1000);
        const itemDateString = itemDate.toISOString().split('T')[0];
        
        if (itemDateString === targetDateString) {
          bestMatch = item;
          break;
        }
        
        // Calculate time difference as backup
        const timeDiff = Math.abs(itemDate.getTime() - targetDate.getTime());
        if (timeDiff < bestScore) {
          bestScore = timeDiff;
          bestMatch = item;
        }
      }

      if (!bestMatch) {
        console.log('❌ No suitable forecast match for', cityName);
        return null;
      }

      // Step 5: Create forecast data
      const liveWeather: ForecastWeatherData = {
        temperature: Math.round(bestMatch.main.temp),
        highTemp: Math.round(bestMatch.main.temp_max),
        lowTemp: Math.round(bestMatch.main.temp_min),
        description: bestMatch.weather[0].description,
        icon: bestMatch.weather[0].icon,
        humidity: bestMatch.main.humidity,
        windSpeed: Math.round(bestMatch.wind?.speed || 0),
        precipitationChance: Math.round((bestMatch.pop || 0) * 100),
        cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: true,
        source: 'live_forecast' as const,
        dateMatchInfo: {
          requestedDate: targetDateString,
          matchedDate: new Date(bestMatch.dt * 1000).toISOString().split('T')[0],
          matchType: 'exact' as const,
          daysOffset: daysFromNow,
          hoursOffset: 0,
          source: 'live_forecast' as const,
          confidence: 'high' as const
        }
      };

      console.log('✅ Created live forecast for', cityName, {
        temperature: liveWeather.temperature,
        description: liveWeather.description,
        isActualForecast: liveWeather.isActualForecast,
        source: liveWeather.source
      });

      return liveWeather;

    } catch (error) {
      console.error('❌ Direct live forecast error for', cityName, error);
      return null;
    }
  }

  private static async getCoordinates(cityName: string, apiKey: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;
      const response = await fetch(geocodingUrl);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        return null;
      }

      return { lat: data[0].lat, lng: data[0].lon };

    } catch (error) {
      console.error('❌ Geocoding error for', cityName, error);
      return null;
    }
  }
}
