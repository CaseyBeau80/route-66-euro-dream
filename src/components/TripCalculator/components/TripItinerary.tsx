
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
  // Generate a simple trip ID for localStorage
  const tripId = tripPlan ? `${tripPlan.startCity}-${tripPlan.endCity}-${tripPlan.totalDays}` : undefined;
  const totalCards = tripPlan?.segments?.length || 0;

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
            <CollapsibleCardGroup 
              className="space-y-4"
              tripId={tripId}
              sectionKey="itinerary"
              autoExpandFirstOnDesktop={true}
              totalCards={totalCards}
            >
              {tripPlan.segments.map((segment, index) => (
                <DaySegmentCard
                  key={segment.day}
                  segment={segment}
                  tripStartDate={tripStartDate}
                  cardIndex={index}
                  tripId={tripId}
                  sectionKey="itinerary"
                />
              ))}
            </CollapsibleCardGroup>
          </TabsContent>
          
          <TabsContent value="weather">
            <CollapsibleCardGroup 
              className="space-y-4"
              tripId={tripId}
              sectionKey="weather"
              totalCards={totalCards}
            >
              {tripPlan.segments.map((segment, index) => (
                <SegmentWeatherWidget
                  key={segment.day}
                  segment={segment}
                  tripStartDate={tripStartDate}
                  cardIndex={index}
                  tripId={tripId}
                  sectionKey="weather"
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
