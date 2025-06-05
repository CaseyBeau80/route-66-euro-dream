
interface SeasonalWeatherData {
  high: number;
  low: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export const getSeasonalWeatherData = (cityName: string, month: number): SeasonalWeatherData => {
  // Seasonal averages for Route 66 regions
  const seasonalData = {
    // Winter (Dec, Jan, Feb)
    winter: { high: 45, low: 25, condition: 'Cool and Clear' },
    // Spring (Mar, Apr, May)
    spring: { high: 68, low: 45, condition: 'Mild and Pleasant' },
    // Summer (Jun, Jul, Aug)
    summer: { high: 85, low: 65, condition: 'Hot and Sunny' },
    // Fall (Sep, Oct, Nov)
    fall: { high: 70, low: 48, condition: 'Cool and Clear' }
  };
  
  let season: keyof typeof seasonalData;
  if (month >= 12 || month <= 2) season = 'winter';
  else if (month >= 3 && month <= 5) season = 'spring';
  else if (month >= 6 && month <= 8) season = 'summer';
  else season = 'fall';
  
  return {
    ...seasonalData[season],
    humidity: 45,
    windSpeed: 8
  };
};
