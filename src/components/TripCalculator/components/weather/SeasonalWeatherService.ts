
interface HistoricalWeatherData {
  low: number;
  high: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitationChance: number;
}

const SEASONAL_WEATHER_DATA: Record<string, Record<string, HistoricalWeatherData>> = {
  // Spring (March-May)
  spring: {
    'Chicago': { low: 42, high: 65, condition: 'Partly cloudy', humidity: 65, windSpeed: 12, precipitationChance: 40 },
    'Springfield': { low: 45, high: 68, condition: 'Partly cloudy', humidity: 63, windSpeed: 11, precipitationChance: 35 },
    'St. Louis': { low: 48, high: 72, condition: 'Partly cloudy', humidity: 62, windSpeed: 10, precipitationChance: 35 },
    'Joplin': { low: 52, high: 74, condition: 'Partly cloudy', humidity: 60, windSpeed: 12, precipitationChance: 30 },
    'Oklahoma City': { low: 55, high: 76, condition: 'Partly cloudy', humidity: 58, windSpeed: 14, precipitationChance: 25 },
    'Amarillo': { low: 46, high: 70, condition: 'Windy', humidity: 45, windSpeed: 18, precipitationChance: 20 },
    'Albuquerque': { low: 44, high: 70, condition: 'Sunny', humidity: 35, windSpeed: 10, precipitationChance: 15 },
    'Flagstaff': { low: 32, high: 58, condition: 'Cool and clear', humidity: 40, windSpeed: 8, precipitationChance: 25 },
    'Kingman': { low: 48, high: 72, condition: 'Sunny', humidity: 30, windSpeed: 8, precipitationChance: 10 },
    'Barstow': { low: 55, high: 78, condition: 'Sunny', humidity: 25, windSpeed: 12, precipitationChance: 5 },
    'Los Angeles': { low: 58, high: 75, condition: 'Partly cloudy', humidity: 65, windSpeed: 8, precipitationChance: 20 },
    'Santa Monica': { low: 60, high: 72, condition: 'Marine layer', humidity: 70, windSpeed: 10, precipitationChance: 25 }
  },
  
  // Summer (June-August)
  summer: {
    'Chicago': { low: 65, high: 84, condition: 'Partly cloudy', humidity: 70, windSpeed: 10, precipitationChance: 30 },
    'Springfield': { low: 68, high: 86, condition: 'Humid', humidity: 72, windSpeed: 8, precipitationChance: 35 },
    'St. Louis': { low: 72, high: 89, condition: 'Hot and humid', humidity: 75, windSpeed: 7, precipitationChance: 40 },
    'Joplin': { low: 72, high: 90, condition: 'Hot and humid', humidity: 73, windSpeed: 9, precipitationChance: 35 },
    'Oklahoma City': { low: 74, high: 94, condition: 'Hot', humidity: 65, windSpeed: 12, precipitationChance: 20 },
    'Amarillo': { low: 68, high: 90, condition: 'Hot and windy', humidity: 55, windSpeed: 16, precipitationChance: 25 },
    'Albuquerque': { low: 65, high: 90, condition: 'Hot and dry', humidity: 30, windSpeed: 8, precipitationChance: 15 },
    'Flagstaff': { low: 50, high: 82, condition: 'Pleasant', humidity: 45, windSpeed: 6, precipitationChance: 30 },
    'Kingman': { low: 72, high: 100, condition: 'Very hot', humidity: 20, windSpeed: 6, precipitationChance: 5 },
    'Barstow': { low: 78, high: 105, condition: 'Very hot', humidity: 15, windSpeed: 8, precipitationChance: 2 },
    'Los Angeles': { low: 68, high: 82, condition: 'Sunny', humidity: 65, windSpeed: 7, precipitationChance: 5 },
    'Santa Monica': { low: 65, high: 78, condition: 'Marine layer', humidity: 75, windSpeed: 8, precipitationChance: 10 }
  },
  
  // Fall (September-November)
  fall: {
    'Chicago': { low: 48, high: 70, condition: 'Crisp', humidity: 65, windSpeed: 11, precipitationChance: 35 },
    'Springfield': { low: 50, high: 73, condition: 'Pleasant', humidity: 63, windSpeed: 10, precipitationChance: 30 },
    'St. Louis': { low: 54, high: 76, condition: 'Pleasant', humidity: 62, windSpeed: 9, precipitationChance: 30 },
    'Joplin': { low: 56, high: 78, condition: 'Pleasant', humidity: 60, windSpeed: 10, precipitationChance: 25 },
    'Oklahoma City': { low: 58, high: 80, condition: 'Pleasant', humidity: 58, windSpeed: 12, precipitationChance: 20 },
    'Amarillo': { low: 50, high: 74, condition: 'Windy', humidity: 50, windSpeed: 16, precipitationChance: 15 },
    'Albuquerque': { low: 48, high: 74, condition: 'Clear', humidity: 40, windSpeed: 8, precipitationChance: 10 },
    'Flagstaff': { low: 35, high: 65, condition: 'Cool and clear', humidity: 45, windSpeed: 7, precipitationChance: 20 },
    'Kingman': { low: 52, high: 78, condition: 'Pleasant', humidity: 35, windSpeed: 6, precipitationChance: 10 },
    'Barstow': { low: 58, high: 82, condition: 'Sunny', humidity: 30, windSpeed: 10, precipitationChance: 5 },
    'Los Angeles': { low: 62, high: 78, condition: 'Sunny', humidity: 60, windSpeed: 6, precipitationChance: 10 },
    'Santa Monica': { low: 62, high: 75, condition: 'Pleasant', humidity: 65, windSpeed: 8, precipitationChance: 15 }
  },
  
  // Winter (December-February)
  winter: {
    'Chicago': { low: 22, high: 35, condition: 'Cold', humidity: 70, windSpeed: 14, precipitationChance: 45 },
    'Springfield': { low: 26, high: 40, condition: 'Cold', humidity: 68, windSpeed: 12, precipitationChance: 40 },
    'St. Louis': { low: 30, high: 45, condition: 'Cool', humidity: 65, windSpeed: 10, precipitationChance: 35 },
    'Joplin': { low: 32, high: 50, condition: 'Cool', humidity: 62, windSpeed: 11, precipitationChance: 30 },
    'Oklahoma City': { low: 35, high: 55, condition: 'Cool', humidity: 60, windSpeed: 13, precipitationChance: 25 },
    'Amarillo': { low: 28, high: 52, condition: 'Cool and windy', humidity: 55, windSpeed: 18, precipitationChance: 20 },
    'Albuquerque': { low: 28, high: 50, condition: 'Cool and dry', humidity: 45, windSpeed: 6, precipitationChance: 15 },
    'Flagstaff': { low: 18, high: 45, condition: 'Cold', humidity: 50, windSpeed: 8, precipitationChance: 35 },
    'Kingman': { low: 35, high: 58, condition: 'Cool', humidity: 45, windSpeed: 6, precipitationChance: 15 },
    'Barstow': { low: 42, high: 65, condition: 'Mild', humidity: 40, windSpeed: 8, precipitationChance: 10 },
    'Los Angeles': { low: 50, high: 68, condition: 'Mild', humidity: 65, windSpeed: 6, precipitationChance: 20 },
    'Santa Monica': { low: 52, high: 65, condition: 'Mild', humidity: 70, windSpeed: 8, precipitationChance: 25 }
  }
};

