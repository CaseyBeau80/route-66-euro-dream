
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import PDFDaySegmentCard from '../pdf/PDFDaySegmentCard';
import ErrorBoundary from '../ErrorBoundary';

interface DailyItinerarySectionProps {
  enrichedSegments: DailySegment[];
  validTripStartDate?: Date;
}

const DailyItinerarySection: React.FC<DailyItinerarySectionProps> = ({
  enrichedSegments,
  validTripStartDate
}) => {
  return (
    <div className="mb-8">
      <div className="mb-6 text-center p-4 bg-blue-600 rounded">
        <h2 className="text-xl font-bold text-white mb-2">
          📅 DAILY ITINERARY
        </h2>
        <p className="text-blue-100 text-sm">
          Your day-by-day guide to the ultimate Route 66 adventure
        </p>
      </div>
      
      {enrichedSegments.map((segment, index) => {
        console.log(`📤 DailyItinerarySection: Rendering segment ${index + 1}`, segment);
        return (
          <ErrorBoundary 
            key={`day-${segment.day}-${index}`} 
            context={`PDFDaySegmentCard-${segment.day}`}
            silent
            fallback={
              <div className="mb-6 p-4 bg-gray-100 rounded border">
                <h3 className="font-bold text-gray-700">Day {segment.day}</h3>
                <p className="text-gray-600">Error loading segment details</p>
              </div>
            }
          >
            <div className="mb-6">
              <PDFDaySegmentCard
                segment={segment}
                tripStartDate={validTripStartDate}
                segmentIndex={index}
                exportFormat="full"
              />
            </div>
          </ErrorBoundary>
        );
      })}
    </div>
  );
};

export default DailyItinerarySection;
