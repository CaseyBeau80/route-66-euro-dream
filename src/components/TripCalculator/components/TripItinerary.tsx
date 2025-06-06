
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import DailySegmentCard from './DailySegmentCard';
import SegmentWeatherWidget from './SegmentWeatherWidget';

interface TripItineraryProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  formatTime: (hours: number) => string;
}

const TripItinerary: React.FC<TripItineraryProps> = ({
  tripPlan,
  tripStartDate,
  formatTime
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-travel text-route66-text-primary">
          Daily Itinerary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="itinerary" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="itinerary">Route & Stops</TabsTrigger>
            <TabsTrigger value="weather">Weather Forecast</TabsTrigger>
          </TabsList>
          
          <TabsContent value="itinerary" className="space-y-4 mt-6">
            {tripPlan.segments.map((segment, index) => (
              <DailySegmentCard
                key={segment.day}
                segment={segment}
                formatTime={formatTime}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="weather" className="space-y-4 mt-6">
            {tripPlan.segments.map((segment) => (
              <SegmentWeatherWidget
                key={segment.day}
                segment={segment}
                tripStartDate={tripStartDate}
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TripItinerary;