function getSeason(date: Date): string {
  const month = date.getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

function findClosestCity(cityName: string): string {
  // Simple city name matching
  const normalizedCity = cityName.toLowerCase();
  
  // Direct matches
  for (const season of Object.values(SEASONAL_WEATHER_DATA)) {
    for (const city of Object.keys(season)) {
      if (city.toLowerCase() === normalizedCity) {
        return city;
      }
    }
  }
  
  // Partial matches for common Route 66 cities
  if (normalizedCity.includes('chicago')) return 'Chicago';
  if (normalizedCity.includes('springfield')) return 'Springfield';
  if (normalizedCity.includes('louis')) return 'St. Louis';
  if (normalizedCity.includes('joplin')) return 'Joplin';
  if (normalizedCity.includes('oklahoma')) return 'Oklahoma City';
  if (normalizedCity.includes('amarillo')) return 'Amarillo';
  if (normalizedCity.includes('albuquerque')) return 'Albuquerque';
  if (normalizedCity.includes('flagstaff')) return 'Flagstaff';
  if (normalizedCity.includes('kingman')) return 'Kingman';
  if (normalizedCity.includes('barstow')) return 'Barstow';
  if (normalizedCity.includes('angeles')) return 'Los Angeles';
  if (normalizedCity.includes('santa monica')) return 'Santa Monica';
  
  // Default fallback based on typical Route 66 progression
  return 'Oklahoma City'; // Central location with moderate weather
}

export function getHistoricalWeatherData(cityName: string, date: Date): HistoricalWeatherData {
  const season = getSeason(date);
  const closestCity = findClosestCity(cityName);
  
  console.log(`🌤️ Getting historical weather for ${cityName} (mapped to ${closestCity}) in ${season} on ${date.toDateString()}`);
  
  const weatherData = SEASONAL_WEATHER_DATA[season][closestCity] || SEASONAL_WEATHER_DATA[season]['Oklahoma City'];
  
  console.log(`✅ Historical weather data:`, weatherData);
  
  return weatherData;
}

export function getSeasonalWeatherData(cityName: string, month: number): HistoricalWeatherData {
  // Create a date object to determine the season
  const date = new Date(2024, month - 1, 15); // Use 15th of the month as representative date
  const season = getSeason(date);
  const closestCity = findClosestCity(cityName);
  
  console.log(`🌤️ Getting seasonal weather for ${cityName} (mapped to ${closestCity}) in ${season} for month ${month}`);
  
  const weatherData = SEASONAL_WEATHER_DATA[season][closestCity] || SEASONAL_WEATHER_DATA[season]['Oklahoma City'];
  
  console.log(`✅ Seasonal weather data:`, weatherData);
  
  return weatherData;
}
