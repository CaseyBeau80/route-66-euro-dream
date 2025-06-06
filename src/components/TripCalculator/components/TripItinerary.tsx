
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import DaySegmentCard from './DaySegmentCard';
import SegmentWeatherWidget from './SegmentWeatherWidget';
import CollapsibleCardGroup from './CollapsibleCardGroup';

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
    <Card className="border-route66-border">
      <CardHeader className="pb-4">
        <CardTitle className="font-travel text-route66-text-primary">
          Daily Itinerary
        </CardTitle>
        <p className="text-sm text-route66-text-secondary">
          Streamlined overview of your {tripPlan.totalDays}-day Route 66 adventure
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="itinerary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="itinerary" className="text-sm">Route & Stops</TabsTrigger>
            <TabsTrigger value="weather" className="text-sm">Weather Forecast</TabsTrigger>
          </TabsList>
          
          <TabsContent value="itinerary">
            <CollapsibleCardGroup className="space-y-4">
              {tripPlan.segments.map((segment) => (
                <DaySegmentCard
                  key={segment.day}
                  segment={segment}
                  tripStartDate={tripStartDate}
                />
              ))}
            </CollapsibleCardGroup>
          </TabsContent>
          
          <TabsContent value="weather">
            <CollapsibleCardGroup className="space-y-4">
              {tripPlan.segments.map((segment) => (
                <SegmentWeatherWidget
                  key={segment.day}
                  segment={segment}
                  tripStartDate={tripStartDate}
                />
              ))}
            </CollapsibleCardGroup>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TripItinerary;
