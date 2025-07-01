
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

const CostEstimatorSection: React.FC<CostEstimatorSectionProps> = ({
  formData,
  tripPlan
}) => {
  const [showCostEstimator, setShowCostEstimator] = useState(false);
  
  const {
    estimates,
    loading,
    error,
    generateEstimates,
    clearEstimates
  } = useCostEstimator(formData, tripPlan);

  const handleToggleCostEstimator = () => {
    setShowCostEstimator(!showCostEstimator);
    
    if (!showCostEstimator && !estimates) {
      generateEstimates();
    }
  };

  return (
    <div className="w-full">
      {/* Simplified Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-route66-text-secondary">
            Get an estimated budget for your Route 66 adventure
          </p>
        </div>
        <Button
          type="button"
          onClick={handleToggleCostEstimator}
          variant="outline"
          className="border-orange-300 hover:bg-orange-50 hover:border-orange-400 text-orange-700 font-medium"
        >
          <Calculator className="mr-2 h-4 w-4" />
          {showCostEstimator ? 'Hide' : 'Show'} Calculator
          {showCostEstimator ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {/* Cost Summary - Only show when we have estimates */}
      {estimates && !showCostEstimator && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-gray-800">Estimated Budget</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-700">
                ${estimates.total.min.toLocaleString()} - ${estimates.total.max.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                For {formData.travelDays} days • {estimates.travelers} traveler{estimates.travelers > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cost Estimator Form */}
      {showCostEstimator && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <CostEstimatorForm
            formData={formData}
            tripPlan={tripPlan}
            onEstimatesGenerated={(newEstimates) => {
              // Handle the estimates if needed
              console.log('Cost estimates generated:', newEstimates);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CostEstimatorSection;
