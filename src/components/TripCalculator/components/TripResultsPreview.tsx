
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Clock, DollarSign } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useCostEstimator } from '../hooks/useCostEstimator';
import { useUnits } from '@/contexts/UnitContext';
import { format, addDays } from 'date-fns';
import PreviewDailyItinerary from './PreviewDailyItinerary';

interface TripResultsPreviewProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
}

const TripResultsPreview: React.FC<TripResultsPreviewProps> = ({
  tripPlan,
  tripStartDate
}) => {
  const { formatDistance } = useUnits();
  const { costEstimate } = useCostEstimator(tripPlan);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const totalAttractions = tripPlan.segments?.reduce((total, segment) => {
    return total + (segment.attractions?.length || 0);
  }, 0) || 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Trip Overview Header - Clean Blue Theme */}
      <Card className="border-blue-200 bg-white shadow-md">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
          <CardTitle className="text-2xl font-bold text-blue-700 mb-2">
            Your Route 66 Adventure
          </CardTitle>
          <p className="text-gray-600">
            {tripPlan.startCity} to {tripPlan.endCity}
          </p>
          {tripStartDate && (
            <p className="text-sm text-gray-500 mt-1">
              Starts: {format(tripStartDate, 'EEEE, MMMM d, yyyy')}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Key Stats - Matching Preview Layout */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{tripPlan.totalDays}</div>
              <div className="text-sm text-gray-600">Days</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {Math.round(tripPlan.totalDistance)}
              </div>
              <div className="text-sm text-gray-600">Miles</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {Math.round((tripPlan.totalDistance || 0) / 55)}
              </div>
              <div className="text-sm text-gray-600">Drive Hours</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{totalAttractions}</div>
              <div className="text-sm text-gray-600">Attractions</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {costEstimate ? formatCurrency(costEstimate.breakdown.totalCost) : '$624'}
              </div>
              <div className="text-sm text-gray-600">Est. Cost</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary Section */}
      <Card className="border-blue-200 bg-white shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
          <CardTitle className="text-xl font-bold text-blue-700">
            Daily Itinerary
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <PreviewDailyItinerary 
            segments={tripPlan.segments || []}
            tripStartDate={tripStartDate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TripResultsPreview;
