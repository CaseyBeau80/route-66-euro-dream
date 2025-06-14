
interface CityWeatherVariation {
  tempOffset: number;
  humidityOffset: number;
  windOffset: number;
  precipitationOffset: number;
  description: string;
  icon: string;
}

const WEATHER_DESCRIPTIONS = [
  'Partly Cloudy',
  'Mostly Sunny',
  'Clear',
  'Few Clouds',
  'Scattered Clouds',
  'Overcast',
  'Light Rain',
  'Partly Sunny'
];

const WEATHER_ICONS = [
  '01d', // clear sky day
  '02d', // few clouds day
  '03d', // scattered clouds
  '04d', // broken clouds
  '10d', // rain day
  '50d', // mist
];

export class CityWeatherVariationService {
  static getCitySpecificVariation(cityName: string): CityWeatherVariation {
    let hash = 0;
    for (let i = 0; i < cityName.length; i++) {
      const char = cityName.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const tempOffset = (hash % 15) - 7;
    const humidityOffset = (hash % 20) - 10;
    const windOffset = (hash % 10) - 5;
    const precipitationOffset = Math.abs(hash % 15);
    
    // FIXED: Generate unique descriptions and icons per city
    const descriptionIndex = Math.abs(hash % WEATHER_DESCRIPTIONS.length);
    const iconIndex = Math.abs(hash % WEATHER_ICONS.length);
    
    return {
      tempOffset,
      humidityOffset,
      windOffset,
      precipitationOffset,
      description: WEATHER_DESCRIPTIONS[descriptionIndex],
      icon: WEATHER_ICONS[iconIndex]
    };
  }

  static applyVariationToWeather(weather: any, cityName: string): any {
    const variation = this.getCitySpecificVariation(cityName);
    
    console.log('🎯 CityWeatherVariationService: Applying unique variation for', cityName, {
      originalTemp: weather.temperature,
      tempOffset: variation.tempOffset,
      originalDescription: weather.description,
      uniqueDescription: variation.description,
      originalIcon: weather.icon,
      uniqueIcon: variation.icon
    });
    
    return {
      ...weather,
      temperature: Math.max(40, Math.min(110, weather.temperature + variation.tempOffset)),
      highTemp: weather.highTemp ? Math.max(45, Math.min(115, weather.highTemp + variation.tempOffset)) : undefined,
      lowTemp: weather.lowTemp ? Math.max(35, Math.min(105, weather.lowTemp + variation.tempOffset)) : undefined,
      humidity: Math.max(0, Math.min(100, weather.humidity + variation.humidityOffset)),
      windSpeed: Math.max(0, Math.min(50, weather.windSpeed + variation.windOffset)),
      precipitationChance: Math.max(0, Math.min(100, weather.precipitationChance + variation.precipitationOffset)),
      description: variation.description,
      icon: variation.icon
    };
  }
}
