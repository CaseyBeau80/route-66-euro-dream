
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Map, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SegmentMapView from './SegmentMapView';
import SegmentDetailsBreakdown from './SegmentDetailsBreakdown';

interface SegmentActionButtonsProps {
  segment: DailySegment;
  isMapExpanded: boolean;
  setIsMapExpanded: (expanded: boolean) => void;
  isDetailsExpanded: boolean;
  setIsDetailsExpanded: (expanded: boolean) => void;
}

const SegmentActionButtons: React.FC<SegmentActionButtonsProps> = ({
  segment,
  isMapExpanded,
  setIsMapExpanded,
  isDetailsExpanded,
  setIsDetailsExpanded
}) => {
  return (
    <div className="space-y-4">
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Collapsible open={isMapExpanded} onOpenChange={setIsMapExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              View Route Map
              {isMapExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <SegmentMapView segment={segment} isExpanded={isMapExpanded} />
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
