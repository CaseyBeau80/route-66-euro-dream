
import React from 'react';
import { Calendar } from 'lucide-react';
import { addDays } from 'date-fns';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { formatDate } from './utils/itineraryCardUtils';

interface ItineraryCardDatesProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
}

const ItineraryCardDates: React.FC<ItineraryCardDatesProps> = ({
  tripPlan,
  tripStartDate
}) => {
  const calculateEndDate = (): Date | null => {
    if (!tripStartDate) return null;
    return addDays(tripStartDate, tripPlan.totalDays - 1);
  };

  const endDate = calculateEndDate();

  if (!tripStartDate && !endDate) {
    return null;
  }

  return (
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
  );
};

export default ItineraryCardDates;
