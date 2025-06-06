
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useUnits } from '@/contexts/UnitContext';
import { UnitSystem } from '@/types/units';

const UnitSelector: React.FC = () => {
  const { preferences, setUnitSystem } = useUnits();

  const handleUnitChange = (value: UnitSystem) => {
    setUnitSystem(value);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-route66-text-primary">
          Preferred Units:
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-route66-text-secondary hover:text-route66-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Choose your preferred unit system for distances, speeds, and temperatures throughout your trip plan</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <RadioGroup
        value={preferences.system}
        onValueChange={handleUnitChange}
        className="flex gap-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="imperial" id="imperial" />
          <Label htmlFor="imperial" className="text-sm cursor-pointer">
            Imperial (miles, °F)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="metric" id="metric" />
          <Label htmlFor="metric" className="text-sm cursor-pointer">
            Metric (km, °C)
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default UnitSelector;
