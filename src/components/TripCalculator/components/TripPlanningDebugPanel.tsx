
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Bug, AlertTriangle, CheckCircle } from 'lucide-react';

interface DebugInfo {
  originalRequest: any;
  constraints: any;
  steps: Array<{
    step: string;
    [key: string]: any;
  }>;
}

interface TripPlanningDebugPanelProps {
  debugInfo?: DebugInfo;
  validationResults?: any;
  warnings?: string[];
  isVisible?: boolean;
}

const TripPlanningDebugPanel: React.FC<TripPlanningDebugPanelProps> = ({
  debugInfo,
  validationResults,
  warnings = [],
  isVisible = false
}) => {
  const [isExpanded, setIsExpanded] = useState(isVisible);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  if (!debugInfo) {
    return null;
  }

  const getStepIcon = (step: any) => {
    if (step.step === 'finalValidation' && !step.isValid) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    if (step.rejectedStops?.length > 0 || step.rejectedDestinations?.length > 0) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const formatStepData = (step: any) => {
    const { step: stepName, ...data } = step;
    return JSON.stringify(data, null, 2);
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg text-blue-800">Trip Planning Debug Panel</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        
        {warnings.length > 0 && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Warnings ({warnings.length})</span>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              {warnings.map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Original Request */}
          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-gray-800 mb-2">Original Request</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>
                <span className="font-medium">Start:</span> {debugInfo.originalRequest.startLocation}
              </div>
              <div>
                <span className="font-medium">End:</span> {debugInfo.originalRequest.endLocation}
              </div>
              <div>
                <span className="font-medium">Days:</span> {debugInfo.originalRequest.requestedDays}
              </div>
              <div>
                <span className="font-medium">Style:</span> {debugInfo.originalRequest.tripStyle}
              </div>
            </div>
          </div>

          {/* Constraints */}
          <div className="p-3 bg-white rounded border">
            <h4 className="font-semibold text-gray-800 mb-2">Drive Time Constraints</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="font-medium">Max Daily Hours:</span> {debugInfo.constraints.maxDailyHours}
              </div>
              <div>
                <span className="font-medium">Max Distance:</span> {debugInfo.constraints.maxSegmentDistance}mi
              </div>
              <div>
                <span className="font-medium">Enforcement:</span> {debugInfo.constraints.enforcementLevel}
              </div>
            </div>
          </div>

          {/* Planning Steps */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Planning Steps</h4>
            {debugInfo.steps.map((step, index) => (
              <div key={index} className="border rounded overflow-hidden">
                <button
                  onClick={() => setActiveStep(activeStep === step.step ? null : step.step)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {getStepIcon(step)}
                    <span className="font-medium capitalize">{step.step.replace(/([A-Z])/g, ' $1')}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeStep === step.step ? 'rotate-180' : ''}`} />
                </button>
                
                {activeStep === step.step && (
                  <div className="p-3 bg-white border-t">
                    <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
                      {formatStepData(step)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Validation Results */}
          {validationResults && (
            <div className="p-3 bg-white rounded border">
              <h4 className="font-semibold text-gray-800 mb-2">Final Validation Results</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {validationResults.driveTimeValidation?.isValid ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span>Drive Time Validation: {validationResults.driveTimeValidation?.isValid ? 'PASSED' : 'FAILED'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {validationResults.sequenceValidation?.isValid ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span>Sequence Validation: {validationResults.sequenceValidation?.isValid ? 'PASSED' : 'FAILED'}</span>
                </div>
                
                {validationResults.sequenceValidation?.backtrackingSegments > 0 && (
                  <div className="text-red-600">
                    ⚠️ {validationResults.sequenceValidation.backtrackingSegments} backtracking segments detected
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default TripPlanningDebugPanel;
