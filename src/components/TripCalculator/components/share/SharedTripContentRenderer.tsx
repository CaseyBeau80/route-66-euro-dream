
import React from 'react';
import { TripPlan, TripPlanDataValidator } from '../../services/planning/TripPlanBuilder';
import { PDFDataIntegrityService } from '../../services/pdf/PDFDataIntegrityService';
import PDFEnhancedHeader from '../pdf/PDFEnhancedHeader';
import PDFFooter from '../pdf/PDFFooter';
import ErrorBoundary from '../ErrorBoundary';
import { getDestinationCity } from '../../utils/DestinationUtils';
import TripOverviewSection from './TripOverviewSection';
import DailyItinerarySection from './DailyItinerarySection';
import TravelTipsSection from './TravelTipsSection';
import DataQualityNotice from './DataQualityNotice';

interface SharedTripContentRendererProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string;
  isSharedView?: boolean;
}

const SharedTripContentRenderer: React.FC<SharedTripContentRendererProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  isSharedView = false
}) => {
  console.log('📤 SharedTripContentRenderer: Starting render with enhanced weather integration', {
    tripPlan,
    segmentsCount: tripPlan.segments?.length || 0,
    dailySegmentsCount: tripPlan.dailySegments?.length || 0,
    hasStartDate: !!tripStartDate,
    startDateType: typeof tripStartDate,
    isSharedView
  });

  // Validate that we have trip data
  if (!tripPlan) {
    console.error('❌ SharedTripContentRenderer: No trip plan provided');
    return (
      <div className="p-8 text-center bg-white min-h-screen">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trip Not Available</h2>
        <p className="text-gray-600">The trip data could not be loaded.</p>
      </div>
    );
  }

  try {
    // Validate and sanitize trip plan data with error handling
    console.log('📤 SharedTripContentRenderer: Sanitizing trip plan');
    const sanitizedTripPlan = TripPlanDataValidator.sanitizeTripPlan(tripPlan);
    console.log('📤 SharedTripContentRenderer: Sanitized trip plan', sanitizedTripPlan);
    
    const integrityReport = PDFDataIntegrityService.generateIntegrityReport(sanitizedTripPlan);
    console.log('📤 SharedTripContentRenderer: Integrity report', integrityReport);
    
    // Use segments or dailySegments, whichever is available
    const rawSegments = sanitizedTripPlan.segments || sanitizedTripPlan.dailySegments || [];
    console.log('📤 SharedTripContentRenderer: Raw segments', rawSegments);
    
    // Filter segments with proper validation
    const enrichedSegments = rawSegments.filter(segment => {
      if (!segment) return false;
      if (typeof segment.day !== 'number' || segment.day <= 0) return false;
      if (!segment.endCity && !getDestinationCity(segment.destination)) return false;
      return true;
    }) || [];

    console.log('📤 SharedTripContentRenderer: Processed segments', {
      rawSegmentsCount: rawSegments.length,
      enrichedSegmentsCount: enrichedSegments.length,
      enrichedSegments: enrichedSegments.map(s => ({ day: s.day, endCity: s.endCity, startCity: s.startCity }))
    });

    if (enrichedSegments.length === 0) {
      console.warn('⚠️ SharedTripContentRenderer: No valid segments found');
      return (
        <div className="p-8 text-center bg-white min-h-screen">
          <h2 className="text-xl font-bold text-gray-800 mb-4">No Trip Segments</h2>
          <p className="text-gray-600">This trip doesn't have any valid segments to display.</p>
          <div className="mt-4 p-4 bg-yellow-100 rounded text-sm text-left">
            <strong>Debug Info:</strong>
            <div>Raw segments: {rawSegments.length}</div>
            <div>Sanitized trip plan keys: {Object.keys(sanitizedTripPlan).join(', ')}</div>
          </div>
        </div>
      );
    }

    const defaultTitle = `Route 66 Adventure: ${sanitizedTripPlan.startCity} to ${sanitizedTripPlan.endCity}`;
    console.log('📤 SharedTripContentRenderer: About to render main content');

    // Ensure tripStartDate is a proper Date object for weather calculations
    const validTripStartDate = React.useMemo(() => {
      if (!tripStartDate) return undefined;
      
      try {
        if (tripStartDate instanceof Date) {
          return isNaN(tripStartDate.getTime()) ? undefined : tripStartDate;
        }
        
        if (typeof tripStartDate === 'string') {
          const parsed = new Date(tripStartDate);
          return isNaN(parsed.getTime()) ? undefined : parsed;
        }
        
        return undefined;
      } catch (error) {
        console.error('❌ Error processing tripStartDate:', error);
        return undefined;
      }
    }, [tripStartDate]);

    console.log('📤 SharedTripContentRenderer: Date validation result:', {
      originalDate: tripStartDate,
      validDate: validTripStartDate?.toISOString(),
      isValid: !!validTripStartDate
    });

    return (
      <div className="w-full bg-white min-h-screen" style={{ 
        padding: '32px', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: '1.4',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Enhanced PDF Header */}
        <ErrorBoundary context="PDFEnhancedHeader" silent>
          <div className="mb-8">
            <PDFEnhancedHeader
              title={defaultTitle}
              tripPlan={sanitizedTripPlan}
              tripStartDate={validTripStartDate}
            />
          </div>
        </ErrorBoundary>

        {/* Data Quality Notice */}
        <DataQualityNotice integrityReport={integrityReport} />

        {/* Enhanced Trip Overview */}
        <TripOverviewSection tripPlan={sanitizedTripPlan} />

        {/* Daily Itinerary */}
        <DailyItinerarySection 
          enrichedSegments={enrichedSegments}
          validTripStartDate={validTripStartDate}
        />

        {/* Travel Tips Section */}
        <TravelTipsSection />

        {/* Enhanced Footer - Only show QR code in shared view */}
        <ErrorBoundary context="PDFFooter" silent>
          <div className="mt-8">
            <PDFFooter
              shareUrl={shareUrl}
              enrichedSegments={enrichedSegments}
              includeQRCode={isSharedView}
              dataIntegrityReport={integrityReport}
            />
          </div>
        </ErrorBoundary>
      </div>
    );

  } catch (error) {
    console.error('❌ SharedTripContentRenderer: Error during render', error);
    return (
      <div className="p-8 text-center bg-white min-h-screen">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Rendering Error</h2>
        <p className="text-gray-600">There was an error displaying the trip content.</p>
        <div className="mt-4 p-4 bg-red-100 rounded text-sm text-left">
          <strong>Error:</strong> {error instanceof Error ? error.message : String(error)}
        </div>
      </div>
    );
  }
};

export default SharedTripContentRenderer;
