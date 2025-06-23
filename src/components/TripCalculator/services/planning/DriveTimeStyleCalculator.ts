
export class DriveTimeStyleCalculator {
  static getStyle(driveTimeHours: number) {
    // Ensure we have a valid number
    const validDriveTime = driveTimeHours || 0;
    
    if (validDriveTime <= 4) {
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200'
      };
    } else if (validDriveTime <= 6) {
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200'
      };
    } else if (validDriveTime <= 8) {
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

  static formatDriveTime(driveTimeHours: number): string {
    const validDriveTime = driveTimeHours || 0;
    
    if (validDriveTime < 1) {
      const minutes = Math.round(validDriveTime * 60);
      return `${minutes}min`;
    }
    
    const hours = Math.floor(validDriveTime);
    const minutes = Math.round((validDriveTime - hours) * 60);
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${minutes}min`;
  }
}
