
import React from 'react';
import { SavedTrip } from '@/components/TripCalculator/services/TripService';
import SharedTripContentRenderer from '@/components/TripCalculator/components/share/SharedTripContentRenderer';
import { TripDataSanitizationService } from '@/components/TripCalculator/services/planning/TripDataSanitizationService';
import ErrorBoundary from '@/components/TripCalculator/components/ErrorBoundary';

interface TripDetailsContentProps {
  trip: SavedTrip;
  shareUrl: string;
}

const TripDetailsContent: React.FC<TripDetailsContentProps> = ({
  trip,
  shareUrl
}) => {
  console.log('🎯 TripDetailsContent: Rendering with UPDATED SharedTripContentRenderer (RAMBLE 66 branding)', {
    trip,
    shareUrl,
    hasTrip: !!trip,
    hasTripData: !!trip.trip_data
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

  // Sanitize trip data to handle circular references and data integrity issues
  const { sanitizedData: tripPlan, report } = TripDataSanitizationService.sanitizeTripData(trip.trip_data);

  console.log('🎯 TripDetailsContent: Data sanitization complete with RAMBLE 66 update', {
    report,
    sanitizedTripPlan: tripPlan,
    hasCircularReferences: report.hasCircularReferences,
    warnings: report.warnings
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

  // Use the correct property name from TripPlan interface
  const tripStartDate = tripPlan.startDate || undefined;

  console.log('🎯 TripDetailsContent: About to render UPDATED SharedTripContentRenderer with RAMBLE 66 branding');

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

        {/* UPDATED SharedTripContentRenderer with RAMBLE 66 branding and weather */}
        <SharedTripContentRenderer
          tripPlan={tripPlan}
          tripStartDate={tripStartDate}
          shareUrl={shareUrl}
          isSharedView={true}
        />
      </div>
    </ErrorBoundary>
  );
};

export default TripDetailsContent;
