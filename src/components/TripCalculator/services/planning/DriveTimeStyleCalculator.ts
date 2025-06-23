
export class DriveTimeStyleCalculator {
  static getStyle(driveTimeHours: number) {
    if (driveTimeHours <= 4) {
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200'
      };
    } else if (driveTimeHours <= 6) {
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200'
      };
    } else if (driveTimeHours <= 8) {
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200'
      };
    } else {
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200'
      };
    }
  }
}
