
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from '../SegmentWeatherWidget';
import ErrorBoundary from '../ErrorBoundary';

interface CollapsibleWeatherCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
  defaultExpanded?: boolean;
}

const CollapsibleWeatherCard: React.FC<CollapsibleWeatherCardProps> = ({
  segment,
  tripStartDate,
  cardIndex = 0,
  tripId,
  sectionKey = 'weather-tab',
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const segmentDate = tripStartDate 
    ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000)
    : null;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <ErrorBoundary context={`CollapsibleWeatherCard-Day${segment.day}`}>
      <div className="bg-blue-50/80 rounded-lg border border-blue-100/60 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm">
        {/* Header - Always Visible */}
        <div 
          className="p-4 border-b border-blue-100/40 cursor-pointer hover:bg-blue-100/40 transition-colors rounded-t-lg"
          onClick={toggleExpanded}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-medium border-route66-border text-blue-700">
                Day {segment.day}
              </Badge>
              <span className="text-blue-300">•</span>
              <h5 className="text-sm font-semibold text-blue-800">
                {segment.endCity}
              </h5>
            </div>
            
            <div className="flex items-center gap-2">
              {segmentDate && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Calendar className="h-3 w-3" />
                  {format(segmentDate, 'EEE, MMM d')}
                </div>
              )}
              
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-blue-600 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 text-blue-600 transition-transform duration-200" />
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        <div className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="p-4 bg-blue-25/30 rounded-b-lg">
            <SegmentWeatherWidget
              segment={segment}
              tripStartDate={tripStartDate}
              cardIndex={cardIndex}
              tripId={tripId}
              sectionKey={sectionKey}
              forceExpanded={true}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CollapsibleWeatherCard;
