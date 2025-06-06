
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
  const [showCostEstimator, setShowCostEstimator] = useState(false);
  
  const { costData, setCostData, costEstimate } = useCostEstimator(tripPlan);

  return (
    <div className="space-y-4">
      <Button
        type="button"
        onClick={() => setShowCostEstimator(!showCostEstimator)}
        variant="outline"
        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
      >
        <DollarSign className="mr-2 h-4 w-4" />
        Cost Estimator (Optional)
        {showCostEstimator ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
      </Button>

      {/* Cost Estimator Form */}
      {showCostEstimator && (
        <div className="space-y-4">
          <CostEstimatorForm 
            costData={costData}
            setCostData={setCostData}
          />
          
          {/* Cost Preview */}
          {costEstimate && formData.travelDays > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Estimated Trip Cost</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Total Cost:</span>
                  <span className="font-bold text-blue-800 ml-2">
                    ${costEstimate.breakdown.totalCost.toFixed(0)}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Per Person:</span>
                  <span className="font-bold text-blue-800 ml-2">
                    ${(costEstimate.breakdown.totalCost / costData.groupSize).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CostEstimatorSection;
