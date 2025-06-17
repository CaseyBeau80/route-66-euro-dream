
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Car, Users, Bed, Utensils, MapPin, DollarSign } from 'lucide-react';
import { CostEstimatorData } from '../types/costEstimator';

interface CostEstimatorFormProps {
  costData: CostEstimatorData;
  setCostData: (data: CostEstimatorData) => void;
}

const CostEstimatorForm: React.FC<CostEstimatorFormProps> = ({
  costData,
  setCostData
}) => {
  // Auto-select Mid-Size car rental when toggle is enabled
  useEffect(() => {
    if (costData.includeCarRental && costData.carRentalType === 'compact') {
      setCostData({
        ...costData,
        carRentalType: 'full-size' // This corresponds to "Full-Size ($55/day)" in the UI
      });
    }
  }, [costData.includeCarRental, costData.carRentalType, setCostData]);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-blue-800">Cost Estimator</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle & Gas Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Car className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-blue-700">Vehicle & Gas</h4>
          </div>
          
          <div>
            <Label htmlFor="gasPrice" className="text-blue-700">Gas Price ($/gallon)</Label>
            <Input
              id="gasPrice"
              type="number"
              step="0.10"
              value={costData.gasPrice}
              onChange={(e) => setCostData({
                ...costData,
                gasPrice: parseFloat(e.target.value) || 0
              })}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          
          <div>
            <Label htmlFor="mpg" className="text-blue-700">Vehicle MPG</Label>
            <Input
              id="mpg"
              type="number"
              value={costData.mpg}
              onChange={(e) => setCostData({
                ...costData,
                mpg: parseInt(e.target.value) || 0
              })}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Group Settings Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-blue-700">Group Settings</h4>
          </div>
          
          <div>
            <Label htmlFor="groupSize" className="text-blue-700">Group Size</Label>
            <Input
              id="groupSize"
              type="number"
              min="1"
              value={costData.groupSize}
              onChange={(e) => setCostData({
                ...costData,
                groupSize: parseInt(e.target.value) || 1
              })}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          
          <div>
            <Label htmlFor="numberOfRooms" className="text-blue-700">Number of Rooms</Label>
            <Input
              id="numberOfRooms"
              type="number"
              min="1"
              value={costData.numberOfRooms}
              onChange={(e) => setCostData({
                ...costData,
                numberOfRooms: parseInt(e.target.value) || 1
              })}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Accommodation Budget */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Bed className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-blue-700">Accommodation Budget</h4>
        </div>
        <Select
          value={costData.motelBudget}
          onValueChange={(value: 'budget' | 'mid-range' | 'luxury') => setCostData({
            ...costData,
            motelBudget: value
          })}
        >
          <SelectTrigger className="border-blue-300 focus:border-blue-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="budget">Budget ($65-90/night)</SelectItem>
            <SelectItem value="mid-range">Mid-Range ($90-135/night)</SelectItem>
            <SelectItem value="luxury">Luxury ($135+/night)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Meal Budget */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Utensils className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-blue-700">Meal Budget</h4>
        </div>
        <Select
          value={costData.mealBudget}
          onValueChange={(value: 'budget' | 'midrange' | 'fine') => setCostData({
            ...costData,
            mealBudget: value
          })}
        >
          <SelectTrigger className="border-blue-300 focus:border-blue-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="budget">Budget ($40–55/day)</SelectItem>
            <SelectItem value="midrange">Mid-Range ($60–80/day)</SelectItem>
            <SelectItem value="fine">Fine Dining ($90+/day)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Car Rental Option */}
      <div className="mt-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeCarRental"
            checked={costData.includeCarRental}
            onCheckedChange={(checked) => setCostData({
              ...costData,
              includeCarRental: checked === true
            })}
          />
          <Label htmlFor="includeCarRental" className="text-blue-700">Include Car Rental</Label>
        </div>

        {costData.includeCarRental && (
          <div className="mt-3">
            <Label className="text-blue-700">Car Type</Label>
            <Select
              value={costData.carRentalType}
              onValueChange={(value: 'compact' | 'mid-size' | 'full-size' | 'suv') => setCostData({
                ...costData,
                carRentalType: value
              })}
            >
              <SelectTrigger className="border-blue-300 focus:border-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact ($35/day)</SelectItem>
                <SelectItem value="mid-size">Mid-Size ($45/day)</SelectItem>
                <SelectItem value="full-size">Full-Size ($55/day)</SelectItem>
                <SelectItem value="suv">SUV ($70/day)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Optional Expenses */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-blue-700">Optional Expenses</h4>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeAttractions"
              checked={costData.includeAttractions}
              onCheckedChange={(checked) => setCostData({
                ...costData,
                includeAttractions: checked === true
              })}
            />
            <Label htmlFor="includeAttractions" className="text-blue-700">
              Include attraction/entrance fees ($20-45/day)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeTolls"
              checked={costData.includeTolls}
              onCheckedChange={(checked) => setCostData({
                ...costData,
                includeTolls: checked === true
              })}
            />
            <Label htmlFor="includeTolls" className="text-blue-700">
              Include toll road costs ($0-15/day)
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostEstimatorForm;
