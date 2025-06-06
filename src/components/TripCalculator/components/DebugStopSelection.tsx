
import React, { useState, useEffect, useMemo } from 'react';
import { Bug, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { ErrorHandlingService } from '../services/error/ErrorHandlingService';
import { DataValidationService } from '../services/validation/DataValidationService';
import { getValidatedStops, isUserRelevantStop } from './utils/stopValidation';
import ErrorBoundary from './ErrorBoundary';

interface DebugStopSelectionProps {
  segment: DailySegment;
}

interface ValidationResults {
  validStops: any[];
  userRelevantStops: any[];
  filteredOutStops: any[];
  rawDataSources: {
    recommendedStops: number;
    attractions: number;
  };
}

const DebugStopSelection: React.FC<DebugStopSelectionProps> = ({ segment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [debugError, setDebugError] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResults>({
    validStops: [],
    userRelevantStops: [],
    filteredOutStops: [],
    rawDataSources: {
      recommendedStops: 0,
      attractions: 0
    }
  });
  
  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  // Validate segment before processing - memoized to prevent recalculation
  const isValidSegment = useMemo(() => {
    return DataValidationService.validateDailySegment(segment, 'DebugStopSelection');
  }, [segment]);

  // Move validation logic to useEffect to prevent render-phase state updates
  useEffect(() => {
    if (!isValidSegment) {
      setValidationResults({
        validStops: [],
        userRelevantStops: [],
        filteredOutStops: [],
        rawDataSources: {
          recommendedStops: 0,
          attractions: 0
        }
      });
      setDebugError('Invalid segment data');
      return;
    }

    try {
      console.log('🔍 DEBUG: Starting validation for segment:', segment.day);
      
      let validStops: any[] = [];
      let userRelevantStops: any[] = [];
      let filteredOutStops: any[] = [];
      
      try {
        validStops = getValidatedStops(segment) || [];
        console.log('✅ DEBUG: Got validated stops:', validStops.length);
      } catch (stopError) {
        console.error('❌ DEBUG: Error getting validated stops:', stopError);
        ErrorHandlingService.logError(stopError as Error, 'DebugStopSelection.getValidatedStops');
        validStops = [];
      }

      // Filter user-relevant stops with error handling
      try {
        userRelevantStops = validStops.filter(stop => {
          try {
            return isUserRelevantStop(stop);
          } catch (filterError) {
            console.error('❌ DEBUG: Error filtering stop:', stop, filterError);
            return false;
          }
        });
        
        filteredOutStops = validStops.filter(stop => {
          try {
            return !isUserRelevantStop(stop);
          } catch (filterError) {
            console.error('❌ DEBUG: Error filtering out stop:', stop, filterError);
            return true; // Include in filtered out if we can't determine
          }
        });
        
        console.log('✅ DEBUG: Filtered stops:', {
          userRelevant: userRelevantStops.length,
          filteredOut: filteredOutStops.length
        });
      } catch (filteringError) {
        console.error('❌ DEBUG: Error during stop filtering:', filteringError);
        userRelevantStops = [];
        filteredOutStops = validStops;
      }

      // Get raw data sources safely
      const rawDataSources = {
        recommendedStops: (segment.recommendedStops && Array.isArray(segment.recommendedStops)) 
          ? segment.recommendedStops.length 
          : 0,
        attractions: (segment.attractions && Array.isArray(segment.attractions)) 
          ? segment.attractions.length 
          : 0
      };

      setValidationResults({
        validStops,
        userRelevantStops,
        filteredOutStops,
        rawDataSources
      });
      
      setDebugError(null); // Clear error on success
      
    } catch (error) {
      console.error('❌ DEBUG: Critical error in validation:', error);
      ErrorHandlingService.logError(error as Error, 'DebugStopSelection.useEffect');
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
      setDebugError(errorMessage);
      
      // Set fallback data
      setValidationResults({
        validStops: [],
        userRelevantStops: [],
        filteredOutStops: [],
        rawDataSources: {
          recommendedStops: 0,
          attractions: 0
        }
      });
    }
  }, [segment, isValidSegment]);

  if (!isValidSegment) {
    return (
      <div className="mt-4 p-3 bg-red-100 rounded-lg border border-red-300 text-xs">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-3 w-3" />
          <span>Debug: Invalid segment data</span>
        </div>
      </div>
    );
  }

  const { validStops, userRelevantStops, filteredOutStops, rawDataSources } = validationResults;

  // Safe rendering function
  const renderStopList = (stops: any[], label: string) => {
    try {
      if (!Array.isArray(stops) || stops.length === 0) {
        return <li>• No {label.toLowerCase()}</li>;
      }

      return stops.map((stop, index) => {
        try {
          const stopName = (stop && typeof stop === 'object' && stop.name) 
            ? stop.name 
            : (typeof stop === 'string' ? stop : `Unknown Stop ${index + 1}`);
          const stopCategory = (stop && typeof stop === 'object' && stop.category) 
            ? stop.category 
            : 'unknown';
          
          return (
            <li key={`${label}-${index}`}>
              • {stopName} ({stopCategory})
            </li>
          );
        } catch (renderError) {
          console.error('❌ DEBUG: Error rendering stop:', stop, renderError);
          return (
            <li key={`${label}-error-${index}`}>
              • Error rendering stop {index + 1}
            </li>
          );
        }
      });
    } catch (listError) {
      console.error('❌ DEBUG: Error rendering stop list:', listError);
      return <li>• Error rendering {label.toLowerCase()}</li>;
    }
  };
  
  return (
    <ErrorBoundary context="DebugStopSelection" fallback={
      <div className="mt-4 p-3 bg-red-100 rounded-lg border border-red-300 text-xs">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-3 w-3" />
          <span>Debug component failed to load</span>
        </div>
      </div>
    }>
      <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-300 text-xs">
        <button
          onClick={() => {
            try {
              setIsExpanded(!isExpanded);
            } catch (error) {
              console.error('❌ DEBUG: Error toggling expanded state:', error);
            }
          }}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <Bug className="h-3 w-3" />
          <span>Debug Stop Selection {debugError && '(Error)'}</span>
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
        
        {isExpanded && (
          <div className="mt-2 space-y-2">
            {debugError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700">
                <strong>Error:</strong> {debugError}
              </div>
            )}
            
            <div>
              <strong>Segment:</strong> {segment.startCity || 'Unknown'} → {segment.endCity || 'Unknown'} (Day {segment.day || 'Unknown'})
            </div>
            
            <div>
              <strong>Raw Data Sources:</strong>
              <ul className="ml-2">
                <li>• recommendedStops: {rawDataSources.recommendedStops}</li>
                <li>• attractions: {rawDataSources.attractions}</li>
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
                  {renderStopList(userRelevantStops, 'User-Relevant')}
                </ul>
              </div>
            )}
            
            {filteredOutStops.length > 0 && (
              <div>
                <strong>Filtered Out Stops:</strong>
                <ul className="ml-2">
                  {renderStopList(filteredOutStops, 'Filtered')}
                </ul>
              </div>
            )}
            
            <div className="text-red-600">
              <strong>Recommendations:</strong>
              {userRelevantStops.length === 0 && (
                <div>• No stops found - check data sources and category filtering</div>
              )}
              {userRelevantStops.length < 2 && userRelevantStops.length > 0 && (
                <div>• Very few stops - consider expanding search criteria</div>
              )}
              {debugError && (
                <div>• Component error detected - check console for details</div>
              )}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default DebugStopSelection;
