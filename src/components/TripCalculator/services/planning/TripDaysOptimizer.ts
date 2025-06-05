export class TripDaysOptimizer {
  /**
   * Calculate optimal days considering balanced drive times
   */
  static calculateOptimalDaysForBalancedDriving(
    totalDistance: number, 
    requestedDays: number
  ): number {
    const avgSpeedMph = 50;
    const totalDriveTimeHours = totalDistance / avgSpeedMph;
    
    // Calculate what the average daily drive time would be
    const avgDailyDriveTime = totalDriveTimeHours / requestedDays;
    
    console.log(`⏱️ Drive time analysis: ${totalDriveTimeHours.toFixed(1)}h total, ${avgDailyDriveTime.toFixed(1)}h average for ${requestedDays} days`);
    
    // Optimal drive time range: 4-6 hours per day
    const OPTIMAL_MIN = 4;
    const OPTIMAL_MAX = 6;
    const ABSOLUTE_MAX = 8;
    
    // If average is within optimal range, keep requested days
    if (avgDailyDriveTime >= OPTIMAL_MIN && avgDailyDriveTime <= OPTIMAL_MAX) {
      console.log(`✅ Requested ${requestedDays} days works well for balanced driving`);
      return requestedDays;
    }
    
    // If average is too low, reduce days
    if (avgDailyDriveTime < OPTIMAL_MIN) {
      const optimalDays = Math.ceil(totalDriveTimeHours / OPTIMAL_MIN);
      console.log(`📉 Reducing from ${requestedDays} to ${optimalDays} days to reach minimum drive time`);
      return Math.max(optimalDays, Math.max(2, requestedDays - 2)); // Don't reduce too drastically
    }
    
    // If average is too high, increase days
    if (avgDailyDriveTime > OPTIMAL_MAX) {
      const optimalDays = Math.ceil(totalDriveTimeHours / OPTIMAL_MAX);
      console.log(`📈 Increasing from ${requestedDays} to ${optimalDays} days for comfortable drive times`);
      return Math.min(optimalDays, requestedDays + 3); // Don't increase too drastically
    }
    
    return requestedDays;
  }
}
