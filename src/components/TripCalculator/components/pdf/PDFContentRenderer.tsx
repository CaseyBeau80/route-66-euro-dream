
import React from 'react';
import { TripPlan, TripPlanDataValidator } from '../../services/planning/TripPlanBuilder';
import { PDFDataIntegrityService } from '../../services/pdf/PDFDataIntegrityService';
import { useCostEstimator } from '../../hooks/useCostEstimator';
import PDFDaySegmentCard from './PDFDaySegmentCard';
import PDFEnhancedHeader from './PDFEnhancedHeader';
import PDFFooter from './PDFFooter';

interface PDFContentRendererProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  exportOptions: any;
  shareUrl?: string;
}

const PDFContentRenderer: React.FC<PDFContentRendererProps> = ({
  tripPlan,
  tripStartDate,
  exportOptions,
  shareUrl
}) => {
  console.log('📄 PDFContentRenderer: Rendering enhanced PDF content with centralized logo configuration', {
    segmentsCount: tripPlan.segments?.length || 0,
    exportFormat: exportOptions.format,
    hasStartDate: !!tripStartDate,
    title: exportOptions.title
  });

  // Get cost estimate for the trip
  const { costEstimate } = useCostEstimator(tripPlan);

  // Validate and sanitize trip plan data
  const sanitizedTripPlan = TripPlanDataValidator.sanitizeTripPlan(tripPlan);
  const integrityReport = PDFDataIntegrityService.generateIntegrityReport(sanitizedTripPlan);
  
  // Filter segments with enriched weather data
  const enrichedSegments = sanitizedTripPlan.segments?.filter(segment => 
    segment && segment.day && (segment.endCity || segment.destination)
  ) || [];

  const defaultTitle = `Route 66 Adventure: ${sanitizedTripPlan.startCity} to ${sanitizedTripPlan.endCity}`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="pdf-content bg-white min-h-screen" style={{ 
      padding: '32px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      lineHeight: '1.4'
    }}>
      {/* Enhanced PDF Header with Centralized Logo */}
      <PDFEnhancedHeader
        title={exportOptions.title || defaultTitle}
        tripPlan={sanitizedTripPlan}
        tripStartDate={tripStartDate}
      />

      {/* Data Quality Notice */}
      {PDFDataIntegrityService.shouldShowDataQualityNotice(integrityReport) && (
        <div className="pdf-data-quality-notice mb-6 p-4 bg-route66-vintage-beige border-l-4 border-route66-vintage-brown rounded">
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
      <div className="pdf-trip-overview no-page-break mb-8 p-6 bg-gradient-to-r from-route66-cream to-route66-vintage-beige rounded-lg border-2 border-route66-vintage-brown">
        <h2 className="text-xl font-bold text-route66-vintage-red mb-4 font-route66 text-center">
          🛣️ YOUR ROUTE 66 JOURNEY OVERVIEW
        </h2>
        <div className={`grid gap-4 text-sm ${costEstimate ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-4'}`}>
          <div className="pdf-overview-card text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
            <div className="font-bold text-route66-primary text-lg font-route66">From {sanitizedTripPlan.startCity}</div>
            <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Starting Point</div>
          </div>
          <div className="pdf-overview-card text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
            <div className="font-bold text-route66-primary text-lg font-route66">To {sanitizedTripPlan.endCity}</div>
            <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Destination</div>
          </div>
          <div className="pdf-overview-card text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
            <div className="font-bold text-route66-vintage-red text-lg font-route66">{sanitizedTripPlan.totalDays}</div>
            <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Adventure Days</div>
          </div>
          <div className="pdf-overview-card text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
            <div className="font-bold text-route66-vintage-red text-lg font-route66">{Math.round(sanitizedTripPlan.totalDistance)}</div>
            <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Historic Miles</div>
          </div>
          {/* Estimated Cost Card - Only show if cost estimate is available */}
          {costEstimate && (
            <div className="pdf-overview-card text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
              <div className="font-bold text-route66-vintage-red text-lg font-route66">
                {formatCurrency(costEstimate.breakdown.totalCost)}
              </div>
              <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Estimated Cost</div>
            </div>
          )}
        </div>
        
        {/* Journey Description */}
        <div className="mt-4 p-4 bg-route66-vintage-yellow rounded border border-route66-tan text-center">
          <p className="text-sm text-route66-navy font-travel">
            <strong>🗺️ Experience America's Main Street:</strong> This carefully planned itinerary takes you through 
            the heart of Route 66, featuring historic landmarks, classic diners, vintage motels, and unforgettable 
            roadside attractions that define the spirit of the open road.
          </p>
          {/* Cost breakdown summary if available */}
          {costEstimate && (
            <div className="mt-3 pt-3 border-t border-route66-tan">
              <p className="text-xs text-route66-vintage-brown font-travel">
                <strong>💰 Cost Breakdown:</strong> Gas {formatCurrency(costEstimate.breakdown.gasCost)} • 
                Lodging {formatCurrency(costEstimate.breakdown.accommodationCost)} • 
                Meals {formatCurrency(costEstimate.breakdown.mealCost)}
                {costEstimate.breakdown.attractionCost > 0 && ` • Attractions ${formatCurrency(costEstimate.breakdown.attractionCost)}`}
                {costEstimate.breakdown.carRentalCost > 0 && ` • Car Rental ${formatCurrency(costEstimate.breakdown.carRentalCost)}`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Daily Itinerary */}
      <div className="pdf-segments">
        <div className="mb-6 text-center p-4 bg-route66-primary rounded">
          <h2 className="text-xl font-bold text-white mb-2 font-route66">
            📅 DAILY ITINERARY
          </h2>
          <p className="text-route66-cream text-sm font-travel">
            Your day-by-day guide to the ultimate Route 66 adventure
          </p>
        </div>
        
        {enrichedSegments.map((segment, index) => (
          <PDFDaySegmentCard
            key={`day-${segment.day}`}
            segment={segment}
            tripStartDate={tripStartDate}
            segmentIndex={index}
            exportFormat={exportOptions.format}
          />
        ))}
      </div>

      {/* Travel Tips Section */}
      {exportOptions.format === 'full' && (
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
      )}

      {/* Enhanced PDF Footer */}
      <PDFFooter
        shareUrl={shareUrl}
        enrichedSegments={enrichedSegments}
        includeQRCode={exportOptions.includeQRCode}
        dataIntegrityReport={integrityReport}
      />

      {/* Watermark with Route 66 Styling */}
      {exportOptions.watermark && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="text-route66-vintage-brown font-route66 opacity-10 transform rotate-45"
            style={{ fontSize: '120px', zIndex: 1 }}
          >
            {exportOptions.watermark}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFContentRenderer;
