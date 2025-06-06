
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import CostEstimatorForm from './CostEstimatorForm';
import { useCostEstimator } from '../hooks/useCostEstimator';
import { TripFormData } from '../types/tripCalculator';
import { TripPlan } from '../services/planning/TripPlanBuilder';

interface CostEstimatorSectionProps {
  formData: TripFormData;
}

const CostEstimatorSection: React.FC<CostEstimatorSectionProps> = ({ formData }) => {
  const [showCostEstimator, setShowCostEstimator] = useState(false);
  
  // Create a complete mock trip plan for cost estimation
  const mockTripPlan: TripPlan = {
    id: `trip-${Math.random().toString(36).substring(2, 9)}`,
    title: `${formData.startLocation} to ${formData.endLocation} Road Trip`,
    startCity: formData.startLocation,
    endCity: formData.endLocation,
    startDate: formData.tripStartDate || new Date(),
    totalDays: formData.travelDays,
    totalDistance: formData.travelDays * 300, // Estimate based on days
    totalDrivingTime: formData.travelDays * 6, // Estimate 6 hours per day
    dailySegments: Array.from({ length: formData.travelDays }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}`,
      startCity: i === 0 ? formData.startLocation : `Stop ${i}`,
      endCity: i === formData.travelDays - 1 ? formData.endLocation : `Stop ${i + 1}`,
      approximateMiles: 300,
      driveTimeHours: 6,
      distance: 300,
      drivingTime: 6
    })),
    segments: Array.from({ length: formData.travelDays }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}`,
      startCity: i === 0 ? formData.startLocation : `Stop ${i}`,
      endCity: i === formData.travelDays - 1 ? formData.endLocation : `Stop ${i + 1}`,
      approximateMiles: 300,
      driveTimeHours: 6,
      distance: 300,
      drivingTime: 6
    })),
    driveTimeBalance: {
      isBalanced: true,
      averageDriveTime: 6,
      balanceQuality: "good"
    }
  };

  const { costData, setCostData, costEstimate } = useCostEstimator(mockTripPlan);

  return (
    <div className="space-y-4">
      <Button
        type="button"
        onClick={() => setShowCostEstimator(!showCostEstimator)}
        variant="outline"
        className="w-full border-green-300 text-green-700 hover:bg-green-50"
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
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Estimated Trip Cost</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700">Total Cost:</span>
                  <span className="font-bold text-green-800 ml-2">
                    ${costEstimate.breakdown.totalCost.toFixed(0)}
                  </span>
                </div>
                <div>
                  <span className="text-green-700">Per Person:</span>
                  <span className="font-bold text-green-800 ml-2">
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
