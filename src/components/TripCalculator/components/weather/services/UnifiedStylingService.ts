
export interface WeatherStyleTheme {
  containerClasses: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  badgeClasses: string;
  sourceColor: string;
  sourceLabel: string;
  badgeText: string;
  iconColor: string;
}

export class UnifiedStylingService {
  /**
   * CENTRALIZED STYLING: Get consistent styles based on weather validation
   */
  static getWeatherStyles(styleTheme: 'green' | 'amber' | 'gray'): WeatherStyleTheme {
    switch (styleTheme) {
      case 'green':
        console.log('🟢 UNIFIED STYLING: Applying GREEN theme for live weather');
        return {
          containerClasses: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
          backgroundColor: '#dcfce7', // Green-100
          borderColor: '#bbf7d0', // Green-200
          textColor: '#166534', // Green-800
          badgeClasses: 'bg-green-100 text-green-700 border-green-200',
          sourceColor: '#059669', // Green-600
          sourceLabel: '🟢 Live Weather Forecast',
          badgeText: '✨ Current live forecast',
          iconColor: '#22c55e' // Green-500
        };

      case 'amber':
        console.log('🟡 UNIFIED STYLING: Applying AMBER theme for historical weather');
        return {
          containerClasses: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
          backgroundColor: '#fef3c7', // Amber-100
          borderColor: '#fde68a', // Amber-200
          textColor: '#92400e', // Amber-800
          badgeClasses: 'bg-amber-100 text-amber-700 border-amber-200',
          sourceColor: '#d97706', // Amber-600
          sourceLabel: '🟡 Historical Weather Data',
          badgeText: '📊 Based on historical patterns',
          iconColor: '#f59e0b' // Amber-500
        };

      case 'gray':
      default:
        console.log('⚫ UNIFIED STYLING: Applying GRAY theme for unknown weather');
        return {
          containerClasses: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200',
          backgroundColor: '#f3f4f6', // Gray-100
          borderColor: '#e5e7eb', // Gray-200
          textColor: '#374151', // Gray-700
          badgeClasses: 'bg-gray-100 text-gray-700 border-gray-200',
          sourceColor: '#6b7280', // Gray-500
          sourceLabel: '⚫ Weather Data',
          badgeText: '❓ Data unavailable',
          iconColor: '#9ca3af' // Gray-400
        };
    }
  }

  /**
   * CONVENIENCE METHOD: Get badge styles only
   */
  static getBadgeStyles(styleTheme: 'green' | 'amber' | 'gray') {
    const styles = this.getWeatherStyles(styleTheme);
    return {
      classes: styles.badgeClasses,
      text: styles.badgeText,
      sourceLabel: styles.sourceLabel
    };
  }
}
