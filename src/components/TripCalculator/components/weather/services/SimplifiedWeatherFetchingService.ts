
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
        console.log('🚀 PLAN: Attempting live forecast with enhanced API call');
        
        const liveResult = await this.attemptEnhancedLiveForecast(cityName, segmentDate);

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
          console.log('⚠️ PLAN: Enhanced live forecast failed, using fallback');
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

  private static async attemptEnhancedLiveForecast(
    cityName: string,
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    try {
      // FIXED: Use the correct API key detection method
      const apiKeyResult = EnhancedApiKeyDetector.detectApiKey();
      const apiKey = apiKeyResult.keySource === 'legacy-storage' ? 
        localStorage.getItem('openweathermap_api_key') || localStorage.getItem('weather_api_key') :
        localStorage.getItem('weather_api_key') || localStorage.getItem('openweathermap_api_key');

      if (!apiKey) {
        console.log('❌ No API key found for enhanced forecast');
        return null;
      }

      console.log('🔧 Enhanced live forecast: Getting coordinates for', cityName);

      // Step 1: Get coordinates with enhanced error handling
      const coords = await this.getEnhancedCoordinates(cityName, apiKey);
      if (!coords) {
        console.log('❌ Could not get coordinates for', cityName);
        return null;
      }

      console.log('✅ Got coordinates for', cityName, coords);

      // Step 2: Check if date is within forecast range (extended to 7 days)
      const today = new Date();
      const daysFromNow = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

      console.log('📅 Date check for', cityName, { daysFromNow, targetDate: targetDate.toISOString() });

      if (daysFromNow < 0 || daysFromNow > 7) {
        console.log('📅 Date outside extended forecast range for', cityName, { daysFromNow });
        return null;
      }

      // Step 3: Fetch live weather with enhanced matching
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      
      console.log('🌐 Making enhanced weather API call for', cityName);
      
      const response = await fetch(weatherUrl);

      if (!response.ok) {
        console.log('❌ Weather API failed for', cityName, response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.log('❌ No forecast data for', cityName);
        return null;
      }

      console.log('✅ Weather API data received for', cityName, {
        listLength: data.list.length,
        firstItem: data.list[0]?.dt_txt
      });

      // Step 4: Enhanced date matching with multiple strategies
      const targetDateString = targetDate.toISOString().split('T')[0];
      
      let bestMatch = null;
      let bestScore = Infinity;
      let matchType = 'none';
      
      // Strategy 1: Try exact date match first
      for (const item of data.list) {
        const itemDate = new Date(item.dt * 1000);
        const itemDateString = itemDate.toISOString().split('T')[0];
        
        if (itemDateString === targetDateString) {
          bestMatch = item;
          matchType = 'exact';
          console.log('✅ Found exact date match for', cityName, itemDateString);
          break;
        }
      }
      
      // Strategy 2: If no exact match, find closest within 48 hours
      if (!bestMatch) {
        for (const item of data.list) {
          const itemDate = new Date(item.dt * 1000);
          const timeDiff = Math.abs(itemDate.getTime() - targetDate.getTime());
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          
          if (hoursDiff <= 48 && timeDiff < bestScore) {
            bestScore = timeDiff;
            bestMatch = item;
            matchType = 'closest';
          }
        }
        
        if (bestMatch) {
          console.log('✅ Found closest match for', cityName, {
            targetDate: targetDateString,
            matchedDate: new Date(bestMatch.dt * 1000).toISOString().split('T')[0],
            hoursDiff: Math.round(bestScore / (1000 * 60 * 60))
          });
        }
      }

      // Strategy 3: Use first available forecast if within range
      if (!bestMatch && daysFromNow <= 5) {
        bestMatch = data.list[0];
        matchType = 'fallback';
        console.log('✅ Using first available forecast for', cityName);
      }

      if (!bestMatch) {
        console.log('❌ No suitable forecast match for', cityName);
        return null;
      }

      // Step 5: Create enhanced forecast data
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
          matchType: matchType as any,
          daysOffset: daysFromNow,
          hoursOffset: 0,
          source: 'live_forecast' as const,
          confidence: matchType === 'exact' ? 'high' : matchType === 'closest' ? 'medium' : 'low'
        }
      };

      console.log('✅ Created enhanced live forecast for', cityName, {
        temperature: liveWeather.temperature,
        description: liveWeather.description,
        isActualForecast: liveWeather.isActualForecast,
        source: liveWeather.source,
        matchType,
        confidence: liveWeather.dateMatchInfo?.confidence
      });

      return liveWeather;

    } catch (error) {
      console.error('❌ Enhanced live forecast error for', cityName, error);
      return null;
    }
  }

  private static async getEnhancedCoordinates(cityName: string, apiKey: string): Promise<{ lat: number; lng: number } | null> {
    try {
      // Enhanced city name processing for better geocoding results
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim(); // Remove state abbreviation
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`;
      
      console.log('🌐 Enhanced geocoding request for', cityName, '→', cleanCityName);
      
      const response = await fetch(geocodingUrl);

      if (!response.ok) {
        console.log('❌ Geocoding API failed:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        console.log('❌ No geocoding results for', cityName);
        return null;
      }

      // Use the first result with preference for US locations
      let selectedResult = data[0];
      for (const result of data) {
        if (result.country === 'US') {
          selectedResult = result;
          break;
        }
      }

      console.log('✅ Enhanced coordinates found for', cityName, {
        lat: selectedResult.lat,
        lng: selectedResult.lon,
        country: selectedResult.country,
        state: selectedResult.state
      });

      return { lat: selectedResult.lat, lng: selectedResult.lon };

    } catch (error) {
      console.error('❌ Enhanced geocoding error for', cityName, error);
      return null;
    }
  }
}
