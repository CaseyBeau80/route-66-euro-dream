
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { TripCompletionAnalysis } from '../services/planning/TripCompletionService';

interface TripCompletionCardProps {
  analysis: TripCompletionAnalysis;
  originalRequestedDays?: number;
}

const TripCompletionCard: React.FC<TripCompletionCardProps> = ({ 
  analysis, 
  originalRequestedDays 
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          {analysis.isCompleted ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          )}
          Trip Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trip Adjustment Info */}
        {analysis.isCompleted && (
          <div className="p-3 bg-yellow-100 border border-yellow-300 rounded">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Trip Optimized</span>
            </div>
            <p className="text-sm text-yellow-700">
              Adjusted from {originalRequestedDays || analysis.originalDays} to {analysis.optimizedDays} days. 
              {analysis.adjustmentReason && ` Reason: ${analysis.adjustmentReason}`}
            </p>
          </div>
        )}

        {/* Quality Metrics */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Quality Metrics
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-sm">
              <span className="text-gray-600">Drive Time Balance:</span>
              <span className={`ml-2 font-medium ${getQualityColor(analysis.qualityMetrics.driveTimeBalance)}`}>
                {analysis.qualityMetrics.driveTimeBalance}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Route Efficiency:</span>
              <span className={`ml-2 font-medium ${getQualityColor(analysis.qualityMetrics.routeEfficiency)}`}>
                {analysis.qualityMetrics.routeEfficiency}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Attraction Coverage:</span>
              <span className={`ml-2 font-medium ${getQualityColor(analysis.qualityMetrics.attractionCoverage)}`}>
                {analysis.qualityMetrics.attractionCoverage}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Overall Score:</span>
              <span className={`ml-2 font-medium ${getConfidenceColor(analysis.qualityMetrics.overallScore)}`}>
                {(analysis.qualityMetrics.overallScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Confidence */}
        <div className="text-sm">
          <span className="text-gray-600">Planning Confidence:</span>
          <span className={`ml-2 font-medium ${getConfidenceColor(analysis.confidence)}`}>
            {(analysis.confidence * 100).toFixed(0)}%
          </span>
        </div>

        {/* Recommendations */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Recommendations</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TripCompletionCard;
