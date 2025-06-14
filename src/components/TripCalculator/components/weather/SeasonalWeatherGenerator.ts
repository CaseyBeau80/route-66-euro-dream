
export class SeasonalWeatherGenerator {
  static getSeasonalTemperature(month: number): number {
    // Month is 0-indexed (0 = January, 11 = December)
    const seasonalTemperatures = [
      45, // January
      50, // February  
      60, // March
      70, // April
      78, // May
      85, // June
      90, // July
      88, // August
      80, // September
      70, // October
      58, // November
      48  // December
    ];
    
    return seasonalTemperatures[month] || 70;
  }

  static getSeasonalDescription(month: number): string {
    const seasonalDescriptions = [
      'Cool winter conditions', // January
      'Cool winter weather', // February
      'Mild spring weather', // March
      'Pleasant spring conditions', // April
      'Warm spring weather', // May
      'Hot summer conditions', // June
      'Hot summer weather', // July
      'Hot summer conditions', // August
      'Warm autumn weather', // September
      'Mild autumn conditions', // October
      'Cool autumn weather', // November
      'Cool winter conditions' // December
    ];
    
    return seasonalDescriptions[month] || 'Pleasant weather';
  }

  static getSeasonalHumidity(month: number): number {
    const seasonalHumidity = [
      65, // January
      60, // February
      55, // March
      50, // April
      45, // May
      40, // June
      35, // July
      38, // August
      45, // September
      55, // October
      60, // November
      65  // December
    ];
    
    return seasonalHumidity[month] || 50;
  }

  static getSeasonalPrecipitation(month: number): number {
    const seasonalPrecipitation = [
      25, // January
      20, // February
      15, // March
      10, // April
      5,  // May
      2,  // June
      1,  // July
      3,  // August
      8,  // September
      15, // October
      20, // November
      25  // December
    ];
    
    return seasonalPrecipitation[month] || 10;
  }

  static getSeasonalIcon(month: number): string {
    const seasonalIcons = [
      '❄️', // January
      '🌨️', // February
      '🌸', // March
      '🌞', // April
      '☀️', // May
      '🌞', // June
      '☀️', // July
      '🌞', // August
      '🍂', // September
      '🍁', // October
      '🌫️', // November
      '❄️'  // December
    ];
    
    return seasonalIcons[month] || '🌤️';
  }
}
