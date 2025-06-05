
export interface DrivingTimeMessage {
  level: 'scenic' | 'efficient' | 'warrior';
  emoji: string;
  title: string;
  message: string;
  recommendations: string[];
  maxStops: number;
}

export class DrivingTimeMessageService {
  /**
   * Get dynamic message and recommendations based on daily driving time
   */
  static getDrivingTimeMessage(driveTimeHours: number): DrivingTimeMessage {
    if (driveTimeHours <= 5) {
      return {
        level: 'scenic',
        emoji: '🚙',
        title: 'Taking the scenic route!',
        message: `With only ${driveTimeHours.toFixed(1)} hours of driving, you've got plenty of time to soak it all in. Expect lots of quirky roadside stops, classic diners, photo ops, and a leisurely pace. Enjoy the ride! 🌄`,
        recommendations: [
          '3–4 attractions per day',
          'Classic diner meal stops',
          'Optional hidden gems',
          'Photo opportunities'
        ],
        maxStops: 4
      };
    }
    
    if (driveTimeHours > 5 && driveTimeHours <= 7) {
      return {
        level: 'efficient',
        emoji: '🛻',
        title: 'Making good time.',
        message: `You're covering some ground with ${driveTimeHours.toFixed(1)} hours of driving — but still have room for 2–3 must-see attractions and a good place to eat. We'll keep things exciting and efficient.`,
        recommendations: [
          '2–3 key attractions',
          'Meal stop',
          'Strategic photo ops',
          'Route 66 waypoints'
        ],
        maxStops: 3
      };
    }
    
    // 7+ hours
    return {
      level: 'warrior',
      emoji: '🚗💨',
      title: 'Whoa, Road Warrior!',
      message: `You've got ${driveTimeHours.toFixed(1)} hours planned — this day's all about the miles. We'll suggest just the essentials:`,
      recommendations: [
        '🛑 Bathroom breaks',
        '🍔 Quick meals',
        '💨 Stretch stops',
        '⛽ Gas stations'
      ],
      maxStops: 1
    };
  }

  /**
   * Get color scheme for the driving time level
   */
  static getLevelColorScheme(level: 'scenic' | 'efficient' | 'warrior') {
    switch (level) {
      case 'scenic':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600'
        };
      case 'efficient':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600'
        };
      case 'warrior':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600'
        };
    }
  }
}
