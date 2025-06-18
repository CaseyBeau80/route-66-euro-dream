
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from './SegmentWeatherWidget';
import ErrorBoundary from './ErrorBoundary';

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

  // Determine drive time styling with enhanced color coding
  const getDriveTimeStyle = (hours: number) => {
    if (hours <= 4) return { 
      bg: 'bg-green-50', 
      text: 'text-green-800', 
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-800'
    };
    if (hours <= 6) return { 
      bg: 'bg-blue-50', 
      text: 'text-blue-800', 
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800'
    };
    if (hours <= 8) return { 
      bg: 'bg-orange-50', 
      text: 'text-orange-800', 
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-800'
    };
    if (hours <= 10) return { 
      bg: 'bg-red-50', 
      text: 'text-red-800', 
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800'
    };
    return { 
      bg: 'bg-gray-900', 
      text: 'text-white', 
      border: 'border-gray-900',
      badge: 'bg-gray-900 text-white'
    };
  };

  const driveTimeStyle = getDriveTimeStyle(segment.driveTimeHours || 0);
  
  // Format drive time with better display
  const formatDriveTime = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  return (
    <ErrorBoundary context={`DaySegmentCard-${segment.day}`}>
      <Card className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
        {/* Enhanced Header with Drive Time Badge */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 relative">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold">Day {segment.day}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${driveTimeStyle.badge}`}>
                  {formatDriveTime(segment.driveTimeHours || 0)}
                </span>
              </div>
              <p className="text-blue-100 text-sm mt-1">
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
          
          {/* Route Line */}
          <div className="mt-3 flex items-center text-blue-200 text-sm">
            <span className="bg-white/20 px-2 py-1 rounded text-xs">{segment.startCity}</span>
            <div className="flex-1 h-px bg-white/30 mx-2"></div>
            <span className="text-xs">🗺️ {Math.round(segment.distance)} mi</span>
            <div className="flex-1 h-px bg-white/30 mx-2"></div>
            <span className="bg-white/20 px-2 py-1 rounded text-xs">{segment.endCity}</span>
          </div>
        </div>

        <CardContent className="p-0">
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded border">
              <div className="text-lg font-bold text-blue-600">
                🗺️ {Math.round(segment.distance)} mi
              </div>
              <div className="text-xs text-gray-600">Distance</div>
            </div>
            
            <div className={`text-center p-3 rounded border ${driveTimeStyle.bg} ${driveTimeStyle.border}`}>
              <div className={`text-lg font-bold ${driveTimeStyle.text}`}>
                ⏱️ {formatDriveTime(segment.driveTimeHours || 0)}
              </div>
              <div className={`text-xs ${driveTimeStyle.text} opacity-75`}>
                Drive Time
                {(segment.driveTimeHours || 0) > 8 && (
                  <div className="text-xs mt-1 font-medium">
                    {(segment.driveTimeHours || 0) > 10 ? '⚠️ Max Limit' : '⚠️ Long Day'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded border">
              <div className="text-sm font-medium text-gray-700">
                🚗 From
              </div>
              <div className="text-xs text-gray-600 truncate">{segment.startCity}</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded border">
              <div className="text-sm font-medium text-gray-700">
                🏁 To
              </div>
              <div className="text-xs text-gray-600 truncate">{segment.endCity}</div>
            </div>
          </div>

          {/* Drive Time Advisory */}
          {(segment.driveTimeHours || 0) > 8 && (
            <div className={`mx-4 mb-4 p-3 rounded-lg border ${driveTimeStyle.bg} ${driveTimeStyle.border}`}>
              <div className={`text-sm font-medium ${driveTimeStyle.text} flex items-center`}>
                {(segment.driveTimeHours || 0) > 10 ? (
                  <>⚠️ Maximum daily drive time reached - plan for early start and frequent rest stops</>
                ) : (
                  <>⏰ Long driving day - consider early departure and meal planning</>
                )}
              </div>
            </div>
          )}

          {/* Weather section */}
          <div className="weather-section bg-gray-50 rounded-lg p-4 mx-4 mb-4 border">
            <div className="mb-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                🌤️ Weather Forecast for {segment.endCity}
              </h4>
              <p className="text-xs text-gray-500">Plan your drive accordingly</p>
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

          {/* Recommended Stops with better formatting */}
          {segment.attractions && segment.attractions.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                📍 Recommended Route 66 Stops:
              </h5>
              <div className="space-y-2">
                {segment.attractions.slice(0, 3).map((attraction, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-medium text-gray-800">{attraction.name}</span>
                      {attraction.description && (
                        <p className="text-gray-600 text-xs mt-1">{attraction.description}</p>
                      )}
                    </div>
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
