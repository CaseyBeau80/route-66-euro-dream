
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { AlertTriangle, Info } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface SegmentHeaderProps {
  segment: DailySegment;
  showAdjustmentWarning?: boolean;
}

const getRouteSectionColor = (section?: string) => {
  switch (section) {
    case 'Early Route': return 'bg-green-100 text-green-800 border-green-200';
    case 'Mid Route': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Final Stretch': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getDriveTimeBadge = (category?: { category: string; message: string; color: string }) => {
  if (!category) return null;

  const iconMap = {
    short: <AlertTriangle className="h-3 w-3" />,
    optimal: <AlertTriangle className="h-3 w-3" />,
    long: <AlertTriangle className="h-3 w-3" />,
    extreme: <AlertTriangle className="h-3 w-3" />
  };

  const bgColorMap = {
    short: 'bg-green-100 border-green-200',
    optimal: 'bg-blue-100 border-blue-200', 
    long: 'bg-orange-100 border-orange-200',
    extreme: 'bg-red-100 border-red-200'
  };

  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${bgColorMap[category.category as keyof typeof bgColorMap]} ${category.color}`}>
      {iconMap[category.category as keyof typeof iconMap]}
      <span className="capitalize">{category.category}</span>
    </div>
  );
};

const SegmentHeader: React.FC<SegmentHeaderProps> = ({ segment, showAdjustmentWarning = false }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <CardTitle className="font-route66 text-lg text-route66-vintage-red">
          {segment.title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {segment.routeSection && (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getRouteSectionColor(segment.routeSection)}`}>
              {segment.routeSection}
            </span>
          )}
          {getDriveTimeBadge(segment.driveTimeCategory)}
        </div>
      </div>

      {/* Drive Time Balance Message */}
      {segment.driveTimeCategory && (
        <div className={`mt-2 p-2 rounded border text-xs ${
          segment.driveTimeCategory.category === 'optimal' ? 'bg-blue-50 border-blue-200 text-blue-800' :
          segment.driveTimeCategory.category === 'short' ? 'bg-green-50 border-green-200 text-green-800' :
          segment.driveTimeCategory.category === 'long' ? 'bg-orange-50 border-orange-200 text-orange-800' :
          'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>{segment.driveTimeCategory.message}</span>
          </div>
        </div>
      )}

      {showAdjustmentWarning && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span className="font-semibold">Trip Duration Adjusted for Balanced Drive Times</span>
          </div>
          <p className="text-xs mt-1">We've optimized your trip duration for consistent daily driving experiences.</p>
        </div>
      )}
    </>
  );
};

export default SegmentHeader;
