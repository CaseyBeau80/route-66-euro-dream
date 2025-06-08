
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import ShareTripDaySegmentCard from './ShareTripDaySegmentCard';

interface ShareTripItineraryViewProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  totalDays: number;
}

const ShareTripItineraryView: React.FC<ShareTripItineraryViewProps> = ({
  segments,
  tripStartDate,
  totalDays
}) => {
  if (!segments || segments.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No Itinerary Available
        </h3>
        <p className="text-gray-500">
          There was an issue generating your trip itinerary.
        </p>
      </div>
    );
  }

  const totalDistance = segments.reduce((total, seg) => total + (seg.distance || seg.approximateMiles || 0), 0);

  return (
    <div className="w-full">
      {/* Trip Overview Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Route 66 Itinerary</h2>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>📅 {totalDays} days</span>
          <span>📍 {segments.length} destinations</span>
          <span>🛣️ {Math.round(totalDistance)} miles</span>
        </div>
      </div>

      {/* Tab Header - Visual Only */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-0">
          <div className="bg-blue-50 border-t-2 border-blue-500 px-6 py-3 font-medium text-blue-700 rounded-t-lg">
            📍 Route & Stops + Weather
          </div>
        </div>
      </div>

      {/* Daily Segments */}
      <div className="space-y-4">
        {segments.map((segment, index) => (
          <ShareTripDaySegmentCard
            key={`share-segment-${segment.day}-${segment.endCity}-${index}`}
            segment={segment}
            tripStartDate={tripStartDate}
          />
        ))}
      </div>
    </div>
  );
};

export default ShareTripItineraryView;
