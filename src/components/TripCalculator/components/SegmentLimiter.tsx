
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
  initialLimit = 2, // EMERGENCY: Reduced from 3 to 2
  incrementSize = 2, // EMERGENCY: Reduced from 5 to 2
  emergencyLimit = 10 // EMERGENCY: Reduced from 15 to 10
}) => {
  const [currentLimit, setCurrentLimit] = useState(initialLimit);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🚨 EMERGENCY: More aggressive limiting
  const safeSegments = useMemo(() => {
    if (segments.length > emergencyLimit) {
      console.warn('🚨 EMERGENCY: Too many segments detected, activating emergency mode');
      setIsEmergencyMode(true);
      return segments.slice(0, emergencyLimit);
    }
    
    // Additional safety: if more than 5 segments, warn but don't emergency mode
    if (segments.length > 5) {
      console.warn('⚠️ WARNING: Large number of segments, performance may be affected');
    }
    
    return segments;
  }, [segments, emergencyLimit]);

  const limitedSegments = useMemo(() => {
    return safeSegments.slice(0, currentLimit);
  }, [safeSegments, currentLimit]);

  const hasMore = currentLimit < safeSegments.length;

  const loadMore = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const newLimit = Math.min(currentLimit + incrementSize, safeSegments.length);
    
    console.log(`📊 SegmentLimiter: Loading more segments (${currentLimit} -> ${newLimit})`);
    
    // Add artificial delay to prevent rapid loading that could cause lockup
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentLimit(newLimit);
    setIsLoading(false);
  };

  // Log segment limiting activity
  console.log('📊 SegmentLimiter render (EMERGENCY MODE):', {
    totalSegments: segments.length,
    safeSegments: safeSegments.length,
    currentLimit,
    limitedSegments: limitedSegments.length,
    hasMore,
    isEmergencyMode,
    isLoading
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
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-route66-primary text-white rounded-lg hover:bg-route66-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>Load More Days ({currentLimit}/{safeSegments.length})</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default SegmentLimiter;
