
import React from 'react';
import { SavedTrip } from '@/components/TripCalculator/services/TripService';
import SharedTripContentRenderer from '@/components/TripCalculator/components/share/SharedTripContentRenderer';
import { TripDataSanitizationService } from '@/components/TripCalculator/services/planning/TripDataSanitizationService';
import { DateDeserializationService } from '@/components/TripCalculator/services/planning/DateDeserializationService';
import ErrorBoundary from '@/components/TripCalculator/components/ErrorBoundary';

interface TripDetailsContentProps {
  trip: SavedTrip;
  shareUrl: string;
}

const TripDetailsContent: React.FC<TripDetailsContentProps> = ({
  trip,
  shareUrl
}) => {
  console.log('🚨 TripDetailsContent: RENDERING with DATE DESERIALIZATION fix', {
    trip: {
      id: trip?.id,
      title: trip?.title,
      created_at: trip?.created_at
    },
    shareUrl,
    hasTrip: !!trip,
    hasTripData: !!trip?.trip_data,
    componentVersion: 'DATE_DESERIALIZATION_FIX',
    timestamp: new Date().toISOString()
  });

  // Validate trip existence
  if (!trip) {
    console.error('❌ TripDetailsContent: No trip provided');
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center w-full min-h-[400px]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trip Not Found</h2>
        <p className="text-gray-600">The requested trip could not be loaded.</p>
      </div>
    );
  }

  // Validate trip_data exists
  if (!trip.trip_data) {
    console.error('❌ TripDetailsContent: No trip_data in trip object');
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center w-full min-h-[400px]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trip Data Missing</h2>
        <p className="text-gray-600">The trip data appears to be missing or corrupted.</p>
      </div>
    );
  }

  try {
    // CRITICAL FIX: First deserialize dates, then sanitize
    console.log('🔧 TripDetailsContent: Starting date deserialization...', {
      originalTripData: trip.trip_data,
      hasStartDate: !!trip.trip_data.startDate,
      startDateType: typeof trip.trip_data.startDate,
      startDateValue: trip.trip_data.startDate
    });

    // Step 1: Fix serialized dates
    const dateFixedTripData = DateDeserializationService.fixTripPlanDates(trip.trip_data);
    
    console.log('🔧 TripDetailsContent: Date deserialization complete:', {
      originalStartDate: trip.trip_data.startDate,
      fixedStartDate: dateFixedTripData.startDate,
      fixedStartDateType: typeof dateFixedTripData.startDate,
      isValidDate: dateFixedTripData.startDate instanceof Date && !isNaN(dateFixedTripData.startDate.getTime())
    });

    // Step 2: Sanitize trip data to handle circular references and data integrity issues
    const { sanitizedData: tripPlan, report } = TripDataSanitizationService.sanitizeTripData(dateFixedTripData);

    console.log('🚨 TripDetailsContent: Data processing complete', {
      report,
      sanitizedTripPlan: {
        startCity: tripPlan?.startCity,
        endCity: tripPlan?.endCity,
        totalDays: tripPlan?.totalDays,
        segmentsCount: tripPlan?.segments?.length,
        startDate: tripPlan?.startDate,
        startDateType: typeof tripPlan?.startDate,
        isValidStartDate: tripPlan?.startDate instanceof Date && !isNaN(tripPlan?.startDate.getTime())
      },
      hasCircularReferences: report.hasCircularReferences,
      warnings: report.warnings,
      willRenderSharedView: true
    });

    // Show data quality warnings if significant issues were found
    if (report.hasCircularReferences || report.warnings.length > 0) {
      console.warn('⚠️ TripDetailsContent: Data quality issues detected', report);
    }

    // Validate sanitized trip plan
    if (!tripPlan || (!tripPlan.segments && !tripPlan.dailySegments)) {
      console.error('❌ TripDetailsContent: No valid segments after sanitization', { 
        tripPlan,
        report
      });
      return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center w-full min-h-[400px]">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Trip Data Invalid</h2>
          <p className="text-gray-600 mb-4">
            The trip data appears to be corrupted or incomplete and could not be repaired.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-yellow-100 rounded text-sm text-left">
              <strong>Sanitization Report:</strong>
              <pre className="mt-2 text-xs">{JSON.stringify(report, null, 2)}</pre>
            </div>
          )}
        </div>
      );
    }

    // Use the fixed startDate
    const tripStartDate = tripPlan.startDate || undefined;

    // FIXED: Simplify type checking to avoid TypeScript error
    if (tripStartDate !== undefined && tripStartDate !== null) {
      if (!(tripStartDate instanceof Date)) {
        // Safely get constructor name without TypeScript error
        let constructorName = 'unknown';
        try {
          if (tripStartDate && typeof tripStartDate === 'object' && 'constructor' in tripStartDate) {
            constructorName = (tripStartDate as any).constructor?.name || 'unknown';
          }
        } catch (e) {
          constructorName = 'error-accessing-constructor';
        }

        console.error('❌ TripDetailsContent: tripStartDate is not a Date object after processing:', {
          tripStartDate,
          type: typeof tripStartDate,
          constructorName
        });
      } else {
        console.log('✅ TripDetailsContent: Valid Date object confirmed:', {
          tripStartDate: tripStartDate.toISOString(),
          tripStartDateLocal: tripStartDate.toLocaleDateString()
        });
      }
    }

    console.log('🚨 TripDetailsContent: About to render SharedTripContentRenderer', {
      tripStartDate: tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate,
      isSharedView: true,
      shareUrl,
      componentVersion: 'DATE_DESERIALIZATION_FIX'
    });

    return (
      <ErrorBoundary 
        context="TripDetailsContent"
        fallback={
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center w-full min-h-[400px]">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Display Error</h2>
            <p className="text-gray-600">There was an error displaying the trip content.</p>
          </div>
        }
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
          {/* Data Quality Notice for significant issues */}
          {(report.hasCircularReferences || report.warnings.length > 2) && (
            <div className="p-4 bg-yellow-50 border-b border-yellow-200">
              <div className="text-sm text-yellow-800">
                <strong>Notice:</strong> Some trip data was automatically repaired for display.
                {report.warnings.length > 0 && (
                  <div className="mt-1 text-xs">
                    Key issues: {report.warnings.slice(0, 2).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced SharedTripContentRenderer */}
          <SharedTripContentRenderer
            tripPlan={tripPlan}
            tripStartDate={tripStartDate}
            shareUrl={shareUrl}
            isSharedView={true}
          />
        </div>
      </ErrorBoundary>
    );

  } catch (error) {
    console.error('❌ TripDetailsContent: Error in component rendering:', error);
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center w-full min-h-[400px]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Rendering Error</h2>
        <p className="text-gray-600 mb-4">
          There was an unexpected error while preparing the trip content for display.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-red-100 rounded text-sm text-left">
            <strong>Error Details:</strong>
            <pre className="mt-2 text-xs text-red-600">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </div>
        )}
      </div>
    );
  }
};

export default TripDetailsContent;
