
import React from 'react';
import { TripPlan, TripPlanDataValidator } from '../../services/planning/TripPlanBuilder';
import { PDFDataIntegrityService } from '../../services/pdf/PDFDataIntegrityService';
import PDFDaySegmentCard from '../pdf/PDFDaySegmentCard';
import PDFEnhancedHeader from '../pdf/PDFEnhancedHeader';
import PDFFooter from '../pdf/PDFFooter';
import SegmentWeatherWidget from '../SegmentWeatherWidget';
import ErrorBoundary from '../ErrorBoundary';
import { getDestinationCityWithState } from '../../utils/DestinationUtils';

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
  console.log('📤 SharedTripContentRenderer: Starting render with enhanced safety', {
    tripPlan,
    segmentsCount: tripPlan.segments?.length || 0,
    dailySegmentsCount: tripPlan.dailySegments?.length || 0,
    hasStartDate: !!tripStartDate,
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
      if (!segment.endCity && !getDestinationCityWithState(segment.destination)) return false;
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
              tripStartDate={tripStartDate}
            />
          </div>
        </ErrorBoundary>

        {/* Data Quality Notice */}
        {PDFDataIntegrityService.shouldShowDataQualityNotice(integrityReport) && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="text-sm text-yellow-800">
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

        {/* Enhanced Trip Overview */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
          <h2 className="text-xl font-bold text-blue-800 mb-4 text-center">
            🛣️ YOUR ROUTE 66 JOURNEY OVERVIEW
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
              <div className="font-bold text-blue-600 text-lg">{sanitizedTripPlan.startCity}</div>
              <div className="text-gray-600 text-xs mt-1">Starting Point</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
              <div className="font-bold text-blue-600 text-lg">{sanitizedTripPlan.endCity}</div>
              <div className="text-gray-600 text-xs mt-1">Destination</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
              <div className="font-bold text-red-600 text-lg">{sanitizedTripPlan.totalDays}</div>
              <div className="text-gray-600 text-xs mt-1">Adventure Days</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
              <div className="font-bold text-red-600 text-lg">{Math.round(sanitizedTripPlan.totalDistance)}</div>
              <div className="text-gray-600 text-xs mt-1">Historic Miles</div>
            </div>
          </div>
          
          {/* Journey Description */}
          <div className="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200 text-center">
            <p className="text-sm text-gray-700">
              <strong>🗺️ Experience America's Main Street:</strong> This carefully planned itinerary takes you through 
              the heart of Route 66, featuring historic landmarks, classic diners, vintage motels, and unforgettable 
              roadside attractions that define the spirit of the open road.
            </p>
          </div>
        </div>

        {/* Daily Itinerary */}
        <div className="mb-8">
          <div className="mb-6 text-center p-4 bg-blue-600 rounded">
            <h2 className="text-xl font-bold text-white mb-2">
              📅 DAILY ITINERARY
            </h2>
            <p className="text-blue-100 text-sm">
              Your day-by-day guide to the ultimate Route 66 adventure
            </p>
          </div>
          
          {enrichedSegments.map((segment, index) => {
            console.log(`📤 SharedTripContentRenderer: Rendering segment ${index + 1}`, segment);
            return (
              <ErrorBoundary 
                key={`day-${segment.day}-${index}`} 
                context={`PDFDaySegmentCard-${segment.day}`}
                silent
                fallback={
                  <div className="mb-6 p-4 bg-gray-100 rounded border">
                    <h3 className="font-bold text-gray-700">Day {segment.day}</h3>
                    <p className="text-gray-600">Error loading segment details</p>
                  </div>
                }
              >
                <div className="mb-6">
                  <PDFDaySegmentCard
                    segment={segment}
                    tripStartDate={tripStartDate}
                    segmentIndex={index}
                    exportFormat="full"
                  />
                  
                  {/* Enhanced Weather Integration */}
                  {tripStartDate && (
                    <ErrorBoundary 
                      context={`SegmentWeather-${segment.day}`}
                      silent
                      fallback={
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                          <p className="text-yellow-800">Weather information temporarily unavailable for this segment.</p>
                        </div>
                      }
                    >
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                        <h4 className="text-sm font-semibold text-blue-800 mb-3">
                          🌤️ Weather Forecast for {segment.endCity}
                        </h4>
                        <SegmentWeatherWidget
                          segment={segment}
                          tripStartDate={tripStartDate}
                          cardIndex={index}
                          sectionKey="shared-view"
                          forceExpanded={true}
                          isCollapsible={false}
                        />
                      </div>
                    </ErrorBoundary>
                  )}
                </div>
              </ErrorBoundary>
            );
          })}
        </div>

        {/* Travel Tips Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            🛣️ ROUTE 66 TRAVEL TIPS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-white rounded border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">📱 Planning</h4>
              <ul className="text-gray-600 space-y-1 text-xs">
                <li>• Download offline maps as cell service can be spotty</li>
                <li>• Book accommodations in advance, especially in summer</li>
                <li>• Check attraction hours before visiting</li>
              </ul>
            </div>
            <div className="p-3 bg-white rounded border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">🚗 Driving</h4>
              <ul className="text-gray-600 space-y-1 text-xs">
                <li>• Keep your gas tank at least half full</li>
                <li>• Pack emergency supplies and water</li>
                <li>• Take frequent breaks to avoid fatigue</li>
              </ul>
            </div>
          </div>
        </div>

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
