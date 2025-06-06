
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Gauge } from 'lucide-react';
import { useUnits } from '@/contexts/UnitContext';
import { UnitSystem } from '@/types/units';

interface UnitToggleProps {
  variant?: 'button' | 'compact';
  className?: string;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ 
  variant = 'button',
  className = '' 
}) => {
  const { preferences, setUnitSystem } = useUnits();

  const toggleUnits = () => {
    const newSystem: UnitSystem = preferences.system === 'imperial' ? 'metric' : 'imperial';
    setUnitSystem(newSystem);
  };

  const isMetric = preferences.system === 'metric';

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleUnits}
              className={`h-8 px-2 text-xs font-mono border ${
                isMetric 
                  ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100' 
                  : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
              } ${className}`}
              aria-label={`Switch to ${isMetric ? 'Imperial' : 'Metric'} units`}
            >
              <Gauge className="h-3 w-3 mr-1" />
              {isMetric ? 'KM' : 'MI'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Currently: {isMetric ? 'Metric' : 'Imperial'} 
              <br />
              Click to switch to {isMetric ? 'Imperial (miles, °F)' : 'Metric (km, °C)'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isMetric ? "default" : "outline"}
            onClick={toggleUnits}
            className={`flex items-center gap-2 ${className}`}
            aria-label={`Switch to ${isMetric ? 'Imperial' : 'Metric'} units`}
          >
            <Gauge className="h-4 w-4" />
            <span className="font-medium">
              {isMetric ? 'Metric' : 'Imperial'}
            </span>
            <span className="text-xs opacity-75">
              ({isMetric ? 'km, °C' : 'mi, °F'})
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Click to switch to {isMetric ? 'Imperial (miles, °F)' : 'Metric (kilometers, °C)'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UnitToggle;
