
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import SegmentNearbyAttractions from '../SegmentNearbyAttractions';

interface PDFDaySegmentCardStopsProps {
  segment: DailySegment;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFDaySegmentCardStops: React.FC<PDFDaySegmentCardStopsProps> = ({
  segment,
  exportFormat
}) => {
  // Skip stops for route-only format
  if (exportFormat === 'route-only') {
    return null;
  }

  console.log('📄 PDFDaySegmentCardStops: Using SAME data source as modal (SegmentNearbyAttractions) for', segment.endCity, {
    exportFormat,
    day: segment.day,
    useModalDataSource: true
  });

  // Use the EXACT SAME component that the modal uses for recommended stops
  // This ensures PDF matches the modal exactly
  return (
    <div className="pdf-stops-section mb-4">
      <SegmentNearbyAttractions 
        segment={segment}
        maxAttractions={exportFormat === 'summary' ? 3 : 6}
        forceDisplay={true}
      />
    </div>
  );
};

export default PDFDaySegmentCardStops;
