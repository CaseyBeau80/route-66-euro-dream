
import { supabase } from '@/lib/supabase';
import type { Route66Waypoint } from '../types/supabaseTypes';

export interface ValidationResult {
  isValid: boolean;
  totalWaypoints: number;
  duplicateSequences: Array<{ sequence_order: number; waypoints: string[] }>;
  sequenceGaps: number[];
  geographicIssues: Array<{ waypoint: string; issue: string; severity: 'warning' | 'error' }>;
  recommendations: string[];
}

export class WaypointValidationService {
  /**
   * Comprehensive validation of Route 66 waypoints data
   */
  static async validateRoute66Waypoints(): Promise<ValidationResult> {
    console.log('🔍 WaypointValidationService: Starting comprehensive waypoint validation');

    try {
      // Fetch all waypoints
      const { data: waypoints, error } = await (supabase as any)
        .from('route66_waypoints')
        .select('id,name,state,latitude,longitude,description,image_url,thumbnail_url,sequence_order,is_major_stop,highway_designation')
        .order('sequence_order');

      if (error) {
        throw new Error(`Failed to fetch waypoints: ${error.message}`);
      }

      if (!waypoints || waypoints.length === 0) {
        return {
          isValid: false,
          totalWaypoints: 0,
          duplicateSequences: [],
          sequenceGaps: [],
          geographicIssues: [{ waypoint: 'Database', issue: 'No waypoints found', severity: 'error' }],
          recommendations: ['Populate the route66_waypoints table with Route 66 data']
        };
      }

      console.log(`📊 Validating ${waypoints.length} waypoints`);

      // Run all validation checks
      const duplicateSequences = this.findDuplicateSequences(waypoints);
      const sequenceGaps = this.findSequenceGaps(waypoints);
      const geographicIssues = this.validateGeographicProgression(waypoints);
      const recommendations = this.generateRecommendations(duplicateSequences, sequenceGaps, geographicIssues);

      const isValid = duplicateSequences.length === 0 && 
                     sequenceGaps.length === 0 && 
                     geographicIssues.filter(issue => issue.severity === 'error').length === 0;

      const result: ValidationResult = {
        isValid,
        totalWaypoints: waypoints.length,
        duplicateSequences,
        sequenceGaps,
        geographicIssues,
        recommendations
      };

      console.log('✅ WaypointValidationService: Validation complete', result);
      return result;

    } catch (error) {
      console.error('❌ WaypointValidationService: Validation failed', error);
      return {
        isValid: false,
        totalWaypoints: 0,
        duplicateSequences: [],
        sequenceGaps: [],
        geographicIssues: [{ waypoint: 'System', issue: `Validation error: ${error}`, severity: 'error' }],
        recommendations: ['Check database connection and table structure']
      };
    }
  }

  /**
   * Find waypoints with duplicate sequence orders
   */
  private static findDuplicateSequences(waypoints: Route66Waypoint[]) {
    const sequenceMap = new Map<number, Route66Waypoint[]>();
    
    waypoints.forEach(wp => {
      const seq = wp.sequence_order;
      if (!sequenceMap.has(seq)) {
        sequenceMap.set(seq, []);
      }
      sequenceMap.get(seq)!.push(wp);
    });

    const duplicates: Array<{ sequence_order: number; waypoints: string[] }> = [];
    
    sequenceMap.forEach((wps, seq) => {
      if (wps.length > 1) {
        duplicates.push({
          sequence_order: seq,
          waypoints: wps.map(w => `${w.name}, ${w.state}`)
        });
      }
    });

    return duplicates;
  }

  /**
   * Find gaps in sequence order
   */
  private static findSequenceGaps(waypoints: Route66Waypoint[]) {
    const sequences = waypoints
      .map(wp => wp.sequence_order)
      .filter(seq => seq !== null)
      .sort((a, b) => a - b);

    if (sequences.length === 0) return [];

    const gaps: number[] = [];
    const minSeq = Math.min(...sequences);
    const maxSeq = Math.max(...sequences);

    for (let i = minSeq; i <= maxSeq; i++) {
      if (!sequences.includes(i)) {
        gaps.push(i);
      }
    }

    return gaps;
  }

