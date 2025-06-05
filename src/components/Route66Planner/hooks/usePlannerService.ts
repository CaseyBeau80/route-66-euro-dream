
import { useState } from 'react';
import { PlannerFormData, TripItinerary, DestinationCity, DaySegment } from '../types';
import { useDestinationCities } from './useDestinationCities';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedDistanceService } from '../services/EnhancedDistanceService';

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

      console.log(`🗺️ Planning trip from ${formData.startCity} to ${formData.endCity}`);

      // Calculate enhanced route metrics
      const routeMetrics = await EnhancedDistanceService.calculateRouteMetrics(routeStops);
      const { totalDistance, totalDuration, isGoogleData, segments } = routeMetrics;

      console.log(`📊 Route metrics: ${totalDistance} miles, ${EnhancedDistanceService.formatDuration(totalDuration)} (Google: ${isGoogleData})`);

      // Determine trip days based on planning type
      let tripDays: number;
      if (formData.planningType === 'duration') {
        tripDays = formData.tripDuration;
      } else {
        // Calculate days based on daily travel preferences using real durations
        const dailyDurationLimit = formData.dailyHours * 3600; // Convert hours to seconds
        const dailyDistanceLimit = formData.dailyMiles;
        
        // Use the more restrictive limit
        const dailyDurationDays = Math.ceil(totalDuration / dailyDurationLimit);
        const dailyDistanceDays = Math.ceil(totalDistance / dailyDistanceLimit);
        
        tripDays = Math.max(dailyDurationDays, dailyDistanceDays);
        
        // Ensure minimum of 3 days and maximum of 21 days
        tripDays = Math.max(3, Math.min(21, tripDays));
      }

      console.log(`📅 Planned for ${tripDays} days`);

      // Create daily segments with enhanced timing
      const dailySegments: DaySegment[] = [];
      const segmentDuration = totalDuration / tripDays;
      const segmentDistance = totalDistance / tripDays;
      let currentDuration = 0;
      let currentDistance = 0;
      let currentStopIndex = 0;

      for (let day = 1; day <= tripDays; day++) {
        const targetDuration = currentDuration + segmentDuration;
        const targetDistance = currentDistance + segmentDistance;
        let nextStopIndex = currentStopIndex;
        let accumulatedDuration = currentDuration;
        let accumulatedDistance = currentDistance;

        // Find the appropriate end city for this day using real segments
        while (nextStopIndex < segments.length && accumulatedDuration < targetDuration) {
          const segment = segments[nextStopIndex];
          
          if (accumulatedDuration + segment.duration <= targetDuration || day === tripDays) {
            accumulatedDuration += segment.duration;
            accumulatedDistance += segment.distance;
            nextStopIndex++;
          } else {
            break;
          }
        }

        // Ensure we reach the final destination on the last day
        if (day === tripDays) {
          nextStopIndex = routeStops.length - 1;
          accumulatedDistance = totalDistance;
          accumulatedDuration = totalDuration;
        }

        const startCity = routeStops[currentStopIndex];
        const endCity = routeStops[Math.min(nextStopIndex, routeStops.length - 1)];
        
        // Calculate day-specific metrics
        const dayDistance = accumulatedDistance - currentDistance;
        const dayDuration = accumulatedDuration - currentDuration;
        const drivingTime = EnhancedDistanceService.formatDuration(dayDuration);
        
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
        currentDuration = accumulatedDuration;
        currentStopIndex = Math.min(nextStopIndex, routeStops.length - 1);

        if (nextStopIndex >= routeStops.length - 1) break;
      }

      // Create route coordinates
      const route = routeStops.map(city => ({
        lat: city.latitude,
        lng: city.longitude
      }));

      const totalDrivingTime = EnhancedDistanceService.formatDuration(totalDuration);

      const itinerary: TripItinerary = {
        id: `trip-${Date.now()}`,
        startDate: formData.startDate,
        totalDays: tripDays,
        totalDistance,
        totalDrivingTime,
        dailySegments,
        route
      };

      console.log(`✅ Trip planned successfully: ${tripDays} days, ${totalDistance} miles`);

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
