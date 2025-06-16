
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { MapPin, Clock, Star, Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import EnhancedWeatherWidget from './weather/EnhancedWeatherWidget';

interface PreviewDayCardProps {
  segment: DailySegment;
  dayIndex: number;
  tripStartDate?: Date;
  isLast: boolean;
}

const PreviewDayCard: React.FC<PreviewDayCardProps> = ({
  segment,
  dayIndex,
  tripStartDate,
  isLast
}) => {
  const segmentDate = tripStartDate ? 
    addDays(tripStartDate, dayIndex) : 
    undefined;

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    return `${wholeHours}h ${minutes}m`;
  };

  return (
    <div className={`group relative bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${!isLast ? 'mb-8' : ''}`}>
      {/* Decorative gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute inset-[1px] bg-white rounded-2xl"></div>
      
      {/* Content container */}
      <div className="relative z-10">
        {/* Enhanced Header Section */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Enhanced day number badge */}
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                  {segment.day}
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-yellow-700" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Day {segment.day}</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{segment.startCity} → {segment.endCity}</span>
                </div>
                {segmentDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{format(segmentDate, 'EEEE, MMM d')}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Enhanced stats section */}
            <div className="text-right">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 justify-end">
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {Math.round(segment.distance)} miles
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {formatTime(segment.driveTimeHours || segment.distance / 55)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Weather Section */}
        {tripStartDate && segmentDate && (
          <div className="bg-gradient-to-r from-green-50 via-blue-50 to-green-50 border-b border-green-100">
            <div className="p-5">
              <EnhancedWeatherWidget
                segment={segment}
                tripStartDate={tripStartDate}
                isSharedView={false}
                isPDFExport={false}
              />
            </div>
          </div>
        )}

        {/* Enhanced Recommended Stops Section */}
        {segment.attractions && segment.attractions.length > 0 && (
          <div className="p-6 bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Recommended Stops</h4>
            </div>
            
            <div className="grid gap-3">
              {segment.attractions.slice(0, 3).map((attraction, idx) => (
                <div key={idx} className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{idx + 1}</span>
                  </div>
                  <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    {attraction.name}
                  </span>
                </div>
              ))}
              
              {segment.attractions.length > 3 && (
                <div className="mt-2 p-3 bg-gradient-to-r from-gray-100 to-blue-100 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium text-center">
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      +{segment.attractions.length - 3} more amazing stops to discover
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewDayCard;
