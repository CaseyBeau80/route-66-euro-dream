
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Clock, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TripFormData } from './types/tripCalculator';
import { route66Towns } from '@/types/route66';
import CostEstimatorForm from './components/CostEstimatorForm';
import { useCostEstimator } from './hooks/useCostEstimator';

interface TripCalculatorFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
  onCalculate: () => void;
  availableEndLocations: typeof route66Towns;
  isCalculateDisabled: boolean;
  isCalculating: boolean;
}

const TripCalculatorForm: React.FC<TripCalculatorFormProps> = ({
  formData,
  setFormData,
  onCalculate,
  availableEndLocations,
  isCalculateDisabled,
  isCalculating
}) => {
  const [showCostEstimator, setShowCostEstimator] = useState(false);
  
  // Create a mock trip plan for cost estimation
  const mockTripPlan = {
    totalDistance: formData.travelDays * 300, // Estimate based on days
    dailySegments: Array.from({ length: formData.travelDays }, (_, i) => ({
      day: i + 1,
      distance: 300,
      drivingTime: 6
    }))
  };

  const { costData, setCostData, costEstimate } = useCostEstimator(mockTripPlan);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-lg">
          Start Planning Your Trip
        </Button>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Starting City */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Starting City</Label>
          <Select 
            value={formData.startLocation} 
            onValueChange={(value) => setFormData({ ...formData, startLocation: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose your starting point" />
            </SelectTrigger>
            <SelectContent>
              {route66Towns.map((town) => (
                <SelectItem key={town.name} value={town.name}>
                  {town.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Destination City */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Destination City</Label>
          <Select 
            value={formData.endLocation} 
            onValueChange={(value) => setFormData({ ...formData, endLocation: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose your destination" />
            </SelectTrigger>
            <SelectContent>
              {availableEndLocations.map((town) => (
                <SelectItem key={town.name} value={town.name}>
                  {town.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Trip Start Date */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Trip Start Date (Optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.tripStartDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.tripStartDate ? format(formData.tripStartDate, "PPP") : "Pick a start date for weather forecasts"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.tripStartDate}
              onSelect={(date) => setFormData({ ...formData, tripStartDate: date })}
              disabled={(date) => date < new Date()}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-gray-600">
          Set a start date to see accurate weather forecasts for each day of your trip
        </p>
      </div>

      {/* Trip Duration */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Trip Duration: {formData.travelDays} days</Label>
        <Input
          type="number"
          min="1"
          max="30"
          value={formData.travelDays || ''}
          onChange={(e) => setFormData({ ...formData, travelDays: parseInt(e.target.value) || 0 })}
          placeholder="Enter number of days (1-30)"
          className="w-full"
        />
        <p className="text-xs text-blue-600">
          How many days do you want to spend on your Route 66 adventure?
        </p>
      </div>

      {/* Cost Estimator Toggle */}
      <div className="space-y-4">
        <Button
          type="button"
          onClick={() => setShowCostEstimator(!showCostEstimator)}
          variant="outline"
          className="w-full border-green-300 text-green-700 hover:bg-green-50"
        >
          <DollarSign className="mr-2 h-4 w-4" />
          Cost Estimator (Optional Module)
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

      {/* Plan Button */}
      <Button
        onClick={onCalculate}
        disabled={isCalculateDisabled || isCalculating}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <MapPin className="h-5 w-5" />
        {isCalculating ? 'Planning Your Route 66 Trip...' : 'Plan My Route 66 Trip'}
      </Button>

      {/* Smart Planning Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-blue-800 mb-2">
          <MapPin className="h-5 w-5" />
          <span className="font-semibold">Smart Planning:</span>
        </div>
        <p className="text-sm text-blue-700">
          Our planner uses real Route 66 attractions, hidden gems, and historic stops from our database to create an 
          authentic road trip experience!
        </p>
      </div>
    </div>
  );
};

export default TripCalculatorForm;
