
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MapPin } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { getTripStyleInfo } from './utils/itineraryCardUtils';

interface ItineraryCardHeaderProps {
  tripPlan: TripPlan;
  tripStyle?: string;
}

const ItineraryCardHeader: React.FC<ItineraryCardHeaderProps> = ({
  tripPlan,
  tripStyle = 'balanced'
}) => {
  const tripStyleInfo = getTripStyleInfo(tripStyle);

  return (
    <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="flex items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5" aria-hidden="true" />
          <span>Your Route 66 Adventure</span>
        </CardTitle>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="secondary" 
                className={`${tripStyleInfo.color} font-medium`}
                aria-label={`Trip style: ${tripStyleInfo.label}`}
              >
                {tripStyleInfo.label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">{tripStyleInfo.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="mt-2">
        <p className="text-blue-100 text-sm font-medium">
          {tripPlan.startCity} → {tripPlan.endCity}
        </p>
      </div>
    </CardHeader>
  );
};

export default ItineraryCardHeader;
