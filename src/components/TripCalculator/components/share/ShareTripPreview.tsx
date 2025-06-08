
import React from 'react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { Calendar, MapPin, Clock, Route } from 'lucide-react';
import { format } from 'date-fns';

interface ShareTripPreviewProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  currentShareUrl: string | null;
}

const ShareTripPreview: React.FC<ShareTripPreviewProps> = ({
  tripPlan,
  tripStartDate,
  currentShareUrl
}) => {
  const startCity = tripPlan.segments?.[0]?.startCity || 'Start';
  const endCity = tripPlan.segments?.[tripPlan.segments.length - 1]?.endCity || 'End';
  const totalDays = tripPlan.segments?.length || 0;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200/50">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Route className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{tripPlan.title}</h3>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>From {startCity} to {endCity}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
            </div>
            
            {tripStartDate && (
              <div className="flex items-center gap-2 text-gray-600 col-span-2">
                <Calendar className="w-4 h-4" />
                <span>Starting {format(tripStartDate, 'MMMM d, yyyy')}</span>
              </div>
            )}
          </div>

          {currentShareUrl && (
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <p className="text-xs text-gray-500 mb-1">Shareable Link:</p>
              <p className="text-sm font-mono text-blue-600 break-all">{currentShareUrl}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareTripPreview;
