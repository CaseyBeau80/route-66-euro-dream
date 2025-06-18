
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from './SegmentWeatherWidget';
import ErrorBoundary from './ErrorBoundary';
import DaySegmentCardHeader from './DaySegmentCardHeader';
import DaySegmentCardStats from './DaySegmentCardStats';

interface DaySegmentCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
  forceExpanded?: boolean;
  isCollapsible?: boolean;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const DaySegmentCard: React.FC<DaySegmentCardProps> = ({
  segment,
  tripStartDate,
  cardIndex = 0,
  tripId,
  sectionKey = 'default',
  forceExpanded = false,
  isCollapsible = true,
  isSharedView = false,
  isPDFExport = false
}) => {
  // Calculate segment date
  const segmentDate = tripStartDate ? 
    new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000) : 
    undefined;

  // Determine drive time styling based on hours
  const getDriveTimeStyle = (hours: number) => {
    if (hours <= 4) return { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' };
    if (hours <= 6) return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' };
    if (hours <= 8) return { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' };
    return { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' };
  };

  const driveTimeStyle = getDriveTimeStyle(segment.driveTimeHours || 0);

  return (
    <ErrorBoundary context={`DaySegmentCard-${segment.day}`}>
      <Card className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        {/* Blue Header - Matching second screenshot */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Day {segment.day}</h3>
              <p className="text-blue-100">
                {segmentDate?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{segment.endCity}</p>
              <p className="text-blue-100 text-sm">Destination</p>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          {/* Stats Grid - Matching second screenshot layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded border">
              <div className="text-lg font-bold text-blue-600">
                🗺️ {Math.round(segment.distance)} mi
              </div>
              <div className="text-xs text-gray-600">Distance</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded border">
              <div className="text-lg font-bold text-purple-600">
                ⏱️ {Math.floor(segment.driveTimeHours)}h {Math.round((segment.driveTimeHours % 1) * 60)}m
              </div>
              <div className="text-xs text-gray-600">Drive Time</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded border">
              <div className="text-sm font-medium text-gray-700">
                🚗 From
              </div>
              <div className="text-xs text-gray-600">{segment.startCity}</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded border">
              <div className="text-sm font-medium text-gray-700">
                🏁 To
              </div>
              <div className="text-xs text-gray-600">{segment.endCity}</div>
            </div>
          </div>

          {/* Weather section - matching second screenshot */}
          <div className="weather-section bg-gray-50 rounded-lg p-4 mx-4 mb-4 border">
            <div className="mb-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                🌤️ Weather Forecast for {segment.endCity}
              </h4>
              <p className="text-xs text-gray-500">Using standardized temperature formatting</p>
            </div>
            
            <SegmentWeatherWidget
              segment={segment}
              tripStartDate={tripStartDate}
              cardIndex={cardIndex}
              tripId={tripId}
              sectionKey={sectionKey}
              forceExpanded={forceExpanded}
              isCollapsible={isCollapsible}
              isSharedView={isSharedView}
              isPDFExport={isPDFExport}
            />
          </div>

          {/* Recommended Stops */}
          {segment.attractions && segment.attractions.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <h5 className="font-medium text-gray-800 mb-2">
                📍 Recommended Stops:
              </h5>
              <div className="space-y-1">
                {segment.attractions.slice(0, 3).map((attraction, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                    <span>{attraction.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default DaySegmentCard;
