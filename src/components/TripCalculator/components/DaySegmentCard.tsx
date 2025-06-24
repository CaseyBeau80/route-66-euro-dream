
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Route, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { format, addDays } from 'date-fns';
import UnifiedWeatherWidget from './weather/UnifiedWeatherWidget';

interface DaySegmentCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
  showWeather?: boolean;
  forceShowAttractions?: boolean;
}

const DaySegmentCard: React.FC<DaySegmentCardProps> = ({
  segment,
  tripStartDate,
  cardIndex = 0,
  tripId,
  sectionKey = 'default',
  showWeather = true,
  forceShowAttractions = false
}) => {
  // Calculate the actual date for this segment
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate || !segment.day) return null;
    
    try {
      const baseDate = new Date(tripStartDate);
      const dayOffset = segment.day - 1; // Day 1 should be +0 days
      return addDays(baseDate, dayOffset);
    } catch (error) {
      console.error('Error calculating segment date:', error);
      return null;
    }
  }, [tripStartDate, segment.day]);

  // FIXED: Get distance directly from segment properties with better debugging
  const segmentDistance = React.useMemo(() => {
    const distance = segment.distance || segment.approximateMiles || 0;
    
    console.log(`🔍 DaySegmentCard Day ${segment.day} DISTANCE DEBUG:`, {
      day: segment.day,
      segmentDistance: segment.distance,
      approximateMiles: segment.approximateMiles,
      finalDistance: distance,
      isGoogleMapsData: segment.isGoogleMapsData,
      startCity: segment.startCity,
      endCity: segment.endCity,
      cardIndex,
      sectionKey,
      segmentObject: segment
    });

    return distance;
  }, [segment, cardIndex, sectionKey]);

  // Calculate drive time
  const driveTime = React.useMemo(() => {
    if (segment.driveTimeHours && segment.driveTimeHours > 0) {
      return `${Math.round(segment.driveTimeHours * 10) / 10}h`;
    }
    // Fallback calculation: assume 55 mph average
    const hours = segmentDistance / 55;
    return `${Math.round(hours * 10) / 10}h`;
  }, [segment.driveTimeHours, segmentDistance]);

  const startCity = segment.startCity || 'Start Location';
  const endCity = segment.endCity || 'End Location';

  return (
    <Card className="border border-route66-border hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        {/* Day Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-route66-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
              {segment.day}
            </div>
            <div>
              <h3 className="text-lg font-bold text-route66-text-primary">
                Day {segment.day}
              </h3>
              {segmentDate && (
                <div className="flex items-center gap-1 text-sm text-route66-text-secondary">
                  <Calendar className="w-4 h-4" />
                  {format(segmentDate, 'EEEE, MMMM d')}
                </div>
              )}
            </div>
          </div>
          
          {/* Distance and Time with Data Source Indicator */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-4 text-sm text-route66-text-secondary">
              <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                <Route className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-800">{Math.round(segmentDistance)} miles</span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-800">{driveTime}</span>
              </div>
            </div>
            
            {/* Data Source Badge */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              segment.isGoogleMapsData 
                ? 'bg-green-100 text-green-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {segment.isGoogleMapsData ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  <span>Google Maps</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  <span>Estimated</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Route Information */}
        <div className="mb-4 p-3 bg-route66-vintage-beige rounded-lg border border-route66-tan">
          <div className="flex items-center gap-2 text-route66-text-primary">
            <MapPin className="w-4 h-4 text-route66-accent" />
            <span className="font-semibold">{startCity}</span>
            <span className="text-route66-text-secondary">→</span>
            <span className="font-semibold">{endCity}</span>
          </div>
        </div>

        {/* Weather Widget */}
        {showWeather && segmentDate && (
          <div className="mb-4">
            <UnifiedWeatherWidget 
              segment={segment} 
              tripStartDate={tripStartDate}
            />
          </div>
        )}

        {/* Attractions/Stops */}
        {(segment.attractions && segment.attractions.length > 0) && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-route66-text-primary mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-route66-accent" />
              Recommended Stops ({segment.attractions.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {segment.attractions.slice(0, 4).map((attraction: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-route66-accent transition-colors">
                  <div className="w-2 h-2 bg-route66-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-route66-text-primary text-sm truncate">
                      {attraction.name}
                    </div>
                    {attraction.type && (
                      <div className="text-xs text-route66-text-secondary">
                        {attraction.type}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {segment.attractions.length > 4 && (
              <p className="text-xs text-route66-text-secondary mt-2 text-center">
                + {segment.attractions.length - 4} more stops
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DaySegmentCard;
