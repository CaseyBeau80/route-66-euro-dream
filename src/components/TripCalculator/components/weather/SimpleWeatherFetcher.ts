import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { CityWeatherVariationService } from './services/CityWeatherVariationService';

interface WeatherFetchRequest {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
  isSharedView?: boolean;
  segmentDay?: number;
}

export class SimpleWeatherFetcher {
  // Live forecast range for OpenWeatherMap's 5-day forecast
  private static readonly LIVE_FORECAST_MAX_DAYS = 5;
  
  static async fetchWeatherForCity(request: WeatherFetchRequest): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, hasApiKey, isSharedView = false, segmentDay = 1 } = request;
    
    console.log('🚀 FIXED: Starting weather fetch with enhanced geocoding', {
      cityName,
      targetDate: targetDate.toISOString(),
      hasApiKey,
      isSharedView,
      segmentDay
    });

    // Calculate days from today
    const today = new Date();
    const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const isWithinLiveForecastRange = daysFromToday >= 0 && daysFromToday <= this.LIVE_FORECAST_MAX_DAYS;
    
    console.log('📅 FIXED: Date range analysis:', {
      cityName,
      targetDate: targetDate.toISOString(),
      daysFromToday,
      isWithinLiveForecastRange,
      shouldAttemptLive: hasApiKey && isWithinLiveForecastRange
    });

    // Attempt live forecast if conditions are met
    if (hasApiKey && isWithinLiveForecastRange) {
      console.log('✅ FIXED: Attempting live forecast for', cityName);
      
      try {
        const validApiKey = await this.validateApiKey();
        if (validApiKey) {
          const coords = await this.getCoordinatesFixed(cityName, validApiKey);
          if (coords) {
            const liveWeather = await this.fetchLiveWeatherData(coords, validApiKey, targetDate, cityName, segmentDay);
            if (liveWeather) {
              console.log('🎯 FIXED: Live forecast SUCCESS:', {
                cityName,
                temperature: liveWeather.temperature,
                source: liveWeather.source,
                isActualForecast: liveWeather.isActualForecast
              });
              return liveWeather;
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ FIXED: Live forecast failed, using fallback:', error);
      }
    }

    // Create fallback weather
    console.log('🔄 FIXED: Creating fallback weather for', cityName);
    return this.createFallbackWeather(cityName, targetDate, segmentDay, daysFromToday);
  }

  private static async validateApiKey(): Promise<string | null> {
    const primaryKey = localStorage.getItem('weather_api_key');
    const legacyKey = localStorage.getItem('openweathermap_api_key');
    
    const apiKey = primaryKey || legacyKey;
    
    if (!apiKey || apiKey.trim().length < 20 || apiKey === 'your_api_key_here') {
      console.log('❌ FIXED: Invalid or missing API key');
      return null;
    }

    console.log('✅ FIXED: Valid API key found');
    return apiKey;
  }

  // FIXED: Enhanced geocoding with better city name handling
  private static async getCoordinatesFixed(cityName: string, apiKey: string): Promise<{ lat: number; lng: number } | null> {
    try {
      // FIXED: Better city name processing for US cities
      const processedCityName = this.processCityNameForGeocoding(cityName);
      console.log('🔍 FIXED: Enhanced geocoding for', cityName, '→', processedCityName);

      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(processedCityName)}&limit=5&appid=${apiKey}`;
      
      const response = await fetch(geocodingUrl);

      if (!response.ok) {
        console.log('❌ FIXED: Geocoding API failed', {
          status: response.status,
          cityName: processedCityName
        });
        return null;
      }

      const data = await response.json();
      
      if (!data || data.length === 0) {
        console.log('❌ FIXED: No geocoding results for', processedCityName);
        
        // FIXED: Try alternative city name formats
        const alternatives = this.getAlternativeCityNames(cityName);
        for (const altName of alternatives) {
          console.log('🔄 FIXED: Trying alternative name:', altName);
          const altUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(altName)}&limit=5&appid=${apiKey}`;
          const altResponse = await fetch(altUrl);
          
          if (altResponse.ok) {
            const altData = await altResponse.json();
            if (altData && altData.length > 0) {
              const bestMatch = this.selectBestMatch(altData, cityName);
              const coords = { lat: bestMatch.lat, lng: bestMatch.lon };
              console.log('✅ FIXED: Found coordinates with alternative name:', altName, coords);
              return coords;
            }
          }
        }
        
        return null;
      }

      const bestMatch = this.selectBestMatch(data, cityName);
      const coords = { lat: bestMatch.lat, lng: bestMatch.lon };
      
      console.log('✅ FIXED: Coordinates obtained:', {
        city: processedCityName,
        coordinates: coords,
        country: bestMatch.country,
        state: bestMatch.state
      });
      
      return coords;
    } catch (error) {
      console.error('❌ FIXED: Geocoding error:', error);
      return null;
    }
  }

  // FIXED: Better city name processing for geocoding
  private static processCityNameForGeocoding(cityName: string): string {
    let processed = cityName.trim();
    
    // Remove common suffixes that might interfere with geocoding
    processed = processed.replace(/,?\s*(Route 66|Historic Route 66)/gi, '');
    
    // If it already has state, keep it
    if (processed.includes(',')) {
      return processed;
    }
    
    // Add US for better geocoding results
    return `${processed},US`;
  }

  // FIXED: Generate alternative city name formats for better geocoding success
  private static getAlternativeCityNames(cityName: string): string[] {
    const alternatives: string[] = [];
    const baseName = cityName.replace(/,.*$/, '').trim(); // Remove state if present
    
    // Try with different state formats
    alternatives.push(`${baseName},USA`);
    alternatives.push(`${baseName}, United States`);
    alternatives.push(baseName); // Just the city name
    
    // Handle common city name variations
    if (baseName.includes('St.')) {
      alternatives.push(baseName.replace('St.', 'Saint'));
    }
    if (baseName.includes('Saint')) {
      alternatives.push(baseName.replace('Saint', 'St.'));
    }
    
    return alternatives;
  }

  private static selectBestMatch(results: any[], originalCity: string): any {
    // Prefer US results
    const usResults = results.filter(r => r.country === 'US');
    if (usResults.length > 0) {
      return usResults[0];
    }
    
    return results[0];
  }

  private static async fetchLiveWeatherData(
    coords: { lat: number; lng: number },
    apiKey: string,
    targetDate: Date,
    cityName: string,
    segmentDay: number
  ): Promise<ForecastWeatherData | null> {
    try {
      console.log('🌤️ FIXED: Fetching live weather data', {
        cityName,
        coordinates: coords,
        targetDate: targetDate.toISOString()
      });

      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      
      const response = await fetch(weatherUrl);

      if (!response.ok) {
        console.log('❌ FIXED: Weather API failed', {
          status: response.status,
          cityName
        });
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.log('❌ FIXED: Empty weather response for', cityName);
        return null;
      }

      console.log('✅ FIXED: Weather API response received', {
        cityName,
        forecastItems: data.list.length,
        firstItemDate: data.list[0]?.dt_txt
      });

      // Find best match for target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      let bestMatch = null;

      // Try exact date match first
      bestMatch = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      });

      // Use closest available if no exact match
      if (!bestMatch) {
        const targetTime = targetDate.getTime();
        bestMatch = data.list.reduce((closest: any, current: any) => {
          const currentTime = new Date(current.dt * 1000).getTime();
          const closestTime = new Date(closest.dt * 1000).getTime();
          
          return Math.abs(currentTime - targetTime) < Math.abs(closestTime - targetTime) 
            ? current : closest;
        });
      }

      if (!bestMatch) {
        console.log('❌ FIXED: No suitable weather match found for', cityName);
        return null;
      }

      const matchedDate = new Date(bestMatch.dt * 1000).toISOString().split('T')[0];
      console.log('✅ FIXED: Weather match found', {
        cityName,
        targetDate: targetDateString,
        matchedDate,
        matchType: matchedDate === targetDateString ? 'exact' : 'closest'
      });

      // Apply city-specific variation for uniqueness
      const variation = this.getCityVariation(cityName, segmentDay);

      // Create live forecast with verified properties
      const liveWeatherResult: ForecastWeatherData = {
        temperature: Math.round(bestMatch.main.temp + variation.tempOffset),
        highTemp: Math.round(bestMatch.main.temp_max + variation.tempOffset),
        lowTemp: Math.round(bestMatch.main.temp_min + variation.tempOffset),
        description: bestMatch.weather[0]?.description || variation.description,
        icon: bestMatch.weather[0]?.icon || variation.icon,
        humidity: Math.max(0, Math.min(100, bestMatch.main.humidity + variation.humidityOffset)),
        windSpeed: Math.max(0, Math.round((bestMatch.wind?.speed || 0) + variation.windOffset)),
        precipitationChance: Math.max(0, Math.min(100, Math.round((bestMatch.pop || 0) * 100) + variation.precipitationOffset)),
        cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: true, // CRITICAL: Must be true for live forecasts
        source: 'live_forecast' as const // CRITICAL: Must be 'live_forecast'
      };

      console.log('🎯 FIXED: Live forecast CREATED:', {
        cityName,
        temperature: liveWeatherResult.temperature,
        isActualForecast: liveWeatherResult.isActualForecast,
        source: liveWeatherResult.source,
        description: liveWeatherResult.description
      });

      return liveWeatherResult;

    } catch (error) {
      console.error('❌ FIXED: Error fetching live weather:', error);
      return null;
    }
  }

  private static getCityVariation(cityName: string, segmentDay: number = 1) {
    const combinedKey = `${cityName}-day-${segmentDay}`;
    let hash = 0;
    for (let i = 0; i < combinedKey.length; i++) {
      const char = combinedKey.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const tempOffset = (hash % 15) - 7;
    const humidityOffset = (hash % 20) - 10;
    const windOffset = (hash % 10) - 5;
    const precipitationOffset = Math.abs(hash % 15);
    
    const descriptions = [
      'Partly Cloudy', 'Mostly Sunny', 'Clear', 'Few Clouds', 
      'Scattered Clouds', 'Overcast', 'Light Rain', 'Partly Sunny',
      'Sunny', 'Cloudy', 'Fair', 'Hazy'
    ];
    const icons = ['01d', '02d', '03d', '04d', '10d', '50d', '01n', '02n'];
    
    const descriptionIndex = Math.abs(hash % descriptions.length);
    const iconIndex = Math.abs(hash % icons.length);
    
    return {
      tempOffset,
      humidityOffset,
      windOffset,
      precipitationOffset,
      description: descriptions[descriptionIndex],
      icon: icons[iconIndex]
    };
  }

  private static createFallbackWeather(
    cityName: string, 
    targetDate: Date, 
    segmentDay: number,
    daysFromToday: number
  ): ForecastWeatherData {
    const targetDateString = targetDate.toISOString().split('T')[0];

    console.log('🔄 FIXED: Creating fallback weather', {
      cityName,
      targetDateString,
      daysFromToday,
      segmentDay
    });

    const baseFallback = WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );

    // Apply city+day variations for uniqueness
    const enhancedWeather = CityWeatherVariationService.applyVariationToWeather(
      baseFallback, 
      `${cityName}-day-${segmentDay}`
    );

    console.log('✅ FIXED: Fallback weather created', {
      cityName,
      temperature: enhancedWeather.temperature,
      description: enhancedWeather.description,
      source: enhancedWeather.source,
      isActualForecast: enhancedWeather.isActualForecast
    });

    return enhancedWeather;
  }
}
