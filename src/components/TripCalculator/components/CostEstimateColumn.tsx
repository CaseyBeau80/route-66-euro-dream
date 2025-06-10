
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { DollarSign } from 'lucide-react';
import { useStableSegments } from '../hooks/useStableSegments';
import ErrorBoundary from './ErrorBoundary';

interface CostEstimateColumnProps {
  segments: DailySegment[];
}

const CostEstimateColumn: React.FC<CostEstimateColumnProps> = ({ segments }) => {
  const stableSegments = useStableSegments(segments);

  console.log('💰 CostEstimateColumn render:', {
    segmentsCount: stableSegments.length
  });

  // Calculate estimated costs per segment
  const calculateDailyCosts = (segment: DailySegment) => {
    const gasPrice = 3.50; // Average gas price per gallon
    const mpg = 25; // Average miles per gallon
    const gasCost = (segment.distance / mpg) * gasPrice;
    
    const foodCost = 50; // Estimated daily food cost
    const lodgingCost = segment.day === stableSegments.length ? 0 : 120; // No lodging on last day
    const attractionsCost = (segment.recommendedStops?.length || 0) * 15; // Estimated per attraction
    
    return {
      gas: gasCost,
      food: foodCost,
      lodging: lodgingCost,
      attractions: attractionsCost,
      total: gasCost + foodCost + lodgingCost + attractionsCost
    };
  };

  const totalTripCost = stableSegments.reduce((total, segment) => {
    const costs = calculateDailyCosts(segment);
    return total + costs.total;
  }, 0);

  return (
    <>
      {/* Column Label */}
      <div className="mb-3">
        <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
          Cost Estimates
        </h4>
      </div>
      
      {/* Total Cost Summary */}
      <div className="bg-route66-primary text-white rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-5 w-5" />
          <span className="font-semibold">Total Trip Cost</span>
        </div>
        <div className="text-2xl font-bold">
          ${Math.round(totalTripCost).toLocaleString()}
        </div>
        <div className="text-xs opacity-90 mt-1">
          Estimated for {stableSegments.length} days
        </div>
      </div>
      
      {/* Daily Cost Breakdown */}
      <div className="space-y-4">
        {stableSegments.map((segment, index) => {
          const costs = calculateDailyCosts(segment);
          
          return (
            <ErrorBoundary key={`cost-segment-${segment.day}-${index}`} context={`CostEstimateColumn-Segment-${index}`}>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-route66-primary bg-route66-accent-light px-2 py-1 rounded">
                        Day {segment.day}
                      </span>
                      <span className="text-gray-300">•</span>
                      <h5 className="text-sm font-semibold text-route66-text-primary">
                        {segment.endCity}
                      </h5>
                    </div>
                    <span className="text-lg font-bold text-route66-primary">
                      ${Math.round(costs.total)}
                    </span>
                  </div>
                </div>
                
                {/* Cost Breakdown */}
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">⛽ Gas ({Math.round(segment.distance)} mi)</span>
                      <span className="font-medium">${costs.gas.toFixed(0)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">🍽️ Food</span>
                      <span className="font-medium">${costs.food.toFixed(0)}</span>
                    </div>
                    {costs.lodging > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">🏨 Lodging</span>
                        <span className="font-medium">${costs.lodging.toFixed(0)}</span>
                      </div>
                    )}
                    {costs.attractions > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">🎯 Attractions ({segment.recommendedStops?.length || 0})</span>
                        <span className="font-medium">${costs.attractions.toFixed(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ErrorBoundary>
          );
        })}
      </div>

      {/* Cost Disclaimer */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          💡 <strong>Note:</strong> These are estimated costs based on average prices. 
          Actual costs may vary depending on your preferences, seasonal pricing, and location.
        </p>
      </div>
    </>
  );
};

export default CostEstimateColumn;
