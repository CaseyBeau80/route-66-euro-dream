
export class BlockingConfirmationService {
  static async confirmDayAdjustment(
    requested: number, 
    minimum: number, 
    startLocation: string, 
    endLocation: string
  ): Promise<boolean> {
    console.log('🚨 BlockingConfirmationService: Requesting day adjustment confirmation');
    
    const message = `IMPORTANT: Your ${requested}-day trip needs to be adjusted to ${minimum} days for safety.

Route: ${startLocation} to ${endLocation}
Original: ${requested} days (${Math.round((minimum * 300) / requested)} miles/day - TOO MUCH!)
Adjusted: ${minimum} days (300 miles/day - Safe & comfortable)

Do you want to continue with the ${minimum}-day trip?`;

    // Use native browser confirm dialog - this ALWAYS works and blocks
    const confirmed = window.confirm(message);
    
    console.log('🚨 BlockingConfirmationService: User response:', confirmed);
    return confirmed;
  }
}
