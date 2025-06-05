
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Route66Town } from '@/types/route66';
import { TripFormData } from './types/tripCalculator';
import { Calculator, Loader2 } from 'lucide-react';

interface TripCalculatorFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
  onCalculate: () => void;
  availableEndLocations: Route66Town[];
  isCalculateDisabled: boolean;
  isCalculating?: boolean;
}

const TripCalculatorForm: React.FC<TripCalculatorFormProps> = ({
  formData,
  setFormData,
  onCalculate,
  availableEndLocations,
  isCalculateDisabled,
  isCalculating = false
}) => {
  const route66Towns = [
    { latLng: [41.8781, -87.6298] as [number, number], name: "Chicago, IL" },
    { latLng: [41.5250, -88.0817] as [number, number], name: "Joliet, IL" },
    { latLng: [39.8317, -89.6501] as [number, number], name: "Springfield, IL" },
    { latLng: [38.6272, -90.1978] as [number, number], name: "St. Louis, MO" },
    { latLng: [37.2090, -93.2923] as [number, number], name: "Springfield, MO" },
    { latLng: [37.0947, -94.5133] as [number, number], name: "Joplin, MO" },
    { latLng: [36.1540, -95.9928] as [number, number], name: "Tulsa, OK" },
    { latLng: [35.4676, -97.5164] as [number, number], name: "Oklahoma City, OK" },
    { latLng: [35.2220, -101.8313] as [number, number], name: "Amarillo, TX" },
    { latLng: [35.1677, -103.7044] as [number, number], name: "Tucumcari, NM" },
    { latLng: [35.0844, -106.6504] as [number, number], name: "Albuquerque, NM" },
    { latLng: [35.5280, -108.7426] as [number, number], name: "Gallup, NM" },
    { latLng: [35.1983, -111.6513] as [number, number], name: "Flagstaff, AZ" },
    { latLng: [35.1894, -114.0530] as [number, number], name: "Kingman, AZ" },
    { latLng: [34.9983, -117.1858] as [number, number], name: "Barstow, CA" },
    { latLng: [34.0529, -117.1822] as [number, number], name: "San Bernardino, CA" },
    { latLng: [34.0099, -118.4960] as [number, number], name: "Santa Monica, CA" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Location */}
        <div className="space-y-2">
          <Label htmlFor="start-location" className="text-route66-vintage-brown font-travel font-bold">
            Starting City
          </Label>
          <Select 
            value={formData.startLocation} 
            onValueChange={(value) => setFormData({ ...formData, startLocation: value, endLocation: '' })}
          >
            <SelectTrigger className="border-route66-tan focus:border-route66-orange">
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

        {/* End Location */}
        <div className="space-y-2">
          <Label htmlFor="end-location" className="text-route66-vintage-brown font-travel font-bold">
            Destination City
          </Label>
          <Select 
            value={formData.endLocation} 
            onValueChange={(value) => setFormData({ ...formData, endLocation: value })}
            disabled={!formData.startLocation}
          >
            <SelectTrigger className="border-route66-tan focus:border-route66-orange">
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

      {/* Travel Days */}
      <div className="space-y-2">
        <Label className="text-route66-vintage-brown font-travel font-bold">
          Trip Duration: {formData.travelDays || 0} {formData.travelDays === 1 ? 'day' : 'days'}
        </Label>
        <div className="px-3">
          <Input
            type="number"
            min="1"
            max="30"
            value={formData.travelDays || ''}
            onChange={(e) => {
              const days = parseInt(e.target.value) || 0;
              setFormData({ ...formData, travelDays: days });
            }}
            placeholder="Enter number of days (1-30)"
            className="border-route66-tan focus:border-route66-orange"
          />
        </div>
        <p className="text-sm text-route66-vintage-brown font-travel px-3">
          How many days do you want to spend on your Route 66 adventure?
        </p>
      </div>

      {/* Calculate Button */}
      <div className="pt-4">
        <Button 
          onClick={onCalculate}
          disabled={isCalculateDisabled || isCalculating}
          className="w-full bg-route66-red hover:bg-route66-orange text-white font-route66 text-lg py-6 transition-all duration-300"
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Planning Your Route 66 Adventure...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-5 w-5" />
              Plan My Route 66 Trip
            </>
          )}
        </Button>
      </div>

      <div className="bg-route66-vintage-yellow p-4 rounded-lg border border-route66-tan">
        <p className="text-sm text-route66-navy font-travel text-center">
          🚗 <strong>Smart Planning:</strong> Our planner uses real Route 66 attractions, hidden gems, 
          and historic stops from our database to create an authentic road trip experience!
        </p>
      </div>
    </div>
  );
};

export default TripCalculatorForm;
