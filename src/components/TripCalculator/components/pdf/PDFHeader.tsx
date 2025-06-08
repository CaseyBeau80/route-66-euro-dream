
import React from 'react';
import { format } from 'date-fns';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import PDFLogo from './components/PDFLogo';

interface PDFHeaderProps {
  title: string;
  tripPlan: TripPlan;
  tripStartDate?: Date;
}

const PDFHeader: React.FC<PDFHeaderProps> = ({
  title,
  tripPlan,
  tripStartDate
}) => {
  return (
    <div className="pdf-header no-page-break mb-8 text-center border-b-2 border-blue-200 pb-6">
      {/* Logo and Branding */}
      <div className="flex justify-center mb-4">
        <PDFLogo showFallback={true} />
      </div>
      
      {/* Trip Title */}
      <h1 className="text-3xl font-bold text-blue-800 mb-2">
        {title}
      </h1>
      
      {/* Trip Subtitle */}
      <div className="text-lg text-gray-600 mb-2">
        {tripPlan.totalDays} Day Adventure • {Math.round(tripPlan.totalDistance)} Miles
      </div>
      
      {/* Trip Dates */}
      {tripStartDate && (
        <div className="text-sm text-gray-500 mb-2">
          Trip Dates: {format(tripStartDate, 'MMMM d, yyyy')} - {format(
            new Date(tripStartDate.getTime() + (tripPlan.totalDays - 1) * 24 * 60 * 60 * 1000),
            'MMMM d, yyyy'
          )}
        </div>
      )}
      
      {/* Generation Date */}
      <div className="text-sm text-gray-500">
        Generated on {format(new Date(), 'MMMM d, yyyy')}
      </div>
    </div>
  );
};

export default PDFHeader;
