
interface SeasonalWeatherData {
  high: number;
  low: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

interface RegionalSeasonalData {
  [key: string]: {
    winter: SeasonalWeatherData;
    spring: SeasonalWeatherData;
    summer: SeasonalWeatherData;
    fall: SeasonalWeatherData;
  };
}

// Enhanced seasonal data with regional variations
const regionalSeasonalData: RegionalSeasonalData = {
  // Illinois/Chicago area
  'chicago': {
    winter: { high: 32, low: 18, condition: 'Cold and Snowy', humidity: 75, windSpeed: 12 },
    spring: { high: 60, low: 42, condition: 'Cool and Rainy', humidity: 65, windSpeed: 10 },
    summer: { high: 82, low: 64, condition: 'Warm and Humid', humidity: 70, windSpeed: 8 },
    fall: { high: 65, low: 45, condition: 'Cool and Crisp', humidity: 60, windSpeed: 9 }
  },
  
  // Missouri/St. Louis area
  'st. louis': {
    winter: { high: 45, low: 28, condition: 'Cold and Overcast', humidity: 70, windSpeed: 10 },
    spring: { high: 68, low: 48, condition: 'Mild and Pleasant', humidity: 65, windSpeed: 9 },
    summer: { high: 88, low: 68, condition: 'Hot and Humid', humidity: 75, windSpeed: 7 },
    fall: { high: 70, low: 50, condition: 'Pleasant and Clear', humidity: 55, windSpeed: 8 }
  },
  
  // Oklahoma area
  'oklahoma': {
    winter: { high: 52, low: 30, condition: 'Cool and Windy', humidity: 60, windSpeed: 15 },
    spring: { high: 72, low: 52, condition: 'Warm and Stormy', humidity: 65, windSpeed: 14 },
    summer: { high: 92, low: 72, condition: 'Hot and Dry', humidity: 55, windSpeed: 12 },
    fall: { high: 75, low: 55, condition: 'Warm and Clear', humidity: 50, windSpeed: 10 }
  },
  
  // Texas/Amarillo area
  'amarillo': {
    winter: { high: 50, low: 25, condition: 'Cool and Windy', humidity: 50, windSpeed: 18 },
    spring: { high: 70, low: 45, condition: 'Mild and Windy', humidity: 55, windSpeed: 16 },
    summer: { high: 88, low: 65, condition: 'Hot and Windy', humidity: 45, windSpeed: 14 },
    fall: { high: 72, low: 48, condition: 'Pleasant and Windy', humidity: 45, windSpeed: 15 }
  },
  
  // New Mexico area
  'albuquerque': {
    winter: { high: 48, low: 26, condition: 'Cool and Dry', humidity: 35, windSpeed: 8 },
    spring: { high: 68, low: 45, condition: 'Mild and Dry', humidity: 30, windSpeed: 10 },
    summer: { high: 88, low: 65, condition: 'Hot and Dry', humidity: 35, windSpeed: 9 },
    fall: { high: 70, low: 48, condition: 'Pleasant and Dry', humidity: 30, windSpeed: 8 }
  },
  
  // Arizona area
  'flagstaff': {
    winter: { high: 45, low: 20, condition: 'Cool and Snowy', humidity: 45, windSpeed: 10 },
    spring: { high: 62, low: 35, condition: 'Mild and Dry', humidity: 35, windSpeed: 12 },
    summer: { high: 82, low: 52, condition: 'Warm and Dry', humidity: 40, windSpeed: 8 },
    fall: { high: 65, low: 38, condition: 'Cool and Clear', humidity: 35, windSpeed: 9 }
  },
  
  // California area
  'los angeles': {
    winter: { high: 68, low: 48, condition: 'Mild and Clear', humidity: 65, windSpeed: 7 },
    spring: { high: 72, low: 55, condition: 'Pleasant and Clear', humidity: 70, windSpeed: 8 },
    summer: { high: 78, low: 62, condition: 'Warm and Sunny', humidity: 75, windSpeed: 6 },
    fall: { high: 75, low: 58, condition: 'Pleasant and Clear', humidity: 65, windSpeed: 7 }
  }
};

// Default Route 66 regional data
const defaultSeasonalData = {
  winter: { high: 45, low: 25, condition: 'Cool and Clear', humidity: 55, windSpeed: 10 },
  spring: { high: 68, low: 45, condition: 'Mild and Pleasant', humidity: 60, windSpeed: 9 },
  summer: { high: 85, low: 65, condition: 'Hot and Sunny', humidity: 50, windSpeed: 8 },
  fall: { high: 70, low: 48, condition: 'Cool and Clear', humidity: 45, windSpeed: 8 }
};

export const getSeasonalWeatherData = (cityName: string, month: number): SeasonalWeatherData => {
  // Determine season based on month
  let season: keyof typeof defaultSeasonalData;
  if (month >= 12 || month <= 2) season = 'winter';
  else if (month >= 3 && month <= 5) season = 'spring';
  else if (month >= 6 && month <= 8) season = 'summer';
  else season = 'fall';
  
  // Try to find regional data based on city name
  const cityKey = cityName.toLowerCase();
  
  // Check for exact matches first
  if (regionalSeasonalData[cityKey]) {
    return regionalSeasonalData[cityKey][season];
  }
  
  // Check for partial matches
  for (const [region, data] of Object.entries(regionalSeasonalData)) {
    if (cityKey.includes(region) || region.includes(cityKey)) {
      return data[season];
    }
  }
  
  // Return default data if no regional match found
  return defaultSeasonalData[season];
};
