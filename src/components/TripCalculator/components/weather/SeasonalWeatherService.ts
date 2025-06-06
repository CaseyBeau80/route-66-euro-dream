
interface SeasonalWeatherData {
  high: number;
  low: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitationChance?: number;
}

// Use MM-DD format keys for date-specific averages, e.g. "06-10": { avgHigh: 87, avgLow: 66 }
interface DateSpecificData {
  [key: string]: {
    avgHigh: number;
    avgLow: number;
    condition: string;
    humidity?: number;
    windSpeed?: number;
    precipitationChance?: number;
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

// Enhanced seasonal data with realistic regional variations for Route 66 cities
const regionalSeasonalData: RegionalSeasonalData = {
  // Illinois/Chicago area - Great Lakes climate, higher humidity
  'chicago': {
    winter: { high: 32, low: 18, condition: 'Cold and Snowy', humidity: 75, windSpeed: 12, precipitationChance: 25 },
    spring: { high: 60, low: 42, condition: 'Cool and Rainy', humidity: 65, windSpeed: 10, precipitationChance: 35 },
    summer: { high: 82, low: 64, condition: 'Warm and Humid', humidity: 70, windSpeed: 8, precipitationChance: 30 },
    fall: { high: 65, low: 45, condition: 'Cool and Crisp', humidity: 60, windSpeed: 9, precipitationChance: 20 },
    dateSpecific: {
      '06-15': { avgHigh: 84, avgLow: 66, condition: 'Warm and Humid', humidity: 72, windSpeed: 7, precipitationChance: 25 },
      '07-04': { avgHigh: 88, avgLow: 70, condition: 'Hot and Humid', humidity: 75, windSpeed: 6, precipitationChance: 35 },
      '09-15': { avgHigh: 74, avgLow: 56, condition: 'Pleasant and Cool', humidity: 58, windSpeed: 8, precipitationChance: 15 }
    }
  },
  
  // Illinois/Springfield area - Continental climate
  'springfield': {
    winter: { high: 38, low: 22, condition: 'Cold and Overcast', humidity: 70, windSpeed: 11, precipitationChance: 20 },
    spring: { high: 65, low: 45, condition: 'Mild and Pleasant', humidity: 62, windSpeed: 9, precipitationChance: 30 },
    summer: { high: 85, low: 66, condition: 'Warm and Humid', humidity: 68, windSpeed: 7, precipitationChance: 25 },
    fall: { high: 68, low: 47, condition: 'Cool and Clear', humidity: 58, windSpeed: 8, precipitationChance: 18 }
  },
  
  // Missouri/St. Louis area - Continental with southern influence
  'st. louis': {
    winter: { high: 45, low: 28, condition: 'Cold and Overcast', humidity: 70, windSpeed: 10, precipitationChance: 22 },
    spring: { high: 68, low: 48, condition: 'Mild and Pleasant', humidity: 65, windSpeed: 9, precipitationChance: 32 },
    summer: { high: 88, low: 68, condition: 'Hot and Humid', humidity: 75, windSpeed: 7, precipitationChance: 28 },
    fall: { high: 70, low: 50, condition: 'Pleasant and Clear', humidity: 55, windSpeed: 8, precipitationChance: 16 },
    dateSpecific: {
      '06-10': { avgHigh: 87, avgLow: 66, condition: 'Hot and Humid', humidity: 73, windSpeed: 6, precipitationChance: 25 },
      '08-15': { avgHigh: 91, avgLow: 72, condition: 'Very Hot and Humid', humidity: 78, windSpeed: 5, precipitationChance: 20 }
    }
  },
  
  // Missouri/Joplin area - Tornado Alley, windier
  'joplin': {
    winter: { high: 48, low: 26, condition: 'Cool and Windy', humidity: 65, windSpeed: 12, precipitationChance: 18 },
    spring: { high: 70, low: 50, condition: 'Warm and Pleasant', humidity: 62, windSpeed: 11, precipitationChance: 35 },
    summer: { high: 90, low: 70, condition: 'Hot and Humid', humidity: 70, windSpeed: 8, precipitationChance: 22 },
    fall: { high: 72, low: 52, condition: 'Pleasant and Clear', humidity: 52, windSpeed: 9, precipitationChance: 14 }
  },
  
  // Oklahoma/Tulsa area - Southern plains, hot summers, windy
  'tulsa': {
    winter: { high: 50, low: 28, condition: 'Cool and Windy', humidity: 60, windSpeed: 14, precipitationChance: 15 },
    spring: { high: 72, low: 52, condition: 'Warm and Stormy', humidity: 65, windSpeed: 13, precipitationChance: 40 },
    summer: { high: 94, low: 74, condition: 'Hot and Dry', humidity: 55, windSpeed: 11, precipitationChance: 12 },
    fall: { high: 76, low: 56, condition: 'Warm and Clear', humidity: 50, windSpeed: 10, precipitationChance: 10 },
    dateSpecific: {
      '07-15': { avgHigh: 96, avgLow: 76, condition: 'Very Hot and Dry', humidity: 50, windSpeed: 12, precipitationChance: 8 },
      '10-01': { avgHigh: 78, avgLow: 58, condition: 'Pleasant and Clear', humidity: 48, windSpeed: 9, precipitationChance: 5 }
    }
  },
  
  // Oklahoma/Oklahoma City area - Southern plains
  'oklahoma city': {
    winter: { high: 52, low: 30, condition: 'Cool and Windy', humidity: 60, windSpeed: 15, precipitationChance: 12 },
    spring: { high: 72, low: 52, condition: 'Warm and Stormy', humidity: 65, windSpeed: 14, precipitationChance: 38 },
    summer: { high: 92, low: 72, condition: 'Hot and Dry', humidity: 55, windSpeed: 12, precipitationChance: 15 },
    fall: { high: 75, low: 55, condition: 'Warm and Clear', humidity: 50, windSpeed: 10, precipitationChance: 8 }
  },
  
  // Texas/Amarillo area - High plains, very windy
  'amarillo': {
    winter: { high: 50, low: 25, condition: 'Cool and Windy', humidity: 50, windSpeed: 18, precipitationChance: 8 },
    spring: { high: 70, low: 45, condition: 'Mild and Windy', humidity: 55, windSpeed: 16, precipitationChance: 20 },
    summer: { high: 88, low: 65, condition: 'Hot and Windy', humidity: 45, windSpeed: 14, precipitationChance: 18 },
    fall: { high: 72, low: 48, condition: 'Pleasant and Windy', humidity: 45, windSpeed: 15, precipitationChance: 5 }
  },
  
  // New Mexico/Santa Fe area - High desert, low humidity
  'santa fe': {
    winter: { high: 45, low: 22, condition: 'Cool and Dry', humidity: 40, windSpeed: 9, precipitationChance: 12 },
    spring: { high: 65, low: 40, condition: 'Mild and Dry', humidity: 35, windSpeed: 11, precipitationChance: 15 },
    summer: { high: 82, low: 58, condition: 'Warm and Dry', humidity: 40, windSpeed: 8, precipitationChance: 25 },
    fall: { high: 68, low: 42, condition: 'Pleasant and Dry', humidity: 35, windSpeed: 9, precipitationChance: 8 }
  },
  
  // New Mexico/Albuquerque area - Desert climate
  'albuquerque': {
    winter: { high: 48, low: 26, condition: 'Cool and Dry', humidity: 35, windSpeed: 8, precipitationChance: 8 },
    spring: { high: 68, low: 45, condition: 'Mild and Dry', humidity: 30, windSpeed: 10, precipitationChance: 12 },
    summer: { high: 88, low: 65, condition: 'Hot and Dry', humidity: 35, windSpeed: 9, precipitationChance: 22 },
    fall: { high: 70, low: 48, condition: 'Pleasant and Dry', humidity: 30, windSpeed: 8, precipitationChance: 5 }
  },
  
  // Arizona/Winslow area - High desert
  'winslow': {
    winter: { high: 52, low: 25, condition: 'Cool and Dry', humidity: 40, windSpeed: 8, precipitationChance: 10 },
    spring: { high: 70, low: 42, condition: 'Mild and Dry', humidity: 35, windSpeed: 10, precipitationChance: 8 },
    summer: { high: 90, low: 62, condition: 'Hot and Dry', humidity: 30, windSpeed: 7, precipitationChance: 15 },
    fall: { high: 72, low: 45, condition: 'Pleasant and Dry', humidity: 35, windSpeed: 8, precipitationChance: 3 }
  },
  
  // Arizona/Flagstaff area - Mountain climate
  'flagstaff': {
    winter: { high: 45, low: 20, condition: 'Cool and Snowy', humidity: 45, windSpeed: 10, precipitationChance: 20 },
    spring: { high: 62, low: 35, condition: 'Mild and Dry', humidity: 35, windSpeed: 12, precipitationChance: 12 },
    summer: { high: 82, low: 52, condition: 'Warm and Dry', humidity: 40, windSpeed: 8, precipitationChance: 18 },
    fall: { high: 65, low: 38, condition: 'Cool and Clear', humidity: 35, windSpeed: 9, precipitationChance: 5 }
  },
  
  // California/Barstow area - Mojave Desert
  'barstow': {
    winter: { high: 62, low: 38, condition: 'Mild and Dry', humidity: 35, windSpeed: 8, precipitationChance: 5 },
    spring: { high: 78, low: 52, condition: 'Warm and Dry', humidity: 30, windSpeed: 9, precipitationChance: 3 },
    summer: { high: 102, low: 72, condition: 'Very Hot and Dry', humidity: 25, windSpeed: 7, precipitationChance: 1 },
    fall: { high: 82, low: 55, condition: 'Warm and Clear', humidity: 30, windSpeed: 8, precipitationChance: 2 }
  },
  
  // California/Los Angeles area - Mediterranean climate
  'los angeles': {
    winter: { high: 68, low: 48, condition: 'Mild and Clear', humidity: 65, windSpeed: 7, precipitationChance: 15 },
    spring: { high: 72, low: 55, condition: 'Pleasant and Clear', humidity: 70, windSpeed: 8, precipitationChance: 8 },
    summer: { high: 78, low: 62, condition: 'Warm and Sunny', humidity: 75, windSpeed: 6, precipitationChance: 2 },
    fall: { high: 75, low: 58, condition: 'Pleasant and Clear', humidity: 65, windSpeed: 7, precipitationChance: 5 }
  },
  
  // California/Santa Monica area - Coastal Mediterranean
  'santa monica': {
    winter: { high: 66, low: 50, condition: 'Mild and Marine Layer', humidity: 70, windSpeed: 8, precipitationChance: 18 },
    spring: { high: 70, low: 56, condition: 'Pleasant and Clear', humidity: 72, windSpeed: 9, precipitationChance: 10 },
    summer: { high: 75, low: 63, condition: 'Warm and Breezy', humidity: 78, windSpeed: 8, precipitationChance: 1 },
    fall: { high: 73, low: 59, condition: 'Pleasant and Clear', humidity: 68, windSpeed: 7, precipitationChance: 3 }
  }
};

// Default Route 66 regional data with realistic variations
const defaultSeasonalData = {
  winter: { high: 45, low: 25, condition: 'Cool and Clear', humidity: 55, windSpeed: 10, precipitationChance: 15 },
  spring: { high: 68, low: 45, condition: 'Mild and Pleasant', humidity: 60, windSpeed: 9, precipitationChance: 25 },
  summer: { high: 85, low: 65, condition: 'Hot and Sunny', humidity: 50, windSpeed: 8, precipitationChance: 18 },
  fall: { high: 70, low: 48, condition: 'Cool and Clear', humidity: 45, windSpeed: 8, precipitationChance: 12 }
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
    console.log(`🌤️ Using regional seasonal data for ${cityName} (${season}):`, regionalSeasonalData[cityKey][season]);
    return regionalSeasonalData[cityKey][season];
  }
  
  // Check for partial matches
  for (const [region, data] of Object.entries(regionalSeasonalData)) {
    if (cityKey.includes(region) || region.includes(cityKey)) {
      console.log(`🌤️ Using partial match regional data for ${cityName} -> ${region} (${season}):`, data[season]);
      return data[season];
    }
  }
  
  // Return default data if no regional match found
  console.log(`🌤️ Using default seasonal data for ${cityName} (${season}):`, defaultSeasonalData[season]);
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
      const historicalData = {
        high: dateSpecific.avgHigh,
        low: dateSpecific.avgLow,
        condition: dateSpecific.condition,
        humidity: dateSpecific.humidity || 50,
        windSpeed: dateSpecific.windSpeed || 8,
        precipitationChance: dateSpecific.precipitationChance || 15,
        isHistorical: true
      };
      console.log(`📊 Using date-specific historical data for ${cityName} on ${dateKey}:`, historicalData);
      return historicalData;
    }
  }
  
  // Fallback to seasonal data
  const seasonalData = getSeasonalWeatherData(cityName, month);
  const historicalData = {
    ...seasonalData,
    isHistorical: true
  };
  console.log(`📊 Using seasonal historical data for ${cityName} on ${dateKey}:`, historicalData);
  return historicalData;
};
