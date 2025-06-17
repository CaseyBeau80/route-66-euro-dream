
import React from 'react';
import { TripPlan } from './services/planning/TripPlanBuilder';
import { TripCompletionAnalysis } from './services/planning/TripCompletionService';
import TripResultsPreview from './components/TripResultsPreview';
import ShareAndExportDropdown from './components/ShareAndExportDropdown';
import ItineraryPreLoader from './components/ItineraryPreLoader';
import TripCompletionWarning from './components/TripCompletionWarning';
import { useCostEstimator } from './hooks/useCostEstimator';

interface EnhancedTripResultsProps {
  tripPlan: TripPlan;
  shareUrl?: string | null;
  tripStartDate?: Date;
  completionAnalysis?: TripCompletionAnalysis;
  originalRequestedDays?: number;
  loadingState?: {
    isPreLoading: boolean;
    progress: number;
    currentStep: string;
    totalSegments: number;
    loadedSegments: number;
    isReady: boolean;
  };
}

const EnhancedTripResults: React.FC<EnhancedTripResultsProps> = ({
  tripPlan,
  shareUrl,
  tripStartDate,
  completionAnalysis,
  originalRequestedDays,
  loadingState
}) => {
  // Add safety check for tripPlan
  if (!tripPlan) {
    console.error('❌ EnhancedTripResults: tripPlan is null or undefined');
    return null;
  }

  // Safely convert tripStartDate to a valid Date object
  const validTripStartDate = React.useMemo(() => {
    if (!tripStartDate) return undefined;
    
    if (tripStartDate instanceof Date) {
      return isNaN(tripStartDate.getTime()) ? undefined : tripStartDate;
    }
    
    if (typeof tripStartDate === 'string') {
      const parsed = new Date(tripStartDate);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    
    return undefined;
  }, [tripStartDate]);

  console.log("🌤️ EnhancedTripResults: Rendering with completion analysis:", {
    segmentsCount: tripPlan.segments?.length || 0,
    hasStartDate: !!validTripStartDate,
    startDate: validTripStartDate?.toISOString(),
    isPreLoading: loadingState?.isPreLoading,
    hasCompletionAnalysis: !!completionAnalysis,
    originalRequestedDays,
    finalDays: tripPlan.totalDays,
    shouldShowWarning: !!(completionAnalysis && originalRequestedDays && (completionAnalysis.isCompleted || completionAnalysis.duplicateSegments.length > 0))
  });

  // Show pre-loader if loading
  if (loadingState?.isPreLoading) {
    return (
      <div id="trip-results" className="space-y-6 trip-content" data-trip-content="true">
        <ItineraryPreLoader
          progress={loadingState.progress}
          currentStep={loadingState.currentStep}
          totalSegments={loadingState.totalSegments}
          loadedSegments={loadingState.loadedSegments}
        />
      </div>
    );
  }

  const tripTitle = tripPlan.title || `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Adventure`;

  // Determine if we should show the completion warning
  const shouldShowCompletionWarning = completionAnalysis && originalRequestedDays && 
    (completionAnalysis.isCompleted || completionAnalysis.duplicateSegments.length > 0) &&
    (originalRequestedDays > completionAnalysis.totalUsefulDays);

  console.log("🚨 COMPLETION WARNING CHECK:", {
    hasAnalysis: !!completionAnalysis,
    hasOriginalDays: !!originalRequestedDays,
    isCompleted: completionAnalysis?.isCompleted,
    duplicateSegments: completionAnalysis?.duplicateSegments?.length || 0,
    originalDays: originalRequestedDays,
    finalDays: completionAnalysis?.totalUsefulDays,
    shouldShow: shouldShowCompletionWarning
  });

  return (
    <div id="trip-results" className="space-y-6 trip-content" data-trip-content="true">
      {/* Trip Completion Warning - Show prominently at the top if optimization occurred */}
      {shouldShowCompletionWarning && (
        <TripCompletionWarning
          analysis={completionAnalysis}
          originalRequestedDays={originalRequestedDays}
        />
      )}

      {/* New Preview Format Results */}
      <TripResultsPreview
        tripPlan={tripPlan}
        tripStartDate={validTripStartDate}
      />

      {/* Share and Export Actions */}
      <div className="flex justify-center">
        <ShareAndExportDropdown
          shareUrl={shareUrl}
          tripTitle={tripTitle}
          tripPlan={tripPlan}
          tripStartDate={validTripStartDate}
          variant="default"
          size="default"
        />
      </div>
    </div>
  );
};

export default EnhancedTripResults;
