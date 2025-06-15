
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Calendar, DollarSign } from 'lucide-react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { useCostEstimator } from '../../hooks/useCostEstimator';
import { format, addDays } from 'date-fns';

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
  const { costEstimate } = useCostEstimator(tripPlan);

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateEndDate = (): Date | null => {
    if (!tripStartDate) return null;
    return addDays(tripStartDate, tripPlan.totalDays - 1);
  };

  const endDate = calculateEndDate();

  console.log('🎨 SharedTripContentRenderer: Rendering with RAMBLE 66 branding and modern layout');

  return (
    <div className="bg-white text-black font-sans">
      {/* Header with RAMBLE 66 Branding */}
      <div className="text-center mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">66</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">RAMBLE 66</h1>
            <p className="text-blue-100 text-sm">Route 66 Trip Planner</p>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">
          {tripPlan.startCity} → {tripPlan.endCity}
        </h2>
        {tripStartDate && (
          <div className="text-blue-100 text-sm">
            <span>Starts: {format(tripStartDate, 'EEEE, MMMM d, yyyy')}</span>
            {endDate && (
              <>
                <span className="mx-2">•</span>
                <span>Ends: {format(endDate, 'EEEE, MMMM d, yyyy')}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Four-Column Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-800">{tripPlan.totalDays}</div>
          <div className="text-sm text-gray-600">Days</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-800">{Math.round(tripPlan.totalDistance)}</div>
          <div className="text-sm text-gray-600">Miles</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-800">{formatTime(tripPlan.totalDrivingTime || 0)}</div>
          <div className="text-sm text-gray-600">Drive Time</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-800">
            {costEstimate ? formatCurrency(costEstimate.breakdown.totalCost) : '--'}
          </div>
          <div className="text-sm text-gray-600">Est. Cost</div>
        </div>
      </div>

      {/* Trip Highlights */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-blue-700">Trip Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tripPlan.segments?.slice(0, 5).map((segment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">Day {index + 1}: {segment.startCity} → {segment.endCity}</div>
                  <div className="text-sm text-gray-600">
                    {Math.round(segment.distance || 0)} miles • {formatTime(segment.driveTimeHours)}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {segment.attractions?.length || 0} attractions
                </div>
              </div>
            ))}
            {tripPlan.segments && tripPlan.segments.length > 5 && (
              <div className="text-center text-gray-500 text-sm italic">
                ...and {tripPlan.segments.length - 5} more days of adventure!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-8 pt-6 border-t border-gray-200">
        <p>Plan your own Route 66 adventure at <strong>ramble66.com</strong></p>
        <p className="mt-1">The ultimate Route 66 trip planning experience</p>
      </div>
    </div>
  );
};

export default SharedTripContentRenderer;
