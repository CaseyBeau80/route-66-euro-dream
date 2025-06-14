
import React from 'react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Fuel, Bed, Utensils, Camera } from 'lucide-react';

interface CostTabContentProps {
  tripPlan: TripPlan;
  isVisible: boolean;
}

const CostTabContent: React.FC<CostTabContentProps> = ({
  tripPlan,
  isVisible
}) => {
  if (!isVisible) return null;

  // Basic cost estimates
  const totalMiles = tripPlan.totalDistance || 0;
  const estimatedGasCost = Math.round(totalMiles * 0.15); // ~$0.15 per mile
  const estimatedLodging = Math.round((tripPlan.segments?.length || 0) * 100); // ~$100 per night
  const estimatedFood = Math.round((tripPlan.segments?.length || 0) * 60); // ~$60 per day
  const estimatedTotal = estimatedGasCost + estimatedLodging + estimatedFood;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <DollarSign className="h-12 w-12 text-route66-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-route66-text-primary mb-2">
          Trip Cost Estimate
        </h3>
        <p className="text-route66-text-secondary mb-4">
          Estimated costs for your Route 66 adventure
        </p>
      </div>

      {/* Cost Summary */}
      <Card className="bg-gradient-to-r from-route66-primary to-route66-secondary text-white">
        <CardContent className="p-6 text-center">
          <h4 className="text-2xl font-bold mb-2">
            ${estimatedTotal.toLocaleString()}
          </h4>
          <p className="text-route66-cream">
            Total Estimated Cost ({tripPlan.segments?.length || 0} days)
          </p>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Fuel className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              ${estimatedGasCost}
            </div>
            <div className="text-sm text-gray-600">Fuel Costs</div>
            <div className="text-xs text-gray-500 mt-1">
              {totalMiles.toFixed(0)} miles @ $0.15/mile
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Bed className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              ${estimatedLodging}
            </div>
            <div className="text-sm text-gray-600">Lodging</div>
            <div className="text-xs text-gray-500 mt-1">
              {tripPlan.segments?.length || 0} nights @ $100/night
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Utensils className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              ${estimatedFood}
            </div>
            <div className="text-sm text-gray-600">Food & Dining</div>
            <div className="text-xs text-gray-500 mt-1">
              {tripPlan.segments?.length || 0} days @ $60/day
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Tips */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <h5 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Money-Saving Tips
          </h5>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>• Book accommodations in advance for better rates</li>
            <li>• Consider camping at state parks along the route</li>
            <li>• Try local diners and cafes for authentic meals at lower prices</li>
            <li>• Fill up at truck stops for competitive gas prices</li>
            <li>• Look for free attractions like historic sites and scenic viewpoints</li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-xs text-gray-500 text-center mt-4">
        * Estimates are based on average costs and may vary by season, location, and personal preferences
      </div>
    </div>
  );
};

export default CostTabContent;
