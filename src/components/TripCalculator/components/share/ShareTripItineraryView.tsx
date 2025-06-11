
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { AttractionLimitingService } from '../../services/attractions/AttractionLimitingService';
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
  const context = `ShareTripItineraryView${isSharedView ? '-SharedView' : ''}`;
  
  console.log('📅 ShareTripItineraryView: Rendering with centralized attraction limiting:', {
    tripStartDate: tripStartDate?.toISOString(),
    hasValidDate: tripStartDate && !isNaN(tripStartDate.getTime()),
    segmentsCount: segments.length,
    isSharedView,
    context,
    maxAttractionsAllowed: AttractionLimitingService.getMaxAttractions()
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Itinerary</h2>
      
      {segments.map((segment, index) => {
        // CRITICAL: Use centralized attraction limiting service
        const segmentContext = `${context}-Day${segment.day}`;
        const originalAttractions = segment.attractions || [];
        
        const limitResult = AttractionLimitingService.limitAttractions(
          originalAttractions,
          segmentContext
        );
        
        // Validate the result
        if (!AttractionLimitingService.validateAttractionLimit(limitResult.limitedAttractions, segmentContext)) {
          console.error(`🚨 CRITICAL: Attraction limit validation failed for ${segmentContext}`);
        }

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

              {/* CENTRALIZED ENFORCED Attraction Limit Recommendations */}
              {limitResult.limitedAttractions.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    🏛️ Recommended Stops ({limitResult.hasMoreAttractions ? `${limitResult.limitedAttractions.length} of ${limitResult.totalAttractions}` : limitResult.limitedAttractions.length} • max {limitResult.limitApplied})
                  </h4>
                  <ul className="space-y-1">
                    {limitResult.limitedAttractions.map((attraction, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {typeof attraction === 'string' 
                          ? attraction 
                          : attraction.name || 'Unknown Attraction'
                        }
                      </li>
                    ))}
                  </ul>
                  
                  {/* Truncation indicator when more attractions are available */}
                  {limitResult.hasMoreAttractions && (
                    <div className="text-xs text-gray-600 italic text-center p-2 bg-gray-100 rounded border border-gray-200 mt-2">
                      🚫 Showing only {limitResult.limitedAttractions.length} of {limitResult.totalAttractions} attractions (limited to max {limitResult.limitApplied})
                      <div className="text-xs text-gray-500 mt-1">
                        + {limitResult.remainingCount} more attraction{limitResult.remainingCount !== 1 ? 's' : ''} nearby
                      </div>
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
