
import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';
import { TripValidationResult } from '../services/validation/TripValidationService';

interface TripFeasibilityMeterProps {
  validation: TripValidationResult;
  className?: string;
}

const TripFeasibilityMeter: React.FC<TripFeasibilityMeterProps> = ({
  validation,
  className = ''
}) => {
  const { feasibilityScore, isValid, suggestedDays } = validation;

  const getFeasibilityLevel = () => {
    if (!isValid) return 'invalid';
    if (feasibilityScore >= 80) return 'excellent';
    if (feasibilityScore >= 60) return 'good';
    if (feasibilityScore >= 40) return 'fair';
    return 'poor';
  };

  const getFeasibilityColor = () => {
    const level = getFeasibilityLevel();
    switch (level) {
      case 'excellent': return 'text-green-700 bg-green-100 border-green-300';
      case 'good': return 'text-blue-700 bg-blue-100 border-blue-300';
      case 'fair': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'poor': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'invalid': return 'text-red-700 bg-red-100 border-red-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getFeasibilityIcon = () => {
    const level = getFeasibilityLevel();
    switch (level) {
      case 'excellent': return <CheckCircle className="h-4 w-4" />;
      case 'good': return <TrendingUp className="h-4 w-4" />;
      case 'fair': case 'poor': return <AlertTriangle className="h-4 w-4" />;
      case 'invalid': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getFeasibilityText = () => {
    const level = getFeasibilityLevel();
    switch (level) {
      case 'excellent': return 'Excellent Trip Plan';
      case 'good': return 'Good Trip Plan';
      case 'fair': return 'Acceptable Plan';
      case 'poor': return 'Challenging Plan';
      case 'invalid': return 'Plan Needs Adjustment';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`border rounded-lg p-3 ${getFeasibilityColor()} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getFeasibilityIcon()}
          <span className="font-semibold text-sm">{getFeasibilityText()}</span>
        </div>
        {isValid && (
          <span className="text-xs font-medium">
            {feasibilityScore}% feasible
          </span>
        )}
      </div>

      {/* Feasibility bar */}
      {isValid && (
        <div className="w-full bg-white/50 rounded-full h-2 mb-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${feasibilityScore}%`,
              backgroundColor: feasibilityScore >= 80 ? '#16a34a' :
                             feasibilityScore >= 60 ? '#2563eb' :
                             feasibilityScore >= 40 ? '#ca8a04' : '#ea580c'
            }}
          />
        </div>
      )}

      {/* Suggested days */}
      {suggestedDays && (
        <div className="text-xs">
          <strong>Suggested:</strong> {suggestedDays} days for optimal experience
        </div>
      )}
    </div>
  );
};

export default TripFeasibilityMeter;
