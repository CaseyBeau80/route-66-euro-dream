
import React from 'react';
import { TripPlan, TripPlanDataValidator } from '../../services/planning/TripPlanBuilder';
import { PDFDataIntegrityService } from '../../services/pdf/PDFDataIntegrityService';
import PDFDaySegmentCard from '../pdf/PDFDaySegmentCard';
import PDFEnhancedHeader from '../pdf/PDFEnhancedHeader';
import PDFFooter from '../pdf/PDFFooter';

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
  console.log('📤 SharedTripContentRenderer: Starting render', {
    tripPlan,
    segmentsCount: tripPlan.segments?.length || 0,
    dailySegmentsCount: tripPlan.dailySegments?.length || 0,
    hasStartDate: !!tripStartDate,
    isSharedView,
    tripPlanType: typeof tripPlan,
    tripPlanKeys: Object.keys(tripPlan || {})
  });

  // Validate that we have trip data
  if (!tripPlan) {
    console.error('❌ SharedTripContentRenderer: No trip plan provided');
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trip Not Available</h2>
        <p className="text-gray-600">The trip data could not be loaded.</p>
      </div>
    );
  }

  try {
    // Validate and sanitize trip plan data
    console.log('📤 SharedTripContentRenderer: Sanitizing trip plan');
    const sanitizedTripPlan = TripPlanDataValidator.sanitizeTripPlan(tripPlan);
    console.log('📤 SharedTripContentRenderer: Sanitized trip plan', sanitizedTripPlan);
    
    const integrityReport = PDFDataIntegrityService.generateIntegrityReport(sanitizedTripPlan);
    console.log('📤 SharedTripContentRenderer: Integrity report', integrityReport);
    
    // Use segments or dailySegments, whichever is available
    const rawSegments = sanitizedTripPlan.segments || sanitizedTripPlan.dailySegments || [];
    console.log('📤 SharedTripContentRenderer: Raw segments', rawSegments);
    
    // Filter segments with enriched weather data
    const enrichedSegments = rawSegments.filter(segment => 
      segment && segment.day && (segment.endCity || segment.destination)
    ) || [];

    console.log('📤 SharedTripContentRenderer: Processed segments', {
      rawSegmentsCount: rawSegments.length,
      enrichedSegmentsCount: enrichedSegments.length,
      enrichedSegments: enrichedSegments.map(s => ({ day: s.day, endCity: s.endCity, startCity: s.startCity }))
    });

    if (enrichedSegments.length === 0) {
      console.warn('⚠️ SharedTripContentRenderer: No valid segments found');
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">No Trip Segments</h2>
          <p className="text-gray-600">This trip doesn't have any valid segments to display.</p>
          <div className="mt-4 p-4 bg-yellow-100 rounded text-sm text-left">
            <strong>Debug Info:</strong>
            <div>Raw segments: {rawSegments.length}</div>
            <div>Sanitized trip plan keys: {Object.keys(sanitizedTripPlan).join(', ')}</div>
            <pre className="mt-2 text-xs">{JSON.stringify(rawSegments.slice(0, 2), null, 2)}</pre>
          </div>
        </div>
      );
    }

    const defaultTitle = `Route 66 Adventure: ${sanitizedTripPlan.startCity} to ${sanitizedTripPlan.endCity}`;
    console.log('📤 SharedTripContentRenderer: About to render main content');

    return (
      <div className="shared-content bg-white min-h-screen" style={{ 
        padding: '32px', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: '1.4'
      }}>
        {/* Enhanced PDF Header */}
        <PDFEnhancedHeader
          title={defaultTitle}
          tripPlan={sanitizedTripPlan}
          tripStartDate={tripStartDate}
        />

        {/* Data Quality Notice */}
        {PDFDataIntegrityService.shouldShowDataQualityNotice(integrityReport) && (
          <div className="data-quality-notice mb-6 p-4 bg-route66-vintage-beige border-l-4 border-route66-vintage-brown rounded">
            <div className="text-sm text-route66-vintage-brown">
              <div className="font-semibold mb-1">
                {PDFDataIntegrityService.generateDataQualityMessage(integrityReport)}
              </div>
              {integrityReport.warnings.length > 0 && (
                <ul className="text-xs space-y-1 mt-2">
                  {integrityReport.warnings.slice(0, 2).map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Trip Overview with Route 66 Styling */}
        <div className="trip-overview no-page-break mb-8 p-6 bg-gradient-to-r from-route66-cream to-route66-vintage-beige rounded-lg border-2 border-route66-vintage-brown">
          <h2 className="text-xl font-bold text-route66-vintage-red mb-4 font-route66 text-center">
            🛣️ YOUR ROUTE 66 JOURNEY OVERVIEW
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="overview-card text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
              <div className="font-bold text-route66-primary text-lg font-route66">{sanitizedTripPlan.startCity}</div>
              <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Starting Point</div>
            </div>
            <div className="overview-card text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
              <div className="font-bold text-route66-primary text-lg font-route66">{sanitizedTripPlan.endCity}</div>
              <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Destination</div>
            </div>
            <div className="overview-card text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
              <div className="font-bold text-route66-vintage-red text-lg font-route66">{sanitizedTripPlan.totalDays}</div>
              <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Adventure Days</div>
            </div>
            <div className="overview-card text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
              <div className="font-bold text-route66-vintage-red text-lg font-route66">{Math.round(sanitizedTripPlan.totalDistance)}</div>
              <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Historic Miles</div>
            </div>
          </div>
          
          {/* Journey Description */}
          <div className="mt-4 p-4 bg-route66-vintage-yellow rounded border border-route66-tan text-center">
            <p className="text-sm text-route66-navy font-travel">
              <strong>🗺️ Experience America's Main Street:</strong> This carefully planned itinerary takes you through 
              the heart of Route 66, featuring historic landmarks, classic diners, vintage motels, and unforgettable 
              roadside attractions that define the spirit of the open road.
            </p>
          </div>
        </div>

        {/* Daily Itinerary */}
        <div className="segments">
          <div className="mb-6 text-center p-4 bg-route66-primary rounded">
            <h2 className="text-xl font-bold text-white mb-2 font-route66">
              📅 DAILY ITINERARY
            </h2>
            <p className="text-route66-cream text-sm font-travel">
              Your day-by-day guide to the ultimate Route 66 adventure
            </p>
          </div>
          
          {enrichedSegments.map((segment, index) => {
            console.log(`📤 SharedTripContentRenderer: Rendering segment ${index + 1}`, segment);
            return (
              <PDFDaySegmentCard
                key={`day-${segment.day}`}
                segment={segment}
                tripStartDate={tripStartDate}
                segmentIndex={index}
                exportFormat="full"
              />
            );
          })}
        </div>

        {/* Travel Tips Section */}
        <div className="mt-8 p-6 bg-route66-vintage-beige rounded-lg border-2 border-route66-vintage-brown">
          <h3 className="text-lg font-bold text-route66-vintage-red mb-4 font-route66 text-center">
            🛣️ ROUTE 66 TRAVEL TIPS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-white rounded border border-route66-tan">
              <h4 className="font-semibold text-route66-navy mb-2">📱 Planning</h4>
              <ul className="text-route66-vintage-brown space-y-1 text-xs">
                <li>• Download offline maps as cell service can be spotty</li>
                <li>• Book accommodations in advance, especially in summer</li>
                <li>• Check attraction hours before visiting</li>
              </ul>
            </div>
            <div className="p-3 bg-white rounded border border-route66-tan">
              <h4 className="font-semibold text-route66-navy mb-2">🚗 Driving</h4>
              <ul className="text-route66-vintage-brown space-y-1 text-xs">
                <li>• Keep your gas tank at least half full</li>
                <li>• Pack emergency supplies and water</li>
                <li>• Take frequent breaks to avoid fatigue</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Enhanced Footer - Only show QR code in shared view */}
        <PDFFooter
          shareUrl={shareUrl}
          enrichedSegments={enrichedSegments}
          includeQRCode={isSharedView}
          dataIntegrityReport={integrityReport}
        />
      </div>
    );

  } catch (error) {
    console.error('❌ SharedTripContentRenderer: Error during render', error);
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Rendering Error</h2>
        <p className="text-gray-600">There was an error displaying the trip content.</p>
        <div className="mt-4 p-4 bg-red-100 rounded text-sm text-left">
          <strong>Error:</strong> {error instanceof Error ? error.message : String(error)}
          <div className="mt-2">
            <strong>Stack:</strong>
            <pre className="text-xs mt-1">{error instanceof Error ? error.stack : 'No stack trace'}</pre>
          </div>
        </div>
      </div>
    );
  }
};

export default SharedTripContentRenderer;
