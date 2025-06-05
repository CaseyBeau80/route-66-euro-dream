
import { useState } from 'react';
import { PlannerFormData, TripItinerary, DestinationCity, DaySegment } from '../types';
import { useDestinationCities } from './useDestinationCities';
import { supabase } from '@/integrations/supabase/client';

export const usePlannerService = () => {
  const { destinationCities } = useDestinationCities();
  const [isLoading, setIsLoading] = useState(false);

  const calculateRouteStops = (startCity: string, endCity: string): DestinationCity[] => {
    const startIndex = destinationCities.findIndex(city => city.name === startCity);
    const endIndex = destinationCities.findIndex(city => city.name === endCity);
    
    if (startIndex === -1 || endIndex === -1) return [];

    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    
    return destinationCities.slice(start, end + 1);
  };

  const calculateDistance = (city1: DestinationCity, city2: DestinationCity): number => {
    // Haversine formula for calculating distance
    const R = 3959; // Earth's radius in miles
    const dLat = (city2.latitude - city1.latitude) * Math.PI / 180;
    const dLon = (city2.longitude - city1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(city1.latitude * Math.PI / 180) * Math.cos(city2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const fetchAttractions = async (cityName: string, state: string) => {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .or(`city_name.ilike.%${cityName}%,state.eq.${state}`)
        .limit(3);

      if (error) {
        console.error('Error fetching attractions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching attractions:', error);
      return [];
    }
  };

  const planTrip = async (formData: PlannerFormData): Promise<TripItinerary> => {
    setIsLoading(true);
    
    try {
      const routeStops = calculateRouteStops(formData.startCity, formData.endCity);
      
      if (routeStops.length < 2) {
        throw new Error('Invalid route selection');
      }

      // Calculate total distance
      let totalDistance = 0;
      for (let i = 0; i < routeStops.length - 1; i++) {
        totalDistance += calculateDistance(routeStops[i], routeStops[i + 1]);
      }

      // Determine trip days based on planning type
      let tripDays: number;
      if (formData.planningType === 'duration') {
        tripDays = formData.tripDuration;
      } else {
        // Calculate days based on daily travel preferences
        const dailyDistance = Math.min(
          formData.dailyMiles,
          formData.dailyHours * 50 // Assume 50 mph average
        );
        tripDays = Math.ceil(totalDistance / dailyDistance);
      }

      // Create daily segments
      const dailySegments: DaySegment[] = [];
      const segmentDistance = totalDistance / tripDays;
      let currentDistance = 0;
      let currentStopIndex = 0;

      for (let day = 1; day <= tripDays; day++) {
        const targetDistance = currentDistance + segmentDistance;
        let nextStopIndex = currentStopIndex;
        let accumulatedDistance = currentDistance;

        // Find the appropriate end city for this day
        while (nextStopIndex < routeStops.length - 1 && accumulatedDistance < targetDistance) {
          const segDist = calculateDistance(routeStops[nextStopIndex], routeStops[nextStopIndex + 1]);
          if (accumulatedDistance + segDist <= targetDistance || day === tripDays) {
            accumulatedDistance += segDist;
            nextStopIndex++;
          } else {
            break;
          }
        }

        // Ensure we reach the final destination on the last day
        if (day === tripDays) {
          nextStopIndex = routeStops.length - 1;
        }

        const startCity = routeStops[currentStopIndex];
        const endCity = routeStops[nextStopIndex];
        const dayDistance = calculateDistance(startCity, endCity);
        const drivingTime = `${Math.floor(dayDistance / 50)}h ${Math.round((dayDistance / 50 % 1) * 60)}m`;
        
        // Get date for this day
        const date = new Date(formData.startDate);
        date.setDate(date.getDate() + day - 1);

        // Fetch attractions for the end city
        const attractions = await fetchAttractions(endCity.name, endCity.state);

        dailySegments.push({
          day,
          date: date.toISOString().split('T')[0],
          startCity,
          endCity,
          distance: Math.round(dayDistance),
          drivingTime,
          attractions,
          funFact: `Day ${day} of your Route 66 adventure!`
        });

        currentDistance = accumulatedDistance;
        currentStopIndex = nextStopIndex;

        if (nextStopIndex >= routeStops.length - 1) break;
      }

      // Create route coordinates
      const route = routeStops.map(city => ({
        lat: city.latitude,
        lng: city.longitude
      }));

      const totalDrivingTime = `${Math.floor(totalDistance / 50)}h ${Math.round((totalDistance / 50 % 1) * 60)}m`;

      const itinerary: TripItinerary = {
        id: `trip-${Date.now()}`,
        startDate: formData.startDate,
        totalDays: tripDays,
        totalDistance: Math.round(totalDistance),
        totalDrivingTime,
        dailySegments,
        route
      };

      return itinerary;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    planTrip,
    isLoading
  };
};
