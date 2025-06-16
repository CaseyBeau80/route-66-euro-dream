
import React from 'react';
import { AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react';
import { TravelDayValidator } from '../services/validation/TravelDayValidator';
import { TripStyleLogic } from '../services/planning/TripStyleLogic';

interface TripStyleHelperMessageProps {
  startLocation: string;
  endLocation: string;
  actualDays: number;
  tripStyle: 'balanced' | 'destination-focused';
}

const TripStyleHelperMessage: React.FC<TripStyleHelperMessageProps> = ({
  startLocation,
  endLocation,
  actualDays,
  tripStyle
}) => {
  const styleConfig = TripStyleLogic.getStyleConfig(tripStyle);
  const validation = TravelDayValidator.validateTravelDays(
    startLocation,
    endLocation,
    actualDays,
    styleConfig
  );

  if (validation.isValid && validation.issues.length === 0) {
    return (
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-2">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">
              Perfect! Your {actualDays}-day {tripStyle} trip looks great.
            </p>
            <p className="text-xs text-green-700 mt-1">
              Daily driving time will be comfortable at ~{validation.currentDays > 0 ? (validation.currentDays * 50 / actualDays).toFixed(1) : '0'} hours per day.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasIssues = validation.issues.length > 0;
  const hasRecommendations = validation.recommendations.length > 0;

  return (
    <div className={`mt-4 p-3 border rounded-lg ${
      hasIssues 
        ? 'bg-red-50 border-red-200' 
        : 'bg-amber-50 border-amber-200'
    }`}>
      <div className="flex items-start gap-2">
        <AlertTriangle className={`h-5 w-5 mt-0.5 ${
          hasIssues ? 'text-red-600' : 'text-amber-600'
        }`} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${
            hasIssues ? 'text-red-800' : 'text-amber-800'
          }`}>
            {hasIssues ? 'Trip Planning Issues' : 'Trip Optimization Suggestions'}
          </p>
          
          {/* Show issues */}
          {validation.issues.map((issue, index) => (
            <p key={index} className={`text-xs mt-1 ${
              hasIssues ? 'text-red-700' : 'text-amber-700'
            }`}>
              • {issue}
            </p>
          ))}
          
          {/* Show recommendations */}
          {validation.recommendations.map((rec, index) => (
            <p key={index} className={`text-xs mt-1 ${
              hasIssues ? 'text-red-700' : 'text-amber-700'
            }`}>
              💡 {rec}
            </p>
          ))}
          
          {/* Show specific guidance */}
          <div className="mt-2 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Min: {validation.minDaysRequired} days</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Style: {tripStyle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripStyleHelperMessage;
