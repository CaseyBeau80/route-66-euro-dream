
export class SeasonalWeatherGenerator {
  static getSeasonalTemperature(month: number): number {
    const seasonalTemps = [40, 45, 55, 65, 75, 85, 90, 88, 80, 70, 55, 45];
    return seasonalTemps[month] || 70;
  }

  static getSeasonalDescription(month: number): string {
    if (month >= 11 || month <= 2) return 'partly cloudy';
    if (month >= 3 && month <= 5) return 'mild and pleasant';
    if (month >= 6 && month <= 8) return 'hot and sunny';
    return 'comfortable weather';
  }

  static getSeasonalIcon(month: number): string {
    if (month >= 11 || month <= 2) return '02d';
    if (month >= 6 && month <= 8) return '01d';
    return '02d';
  }

  static getSeasonalHumidity(month: number): number {
    if (month >= 6 && month <= 8) return 60;
    if (month >= 11 || month <= 2) return 45;
    return 55;
  }

  static getSeasonalPrecipitation(month: number): number {
    if (month >= 4 && month <= 6) return 35;
    if (month >= 7 && month <= 9) return 25;
    return 20;
  }
}
