
import { useState } from 'react';
import { PlannerFormData, TripItinerary, DestinationCity, DaySegment } from '../types';
import { useDestinationCities } from './useDestinationCities';
import { supabase } from '@/lib/supabase';
import { GoogleDistanceMatrixService } from '../services/GoogleDistanceMatrixService';
import { DirectionEnforcerService } from '@/components/TripCalculator/services/planning/DirectionEnforcerService';
import { GeographicProgressionService } from '@/components/TripCalculator/services/planning/GeographicProgressionService';

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
      const { data, error } = await (supabase as any)
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

      // FIXED: Use EXACTLY the user's requested number of days
      let tripDays: number;
      if (formData.planningType === 'duration') {
        tripDays = formData.tripDuration;
      } else {
        // Calculate days based on daily travel preferences
        const dailyDurationLimit = formData.dailyHours * 3600;
        const dailyDistanceLimit = formData.dailyMiles;
        
        const dailyDurationDays = Math.ceil(totalDuration / dailyDurationLimit);
        const dailyDistanceDays = Math.ceil(totalDistance / dailyDistanceLimit);
        
        tripDays = Math.max(dailyDurationDays, dailyDistanceDays);
        tripDays = Math.max(3, Math.min(21, tripDays));
      }

      // IMPORTANT: Check if we have enough destination cities for the requested days
      const maxPossibleDays = routeStops.length - 1; // -1 because we need intermediate stops
      if (tripDays > maxPossibleDays) {
        console.log(`⚠️ Requested ${tripDays} days but only ${maxPossibleDays} possible with available destination cities. Adjusting to ${maxPossibleDays} days.`);
        tripDays = maxPossibleDays;
      }

      console.log(`📅 Planning for EXACTLY ${tripDays} days using destination cities as overnight stops`);

      // SIMPLIFIED: Create daily segments using destination cities as overnight stops with GEOGRAPHIC PROGRESSION
      const dailySegments: DaySegment[] = [];
      
      // Select specific destination cities for each day using geographic progression
      const selectedStops = selectDestinationCitiesWithProgression(routeStops, tripDays);
      
      console.log(`🏙️ Selected ${selectedStops.length} destination cities with geographic progression:`, selectedStops.map(s => s.name));

      for (let day = 1; day <= tripDays; day++) {
        const startCity = selectedStops[day - 1];
        const endCity = selectedStops[day];
        
        // Calculate distance and duration for this segment
        let dayDistance = 0;
        let dayDuration = 0;
        
        if (isUsingGoogleData && GoogleDistanceMatrixService.isAvailable()) {
          try {
            const segment = await GoogleDistanceMatrixService.calculateDistance(startCity, endCity);
            dayDistance = segment.distance;
            dayDuration = segment.duration;
          } catch (error) {
            console.error('Error calculating segment distance:', error);
            dayDistance = calculateHaversineDistance(startCity, endCity);
            dayDuration = (dayDistance / 55) * 3600;
          }
        } else {
          dayDistance = calculateHaversineDistance(startCity, endCity);
          dayDuration = (dayDistance / 55) * 3600;
        }
        
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

        console.log(`✅ Day ${day}: ${startCity.name} → ${endCity.name} (${Math.round(dayDistance)} miles)`);
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

  // Helper function to select destination cities with geographic progression
  const selectDestinationCitiesWithProgression = (routeStops: DestinationCity[], tripDays: number): DestinationCity[] => {
    if (tripDays <= 1) return routeStops;
    if (tripDays >= routeStops.length) return routeStops;
    
    console.log(`🧭 Using geographic progression for ${tripDays} days from ${routeStops.length} cities`);
    
    // Convert to TripStop format for geographic services
    const tripStops = routeStops.map(city => ({
      id: city.name.toLowerCase().replace(/\s+/g, '-'),
      name: city.name,
      city: city.name,
      city_name: city.name,
      state: city.state,
      latitude: city.latitude,
      longitude: city.longitude,
      description: `${city.name}, ${city.state}`,
      category: 'destination'
    }));

    const startStop = tripStops[0];
    const endStop = tripStops[tripStops.length - 1];
    
    if (tripDays === 2) {
      // Just start and end for 2-day trip
      return [routeStops[0], routeStops[routeStops.length - 1]];
    }

    // Need (tripDays - 2) intermediate stops
    const neededIntermediateStops = tripDays - 2;
    const availableIntermediateStops = tripStops.slice(1, -1); // Exclude start and end
    
    console.log(`🎯 Need ${neededIntermediateStops} intermediate stops from ${availableIntermediateStops.length} available`);
    
    if (availableIntermediateStops.length <= neededIntermediateStops) {
      // Use all available intermediate stops
      console.log(`✅ Using all ${availableIntermediateStops.length} available intermediate stops`);
      return routeStops;
    }
    
    // Use geographic progression to select optimal intermediate stops
    const selectedIntermediateStops: typeof tripStops = [];
    const totalDistance = DirectionEnforcerService.calculateDistance(startStop, endStop);
    
    // Calculate target distances for even distribution
    const segmentDistance = totalDistance / (tripDays - 1);
    let currentStop = startStop;
    
    for (let day = 1; day < tripDays - 1; day++) {
      const targetDistanceFromStart = segmentDistance * day;
      
      // Filter available stops for forward progression
      const progressionFiltered = DirectionEnforcerService.filterForwardDestinations(
        currentStop, availableIntermediateStops, endStop, 'moderate'
      );
      
      console.log(`📍 Day ${day + 1}: ${progressionFiltered.length} cities maintain forward progression`);
      
      // Use progression-filtered stops, fallback to all if none available
      const candidateStops = progressionFiltered.length > 0 ? progressionFiltered : availableIntermediateStops;
      
      // Find best stop based on target distance and progression score
      let bestStop = candidateStops[0];
      let bestScore = -Infinity;
      
      for (const candidate of candidateStops) {
        // Skip if already selected
        if (selectedIntermediateStops.find(s => s.id === candidate.id)) continue;
        
        const distanceFromStart = DirectionEnforcerService.calculateDistance(startStop, candidate);
        const distanceScore = Math.max(0, 100 - Math.abs(distanceFromStart - targetDistanceFromStart) / 10);
        const progressionScore = DirectionEnforcerService.calculateProgressionScore(currentStop, candidate, endStop);
        
        // Combined score (60% distance, 40% progression)
        const totalScore = distanceScore * 0.6 + progressionScore * 0.4;
        
        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestStop = candidate;
        }
      }
      
      selectedIntermediateStops.push(bestStop);
      currentStop = bestStop;
      
      // Remove selected stop from available options
      const index = availableIntermediateStops.findIndex(s => s.id === bestStop.id);
      if (index > -1) {
        availableIntermediateStops.splice(index, 1);
      }
      
      console.log(`✅ Selected ${bestStop.name} for day ${day + 1} (score: ${bestScore.toFixed(1)})`);
    }
    
    // Convert back to DestinationCity format and create final sequence
    const finalSequence = [
      routeStops[0], // Start city
      ...selectedIntermediateStops.map(stop => 
        routeStops.find(city => city.name === stop.name)!
      ),
      routeStops[routeStops.length - 1] // End city
    ];
    
    console.log(`🔄 Final sequence selected with geographic progression`);
    return finalSequence;
  };

  // Helper function for Haversine distance calculation
  const calculateHaversineDistance = (city1: DestinationCity, city2: DestinationCity): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (city2.latitude - city1.latitude) * Math.PI / 180;
    const dLon = (city2.longitude - city1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(city1.latitude * Math.PI / 180) * Math.cos(city2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return {
    planTrip,
    isLoading
  };
};
