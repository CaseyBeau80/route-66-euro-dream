
import React from 'react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { CostEstimate } from '../../types/costEstimator';
import PDFTripHeader from './PDFTripHeader';
import PDFDaySegmentCard from './PDFDaySegmentCard';

interface PDFTripContentProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  exportFormat: 'full' | 'summary' | 'route-only';
  costEstimate?: CostEstimate | null;
  shareUrl?: string;
}

const PDFTripContent: React.FC<PDFTripContentProps> = ({
  tripPlan,
  tripStartDate,
  exportFormat,
  costEstimate,
  shareUrl
}) => {
  console.log('📄 [CONSISTENT-PDF] PDF using enhanced system like preview:', {
    format: exportFormat,
    segments: tripPlan.segments.length,
    hasTripStartDate: !!tripStartDate
  });

  return (
    <div className="pdf-content bg-white text-black font-sans">
      {/* Header Section */}
      <PDFTripHeader 
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
        exportFormat={exportFormat}
        costEstimate={costEstimate}
        shareUrl={shareUrl}
      />

      {/* Daily Segments - Using consistent enhanced system */}
      <div className="pdf-daily-segments space-y-6 mt-6">
        {tripPlan.segments.map((segment, index) => (
          <PDFDaySegmentCard
            key={`pdf-day-${segment.day}-${segment.endCity}`}
            segment={segment}
            segmentIndex={index}
            exportFormat={exportFormat}
            tripStartDate={tripStartDate}
          />
        ))}
      </div>
    </div>
  );
};

export default PDFTripContent;
