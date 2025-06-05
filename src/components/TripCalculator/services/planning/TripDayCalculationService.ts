
export class TripDayCalculationService {
  private static readonly MILES_PER_DAY_COMFORTABLE = 300;
  private static readonly MILES_PER_DAY_MAXIMUM = 500;

  /**
   * Smart trip day calculation based on total distance with conservative limits
   */
  static calculateOptimalTripDays(totalDistanceMiles: number, requestedDays: number): number {
    const milesPerDay = totalDistanceMiles / requestedDays;
    
    if (milesPerDay > this.MILES_PER_DAY_MAXIMUM) {
      const suggestedDays = Math.ceil(totalDistanceMiles / this.MILES_PER_DAY_COMFORTABLE);
      console.log(`🚗 Adjusting trip from ${requestedDays} to ${suggestedDays} days for comfortable daily distances`);
      return suggestedDays;
    }
    
    return requestedDays;
  }
}
