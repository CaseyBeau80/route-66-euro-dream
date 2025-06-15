
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import CostEstimatorForm from './CostEstimatorForm';
import { useCostEstimator } from '../hooks/useCostEstimator';
import { TripFormData } from '../types/tripCalculator';
import { TripPlan } from '../services/planning/TripPlanBuilder';

interface CostEstimatorSectionProps {
  formData: TripFormData;
  tripPlan?: TripPlan;
}

const CostEstimatorSection: React.FC<CostEstimatorSectionProps> = ({ formData, tripPlan }) => {
  const [showCostEstimator, setShowCostEstimator] = useState(true); // Default to open
  
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-800">Trip Cost Calculator</h3>
        <Button
          type="button"
          onClick={() => setShowCostEstimator(!showCostEstimator)}
          variant="outline"
          size="sm"
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <DollarSign className="mr-2 h-4 w-4" />
          {showCostEstimator ? 'Hide Calculator' : 'Show Calculator'}
          {showCostEstimator ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {/* Cost Summary - Always visible when there's an estimate */}
      {costEstimate && tripPlan && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-3">Estimated Trip Cost</h4>
          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div>
              <span className="text-blue-700">Total Cost:</span>
              <span className="font-bold text-blue-800 ml-2 text-lg">
                {formatCurrency(costEstimate.breakdown.totalCost)}
              </span>
            </div>
            <div>
              <span className="text-blue-700">Per Person:</span>
              <span className="font-bold text-blue-800 ml-2 text-lg">
                {formatCurrency(costEstimate.breakdown.totalCost / costData.groupSize)}
              </span>
            </div>
          </div>
          
          {/* Detailed breakdown */}
          <div className="pt-3 border-t border-blue-200">
            <div className="grid grid-cols-3 gap-2 text-xs text-blue-600">
              <div>Gas: {formatCurrency(costEstimate.breakdown.gasCost)}</div>
              <div>Hotels: {formatCurrency(costEstimate.breakdown.accommodationCost)}</div>
              <div>Meals: {formatCurrency(costEstimate.breakdown.mealCost)}</div>
              {costEstimate.breakdown.carRentalCost > 0 && (
                <div>Car Rental: {formatCurrency(costEstimate.breakdown.carRentalCost)}</div>
              )}
              {costEstimate.breakdown.attractionCost > 0 && (
                <div>Attractions: {formatCurrency(costEstimate.breakdown.attractionCost)}</div>
              )}
              {costEstimate.breakdown.tollCost > 0 && (
                <div>Tolls: {formatCurrency(costEstimate.breakdown.tollCost)}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cost Estimator Form */}
      {showCostEstimator && (
        <div className="space-y-4">
          <CostEstimatorForm 
            costData={costData}
            setCostData={setCostData}
          />
          
          {/* Message when no trip plan */}
          {!tripPlan && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 text-center">
                Plan your trip first to see cost estimates
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CostEstimatorSection;
