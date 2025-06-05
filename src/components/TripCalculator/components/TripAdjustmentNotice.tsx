
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Clock, Shield } from 'lucide-react';

interface TripAdjustmentNoticeProps {
  originalDays: number;
  adjustedDays: number;
  driveTimeBalance?: {
    averageDriveTime: number;
    balanceQuality: 'excellent' | 'good' | 'fair' | 'poor';
  };
}

const TripAdjustmentNotice: React.FC<TripAdjustmentNoticeProps> = ({
  originalDays,
  adjustedDays,
  driveTimeBalance
}) => {
  const getAdjustmentReason = () => {
    if (adjustedDays > originalDays) {
      return {
        icon: <Shield className="h-4 w-4" />,
        title: "Trip Extended for Comfort & Safety",
        reason: "to ensure comfortable daily driving times and safer travel",
        benefit: "More time to enjoy attractions and rest between destinations"
      };
    } else {
      return {
        icon: <Clock className="h-4 w-4" />,
        title: "Trip Optimized for Better Balance",
        reason: "to create a more balanced and enjoyable travel experience",
        benefit: "Better pacing with optimal driving times each day"
      };
    }
  };

  const adjustment = getAdjustmentReason();
  const avgDriveTime = driveTimeBalance?.averageDriveTime;

  return (
    <Alert className="border-blue-200 bg-blue-50 text-blue-900 mb-6">
      <Info className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2 text-blue-900 font-semibold">
        {adjustment.icon}
        {adjustment.title}
      </AlertTitle>
      <AlertDescription className="text-blue-800 mt-2">
        <div className="space-y-2">
          <p>
            We've adjusted your trip from <strong>{originalDays} days</strong> to{' '}
            <strong>{adjustedDays} days</strong> {adjustment.reason}.
          </p>
          
          {avgDriveTime && (
            <p className="text-sm">
              <strong>Average daily driving time:</strong> {Math.round(avgDriveTime)}h{' '}
              <span className="text-blue-600">
                ({driveTimeBalance?.balanceQuality === 'excellent' ? '🌟 Excellent' :
                  driveTimeBalance?.balanceQuality === 'good' ? '✅ Good' :
                  driveTimeBalance?.balanceQuality === 'fair' ? '👍 Fair' : '⚠️ Needs attention'} balance)
              </span>
            </p>
          )}
          
          <p className="text-sm italic text-blue-700">
            💡 {adjustment.benefit}
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default TripAdjustmentNotice;
