
interface SeasonalWeatherData {
  high: number;
  low: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

// Use MM-DD format keys for date-specific averages, e.g. "06-10": { avgHigh: 87, avgLow: 66 }
interface DateSpecificData {
  [key: string]: {
    avgHigh: number;
    avgLow: number;
    condition: string;
  };
}

interface RegionalSeasonalData {
  [key: string]: {
    winter: SeasonalWeatherData;
    spring: SeasonalWeatherData;
    summer: SeasonalWeatherData;
    fall: SeasonalWeatherData;
    dateSpecific?: DateSpecificData;
  };
}

// Enhanced seasonal data with regional variations and more Route 66 cities
const regionalSeasonalData: RegionalSeasonalData = {
  // Illinois/Chicago area
  'chicago': {
    winter: { high: 32, low: 18, condition: 'Cold and Snowy', humidity: 75, windSpeed: 12 },
    spring: { high: 60, low: 42, condition: 'Cool and Rainy', humidity: 65, windSpeed: 10 },
    summer: { high: 82, low: 64, condition: 'Warm and Humid', humidity: 70, windSpeed: 8 },
    fall: { high: 65, low: 45, condition: 'Cool and Crisp', humidity: 60, windSpeed: 9 },
    dateSpecific: {
      '06-15': { avgHigh: 84, avgLow: 66, condition: 'Warm and Humid' },
      '07-04': { avgHigh: 88, avgLow: 70, condition: 'Hot and Humid' },
      '09-15': { avgHigh: 74, avgLow: 56, condition: 'Pleasant and Cool' }
    }
  },
  
  // Illinois/Springfield area
  'springfield': {
    winter: { high: 38, low: 22, condition: 'Cold and Overcast', humidity: 70, windSpeed: 11 },
    spring: { high: 65, low: 45, condition: 'Mild and Pleasant', humidity: 62, windSpeed: 9 },
    summer: { high: 85, low: 66, condition: 'Warm and Humid', humidity: 68, windSpeed: 7 },
    fall: { high: 68, low: 47, condition: 'Cool and Clear', humidity: 58, windSpeed: 8 }
  },
  
  // Missouri/St. Louis area
  'st. louis': {
    winter: { high: 45, low: 28, condition: 'Cold and Overcast', humidity: 70, windSpeed: 10 },
    spring: { high: 68, low: 48, condition: 'Mild and Pleasant', humidity: 65, windSpeed: 9 },
    summer: { high: 88, low: 68, condition: 'Hot and Humid', humidity: 75, windSpeed: 7 },
    fall: { high: 70, low: 50, condition: 'Pleasant and Clear', humidity: 55, windSpeed: 8 },
    dateSpecific: {
      '06-10': { avgHigh: 87, avgLow: 66, condition: 'Hot and Humid' },
      '08-15': { avgHigh: 91, avgLow: 72, condition: 'Very Hot and Humid' }
    }
  },
  
  // Missouri/Joplin area
  'joplin': {
    winter: { high: 48, low: 26, condition: 'Cool and Windy', humidity: 65, windSpeed: 12 },
    spring: { high: 70, low: 50, condition: 'Warm and Pleasant', humidity: 62, windSpeed: 11 },
    summer: { high: 90, low: 70, condition: 'Hot and Humid', humidity: 70, windSpeed: 8 },
    fall: { high: 72, low: 52, condition: 'Pleasant and Clear', humidity: 52, windSpeed: 9 }
  },
  
  // Oklahoma/Tulsa area
  'tulsa': {
    winter: { high: 50, low: 28, condition: 'Cool and Windy', humidity: 60, windSpeed: 14 },
    spring: { high: 72, low: 52, condition: 'Warm and Stormy', humidity: 65, windSpeed: 13 },
    summer: { high: 94, low: 74, condition: 'Hot and Dry', humidity: 55, windSpeed: 11 },
    fall: { high: 76, low: 56, condition: 'Warm and Clear', humidity: 50, windSpeed: 10 },
    dateSpecific: {
      '07-15': { avgHigh: 96, avgLow: 76, condition: 'Very Hot and Dry' },
      '10-01': { avgHigh: 78, avgLow: 58, condition: 'Pleasant and Clear' }
    }
  },
  
  // Oklahoma/Oklahoma City area
  'oklahoma city': {
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
  
  // New Mexico/Santa Fe area
  'santa fe': {
    winter: { high: 45, low: 22, condition: 'Cool and Dry', humidity: 40, windSpeed: 9 },
    spring: { high: 65, low: 40, condition: 'Mild and Dry', humidity: 35, windSpeed: 11 },
    summer: { high: 82, low: 58, condition: 'Warm and Dry', humidity: 40, windSpeed: 8 },
    fall: { high: 68, low: 42, condition: 'Pleasant and Dry', humidity: 35, windSpeed: 9 }
  },
  
  // New Mexico/Albuquerque area
  'albuquerque': {
    winter: { high: 48, low: 26, condition: 'Cool and Dry', humidity: 35, windSpeed: 8 },
    spring: { high: 68, low: 45, condition: 'Mild and Dry', humidity: 30, windSpeed: 10 },
    summer: { high: 88, low: 65, condition: 'Hot and Dry', humidity: 35, windSpeed: 9 },
    fall: { high: 70, low: 48, condition: 'Pleasant and Dry', humidity: 30, windSpeed: 8 }
  },
  
  // Arizona/Winslow area
  'winslow': {
    winter: { high: 52, low: 25, condition: 'Cool and Dry', humidity: 40, windSpeed: 8 },
    spring: { high: 70, low: 42, condition: 'Mild and Dry', humidity: 35, windSpeed: 10 },
    summer: { high: 90, low: 62, condition: 'Hot and Dry', humidity: 30, windSpeed: 7 },
    fall: { high: 72, low: 45, condition: 'Pleasant and Dry', humidity: 35, windSpeed: 8 }
  },
  
  // Arizona/Flagstaff area
  'flagstaff': {
    winter: { high: 45, low: 20, condition: 'Cool and Snowy', humidity: 45, windSpeed: 10 },
    spring: { high: 62, low: 35, condition: 'Mild and Dry', humidity: 35, windSpeed: 12 },
    summer: { high: 82, low: 52, condition: 'Warm and Dry', humidity: 40, windSpeed: 8 },
    fall: { high: 65, low: 38, condition: 'Cool and Clear', humidity: 35, windSpeed: 9 }
  },
  
  // California/Barstow area
  'barstow': {
    winter: { high: 62, low: 38, condition: 'Mild and Dry', humidity: 35, windSpeed: 8 },
    spring: { high: 78, low: 52, condition: 'Warm and Dry', humidity: 30, windSpeed: 9 },
    summer: { high: 102, low: 72, condition: 'Very Hot and Dry', humidity: 25, windSpeed: 7 },
    fall: { high: 82, low: 55, condition: 'Warm and Clear', humidity: 30, windSpeed: 8 }
  },
  
  // California/Los Angeles area
  'los angeles': {
    winter: { high: 68, low: 48, condition: 'Mild and Clear', humidity: 65, windSpeed: 7 },
    spring: { high: 72, low: 55, condition: 'Pleasant and Clear', humidity: 70, windSpeed: 8 },
    summer: { high: 78, low: 62, condition: 'Warm and Sunny', humidity: 75, windSpeed: 6 },
    fall: { high: 75, low: 58, condition: 'Pleasant and Clear', humidity: 65, windSpeed: 7 }
  },
  
  // California/Santa Monica area
  'santa monica': {
    winter: { high: 66, low: 50, condition: 'Mild and Marine Layer', humidity: 70, windSpeed: 8 },
    spring: { high: 70, low: 56, condition: 'Pleasant and Clear', humidity: 72, windSpeed: 9 },
    summer: { high: 75, low: 63, condition: 'Warm and Breezy', humidity: 78, windSpeed: 8 },
    fall: { high: 73, low: 59, condition: 'Pleasant and Clear', humidity: 68, windSpeed: 7 }
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

export const getHistoricalWeatherData = (cityName: string, targetDate: Date): SeasonalWeatherData & { isHistorical: boolean } => {
  const month = targetDate.getMonth() + 1; // Convert to 1-12
  const day = targetDate.getDate();
  const dateKey = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
  const cityKey = cityName.toLowerCase();
  
  // Check for date-specific data first
  for (const [region, data] of Object.entries(regionalSeasonalData)) {
    if ((cityKey.includes(region) || region.includes(cityKey)) && data.dateSpecific?.[dateKey]) {
      const dateSpecific = data.dateSpecific[dateKey];
      return {
        high: dateSpecific.avgHigh,
        low: dateSpecific.avgLow,
        condition: dateSpecific.condition,
        humidity: 50, // Default for historical
        windSpeed: 8, // Default for historical
        isHistorical: true
      };
    }
  }
  
  // Fallback to seasonal data
  const seasonalData = getSeasonalWeatherData(cityName, month);
  return {
    ...seasonalData,
    isHistorical: true
  };
};
