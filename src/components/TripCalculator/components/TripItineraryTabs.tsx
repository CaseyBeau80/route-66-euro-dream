
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TripItineraryTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const TripItineraryTabs: React.FC<TripItineraryTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="itinerary">Daily Itinerary</TabsTrigger>
      <TabsTrigger value="weather">Weather Forecast</TabsTrigger>
      <TabsTrigger value="costs">Cost Estimates</TabsTrigger>
      <TabsTrigger value="overview">Trip Overview</TabsTrigger>
    </TabsList>
  );
};

export default TripItineraryTabs;
