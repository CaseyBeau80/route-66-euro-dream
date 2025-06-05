
import { useState } from 'react';
import { PlannerFormData, TripItinerary, DestinationCity, DaySegment } from '../types';
import { useDestinationCities } from './useDestinationCities';
import { supabase } from '@/integrations/supabase/client';
import { GoogleDistanceMatrixService } from '../services/GoogleDistanceMatrixService';

export const usePlannerService = () => {
  const { destinationCities } = useDestinationCities();
  const [isLoading, setIsLoading] = useState(false);

  const calculateRouteStops = (startCity: string, endCity: string): DestinationCity[] => {
    console.log(`🗺️ Calculating route stops from ${startCity} to ${endCity}`);
    
    const startIndex = destinationCities.findIndex(city => city.name === startCity);
    const endIndex = destinationCities.findIndex(city => city.name === endCity);
    
    if (startIndex === -1 || endIndex === -1) {
      console.error('❌ Start or end city not found in destination cities');
      return [];
    }

    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    
    const routeStops = destinationCities.slice(start, end + 1);
    
    // If going backwards (higher index to lower), reverse the order
    if (startIndex > endIndex) {
      routeStops.reverse();
    }
    
    console.log(`✅ Route calculated: ${routeStops.length} stops in correct sequence`);
    return routeStops;
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

      console.log(`🗺️ Planning trip from ${formData.startCity} to ${formData.endCity} with ${routeStops.length} stops`);

      let totalDistance = 0;
      let totalDuration = 0;
      let isUsingGoogleData = false;

      // Calculate accurate distances using Google Distance Matrix API
      if (GoogleDistanceMatrixService.isAvailable()) {
        console.log('📊 Using Google Distance Matrix API for accurate calculations');
        const routeMetrics = await GoogleDistanceMatrixService.calculateRouteDistances(routeStops);
        totalDistance = routeMetrics.totalDistance;
        totalDuration = routeMetrics.totalDuration;
        isUsingGoogleData = true;
      } else {
        console.log('📏 Using fallback distance calculations (less accurate)');
        // Fallback to simple distance calculation
        for (let i = 0; i < routeStops.length - 1; i++) {
          const current = routeStops[i];
          const next = routeStops[i + 1];
          
          // Simple haversine distance
          const R = 3959; // Earth's radius in miles
          const dLat = (next.latitude - current.latitude) * Math.PI / 180;
          const dLon = (next.longitude - current.longitude) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(current.latitude * Math.PI / 180) * Math.cos(next.latitude * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = R * c;
          
          totalDistance += distance;
          totalDuration += (distance / 55) * 3600; // Assume 55 mph average
        }
      }

      console.log(`📊 Route metrics: ${Math.round(totalDistance)} miles, ${GoogleDistanceMatrixService.formatDuration(totalDuration)} (Google: ${isUsingGoogleData})`);

      // Determine trip days based on planning type
      let tripDays: number;
      if (formData.planningType === 'duration') {
        tripDays = formData.tripDuration;
      } else {
        // Calculate days based on daily travel preferences
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

      // Create daily segments with realistic distribution
      const dailySegments: DaySegment[] = [];
      const segmentDistance = totalDistance / tripDays;
      const segmentDuration = totalDuration / tripDays;
      
      let currentStopIndex = 0;
      let accumulatedDistance = 0;
      let accumulatedDuration = 0;

      for (let day = 1; day <= tripDays; day++) {
        const targetDistance = day * segmentDistance;
        const targetDuration = day * segmentDuration;
        
        let nextStopIndex = currentStopIndex;
        let tempDistance = accumulatedDistance;
        let tempDuration = accumulatedDuration;

        // Find the appropriate end city for this day
        while (nextStopIndex < routeStops.length - 1 && 
               (tempDistance < targetDistance || day === tripDays)) {
          
          if (day === tripDays) {
            // Last day - go to final destination
            nextStopIndex = routeStops.length - 1;
            break;
          }
          
          nextStopIndex++;
          
          // Calculate distance to this stop
          const current = routeStops[nextStopIndex - 1];
          const next = routeStops[nextStopIndex];
          
          if (isUsingGoogleData && GoogleDistanceMatrixService.isAvailable()) {
            try {
              const segment = await GoogleDistanceMatrixService.calculateDistance(current, next);
              tempDistance += segment.distance;
              tempDuration += segment.duration;
            } catch (error) {
              console.error('Error calculating segment distance:', error);
              // Fallback calculation
              const R = 3959;
              const dLat = (next.latitude - current.latitude) * Math.PI / 180;
              const dLon = (next.longitude - current.longitude) * Math.PI / 180;
              const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(current.latitude * Math.PI / 180) * Math.cos(next.latitude * Math.PI / 180) *
                        Math.sin(dLon/2) * Math.sin(dLon/2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
              const distance = R * c;
              tempDistance += distance;
              tempDuration += (distance / 55) * 3600;
            }
          } else {
            // Fallback calculation
            const R = 3959;
            const dLat = (next.latitude - current.latitude) * Math.PI / 180;
            const dLon = (next.longitude - current.longitude) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(current.latitude * Math.PI / 180) * Math.cos(next.latitude * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;
            tempDistance += distance;
            tempDuration += (distance / 55) * 3600;
          }
          
          if (tempDistance >= targetDistance) break;
        }

        const startCity = routeStops[currentStopIndex];
        const endCity = routeStops[nextStopIndex];
        
        // Calculate day-specific metrics
        const dayDistance = tempDistance - accumulatedDistance;
        const dayDuration = tempDuration - accumulatedDuration;
        const drivingTime = GoogleDistanceMatrixService.formatDuration(dayDuration);
        
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
          funFact: `Day ${day} of your Route 66 adventure through ${endCity.state}!`
        });

        accumulatedDistance = tempDistance;
        accumulatedDuration = tempDuration;
        currentStopIndex = nextStopIndex;

        if (nextStopIndex >= routeStops.length - 1) break;
      }

      // Create route coordinates
      const route = routeStops.map(city => ({
        lat: city.latitude,
        lng: city.longitude
      }));

      const totalDrivingTime = GoogleDistanceMatrixService.formatDuration(totalDuration);

      const itinerary: TripItinerary = {
        id: `trip-${Date.now()}`,
        startDate: formData.startDate,
        totalDays: tripDays,
        totalDistance: Math.round(totalDistance),
        totalDrivingTime,
        dailySegments,
        route
      };

      console.log(`✅ Trip planned successfully: ${tripDays} days, ${Math.round(totalDistance)} miles (Google: ${isUsingGoogleData})`);

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
