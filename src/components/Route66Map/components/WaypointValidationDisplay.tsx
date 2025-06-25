
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { WaypointValidationService, ValidationResult } from '../services/WaypointValidationService';

interface WaypointValidationDisplayProps {
  isVisible: boolean;
  onClose: () => void;
}

const WaypointValidationDisplay: React.FC<WaypointValidationDisplayProps> = ({
  isVisible,
  onClose
}) => {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible && !validation) {
      runValidation();
    }
  }, [isVisible]);

  const runValidation = async () => {
    setIsLoading(true);
    try {
      const result = await WaypointValidationService.validateRoute66Waypoints();
      setValidation(result);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Route 66 Waypoints Validation
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Validating waypoints...</span>
            </div>
          ) : validation ? (
            <div className="space-y-6">
              {/* Summary */}
              <div className={`p-4 rounded-lg border ${
                validation.isValid 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {validation.isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <h3 className="font-semibold">
                    {validation.isValid ? 'Validation Passed' : 'Validation Failed'}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Total waypoints: {validation.totalWaypoints}
                </p>
              </div>

              {/* Duplicate Sequences */}
              {validation.duplicateSequences.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-800">
                      Duplicate Sequence Orders ({validation.duplicateSequences.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {validation.duplicateSequences.map((dup, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">Sequence {dup.sequence_order}:</span>
                        <ul className="ml-4 list-disc">
                          {dup.waypoints.map((wp, i) => (
                            <li key={i}>{wp}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sequence Gaps */}
              {validation.sequenceGaps.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold text-orange-800">
                      Sequence Gaps ({validation.sequenceGaps.length})
                    </h4>
                  </div>
                  <p className="text-sm text-orange-700">
                    Missing sequences: {validation.sequenceGaps.slice(0, 10).join(', ')}
                    {validation.sequenceGaps.length > 10 && ` and ${validation.sequenceGaps.length - 10} more...`}
                  </p>
                </div>
              )}

              {/* Geographic Issues */}
              {validation.geographicIssues.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-red-800">
                      Geographic Issues ({validation.geographicIssues.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {validation.geographicIssues.map((issue, index) => (
                      <div key={index} className="text-sm">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium mr-2 ${
                          issue.severity === 'error' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {issue.severity.toUpperCase()}
                        </span>
                        <span className="font-medium">{issue.waypoint}:</span> {issue.issue}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {validation.recommendations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Recommendations</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-blue-700">
                    {validation.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Click the button below to run validation</p>
              <button
                onClick={runValidation}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Run Validation
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <button
            onClick={runValidation}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Validating...' : 'Refresh Validation'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaypointValidationDisplay;
