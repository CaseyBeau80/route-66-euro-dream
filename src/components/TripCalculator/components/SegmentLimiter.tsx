
import React, { useState, useMemo } from 'react';
import { ChevronDown, AlertTriangle } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface SegmentLimiterProps {
  segments: DailySegment[];
  children: (limitedSegments: DailySegment[], hasMore: boolean, loadMore: () => void) => React.ReactNode;
  initialLimit?: number;
  incrementSize?: number;
  emergencyLimit?: number;
}

const SegmentLimiter: React.FC<SegmentLimiterProps> = ({
  segments,
  children,
  initialLimit = 3,
  incrementSize = 5,
  emergencyLimit = 15
}) => {
  const [currentLimit, setCurrentLimit] = useState(initialLimit);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  // Emergency circuit breaker - if too many segments, force emergency mode
  const safeSegments = useMemo(() => {
    if (segments.length > emergencyLimit && !isEmergencyMode) {
      console.warn('🚨 EMERGENCY: Too many segments detected, activating emergency mode');
      setIsEmergencyMode(true);
      return segments.slice(0, emergencyLimit);
    }
    return segments;
  }, [segments, emergencyLimit, isEmergencyMode]);

  const limitedSegments = useMemo(() => {
    return safeSegments.slice(0, currentLimit);
  }, [safeSegments, currentLimit]);

  const hasMore = currentLimit < safeSegments.length;

  const loadMore = () => {
    const newLimit = Math.min(currentLimit + incrementSize, safeSegments.length);
    console.log(`📊 SegmentLimiter: Loading more segments (${currentLimit} -> ${newLimit})`);
    setCurrentLimit(newLimit);
  };

  // Log segment limiting activity
  console.log('📊 SegmentLimiter render:', {
    totalSegments: segments.length,
    safeSegments: safeSegments.length,
    currentLimit,
    limitedSegments: limitedSegments.length,
    hasMore,
    isEmergencyMode
  });

  return (
    <>
      {children(limitedSegments, hasMore, loadMore)}
      
      {/* Emergency Mode Warning */}
      {isEmergencyMode && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Emergency Mode: Large trip detected. Showing limited segments for performance.
            </span>
          </div>
        </div>
      )}
      
      {/* Load More Button */}
      {hasMore && !isEmergencyMode && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            className="inline-flex items-center gap-2 px-6 py-3 bg-route66-primary text-white rounded-lg hover:bg-route66-primary-dark transition-colors"
          >
            <span>Load More Days ({currentLimit}/{safeSegments.length})</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default SegmentLimiter;
