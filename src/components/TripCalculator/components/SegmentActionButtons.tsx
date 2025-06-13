
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Cloud, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from './SegmentWeatherWidget';
import SegmentDetailsBreakdown from './SegmentDetailsBreakdown';

interface SegmentActionButtonsProps {
  segment: DailySegment;
  isMapExpanded: boolean;
  setIsMapExpanded: (expanded: boolean) => void;
  isDetailsExpanded: boolean;
  setIsDetailsExpanded: (expanded: boolean) => void;
  tripStartDate?: Date;
}

const SegmentActionButtons: React.FC<SegmentActionButtonsProps> = ({
  segment,
  isMapExpanded: isWeatherExpanded,
  setIsMapExpanded: setIsWeatherExpanded,
  isDetailsExpanded,
  setIsDetailsExpanded,
  tripStartDate
}) => {
  console.log('📅 SegmentActionButtons received tripStartDate:', tripStartDate);

  return (
    <div className="space-y-4">
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Collapsible open={isWeatherExpanded} onOpenChange={setIsWeatherExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Weather Forecast
              {isWeatherExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <SegmentWeatherWidget segment={segment} tripStartDate={tripStartDate} />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isDetailsExpanded} onOpenChange={setIsDetailsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Detailed Breakdown
              {isDetailsExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <SegmentDetailsBreakdown segment={segment} isExpanded={isDetailsExpanded} />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default SegmentActionButtons;
