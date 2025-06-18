
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CostEstimate } from '../types/costEstimator';
import { DollarSign, Car, Bed, Utensils, MapPin, CreditCard, Users, CarIcon } from 'lucide-react';

interface CostBreakdownDisplayProps {
  costEstimate: CostEstimate;
  groupSize: number;
}

const CostBreakdownDisplay: React.FC<CostBreakdownDisplayProps> = ({ costEstimate, groupSize }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const { breakdown, dailyCosts, perPersonCost, averageDailyCost } = costEstimate;

  return (
    <div className="space-y-6">
      {/* Total Cost Summary */}
      <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Total Trip Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{formatCurrency(breakdown.totalCost)}</div>
              <div className="text-sm opacity-90">Total Cost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatCurrency(perPersonCost)}</div>
              <div className="text-sm opacity-90">Per Person</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatCurrency(averageDailyCost)}</div>
              <div className="text-sm opacity-90">Avg. Per Day</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown - FIXED: Single row layout with horizontal scroll on mobile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg min-w-[200px] flex-shrink-0">
              <Car className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-blue-800 truncate">Gas Costs</div>
                <div className="text-xl font-bold text-blue-700">
                  {formatCurrency(breakdown.gasCost)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg min-w-[200px] flex-shrink-0">
              <Bed className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-semibent text-blue-800 truncate">Hotels</div>
                <div className="text-xl font-bold text-blue-700">
                  {formatCurrency(breakdown.accommodationCost)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg min-w-[200px] flex-shrink-0">
              <Utensils className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-blue-800 truncate">Meals</div>
                <div className="text-xl font-bold text-blue-700">
                  {formatCurrency(breakdown.mealCost)}
                </div>
              </div>
            </div>

            {breakdown.carRentalCost > 0 && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg min-w-[200px] flex-shrink-0">
                <CarIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-blue-800 truncate">Car Rental</div>
                  <div className="text-xl font-bold text-blue-700">
                    {formatCurrency(breakdown.carRentalCost)}
                  </div>
                </div>
              </div>
            )}

            {breakdown.attractionCost > 0 && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg min-w-[200px] flex-shrink-0">
                <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-blue-800 truncate">Attractions</div>
                  <div className="text-xl font-bold text-blue-700">
                    {formatCurrency(breakdown.attractionCost)}
                  </div>
                </div>
              </div>
            )}

            {breakdown.tollCost > 0 && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg min-w-[200px] flex-shrink-0">
                <CreditCard className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibent text-blue-800 truncate">Tolls</div>
                  <div className="text-xl font-bold text-blue-700">
                    {formatCurrency(breakdown.tollCost)}
                  </div>
                </div>
              </div>
            )}

            {groupSize > 1 && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg min-w-[200px] flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-blue-800 truncate">Group Size</div>
                  <div className="text-xl font-bold text-blue-700">
                    {groupSize} people
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dailyCosts.map((day) => (
              <div key={day.day} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50 rounded-lg gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">Day {day.day} - {day.city}</div>
                  <div className="text-sm text-blue-600 flex flex-wrap gap-2 sm:gap-4 mt-1">
                    <span className="whitespace-nowrap">Gas: {formatCurrency(day.gas)}</span>
                    {day.accommodation > 0 && <span className="whitespace-nowrap">Hotel: {formatCurrency(day.accommodation)}</span>}
                    <span className="whitespace-nowrap">Meals: {formatCurrency(day.meals)}</span>
                    {day.carRental > 0 && <span className="whitespace-nowrap">Car Rental: {formatCurrency(day.carRental)}</span>}
                    {day.attractions > 0 && <span className="whitespace-nowrap">Attractions: {formatCurrency(day.attractions)}</span>}
                    {day.tolls > 0 && <span className="whitespace-nowrap">Tolls: {formatCurrency(day.tolls)}</span>}
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-600 text-right sm:text-left">
                  {formatCurrency(day.dailyTotal)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostBreakdownDisplay;
