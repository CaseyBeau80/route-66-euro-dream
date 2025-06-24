
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { Clock, MapPin } from 'lucide-react';
import { useStableSegment } from '../hooks/useStableSegments';
import { DriveTimeStyleCalculator } from '../services/planning/DriveTimeStyleCalculator';
import DaySegmentCardHeader from './DaySegmentCardHeader';
import DaySegmentCardContent from './DaySegmentCardContent';
import SegmentWeatherWidget from './SegmentWeatherWidget';
import ErrorBoundary from './ErrorBoundary';

interface DaySegmentCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
  showWeather?: boolean;
  forceShowAttractions?: boolean;
  isCompact?: boolean;
}

const DaySegmentCard: React.FC<DaySegmentCardProps> = ({
  segment,
  tripStartDate,
  cardIndex = 0,
  tripId,
  sectionKey = 'default',
  showWeather = true,
  forceShowAttractions = false,
  isCompact = false
}) => {
  const stableSegment = useStableSegment(segment);
  
  // Ensure we have valid drive time data
  const driveTimeHours = stableSegment?.driveTimeHours || stableSegment?.drivingTime || 0;
  const distance = stableSegment?.distance || stableSegment?.approximateMiles || 0;
  
  const driveTimeStyle = DriveTimeStyleCalculator.getStyle(driveTimeHours);
  
  // Detect if we're in the split-screen compact mode
  const isInCompactMode = isCompact || sectionKey?.includes('compact');
  
  console.log('🗂️ DaySegmentCard render:', {
    day: stableSegment?.day,
    endCity: stableSegment?.endCity,
    driveTimeHours,
    distance,
    isInCompactMode,
    sectionKey,
    showWeather
  });

  if (!stableSegment) {
    return (
      <div className="bg-white border border-route66-border rounded-lg p-4">
        <div className="text-center text-gray-500">
          <p>Loading segment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border-2 border-route66-border rounded-lg shadow-lg overflow-hidden ${isInCompactMode ? 'shadow-sm' : ''}`}>
      <ErrorBoundary context={`DaySegmentCard-Header-${stableSegment.day}`}>
        <DaySegmentCardHeader 
          segment={stableSegment} 
          tripStartDate={tripStartDate}
          cardIndex={cardIndex}
          isCompact={isInCompactMode}
        />
      </ErrorBoundary>

      {/* Drive Time and Distance Stats */}
      <div className={`px-4 py-${isInCompactMode ? '2' : '3'} bg-route66-cream border-b border-route66-border`}>
        <div className="grid grid-cols-2 gap-4">
          {/* Distance Display */}
          <div className={`text-center p-${isInCompactMode ? '2' : '3'} bg-white rounded border border-route66-tan`}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <MapPin className={`${isInCompactMode ? 'h-3 w-3' : 'h-4 w-4'} text-route66-primary`} />
            </div>
            <div className={`font-route66 ${isInCompactMode ? 'text-base' : 'text-lg'} text-route66-vintage-red mb-1`}>
              {Math.round(distance)} miles
            </div>
            <div className={`font-travel ${isInCompactMode ? 'text-xs' : 'text-xs'} text-route66-vintage-brown`}>
              Total Distance
            </div>
          </div>
          
          {/* Drive Time Display */}
          <div className={`text-center p-${isInCompactMode ? '2' : '3'} bg-white rounded border border-route66-tan`}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className={`${isInCompactMode ? 'h-3 w-3' : 'h-4 w-4'} text-route66-primary`} />
            </div>
            <div className={`font-route66 ${isInCompactMode ? 'text-base' : 'text-lg'} mb-1 ${driveTimeHours > 7 ? driveTimeStyle.text : 'text-route66-vintage-red'}`}>
              {DriveTimeStyleCalculator.formatDriveTime(driveTimeHours)}
            </div>
            <div className={`font-travel ${isInCompactMode ? 'text-xs' : 'text-xs'} text-route66-vintage-brown`}>
              Drive Time
            </div>
            {driveTimeHours > 7 && (
              <div className={`${isInCompactMode ? 'text-xs' : 'text-xs'} text-orange-600 font-semibold mt-1 bg-orange-50 px-2 py-1 rounded`}>
                ⚠️ Long Drive
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weather Widget - Only show in full mode */}
      {showWeather && !isInCompactMode && (
        <ErrorBoundary context={`DaySegmentCard-Weather-${stableSegment.day}`}>
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-200">
            <SegmentWeatherWidget 
              segment={stableSegment} 
              tripStartDate={tripStartDate}
            />
          </div>
        </ErrorBoundary>
      )}

      {/* Main Content */}
      <ErrorBoundary context={`DaySegmentCard-Content-${stableSegment.day}`}>
        <DaySegmentCardContent 
          segment={stableSegment}
          driveTimeStyle={driveTimeStyle}
          forceShowAttractions={forceShowAttractions}
          isCompact={isInCompactMode}
        />
      </ErrorBoundary>
    </div>
  );
};

export default DaySegmentCard;
