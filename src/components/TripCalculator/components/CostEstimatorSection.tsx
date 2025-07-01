
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign, ChevronDown, ChevronUp, Calculator, Sparkles } from 'lucide-react';
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
    <div className="w-full">
      {/* Enhanced Toggle Button */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <p className="text-sm text-route66-text-secondary mb-4">
            Get an estimated budget for your Route 66 adventure
          </p>
        </div>
        
        {/* Big, Captivating Show Calculator Button */}
        <div className="relative">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-xl opacity-20 animate-pulse blur-lg"></div>
          
          {/* Main button container */}
          <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 p-1 rounded-xl shadow-xl">
            <Button
              type="button"
              onClick={() => setShowCostEstimator(!showCostEstimator)}
              className="w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 text-white py-6 text-lg font-bold rounded-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border-0"
            >
              <Calculator className="h-6 w-6 animate-bounce" />
              <span className="bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent font-black tracking-wide">
                {showCostEstimator ? 'Hide Budget Calculator' : 'Show Budget Calculator'}
              </span>
              <Sparkles className="h-6 w-6 animate-pulse text-yellow-300" />
              {showCostEstimator ? 
                <ChevronUp className="ml-2 h-6 w-6 animate-bounce" /> : 
                <ChevronDown className="ml-2 h-6 w-6 animate-bounce" />
              }
            </Button>
          </div>
          
          {/* Floating sparkle effects */}
          {!showCostEstimator && (
            <>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
        </div>

        {/* Call-to-action text below button */}
        <div className="text-center">
          <p className="text-base font-semibold text-orange-600 animate-pulse">
            💰 Plan Your Route 66 Budget! 💰
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Free estimates • Fuel, hotels, meals & attractions
          </p>
        </div>
      </div>

      {/* Cost Summary - Only show when we have estimates */}
      {costEstimate && tripPlan && (
        <div className="mb-6">
          {/* Main Cost Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Total Cost Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Total Trip Cost</h4>
                  <div className="text-2xl font-bold">
                    {formatCurrency(costEstimate.breakdown.totalCost)}
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-white/70" />
              </div>
            </div>

            {/* Per Person Card */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Per Person Cost</h4>
                  <div className="text-2xl font-bold">
                    {formatCurrency(costEstimate.breakdown.totalCost / costData.groupSize)}
                  </div>
                  <div className="text-xs text-white/80">
                    Split between {costData.groupSize} {costData.groupSize === 1 ? 'person' : 'people'}
                  </div>
                </div>
                <Calculator className="h-8 w-8 text-white/70" />
              </div>
            </div>
          </div>
          
          {/* Cost Breakdown */}
          <div className="bg-route66-background-alt p-4 rounded-lg border border-route66-border">
            <h5 className="font-semibold text-route66-text-primary mb-3 text-center">Cost Breakdown</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="text-center p-3 bg-white rounded border border-route66-border">
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(costEstimate.breakdown.gasCost)}
                </div>
                <div className="text-xs text-route66-text-secondary">⛽ Fuel</div>
              </div>
              
              <div className="text-center p-3 bg-white rounded border border-route66-border">
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(costEstimate.breakdown.accommodationCost)}
                </div>
                <div className="text-xs text-route66-text-secondary">🏨 Lodging</div>
              </div>
              
              <div className="text-center p-3 bg-white rounded border border-route66-border">
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(costEstimate.breakdown.mealCost)}
                </div>
                <div className="text-xs text-route66-text-secondary">🍔 Meals</div>
              </div>
              
              <div className="text-center p-3 bg-white rounded border border-route66-border">
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(costEstimate.breakdown.attractionCost)}
                </div>
                <div className="text-xs text-route66-text-secondary">🎯 Attractions</div>
              </div>
              
              <div className="text-center p-3 bg-white rounded border border-route66-border">
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(costEstimate.breakdown.carRentalCost)}
                </div>
                <div className="text-xs text-route66-text-secondary">🚗 Car Rental</div>
              </div>
            </div>
            
            {/* Additional costs if they exist */}
            {costEstimate.breakdown.tollCost > 0 && (
              <div className="mt-3 flex justify-center">
                <div className="text-center p-3 bg-white rounded border border-route66-border">
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(costEstimate.breakdown.tollCost)}
                  </div>
                  <div className="text-xs text-route66-text-secondary">💰 Tolls & Fees</div>
                </div>
              </div>
            )}
          </div>

          {/* Info Note */}
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-700 text-center">
              <strong>📊 Estimates</strong> based on current rates and your preferences. Actual costs may vary.
            </p>
          </div>
        </div>
      )}

      {/* Cost Estimator Form - Collapsible */}
      {showCostEstimator && (
        <div className="border-t border-route66-border pt-6">
          <div className="mb-4">
            <h4 className="text-md font-semibold text-route66-text-primary mb-1">
              Customize Your Cost Estimate
            </h4>
            <p className="text-sm text-route66-text-secondary">
              Adjust parameters below for a personalized estimate
            </p>
          </div>
          
          <CostEstimatorForm 
            costData={costData}
            setCostData={setCostData}
          />
          
          {/* Message when no trip plan */}
          {!tripPlan && (
            <div className="mt-4 p-4 bg-route66-background-alt border border-route66-border rounded-lg">
              <div className="text-center">
                <Calculator className="h-6 w-6 text-route66-text-secondary mx-auto mb-2" />
                <p className="text-route66-text-primary text-sm font-medium">
                  Plan your Route 66 trip first to see detailed cost estimates
                </p>
                <p className="text-xs text-route66-text-secondary mt-1">
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
