
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
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
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        {/* Header - Always Visible */}
        <div 
          className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={toggleExpanded}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-route66-primary bg-route66-accent-light px-2 py-1 rounded">
                Day {segment.day}
              </span>
              <span className="text-gray-300">•</span>
              <h5 className="text-sm font-semibold text-route66-text-primary">
                {segment.endCity}
              </h5>
            </div>
            
            <div className="flex items-center gap-2">
              {segmentDate && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {format(segmentDate, 'EEE, MMM d')}
                </div>
              )}
              
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        <div className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="p-4">
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
