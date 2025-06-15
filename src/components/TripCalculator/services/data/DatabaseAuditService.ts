
// Stub implementation - recommendation system removed
export class DatabaseAuditService {
  static async auditStopsBetweenLocations(
    startCity: string,
    endCity: string,
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ): Promise<void> {
    console.log(`🚫 DatabaseAuditService: Audit disabled for ${startCity} → ${endCity}`);
  }
}
