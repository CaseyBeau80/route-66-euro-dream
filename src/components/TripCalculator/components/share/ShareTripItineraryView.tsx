
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from '../SegmentWeatherWidget';

interface ShareTripItineraryViewProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  totalDays: number;
  isSharedView?: boolean;
}

const ShareTripItineraryView: React.FC<ShareTripItineraryViewProps> = ({ 
  segments, 
  tripStartDate, 
  totalDays,
  isSharedView = false
}) => {
  console.log('📅 ShareTripItineraryView: Rendering with enhanced weather system:', {
    tripStartDate: tripStartDate?.toISOString(),
    hasValidDate: tripStartDate && !isNaN(tripStartDate.getTime()),
    segmentsCount: segments.length,
    isSharedView
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Itinerary</h2>
      
      {segments.map((segment, index) => {
        // CRITICAL: Enforce 3-attraction limit in shared view
        const maxAttractions = 3;
        const totalAttractions = segment.attractions?.length || 0;
        const limitedAttractions = segment.attractions?.slice(0, maxAttractions) || [];
        const hasMoreAttractions = totalAttractions > maxAttractions;
        const remainingCount = totalAttractions - maxAttractions;

        console.log('🔍 ShareTripItineraryView ENFORCED attraction limiting:', {
          segmentDay: segment.day,
          totalAttractions,
          maxAttractions,
          limitedAttractions: limitedAttractions.length,
          hasMoreAttractions,
          remainingCount
        });

        return (
          <div key={`day-${segment.day}`} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Day Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Day {segment.day}</h3>
                  <p className="text-blue-100">
                    {tripStartDate && !isNaN(tripStartDate.getTime()) ? (
                      new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000)
                        .toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                    ) : 'Date not available'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{segment.endCity}</p>
                  <p className="text-blue-100 text-sm">
                    {Math.round(segment.distance || 0)} mi • {Math.round(segment.driveTimeHours || 0)}h drive
                  </p>
                </div>
              </div>
            </div>

            {/* Day Content */}
            <div className="p-4 space-y-4">
              {/* Route Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  🗺️ Route Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Distance:</span>
                    <span className="ml-2 font-semibold">{Math.round(segment.distance || 0)} miles</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Drive Time:</span>
                    <span className="ml-2 font-semibold">{Math.round(segment.driveTimeHours || 0)} hours</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Arrival:</span>
                    <span className="ml-2 font-semibold">{segment.endCity}</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Weather Information with SegmentWeatherWidget */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  🌤️ Weather Information
                </h4>
                <SegmentWeatherWidget
                  segment={segment}
                  tripStartDate={tripStartDate}
                  cardIndex={index}
                  sectionKey="shared-view"
                  forceExpanded={true}
                  isCollapsible={false}
                />
              </div>

              {/* ENFORCED 3-Attraction Limit Recommendations */}
              {limitedAttractions.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    🏛️ Recommended Stops ({hasMoreAttractions ? `${limitedAttractions.length} of ${totalAttractions}` : limitedAttractions.length} total)
                  </h4>
                  <ul className="space-y-1">
                    {limitedAttractions.map((attraction, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {attraction.name || attraction}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Truncation indicator when more attractions are available */}
                  {hasMoreAttractions && (
                    <div className="text-xs text-gray-600 italic text-center p-2 bg-gray-100 rounded border border-gray-200 mt-2">
                      + {remainingCount} more attraction{remainingCount !== 1 ? 's' : ''} nearby
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShareTripItineraryView;
