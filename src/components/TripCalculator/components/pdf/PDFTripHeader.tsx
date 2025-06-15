
import React from 'react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { CostEstimate } from '../../types/costEstimator';
import { format } from 'date-fns';

interface PDFTripHeaderProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  exportFormat: 'full' | 'summary' | 'route-only';
  costEstimate?: CostEstimate | null;
  shareUrl?: string;
}

const PDFTripHeader: React.FC<PDFTripHeaderProps> = ({
  tripPlan,
  tripStartDate,
  exportFormat,
  costEstimate,
  shareUrl
}) => {
  const totalDistance = tripPlan.segments.reduce((sum, segment) => sum + (segment.distance || 0), 0);
  const totalDriveTime = tripPlan.segments.reduce((sum, segment) => sum + (segment.driveTimeHours || 0), 0);

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  return (
    <div className="pdf-header bg-gradient-to-r from-route66-primary to-route66-secondary text-white p-6 rounded-lg mb-6">
      {/* Title */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold font-route66 mb-2">
          {tripPlan.title || 'Route 66 Adventure'}
        </h1>
        <p className="text-route66-cream font-travel">
          Your complete Route 66 journey guide
        </p>
      </div>

      {/* Trip Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{tripPlan.segments.length}</div>
          <div className="text-sm text-route66-cream">Days</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold">{Math.round(totalDistance)}</div>
          <div className="text-sm text-route66-cream">Miles</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold">{formatTime(totalDriveTime)}</div>
          <div className="text-sm text-route66-cream">Drive Time</div>
        </div>
        
        {costEstimate && (
          <div className="text-center">
            <div className="text-2xl font-bold">${costEstimate.total?.toLocaleString() || 'N/A'}</div>
            <div className="text-sm text-route66-cream">Est. Cost</div>
          </div>
        )}
      </div>

      {/* Trip Dates */}
      {tripStartDate && (
        <div className="mt-4 text-center">
          <div className="text-sm text-route66-cream">
            <span className="font-semibold">Start Date:</span> {format(tripStartDate, 'EEEE, MMMM d, yyyy')}
          </div>
        </div>
      )}

      {/* Export Format Badge */}
      <div className="mt-4 text-center">
        <span className="px-3 py-1 bg-route66-accent-light text-route66-primary rounded-full text-sm font-semibold">
          {exportFormat === 'full' ? 'Complete Itinerary' : 
           exportFormat === 'summary' ? 'Summary View' : 'Route Only'}
        </span>
      </div>
    </div>
  );
};

export default PDFTripHeader;
