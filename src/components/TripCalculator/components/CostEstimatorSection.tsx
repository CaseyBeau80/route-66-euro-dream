
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
  const [showCostEstimator, setShowCostEstimator] = useState(false);
  
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
    <div className="space-y-6">
      {/* Header Section - Matching Preview Style */}
      <div className="bg-white border border-route66-border rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-route66-primary to-route66-primary-light">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-route66">Trip Cost Calculator</h3>
              <p className="text-route66-cream text-sm font-travel">Estimate your Route 66 expenses</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setShowCostEstimator(!showCostEstimator)}
            variant="outline"
            size="lg"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30 font-semibold"
          >
            <DollarSign className="mr-2 h-5 w-5" />
            {showCostEstimator ? 'Hide Calculator' : 'Show Calculator'}
            {showCostEstimator ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}
          </Button>
        </div>

        {/* Cost Summary - Always Visible When Trip Plan Exists */}
        {costEstimate && tripPlan && (
          <div className="p-6 bg-route66-vintage-white border-t border-route66-border">
            {/* Trip Summary Header */}
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-route66-vintage-red font-route66">
                🛣️ Trip Cost Summary
              </h4>
              <div className="text-xs font-semibold text-route66-primary bg-route66-cream px-3 py-1 rounded-full border border-route66-border">
                {costData.groupSize} {costData.groupSize === 1 ? 'Traveler' : 'Travelers'}
              </div>
            </div>
            
            {/* Main Cost Display Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Total Cost Card */}
              <div className="bg-gradient-to-br from-route66-primary to-route66-primary-dark p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <h5 className="font-bold font-route66">Total Trip Cost</h5>
                </div>
                <div className="text-3xl font-bold mb-1 font-route66">
                  {formatCurrency(costEstimate.breakdown.totalCost)}
                </div>
                <div className="text-sm text-route66-cream font-travel">
                  Complete Route 66 adventure
                </div>
              </div>

              {/* Per Person Card */}
              <div className="bg-gradient-to-br from-route66-accent-gold to-route66-orange-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <h5 className="font-bold font-route66">Per Person Cost</h5>
                </div>
                <div className="text-3xl font-bold mb-1 font-route66">
                  {formatCurrency(costEstimate.breakdown.totalCost / costData.groupSize)}
                </div>
                <div className="text-sm text-white/90 font-travel">
                  Split between {costData.groupSize} {costData.groupSize === 1 ? 'person' : 'people'}
                </div>
              </div>
            </div>
            
            {/* Cost Breakdown Grid - Preview Style */}
            <div className="bg-route66-cream p-5 rounded-xl border border-route66-tan">
              <h5 className="font-bold text-route66-vintage-red mb-4 font-route66 text-center">
                💰 Cost Breakdown
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-route66-border shadow-sm">
                  <div className="text-lg font-bold text-route66-primary font-route66">
                    {formatCurrency(costEstimate.breakdown.gasCost)}
                  </div>
                  <div className="text-xs text-route66-vintage-brown font-travel mt-1">⛽ Fuel</div>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border border-route66-border shadow-sm">
                  <div className="text-lg font-bold text-route66-primary font-route66">
                    {formatCurrency(costEstimate.breakdown.accommodationCost)}
                  </div>
                  <div className="text-xs text-route66-vintage-brown font-travel mt-1">🏨 Lodging</div>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border border-route66-border shadow-sm">
                  <div className="text-lg font-bold text-route66-primary font-route66">
                    {formatCurrency(costEstimate.breakdown.mealCost)}
                  </div>
                  <div className="text-xs text-route66-vintage-brown font-travel mt-1">🍔 Meals</div>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border border-route66-border shadow-sm">
                  <div className="text-lg font-bold text-route66-primary font-route66">
                    {formatCurrency(costEstimate.breakdown.attractionCost)}
                  </div>
                  <div className="text-xs text-route66-vintage-brown font-travel mt-1">🎯 Attractions</div>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border border-route66-border shadow-sm">
                  <div className="text-lg font-bold text-route66-primary font-route66">
                    {formatCurrency(costEstimate.breakdown.carRentalCost)}
                  </div>
                  <div className="text-xs text-route66-vintage-brown font-travel mt-1">🚗 Car Rental</div>
                </div>
              </div>
              
              {/* Additional costs if they exist */}
              {costEstimate.breakdown.tollCost > 0 && (
                <div className="mt-4 pt-4 border-t border-route66-tan">
                  <div className="text-center p-3 bg-white rounded-lg border border-route66-border shadow-sm max-w-xs mx-auto">
                    <div className="text-lg font-bold text-route66-primary font-route66">
                      {formatCurrency(costEstimate.breakdown.tollCost)}
                    </div>
                    <div className="text-xs text-route66-vintage-brown font-travel mt-1">💰 Tolls & Fees</div>
                  </div>
                </div>
              )}
            </div>

            {/* Cost Calculation Info */}
            <div className="mt-4 p-4 bg-route66-vintage-yellow rounded-lg border border-route66-tan">
              <p className="text-sm text-route66-navy text-center font-travel">
                <strong>📊 Cost estimates</strong> are based on current market rates and your selected preferences. 
                Actual costs may vary depending on season, location, and personal choices.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Cost Estimator Form - Collapsible */}
      {showCostEstimator && (
        <div className="bg-white border border-route66-border rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h4 className="text-lg font-bold text-route66-vintage-red font-route66 mb-2">
              🔧 Customize Your Cost Estimate
            </h4>
            <p className="text-sm text-route66-vintage-brown font-travel">
              Adjust the parameters below to get a personalized cost estimate for your Route 66 adventure.
            </p>
          </div>
          
          <CostEstimatorForm 
            costData={costData}
            setCostData={setCostData}
          />
          
          {/* Message when no trip plan */}
          {!tripPlan && (
            <div className="mt-6 p-4 bg-route66-cream border border-route66-tan rounded-lg">
              <div className="text-center">
                <Calculator className="h-8 w-8 text-route66-primary mx-auto mb-3" />
                <p className="text-route66-vintage-brown font-travel font-medium">
                  Plan your Route 66 trip first to see detailed cost estimates
                </p>
                <p className="text-xs text-route66-vintage-brown font-travel mt-1">
                  Use the trip planner above to create your itinerary
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CostEstimatorSection;
