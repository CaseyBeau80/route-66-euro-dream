
import { createClient } from '@supabase/supabase-js';

export interface PublicWeatherData {
  temperature: number;
  highTemp: number;
  lowTemp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitationChance: number;
  cityName: string;
  isActualForecast: boolean;
  source: 'live_forecast' | 'historical_fallback';
  forecastDate: string;
}

export class PublicWeatherService {
  private static supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );

  static async getWeatherForSharedView(
    cityName: string,
    targetDate: Date,
    segmentDay: number
  ): Promise<PublicWeatherData | null> {
    try {
      console.log('🌍 PUBLIC-WEATHER: Requesting weather for shared view:', {
        cityName,
        targetDate: targetDate.toISOString(),
        segmentDay,
        isSharedViewRequest: true
      });

      const { data, error } = await this.supabase.functions.invoke('public-weather', {
        body: {
          cityName,
          targetDate: targetDate.toISOString(),
          segmentDay
        }
      });

      if (error) {
        console.error('❌ PUBLIC-WEATHER: Edge function error:', error);
        return this.createLocalFallback(cityName, targetDate, segmentDay);
      }

      if (data) {
        console.log('✅ PUBLIC-WEATHER: Received weather data:', {
          cityName: data.cityName,
          temperature: data.temperature,
          isActualForecast: data.isActualForecast,
          source: data.source,
          description: data.description
        });
        return data;
      }

      return this.createLocalFallback(cityName, targetDate, segmentDay);
    } catch (error) {
      console.error('❌ PUBLIC-WEATHER: Service error:', error);
      return this.createLocalFallback(cityName, targetDate, segmentDay);
    }
  }

  private static createLocalFallback(
    cityName: string,
    targetDate: Date,
    segmentDay: number
  ): PublicWeatherData {
    const month = targetDate.getMonth();
    
    // Seasonal base temperatures
    const seasonalTemps = [
      45, 48, 58, 68, 78, 88, 92, 90, 82, 70, 58, 48
    ];
    
    // Create city-specific variation
    const cityHash = cityName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const variation = (Math.abs(cityHash) % 20) - 10;
    const baseTemp = seasonalTemps[month] + variation;
    
    console.log('🔄 PUBLIC-WEATHER: Created local fallback for', cityName, {
      baseTemp,
      month,
      variation,
      isLocalFallback: true
    });
    
    return {
      temperature: baseTemp,
      highTemp: baseTemp + 8,
      lowTemp: baseTemp - 8,
      description: this.getSeasonalDescription(month),
      icon: this.getSeasonalIcon(month),
      humidity: 45 + (Math.abs(cityHash) % 30),
      windSpeed: 5 + (Math.abs(cityHash) % 10),
      precipitationChance: this.getSeasonalPrecipitation(month),
      cityName,
      isActualForecast: false,
      source: 'historical_fallback' as const,
      forecastDate: targetDate.toISOString()
    };
  }

  private static getSeasonalDescription(month: number): string {
    const descriptions = [
      'Partly Cloudy', 'Partly Cloudy', 'Mostly Sunny', 'Sunny', 'Sunny', 'Hot',
      'Hot', 'Hot', 'Warm', 'Pleasant', 'Cool', 'Partly Cloudy'
    ];
    return descriptions[month];
  }

  private static getSeasonalIcon(month: number): string {
    const icons = [
      '02d', '02d', '01d', '01d', '01d', '01d',
      '01d', '01d', '01d', '02d', '02d', '02d'
    ];
    return icons[month];
  }

  private static getSeasonalPrecipitation(month: number): number {
    const precipitation = [
      30, 25, 20, 15, 10, 5, 5, 5, 10, 15, 20, 25
    ];
    return precipitation[month];
  }
}
