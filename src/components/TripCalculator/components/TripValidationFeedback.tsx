
import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { TripValidationResult, OptimizationSuggestion } from '../services/validation/TripValidationService';
import TripFeasibilityMeter from './TripFeasibilityMeter';
import TripOptimizationSuggestions from './TripOptimizationSuggestions';

interface TripValidationFeedbackProps {
  validation: TripValidationResult;
  onOptimizationClick: (suggestion: OptimizationSuggestion) => void;
  className?: string;
}

const TripValidationFeedback: React.FC<TripValidationFeedbackProps> = ({
  validation,
  onOptimizationClick,
  className = ''
}) => {
  const { isValid, issues, recommendations, canBeOptimized, optimizationSuggestions } = validation;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Feasibility Meter */}
      <TripFeasibilityMeter validation={validation} />

      {/* Issues */}
      {issues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 mb-2">Trip Issues</h4>
              <ul className="space-y-1">
                {issues.map((issue, index) => (
                  <li key={index} className="text-sm text-red-700">
                    • {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-blue-700">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Optimization Suggestions */}
      {canBeOptimized && optimizationSuggestions.length > 0 && (
        <TripOptimizationSuggestions
          suggestions={optimizationSuggestions}
          onSuggestionClick={onOptimizationClick}
        />
      )}

      {/* Success message for valid trips */}
      {isValid && issues.length === 0 && recommendations.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800">
              Your trip plan looks great! Ready to create your Route 66 adventure.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripValidationFeedback;
