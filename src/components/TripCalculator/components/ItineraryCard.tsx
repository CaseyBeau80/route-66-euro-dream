
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MapPin, Clock, Calendar, DollarSign, ChevronRight } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useUnits } from '@/contexts/UnitContext';

interface ItineraryCardProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  tripStyle?: string;
  onViewDetails?: () => void;
  className?: string;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({
  tripPlan,
  tripStartDate,
  tripStyle = 'balanced',
  onViewDetails,
  className = ''
}) => {
  const { formatDistance } = useUnits();

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const formatDate = (date: Date): string => {
    return format(date, 'MMM d, yyyy');
  };

  const calculateEndDate = (): Date | null => {
    if (!tripStartDate) return null;
    return addDays(tripStartDate, tripPlan.totalDays - 1);
  };

  const getTripStyleInfo = () => {
    switch (tripStyle) {
      case 'destination-focused':
        return {
          label: 'Heritage-Optimized',
          description: 'Prioritizes consecutive major Route 66 heritage cities for an authentic Mother Road experience',
          color: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case 'balanced':
        return {
          label: 'Balanced',
          description: 'Evenly distributes driving time across all days for consistent daily travel',
          color: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      default:
        return {
          label: 'Custom',
          description: 'Custom trip planning approach',
          color: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const endDate = calculateEndDate();
  const tripStyleInfo = getTripStyleInfo();

  return (
    <div className={className} data-testid="itinerary-card">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <MapPin className="h-5 w-5" aria-hidden="true" />
              <span>Your Route 66 Adventure</span>
            </CardTitle>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="secondary" 
                    className={`${tripStyleInfo.color} font-medium`}
                    aria-label={`Trip style: ${tripStyleInfo.label}`}
                  >
                    {tripStyleInfo.label}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{tripStyleInfo.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="mt-2">
            <p className="text-blue-100 text-sm font-medium">
              {tripPlan.startCity} → {tripPlan.endCity}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Trip Overview Section */}
          <section aria-labelledby="trip-overview" className="mb-6">
            <h3 id="trip-overview" className="sr-only">Trip Overview</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100" role="group" aria-label="Trip duration">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <span className="text-sm font-medium text-blue-800">Duration</span>
                </div>
                <div className="text-2xl font-bold text-blue-900" aria-label={`${tripPlan.totalDays} days`}>
                  {tripPlan.totalDays} Days
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100" role="group" aria-label="Total distance">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <span className="text-sm font-medium text-blue-800">Distance</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatDistance(tripPlan.totalDistance)}
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100" role="group" aria-label="Driving time">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <span className="text-sm font-medium text-blue-800">Drive Time</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatTime(tripPlan.totalDrivingTime)}
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100" role="group" aria-label="Estimated cost">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <span className="text-sm font-medium text-blue-800">Est. Cost</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  <span className="text-lg">Coming Soon</span>
                </div>
              </div>
            </div>
          </section>

          {/* Trip Dates Section */}
          {(tripStartDate || endDate) && (
            <section aria-labelledby="trip-dates" className="mb-6">
              <h3 id="trip-dates" className="sr-only">Trip Dates</h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {tripStartDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" aria-hidden="true" />
                      <div>
                        <span className="text-sm text-blue-700 font-medium">Starts:</span>
                        <span className="ml-2 text-blue-900 font-semibold" aria-label={`Trip starts on ${formatDate(tripStartDate)}`}>
                          {formatDate(tripStartDate)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" aria-hidden="true" />
                      <div>
                        <span className="text-sm text-blue-700 font-medium">Ends:</span>
                        <span className="ml-2 text-blue-900 font-semibold" aria-label={`Trip ends on ${formatDate(endDate)}`}>
                          {formatDate(endDate)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Action Button */}
          {onViewDetails && (
            <div className="flex justify-center">
              <button
                onClick={onViewDetails}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="View detailed itinerary"
              >
                View Detailed Itinerary
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* ARIA Live Region for Dynamic Updates */}
          <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
            Trip summary updated: {tripPlan.totalDays} day journey from {tripPlan.startCity} to {tripPlan.endCity}, 
            covering {formatDistance(tripPlan.totalDistance)} with {formatTime(tripPlan.totalDrivingTime)} of driving time.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItineraryCard;
