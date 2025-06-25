
import React, { useState, useEffect } from 'react';
import { X, Database, AlertTriangle, CheckCircle, MapPin, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface ValidationDisplayProps {
  isVisible: boolean;
  onClose: () => void;
}

interface ValidationIssue {
  type: 'duplicate_sequence' | 'geographic_jump' | 'invalid_coords' | 'sequence_gap';
  severity: 'error' | 'warning';
  waypointId: string;
  waypointName: string;
  sequenceOrder: number;
  description: string;
  suggestion?: string;
}

interface ValidationResult {
  waypoints: Route66Waypoint[];
  issues: ValidationIssue[];
  isValid: boolean;
  totalWaypoints: number;
  sequenceRange: { min: number; max: number };
  duplicateSequences: number[];
  sequenceGaps: number[];
}

const WaypointValidationDisplay: React.FC<ValidationDisplayProps> = ({ isVisible, onClose }) => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible) {
      validateWaypoints();
    }
  }, [isVisible]);

  const validateWaypoints = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 VALIDATION: Starting comprehensive Route 66 waypoints validation');

      // Fetch all waypoints ordered by sequence_order
      const { data: waypoints, error: fetchError } = await supabase
        .from('route66_waypoints')
        .select('*')
        .order('sequence_order', { ascending: true });

      if (fetchError) {
        throw new Error(`Database fetch error: ${fetchError.message}`);
      }

      if (!waypoints || waypoints.length === 0) {
        throw new Error('No waypoints found in route66_waypoints table');
      }

      console.log(`📊 VALIDATION: Fetched ${waypoints.length} waypoints from database`);

      // Log all waypoints for manual review
      console.log('🗺️ COMPLETE WAYPOINT LIST (ordered by sequence_order):');
      waypoints.forEach((wp, index) => {
        console.log(`${index + 1}. ID: ${wp.id}, Name: "${wp.name}", State: ${wp.state}, Seq: ${wp.sequence_order}, Lat: ${wp.latitude}, Lng: ${wp.longitude}`);
      });

      // Start validation
      const issues: ValidationIssue[] = [];
      const sequences = waypoints.map(wp => wp.sequence_order);
      const minSeq = Math.min(...sequences);
      const maxSeq = Math.max(...sequences);

      // 1. Check for duplicate sequence orders
      const sequenceCounts = new Map<number, Route66Waypoint[]>();
      waypoints.forEach(wp => {
        if (!sequenceCounts.has(wp.sequence_order)) {
          sequenceCounts.set(wp.sequence_order, []);
        }
        sequenceCounts.get(wp.sequence_order)!.push(wp);
      });

      const duplicateSequences: number[] = [];
      sequenceCounts.forEach((wps, seq) => {
        if (wps.length > 1) {
          duplicateSequences.push(seq);
          wps.forEach(wp => {
            issues.push({
              type: 'duplicate_sequence',
              severity: 'error',
              waypointId: wp.id,
              waypointName: wp.name,
              sequenceOrder: wp.sequence_order,
              description: `Duplicate sequence order ${seq} shared with ${wps.length - 1} other waypoint(s)`,
              suggestion: 'Assign unique sequence orders to maintain proper route ordering'
            });
          });
        }
      });

      // 2. Check for sequence gaps
      const sequenceGaps: number[] = [];
      for (let i = minSeq; i <= maxSeq; i++) {
        if (!sequences.includes(i)) {
          sequenceGaps.push(i);
        }
      }

      // 3. Check for invalid coordinates
      waypoints.forEach(wp => {
        if (wp.latitude === null || wp.longitude === null || 
            isNaN(wp.latitude) || isNaN(wp.longitude) ||
            wp.latitude < -90 || wp.latitude > 90 ||
            wp.longitude < -180 || wp.longitude > 180) {
          issues.push({
            type: 'invalid_coords',
            severity: 'error',
            waypointId: wp.id,
            waypointName: wp.name,
            sequenceOrder: wp.sequence_order,
            description: `Invalid coordinates: lat=${wp.latitude}, lng=${wp.longitude}`,
            suggestion: 'Verify and correct latitude/longitude values'
          });
        }
      });

      // 4. Check for geographic progression issues (east-to-west movement)
      const validWaypoints = waypoints.filter(wp => 
        wp.latitude !== null && wp.longitude !== null && 
        !isNaN(wp.latitude) && !isNaN(wp.longitude)
      );

      for (let i = 1; i < validWaypoints.length; i++) {
        const prev = validWaypoints[i - 1];
        const current = validWaypoints[i];
        
        // Check for major eastward jumps (Route 66 generally goes west)
        const longitudeDiff = current.longitude - prev.longitude;
        if (longitudeDiff > 2) { // Threshold for suspicious eastward movement
          issues.push({
            type: 'geographic_jump',
            severity: 'warning',
            waypointId: current.id,
            waypointName: current.name,
            sequenceOrder: current.sequence_order,
            description: `Geographic inconsistency: ${prev.name} (${prev.longitude.toFixed(3)}) → ${current.name} (${current.longitude.toFixed(3)}) - moving ${longitudeDiff.toFixed(3)}° eastward`,
            suggestion: 'Verify sequence order matches actual Route 66 progression'
          });
        }
      }

      // 5. Validate critical waypoints
      const chicago = waypoints.find(w => w.name.toLowerCase().includes('chicago') && w.state === 'IL');
      const santaMonica = waypoints.find(w => w.name.toLowerCase().includes('santa monica') && w.state === 'CA');
      const springfieldIL = waypoints.find(w => w.name.toLowerCase().includes('springfield') && w.state === 'IL');
      const stLouis = waypoints.find(w => w.name.toLowerCase().includes('st. louis') && w.state === 'MO');

      if (chicago && chicago.sequence_order !== 1) {
        issues.push({
          type: 'sequence_gap',
          severity: 'error',
          waypointId: chicago.id,
          waypointName: chicago.name,
          sequenceOrder: chicago.sequence_order,
          description: `Chicago should be sequence order 1 (start), but is ${chicago.sequence_order}`,
          suggestion: 'Set Chicago sequence_order to 1'
        });
      }

      if (springfieldIL && stLouis && springfieldIL.sequence_order >= stLouis.sequence_order) {
        issues.push({
          type: 'sequence_gap',
          severity: 'error',
          waypointId: springfieldIL.id,
          waypointName: springfieldIL.name,
          sequenceOrder: springfieldIL.sequence_order,
          description: `Springfield, IL (${springfieldIL.sequence_order}) should come before St. Louis, MO (${stLouis.sequence_order})`,
          suggestion: 'Correct the sequence order for proper Route 66 progression'
        });
      }

      const result: ValidationResult = {
        waypoints,
        issues,
        isValid: issues.filter(i => i.severity === 'error').length === 0,
        totalWaypoints: waypoints.length,
        sequenceRange: { min: minSeq, max: maxSeq },
        duplicateSequences,
        sequenceGaps
      };

      // Log summary
      console.log('📋 VALIDATION SUMMARY:');
      console.log(`   Total waypoints: ${result.totalWaypoints}`);
      console.log(`   Sequence range: ${result.sequenceRange.min} to ${result.sequenceRange.max}`);
      console.log(`   Total issues: ${result.issues.length}`);
      console.log(`   Errors: ${result.issues.filter(i => i.severity === 'error').length}`);
      console.log(`   Warnings: ${result.issues.filter(i => i.severity === 'warning').length}`);
      console.log(`   Duplicate sequences: ${result.duplicateSequences.join(', ') || 'None'}`);
      console.log(`   Sequence gaps: ${result.sequenceGaps.join(', ') || 'None'}`);
      console.log(`   Route is valid: ${result.isValid ? 'YES' : 'NO'}`);

      setValidationResult(result);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown validation error';
      console.error('❌ VALIDATION ERROR:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Route 66 Waypoints Validation</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Validating waypoints...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                <AlertTriangle className="h-5 w-5" />
                Validation Error
              </div>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {validationResult && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">{validationResult.totalWaypoints}</div>
                  <div className="text-sm text-blue-700">Total Waypoints</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {validationResult.sequenceRange.min}-{validationResult.sequenceRange.max}
                  </div>
                  <div className="text-sm text-gray-700">Sequence Range</div>
                </div>
                <div className={`p-4 rounded-lg ${validationResult.issues.filter(i => i.severity === 'error').length > 0 ? 'bg-red-50' : 'bg-yellow-50'}`}>
                  <div className={`text-2xl font-bold ${validationResult.issues.filter(i => i.severity === 'error').length > 0 ? 'text-red-900' : 'text-yellow-900'}`}>
                    {validationResult.issues.length}
                  </div>
                  <div className={`text-sm ${validationResult.issues.filter(i => i.severity === 'error').length > 0 ? 'text-red-700' : 'text-yellow-700'}`}>
                    Total Issues
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${validationResult.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className={`text-2xl font-bold ${validationResult.isValid ? 'text-green-900' : 'text-red-900'}`}>
                    {validationResult.isValid ? 'VALID' : 'INVALID'}
                  </div>
                  <div className={`text-sm ${validationResult.isValid ? 'text-green-700' : 'text-red-700'}`}>
                    Route Status
                  </div>
                </div>
              </div>

              {/* Issues List */}
              {validationResult.issues.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Validation Issues ({validationResult.issues.length})
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {validationResult.issues.map((issue, index) => (
                      <div
                        key={`${issue.waypointId}-${index}`}
                        className={`p-4 rounded-lg border-l-4 ${
                          issue.severity === 'error'
                            ? 'bg-red-50 border-red-500'
                            : 'bg-yellow-50 border-yellow-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-gray-900">
                              {issue.waypointName} (Seq: {issue.sequenceOrder})
                            </div>
                            <div className="text-sm text-gray-700 mt-1">{issue.description}</div>
                            {issue.suggestion && (
                              <div className="text-sm text-gray-600 mt-2 italic">
                                💡 {issue.suggestion}
                              </div>
                            )}
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            issue.severity === 'error'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {issue.severity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Route Visualization */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Route Progression (First 20 waypoints)
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {validationResult.waypoints.slice(0, 20).map((waypoint, index) => (
                      <div key={waypoint.id} className="flex items-center gap-2 text-sm">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono">
                          {waypoint.sequence_order}
                        </span>
                        <span className="font-medium">{waypoint.name}</span>
                        <span className="text-gray-500">{waypoint.state}</span>
                        {index < validationResult.waypoints.length - 1 && (
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    ))}
                    {validationResult.waypoints.length > 20 && (
                      <div className="text-sm text-gray-500 italic">
                        ... and {validationResult.waypoints.length - 20} more waypoints
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Diagnostic Info */}
              {(validationResult.duplicateSequences.length > 0 || validationResult.sequenceGaps.length > 0) && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sequence Diagnostics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {validationResult.duplicateSequences.length > 0 && (
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="font-medium text-red-900 mb-2">Duplicate Sequences</div>
                        <div className="text-sm text-red-700">
                          {validationResult.duplicateSequences.join(', ')}
                        </div>
                      </div>
                    )}
                    {validationResult.sequenceGaps.length > 0 && (
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="font-medium text-yellow-900 mb-2">Sequence Gaps</div>
                        <div className="text-sm text-yellow-700">
                          {validationResult.sequenceGaps.slice(0, 10).join(', ')}
                          {validationResult.sequenceGaps.length > 10 && ' ...'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Check browser console for detailed logging of all waypoints
            </div>
            <div className="flex gap-3">
              <button
                onClick={validateWaypoints}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Validating...' : 'Re-validate'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaypointValidationDisplay;