  /**
   * Validate geographic progression (east to west)
   */
  private static validateGeographicProgression(waypoints: Route66Waypoint[]) {
    const issues: Array<{ waypoint: string; issue: string; severity: 'warning' | 'error' }> = [];
    
    // Sort by sequence order
    const sortedWaypoints = waypoints
      .filter(wp => wp.latitude && wp.longitude && wp.sequence_order !== null)
      .sort((a, b) => a.sequence_order - b.sequence_order);

    // Check critical waypoint sequence
    const chicago = sortedWaypoints.find(w => w.name.toLowerCase().includes('chicago') && w.state === 'IL');
    const springfieldIL = sortedWaypoints.find(w => w.name.toLowerCase().includes('springfield') && w.state === 'IL');
    const stLouis = sortedWaypoints.find(w => w.name.toLowerCase().includes('st. louis') && w.state === 'MO');
    const springfieldMO = sortedWaypoints.find(w => w.name.toLowerCase().includes('springfield') && w.state === 'MO');
    const santaMonica = sortedWaypoints.find(w => w.name.toLowerCase().includes('santa monica') && w.state === 'CA');

    // Validate critical sequence
    if (chicago && chicago.sequence_order !== 1) {
      issues.push({
        waypoint: `${chicago.name}, ${chicago.state}`,
        issue: `Should be sequence order 1 (start), but is ${chicago.sequence_order}`,
        severity: 'error'
      });
    }

    if (springfieldIL && stLouis && springfieldIL.sequence_order >= stLouis.sequence_order) {
      issues.push({
        waypoint: `${springfieldIL.name}, ${springfieldIL.state}`,
        issue: `Should come before St. Louis, MO in sequence`,
        severity: 'error'
      });
    }

    if (stLouis && springfieldMO && stLouis.sequence_order >= springfieldMO.sequence_order) {
      issues.push({
        waypoint: `${stLouis.name}, ${stLouis.state}`,
        issue: `Should come before Springfield, MO in sequence`,
        severity: 'error'
      });
    }

    // Check for major longitude reversals (ping-ponging)
    for (let i = 1; i < sortedWaypoints.length - 1; i++) {
      const prev = sortedWaypoints[i - 1];
      const current = sortedWaypoints[i];
      const next = sortedWaypoints[i + 1];

      // Check if we're moving significantly east when we should be moving west
      const lng1 = prev.longitude;
      const lng2 = current.longitude;
      const lng3 = next.longitude;

      const direction1 = lng2 - lng1; // Should be positive (eastward) overall
      const direction2 = lng3 - lng2;

      // Detect ping-ponging (significant direction reversals)
      if (Math.abs(direction1) > 1 && Math.abs(direction2) > 1 && 
          Math.sign(direction1) !== Math.sign(direction2)) {
        issues.push({
          waypoint: `${current.name}, ${current.state}`,
          issue: `Possible ping-ponging: ${prev.name} → ${current.name} → ${next.name} (longitude: ${lng1.toFixed(2)} → ${lng2.toFixed(2)} → ${lng3.toFixed(2)})`,
          severity: 'warning'
        });
      }
    }

    return issues;
  }

  /**
   * Generate recommendations based on validation results
   */
  private static generateRecommendations(
    duplicateSequences: Array<{ sequence_order: number; waypoints: string[] }>,
    sequenceGaps: number[],
    geographicIssues: Array<{ waypoint: string; issue: string; severity: 'warning' | 'error' }>
  ): string[] {
    const recommendations: string[] = [];

    if (duplicateSequences.length > 0) {
      recommendations.push(`Fix ${duplicateSequences.length} duplicate sequence orders`);
      recommendations.push('Run: UPDATE route66_waypoints SET sequence_order = NEW_VALUE WHERE id = WAYPOINT_ID');
    }

    if (sequenceGaps.length > 0) {
      recommendations.push(`Fill ${sequenceGaps.length} sequence gaps: ${sequenceGaps.slice(0, 5).join(', ')}${sequenceGaps.length > 5 ? '...' : ''}`);
      recommendations.push('Add missing waypoints or renumber sequences to be consecutive');
    }

    const errors = geographicIssues.filter(issue => issue.severity === 'error');
    const warnings = geographicIssues.filter(issue => issue.severity === 'warning');

    if (errors.length > 0) {
      recommendations.push(`Fix ${errors.length} critical geographic sequence errors`);
      recommendations.push('Ensure Chicago (IL) → Springfield (IL) → St. Louis (MO) → Springfield (MO) sequence');
    }

    if (warnings.length > 0) {
      recommendations.push(`Review ${warnings.length} geographic progression warnings`);
      recommendations.push('Check for ping-ponging and ensure general east-to-west progression');
    }

    if (recommendations.length === 0) {
      recommendations.push('Route 66 waypoints validation passed! All data looks good.');
    }

    return recommendations;
  }
}
