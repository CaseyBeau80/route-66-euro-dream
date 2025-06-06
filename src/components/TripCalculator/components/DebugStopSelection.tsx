
import React, { useState } from 'react';
import { Bug, ChevronDown, ChevronRight } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { getValidatedStops, isUserRelevantStop } from './utils/stopValidation';

interface DebugStopSelectionProps {
  segment: DailySegment;
}

const DebugStopSelection: React.FC<DebugStopSelectionProps> = ({ segment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }
  
  const validStops = getValidatedStops(segment);
  const userRelevantStops = validStops.filter(isUserRelevantStop);
  const filteredOutStops = validStops.filter(stop => !isUserRelevantStop(stop));
  
  return (
    <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-300 text-xs">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <Bug className="h-3 w-3" />
        <span>Debug Stop Selection</span>
        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>
      
      {isExpanded && (
        <div className="mt-2 space-y-2">
          <div>
            <strong>Segment:</strong> {segment.startCity} → {segment.endCity} (Day {segment.day})
          </div>
          
          <div>
            <strong>Raw Data Sources:</strong>
            <ul className="ml-2">
              <li>• recommendedStops: {segment.recommendedStops?.length || 0}</li>
              <li>• attractions: {segment.attractions?.length || 0}</li>
            </ul>
          </div>
          
          <div>
            <strong>Validation Results:</strong>
            <ul className="ml-2">
              <li>• Total validated: {validStops.length}</li>
              <li>• User-relevant: {userRelevantStops.length}</li>
              <li>• Filtered out: {filteredOutStops.length}</li>
            </ul>
          </div>
          
          {userRelevantStops.length > 0 && (
            <div>
              <strong>User-Relevant Stops:</strong>
              <ul className="ml-2">
                {userRelevantStops.map((stop, index) => (
                  <li key={index}>• {stop.name} ({stop.category})</li>
                ))}
              </ul>
            </div>
          )}
          
          {filteredOutStops.length > 0 && (
            <div>
              <strong>Filtered Out Stops:</strong>
              <ul className="ml-2">
                {filteredOutStops.map((stop, index) => (
                  <li key={index}>• {stop.name} ({stop.category})</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="text-red-600">
            <strong>Recommendations:</strong>
            {userRelevantStops.length === 0 && (
              <div>• No stops found - check data sources and category filtering</div>
            )}
            {userRelevantStops.length < 2 && (
              <div>• Very few stops - consider expanding search criteria</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugStopSelection;
