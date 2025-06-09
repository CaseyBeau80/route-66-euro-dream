
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from '../SegmentWeatherWidget';
import SeasonalWeatherDisplay from '../weather/SeasonalWeatherDisplay';

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
  console.log('📅 ShareTripItineraryView: Rendering with tripStartDate:', {
    tripStartDate: tripStartDate?.toISOString(),
    hasValidDate: tripStartDate && !isNaN(tripStartDate.getTime()),
    segmentsCount: segments.length,
    isSharedView
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Itinerary</h2>
      
      {segments.map((segment, index) => {
        // Calculate segment date with proper validation
        const segmentDate = React.useMemo(() => {
          if (!tripStartDate || isNaN(tripStartDate.getTime())) {
            console.log(`📅 ShareTripItineraryView: No valid tripStartDate for segment ${segment.day}`);
            return null;
          }
          
          try {
            const calculatedDate = new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
            
            if (isNaN(calculatedDate.getTime())) {
              console.error(`❌ ShareTripItineraryView: Invalid calculated date for segment ${segment.day}`);
              return null;
            }
            
            console.log(`📅 ShareTripItineraryView: Valid date calculated for segment ${segment.day}:`, calculatedDate.toISOString());
            return calculatedDate;
          } catch (error) {
            console.error(`❌ ShareTripItineraryView: Error calculating date for segment ${segment.day}:`, error);
            return null;
          }
        }, [tripStartDate, segment.day]);

        return (
          <div key={`day-${segment.day}`} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Day Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Day {segment.day}</h3>
                  <p className="text-blue-100">
                    {segmentDate ? segmentDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Date not available'}
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

              {/* Weather Information */}
              {isSharedView ? (
                // For shared views, show seasonal weather without requiring API key
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    🌤️ Seasonal Weather Information
                  </h4>
                  {segmentDate ? (
                    <SeasonalWeatherDisplay 
                      segmentDate={segmentDate} 
                      cityName={segment.endCity}
                      compact={true}
                    />
                  ) : (
                    <div className="text-sm text-gray-600">
                      <p>Weather information not available - trip date not set</p>
                    </div>
                  )}
                </div>
              ) : (
                // For regular views, show full weather widget
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    🌤️ Weather Information
                  </h4>
                  <SegmentWeatherWidget
                    segment={segment}
                    tripStartDate={tripStartDate}
                    cardIndex={index}
                    isCollapsible={false}
                    forceExpanded={true}
                  />
                </div>
              )}

              {/* Recommendations */}
              {segment.attractions && segment.attractions.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    🏛️ Recommended Stops ({segment.attractions.length} total)
                  </h4>
                  <ul className="space-y-1">
                    {segment.attractions.map((attraction, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {attraction.name || attraction}
                      </li>
                    ))}
                  </ul>
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
