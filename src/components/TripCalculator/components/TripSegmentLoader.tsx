
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface TripSegmentLoaderProps {
  segments: DailySegment[];
  initialLimit?: number;
  children: (limitedSegments: DailySegment[], hasMore: boolean, loadMore: () => void) => React.ReactNode;
}

const TripSegmentLoader: React.FC<TripSegmentLoaderProps> = ({
  segments,
  initialLimit = 1,
  children
}) => {
  const [visibleSegmentCount, setVisibleSegmentCount] = React.useState(initialLimit);

  // Emergency limit check
  if (segments.length > 15) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 text-center bg-red-50 border-2 border-red-200 rounded-lg">
        <h3 className="text-xl font-bold text-red-800 mb-4">⚠️ Trip Too Large</h3>
        <p className="text-red-700 mb-4">
          This trip has {segments.length} segments. For performance, please plan a shorter trip (maximum 15 days).
        </p>
      </div>
    );
  }

  const limitedSegments = React.useMemo(() => {
    return segments.slice(0, visibleSegmentCount);
  }, [segments, visibleSegmentCount]);

  const loadMoreSegments = () => {
    const maxSegments = segments.length;
    const newCount = Math.min(visibleSegmentCount + 2, maxSegments);
    
    console.log('🔄 Loading more segments:', {
      current: visibleSegmentCount,
      new: newCount,
      max: maxSegments
    });
    
    setVisibleSegmentCount(newCount);
  };

  const hasMoreSegments = visibleSegmentCount < segments.length;

  return (
    <>
      {children(limitedSegments, hasMoreSegments, loadMoreSegments)}
    </>
  );
};

export default TripSegmentLoader;
