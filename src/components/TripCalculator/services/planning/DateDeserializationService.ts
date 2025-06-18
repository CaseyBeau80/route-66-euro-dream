
/**
 * Service to handle deserialization of complex Date objects back to native Date objects
 */
export class DateDeserializationService {
  /**
   * Check if an object is a serialized Date structure
   */
  static isSerializedDate(obj: any): boolean {
    return obj && 
           typeof obj === 'object' && 
           obj._type === 'Date' && 
           obj.value && 
           (typeof obj.value.value === 'number' || typeof obj.value.iso === 'string');
  }

  /**
   * Convert a serialized Date object back to a native Date
   */
  static deserializeDate(serializedDate: any): Date | null {
    if (!this.isSerializedDate(serializedDate)) {
      // If it's already a Date object, return it
      if (serializedDate instanceof Date) {
        return serializedDate;
      }
      // If it's a string that can be parsed as a date
      if (typeof serializedDate === 'string') {
        const parsed = new Date(serializedDate);
        return isNaN(parsed.getTime()) ? null : parsed;
      }
      return null;
    }

    try {
      // Try to use the ISO string first
      if (serializedDate.value.iso) {
        const fromIso = new Date(serializedDate.value.iso);
        if (!isNaN(fromIso.getTime())) {
          console.log('✅ DateDeserializationService: Successfully deserialized from ISO:', {
            original: serializedDate,
            result: fromIso.toISOString()
          });
          return fromIso;
        }
      }

      // Fallback to numeric value
      if (typeof serializedDate.value.value === 'number') {
        const fromNumber = new Date(serializedDate.value.value);
        if (!isNaN(fromNumber.getTime())) {
          console.log('✅ DateDeserializationService: Successfully deserialized from number:', {
            original: serializedDate,
            result: fromNumber.toISOString()
          });
          return fromNumber;
        }
      }

      console.error('❌ DateDeserializationService: Could not deserialize date:', serializedDate);
      return null;
    } catch (error) {
      console.error('❌ DateDeserializationService: Error deserializing date:', error, serializedDate);
      return null;
    }
  }

  /**
   * Recursively process an object to deserialize all Date objects
   */
  static deserializeDatesInObject(obj: any): any {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => this.deserializeDatesInObject(item));
    }

    // Check if this object itself is a serialized date
    if (this.isSerializedDate(obj)) {
      return this.deserializeDate(obj);
    }

    // Process object properties
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object') {
        if (this.isSerializedDate(value)) {
          result[key] = this.deserializeDate(value);
          console.log(`🔧 DateDeserializationService: Deserialized ${key}:`, {
            original: value,
            result: result[key]?.toISOString()
          });
        } else {
          result[key] = this.deserializeDatesInObject(value);
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Fix trip plan dates specifically
   */
  static fixTripPlanDates(tripPlan: any): any {
    if (!tripPlan) return tripPlan;

    console.log('🔧 DateDeserializationService: Fixing trip plan dates:', {
      hasStartDate: !!tripPlan.startDate,
      hasLastUpdated: !!tripPlan.lastUpdated,
      startDateType: typeof tripPlan.startDate,
      startDateValue: tripPlan.startDate
    });

    const fixed = { ...tripPlan };

    // Fix startDate
    if (tripPlan.startDate) {
      fixed.startDate = this.deserializeDate(tripPlan.startDate);
    }

    // Fix lastUpdated
    if (tripPlan.lastUpdated) {
      fixed.lastUpdated = this.deserializeDate(tripPlan.lastUpdated);
    }

    // Fix any dates in segments
    if (tripPlan.segments && Array.isArray(tripPlan.segments)) {
      fixed.segments = tripPlan.segments.map((segment: any) => {
        const fixedSegment = { ...segment };
        if (segment.date) {
          fixedSegment.date = this.deserializeDate(segment.date);
        }
        return fixedSegment;
      });
    }

    console.log('✅ DateDeserializationService: Fixed trip plan dates:', {
      originalStartDate: tripPlan.startDate,
      fixedStartDate: fixed.startDate?.toISOString(),
      hasValidStartDate: fixed.startDate instanceof Date && !isNaN(fixed.startDate.getTime())
    });

    return fixed;
  }
}
