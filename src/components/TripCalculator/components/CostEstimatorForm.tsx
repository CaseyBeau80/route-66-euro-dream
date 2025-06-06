
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CostEstimatorData } from '../types/costEstimator';
import { DollarSign, Car, Bed, Utensils, MapPin, Users, Home, CarIcon } from 'lucide-react';

interface CostEstimatorFormProps {
  costData: CostEstimatorData;
  setCostData: (data: CostEstimatorData) => void;
}

const CostEstimatorForm: React.FC<CostEstimatorFormProps> = ({ costData, setCostData }) => {
  const [tempGroupSize, setTempGroupSize] = useState(costData.groupSize.toString());
  const [tempRooms, setTempRooms] = useState(costData.numberOfRooms.toString());

  const handleGroupSizeBlur = () => {
    const value = parseInt(tempGroupSize);
    if (!isNaN(value) && value >= 1) {
      setCostData({ ...costData, groupSize: value });
    } else {
      setTempGroupSize(costData.groupSize.toString());
    }
  };

  const handleRoomsBlur = () => {
    const value = parseInt(tempRooms);
    if (!isNaN(value) && value >= 1) {
      setCostData({ ...costData, numberOfRooms: value });
    } else {
      setTempRooms(costData.numberOfRooms.toString());
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border border-green-200">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="h-6 w-6 text-green-600" />
        <h3 className="text-lg font-bold text-green-800">Cost Estimator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gas Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-green-600" />
            <Label className="font-semibold text-green-800">Vehicle & Gas</Label>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-green-700">Gas Price ($/gallon)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={costData.gasPrice}
                onChange={(e) => setCostData({ ...costData, gasPrice: parseFloat(e.target.value) || 0 })}
                className="border-green-300 focus:border-green-500"
                placeholder="3.50"
              />
            </div>
            
            <div>
              <Label className="text-sm text-green-700">Vehicle MPG</Label>
              <Input
                type="number"
                min="1"
                value={costData.mpg}
                onChange={(e) => setCostData({ ...costData, mpg: parseInt(e.target.value) || 0 })}
                className="border-green-300 focus:border-green-500"
                placeholder="25"
              />
            </div>
          </div>
        </div>

        {/* Group Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" />
            <Label className="font-semibold text-green-800">Group Settings</Label>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-green-700">Group Size</Label>
              <Input
                type="number"
                min="1"
                max="8"
                value={tempGroupSize}
                onChange={(e) => setTempGroupSize(e.target.value)}
                onBlur={handleGroupSizeBlur}
                className="border-green-300 focus:border-green-500"
                placeholder="2"
              />
            </div>
            
            <div>
              <Label className="text-sm text-green-700">Number of Rooms</Label>
              <Input
                type="number"
                min="1"
                max="4"
                value={tempRooms}
                onChange={(e) => setTempRooms(e.target.value)}
                onBlur={handleRoomsBlur}
                className="border-green-300 focus:border-green-500"
                placeholder="1"
              />
            </div>
          </div>
        </div>

        {/* Accommodation Budget */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-green-600" />
            <Label className="font-semibold text-green-800">Accommodation Budget</Label>
          </div>
          
          <Select 
            value={costData.motelBudget} 
            onValueChange={(value: 'budget' | 'mid-range' | 'luxury') => 
              setCostData({ ...costData, motelBudget: value })
            }
          >
            <SelectTrigger className="border-green-300 focus:border-green-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget ($65/night)</SelectItem>
              <SelectItem value="mid-range">Mid-Range ($120/night)</SelectItem>
              <SelectItem value="luxury">Luxury ($250/night)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Meal Budget */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-green-600" />
            <Label className="font-semibold text-green-800">Meal Budget</Label>
          </div>
          
          <Select 
            value={costData.mealBudget} 
            onValueChange={(value: 'budget' | 'mid-range' | 'fine-dining') => 
              setCostData({ ...costData, mealBudget: value })
            }
          >
            <SelectTrigger className="border-green-300 focus:border-green-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget ($45/day)</SelectItem>
              <SelectItem value="mid-range">Mid-Range ($85/day)</SelectItem>
              <SelectItem value="fine-dining">Fine Dining ($150/day)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Car Rental Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="car-rental"
            checked={costData.includeCarRental}
            onCheckedChange={(checked) => 
              setCostData({ ...costData, includeCarRental: !!checked })
            }
          />
          <div className="flex items-center gap-2">
            <CarIcon className="h-4 w-4 text-green-600" />
            <Label htmlFor="car-rental" className="font-semibold text-green-800">
              Include Car Rental
            </Label>
          </div>
        </div>

        {costData.includeCarRental && (
          <div className="ml-6 space-y-3">
            <div>
              <Label className="text-sm text-green-700">Car Type</Label>
              <Select 
                value={costData.carRentalType} 
                onValueChange={(value: 'economy' | 'compact' | 'mid-size' | 'full-size' | 'suv' | 'luxury') => 
                  setCostData({ ...costData, carRentalType: value })
                }
              >
                <SelectTrigger className="border-green-300 focus:border-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy ($35/day)</SelectItem>
                  <SelectItem value="compact">Compact ($42/day)</SelectItem>
                  <SelectItem value="mid-size">Mid-Size ($52/day)</SelectItem>
                  <SelectItem value="full-size">Full-Size ($65/day)</SelectItem>
                  <SelectItem value="suv">SUV ($78/day)</SelectItem>
                  <SelectItem value="luxury">Luxury ($125/day)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Optional Costs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-green-600" />
          <Label className="font-semibold text-green-800">Optional Expenses</Label>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="attractions"
              checked={costData.includeAttractions}
              onCheckedChange={(checked) => 
                setCostData({ ...costData, includeAttractions: !!checked })
              }
            />
            <Label htmlFor="attractions" className="text-sm text-green-700">
              Include attraction/entrance fees ($20-45/day)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tolls"
              checked={costData.includeTolls}
              onCheckedChange={(checked) => 
                setCostData({ ...costData, includeTolls: !!checked })
              }
            />
            <Label htmlFor="tolls" className="text-sm text-green-700">
              Include toll road costs ($0-15/day)
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostEstimatorForm;
