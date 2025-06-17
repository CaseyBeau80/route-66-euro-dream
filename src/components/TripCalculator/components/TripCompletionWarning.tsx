
import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { TripCompletionAnalysis } from '../services/planning/TripCompletionService';

interface TripCompletionWarningProps {
  analysis: TripCompletionAnalysis;
  originalRequestedDays: number;
}

const TripCompletionWarning: React.FC<TripCompletionWarningProps> = ({
  analysis,
  originalRequestedDays
}) => {
  if (!analysis.isCompleted && analysis.duplicateSegments.length === 0) {
    return null;
  }

  const getWarningStyle = () => {
    if (analysis.duplicateSegments.length > 0) {
      return {
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-800',
        icon: AlertTriangle,
        iconColor: 'text-amber-600'
      };
    }

    if (analysis.unusedDays > 2) {
      return {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        icon: Info,
        iconColor: 'text-blue-600'
      };
    }

    return {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    };
  };

  const style = getWarningStyle();
  const Icon = style.icon;

  const getTitle = () => {
    if (analysis.duplicateSegments.length > 0) {
      return '⚠️ Trip Optimized - Duplicate Stops Removed';
    }
    if (analysis.unusedDays > 0) {
      return '✅ Trip Completed Early';
    }
    return '✅ Trip Optimized';
  };

  const getMessage = () => {
    if (analysis.redistributionSuggestion) {
      return analysis.redistributionSuggestion.message;
    }

    return `Your Route 66 journey has been optimized to ${analysis.totalUsefulDays} days. ${
      analysis.unusedDays > 0 
        ? `The remaining ${analysis.unusedDays} days were not needed and have been removed to avoid duplicate or empty stops.`
        : 'All days include meaningful progression along Route 66.'
    }`;
  };

  return (
    <div className={`${style.bgColor} border ${style.borderColor} rounded-lg p-4 mb-4`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 ${style.iconColor} mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <h4 className={`font-medium ${style.textColor} mb-1`}>
            {getTitle()}
          </h4>
          <p className={`text-sm ${style.textColor} mb-2`}>
            {getMessage()}
          </p>
          
          {/* Additional details */}
          <div className={`text-xs ${style.textColor} space-y-1`}>
            <div className="flex items-center gap-4">
              <span>📅 Optimized Duration: <strong>{analysis.totalUsefulDays} days</strong></span>
              {analysis.unusedDays > 0 && (
                <span>🗑️ Removed: <strong>{analysis.unusedDays} unused days</strong></span>
              )}
              {analysis.duplicateSegments.length > 0 && (
                <span>🔄 Fixed: <strong>{analysis.duplicateSegments.length} duplicate segments</strong></span>
              )}
            </div>
            
            {originalRequestedDays !== analysis.totalUsefulDays && (
              <div className="mt-2 pt-2 border-t border-current/20">
                <span>
                  🎯 <strong>Originally requested:</strong> {originalRequestedDays} days → 
                  <strong> Delivered:</strong> {analysis.totalUsefulDays} days for optimal Route 66 experience
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCompletionWarning;
