
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign, ChevronDown, ChevronUp, Calculator } from 'lucide-react';
import CostEstimatorForm from './CostEstimatorForm';
import { useCostEstimator } from '../hooks/useCostEstimator';
import { TripFormData } from '../types/tripCalculator';
import { TripPlan } from '../services/planning/TripPlanBuilder';

interface CostEstimatorSectionProps {
  formData: TripFormData;
  tripPlan?: TripPlan;
}

const CostEstimatorSection: React.FC<CostEstimatorSectionProps> = ({ formData, tripPlan }) => {
  const [showCostEstimator, setShowCostEstimator] = useState(true);
  
  const { costData, setCostData, costEstimate } = useCostEstimator(tripPlan);

  console.log('💰 CostEstimatorSection rendering:', {
    hasTripPlan: !!tripPlan,
    hasCostEstimate: !!costEstimate,
    showCostEstimator,
    totalCost: costEstimate?.breakdown?.totalCost
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Streamlined Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calculator className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Trip Cost Calculator</h3>
            <p className="text-sm text-blue-600">Estimate your Route 66 expenses</p>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => setShowCostEstimator(!showCostEstimator)}
          variant="outline"
          size="sm"
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <DollarSign className="mr-2 h-4 w-4" />
          {showCostEstimator ? 'Hide' : 'Show'}
          {showCostEstimator ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {/* Streamlined Cost Summary */}
      {costEstimate && tripPlan && (
        <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-blue-800">Estimated Trip Cost</h4>
            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {costData.groupSize} {costData.groupSize === 1 ? 'person' : 'people'}
            </div>
          </div>
          
          {/* Main Cost Display */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">
                {formatCurrency(costEstimate.breakdown.totalCost)}
              </div>
              <div className="text-sm text-blue-600">Total Cost</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">
                {formatCurrency(costEstimate.breakdown.totalCost / costData.groupSize)}
              </div>
              <div className="text-sm text-blue-600">Per Person</div>
            </div>
          </div>
          
          {/* Compact breakdown in a grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-semibold text-gray-800">{formatCurrency(costEstimate.breakdown.gasCost)}</div>
              <div className="text-xs text-gray-600">Gas</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-semibold text-gray-800">{formatCurrency(costEstimate.breakdown.accommodationCost)}</div>
              <div className="text-xs text-gray-600">Hotels</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-semibold text-gray-800">{formatCurrency(costEstimate.breakdown.mealCost)}</div>
              <div className="text-xs text-gray-600">Meals</div>
            </div>
            
            {/* Optional items on second row if they exist */}
            {costEstimate.breakdown.carRentalCost > 0 && (
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-semibold text-gray-800">{formatCurrency(costEstimate.breakdown.carRentalCost)}</div>
                <div className="text-xs text-gray-600">Car Rental</div>
              </div>
            )}
            {costEstimate.breakdown.attractionCost > 0 && (
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-semibold text-gray-800">{formatCurrency(costEstimate.breakdown.attractionCost)}</div>
                <div className="text-xs text-gray-600">Attractions</div>
              </div>
            )}
            {costEstimate.breakdown.tollCost > 0 && (
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-semibold text-gray-800">{formatCurrency(costEstimate.breakdown.tollCost)}</div>
                <div className="text-xs text-gray-600">Tolls</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cost Estimator Form */}
      {showCostEstimator && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <CostEstimatorForm 
            costData={costData}
            setCostData={setCostData}
          />
          
          {/* Message when no trip plan */}
          {!tripPlan && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700 text-center">
                Plan your trip first to see detailed cost estimates
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CostEstimatorSection;
