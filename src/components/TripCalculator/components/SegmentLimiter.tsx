
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
  initialLimit = 1, // 🚨 NUCLEAR: Start with just 1 segment
  incrementSize = 1, // 🚨 NUCLEAR: Load only 1 at a time
  emergencyLimit = 5 // 🚨 NUCLEAR: Never more than 5 total
}) => {
  const [currentLimit, setCurrentLimit] = useState(initialLimit);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🚨 NUCLEAR: Ultra-aggressive limiting
  const safeSegments = useMemo(() => {
    if (segments.length > emergencyLimit) {
      console.warn('🚨 NUCLEAR: Too many segments detected, activating emergency mode');
      setIsEmergencyMode(true);
      return segments.slice(0, emergencyLimit);
    }
    
    // NUCLEAR: If more than 3 segments, warn immediately
    if (segments.length > 3) {
      console.warn('🚨 NUCLEAR WARNING: Large number of segments, ultra-conservative mode');
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
    
    console.log(`🚨 NUCLEAR: Loading segments one by one (${currentLimit} -> ${newLimit})`);
    
    // NUCLEAR: Longer delay to prevent rapid loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCurrentLimit(newLimit);
    setIsLoading(false);
  };

  // Log nuclear limiting activity
  console.log('🚨 NUCLEAR SegmentLimiter render:', {
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
              🚨 Nuclear Mode: Trip too large. Showing maximum {emergencyLimit} segments.
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
                <span>Load Next Day ({currentLimit}/{safeSegments.length})</span>
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
