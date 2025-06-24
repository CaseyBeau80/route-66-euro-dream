
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import DaySegmentCard from './DaySegmentCard';
import ErrorBoundary from './ErrorBoundary';

interface PreviewDailyItineraryProps {
  segments: DailySegment[];
  tripStartDate?: Date;
}

const PreviewDailyItinerary: React.FC<PreviewDailyItineraryProps> = ({
  segments,
  tripStartDate
}) => {
  console.log('📅 PreviewDailyItinerary: Rendering segments with distance debugging:', {
    segmentCount: segments.length,
    segmentDistances: segments.map((s, i) => ({
      day: s.day,
      distance: s.distance,
      approximateMiles: s.approximateMiles,
      index: i
    }))
  });

  if (!segments || segments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No daily segments available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-blue-600 rounded">
        <h3 className="text-lg font-bold text-white mb-2">
          📅 Your complete day-by-day guide with live weather forecasts
        </h3>
        <p className="text-blue-100 text-sm">
          Trip starts: {tripStartDate?.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          }) || 'Date not specified'}
        </p>
      </div>
      
      {segments.map((segment, index) => {
        // Debug logging for each segment's distance
        console.log(`📏 Segment ${index + 1} distance debug:`, {
          day: segment.day,
          distance: segment.distance,
          approximateMiles: segment.approximateMiles,
          effectiveDistance: segment.distance || segment.approximateMiles || 0
        });

        return (
          <ErrorBoundary key={`preview-segment-${segment.day}-${index}`} context={`PreviewItinerary-${index}`}>
            <DaySegmentCard
              segment={segment}
              tripStartDate={tripStartDate}
              cardIndex={index}
              sectionKey="preview-itinerary"
            />
          </ErrorBoundary>
        );
      })}
    </div>
  );
};

export default PreviewDailyItinerary;
