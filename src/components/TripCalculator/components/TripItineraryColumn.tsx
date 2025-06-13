
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import DaySegmentCard from './DaySegmentCard';
import { Loader } from 'lucide-react';

interface TripItineraryColumnProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  loadingState?: {
    isPreLoading: boolean;
    progress: number;
    currentStep: string;
    totalSegments: number;
    loadedSegments: number;
    isReady: boolean;
  };
}

const TripItineraryColumn: React.FC<TripItineraryColumnProps> = ({ 
  segments, 
  tripStartDate,
  loadingState
}) => {
  const [visibleSegments, setVisibleSegments] = React.useState<number>(0);

  // Progressive segment reveal
  React.useEffect(() => {
    if (!loadingState?.isPreLoading && segments.length > 0) {
      // Show segments progressively for smooth UX
      let currentIndex = 0;
      const revealSegment = () => {
        if (currentIndex < segments.length) {
          setVisibleSegments(currentIndex + 1);
          currentIndex++;
          setTimeout(revealSegment, 150); // Stagger reveals
        }
      };
      
      // Start revealing after a brief delay
      setTimeout(revealSegment, 300);
    }
  }, [loadingState?.isPreLoading, segments.length]);

  console.log('📅 TripItineraryColumn: Rendering segments', {
    totalSegments: segments.length,
    visibleSegments,
    isPreLoading: loadingState?.isPreLoading,
    loadedSegments: loadingState?.loadedSegments
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Daily Itinerary</h3>
        {loadingState?.isPreLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader className="w-4 h-4 animate-spin" />
            Loading segments...
          </div>
        )}
      </div>
      
      {segments.slice(0, visibleSegments).map((segment, index) => (
        <div 
          key={`day-${segment.day}-${segment.endCity}`}
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'both'
          }}
        >
          <DaySegmentCard
            segment={segment}
            tripStartDate={tripStartDate}
            cardIndex={index}
            sectionKey="itinerary"
          />
        </div>
      ))}
      
      {/* Loading placeholder for remaining segments */}
      {loadingState?.isPreLoading && visibleSegments < segments.length && (
        <div className="space-y-4">
          {Array.from({ length: Math.min(3, segments.length - visibleSegments) }).map((_, index) => (
            <div 
              key={`loading-${index}`}
              className="bg-gray-100 rounded-lg p-6 animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripItineraryColumn;
