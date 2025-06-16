
import { TripStop } from '../data/SupabaseDataService';
import { DailySegment } from './TripPlanTypes';
import { Route66SequenceValidator } from './utils/Route66SequenceValidator';
import { Route66SequenceUtils } from './utils/Route66SequenceUtils';

export interface SequenceEnforcementResult {
  isValid: boolean;
  originalSegments: DailySegment[];
  correctedSegments?: DailySegment[];
  violations: Array<{
    day: number;
    from: string;
    to: string;
    violation: string;
    correctionApplied?: string;
  }>;
  summary: string;
}

export class Route66SequenceEnforcer {
  /**
   * Enforce Route 66 sequence order in trip segments
   */
  static enforceSequenceOrder(segments: DailySegment[]): SequenceEnforcementResult {
    console.log(`🔒 SEQUENCE ENFORCEMENT: Validating ${segments.length} segments`);

    const violations: Array<{
      day: number;
      from: string;
      to: string;
      violation: string;
      correctionApplied?: string;
    }> = [];

    // Extract stops from segments for validation
    const allStops: TripStop[] = [];
    
    if (segments.length > 0) {
      // Add start stop (reconstructed from first segment)
      const firstSegment = segments[0];
      allStops.push({
        id: `start-${Math.random()}`,
        name: firstSegment.startCity,
        city_name: firstSegment.startCity,
        state: 'Unknown', // We don't have state info in segments
        latitude: 0, // We don't have coordinates in segments
        longitude: 0,
        category: 'destination_city'
      } as TripStop);

      // Add all destination stops
      segments.forEach(segment => {
        allStops.push({
          id: `dest-${segment.day}`,
          name: segment.endCity,
          city_name: segment.endCity,
          state: segment.destination?.state || 'Unknown',
          latitude: 0, // We don't have coordinates in segments
          longitude: 0,
          category: 'destination_city'
        } as TripStop);
      });
    }

    // Validate sequence using the validator
    const sequenceValidation = Route66SequenceValidator.validateTripSequence(allStops);

    // Convert validation violations to our format
    sequenceValidation.violations.forEach(violation => {
      const fromStop = allStops[violation.fromIndex];
      const toStop = allStops[violation.toIndex];
      
      violations.push({
        day: violation.fromIndex + 1,
        from: fromStop.name,
        to: toStop.name,
        violation: violation.reason,
      });
    });

    const isValid = violations.length === 0;
    
    let summary: string;
    if (isValid) {
      summary = `✅ All ${segments.length} segments maintain proper Route 66 sequence order`;
    } else {
      summary = `❌ Found ${violations.length} sequence violations requiring attention`;
    }

    console.log(`🔒 ENFORCEMENT RESULT: ${summary}`);
    violations.forEach(v => {
      console.log(`   Day ${v.day}: ${v.from} → ${v.to} (${v.violation})`);
    });

    return {
      isValid,
      originalSegments: segments,
      violations,
      summary
    };
  }

  /**
   * Validate that a proposed trip maintains Route 66 sequence integrity
   */
  static validateTripSequenceIntegrity(
    startStop: TripStop,
    intermediateStops: TripStop[],
    endStop: TripStop
  ): {
    isValid: boolean;
    violations: string[];
    recommendations: string[];
  } {
    const allStops = [startStop, ...intermediateStops, endStop];
    const violations: string[] = [];
    const recommendations: string[] = [];

    console.log(`🔍 INTEGRITY CHECK: Validating sequence for ${allStops.length} stops`);

    // Check for sequence violations
    const sequenceResult = Route66SequenceUtils.detectSequenceViolations(allStops);
    
    if (sequenceResult.hasViolations) {
      sequenceResult.details.forEach(detail => {
        violations.push(`${detail.from} → ${detail.to}: ${detail.violation}`);
      });

      if (sequenceResult.backtrackingCount > 0) {
        recommendations.push(`Remove ${sequenceResult.backtrackingCount} backtracking segments`);
      }
      
      if (sequenceResult.overshootingCount > 0) {
        recommendations.push(`Add intermediate stops to prevent overshooting`);
      }
    }

    // Check for large sequence gaps
    for (let i = 0; i < allStops.length - 1; i++) {
      const current = allStops[i];
      const next = allStops[i + 1];
      
      const currentInfo = Route66SequenceUtils.getSequenceInfo(current);
      const nextInfo = Route66SequenceUtils.getSequenceInfo(next);
      
      if (currentInfo.order !== null && nextInfo.order !== null) {
        const gap = Math.abs(nextInfo.order - currentInfo.order);
        
        if (gap > 150) { // Large sequence gap threshold
          violations.push(`Large sequence gap between ${current.name} and ${next.name} (${gap} units)`);
          recommendations.push(`Consider adding intermediate stop between ${current.name} and ${next.name}`);
        }
      }
    }

    const isValid = violations.length === 0;
    
    console.log(`🔍 INTEGRITY RESULT: ${isValid ? 'Valid' : 'Invalid'} (${violations.length} violations)`);
    
    return {
      isValid,
      violations,
      recommendations
    };
  }

  /**
   * Get sequence enforcement summary for trip planning
   */
  static getSequenceEnforcementSummary(
    segments: DailySegment[]
  ): {
    totalSegments: number;
    validSegments: number;
    violatingSegments: number;
    sequenceQuality: 'excellent' | 'good' | 'fair' | 'poor';
    qualityReason: string;
  } {
    const enforcementResult = this.enforceSequenceOrder(segments);
    
    const totalSegments = segments.length;
    const violatingSegments = enforcementResult.violations.length;
    const validSegments = totalSegments - violatingSegments;
    
    let sequenceQuality: 'excellent' | 'good' | 'fair' | 'poor';
    let qualityReason: string;
    
    const violationRate = violatingSegments / totalSegments;
    
    if (violationRate === 0) {
      sequenceQuality = 'excellent';
      qualityReason = 'Perfect Route 66 sequence adherence with no backtracking';
    } else if (violationRate <= 0.1) {
      sequenceQuality = 'good';
      qualityReason = 'Minor sequence deviations that maintain overall Route 66 flow';
    } else if (violationRate <= 0.3) {
      sequenceQuality = 'fair';
      qualityReason = 'Some sequence violations present, consider route adjustments';
    } else {
      sequenceQuality = 'poor';
      qualityReason = 'Significant backtracking detected, route needs major revision';
    }
    
    console.log(`📊 SEQUENCE QUALITY: ${sequenceQuality} (${validSegments}/${totalSegments} valid segments)`);
    
    return {
      totalSegments,
      validSegments,
      violatingSegments,
      sequenceQuality,
      qualityReason
    };
  }
}
