
import { useState, useMemo } from 'react';
import { route66Towns } from '@/types/route66';
import { TripCalculation, TripFormData } from '../types/tripCalculator';
import { calculateDistance } from '../utils/distanceCalculator';

export const useTripCalculation = () => {
  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    endLocation: '',
    travelDays: 0,
    dailyDrivingLimit: [300]
  });
  const [calculation, setCalculation] = useState<TripCalculation | null>(null);

  // Debug: Log the route66Towns data
  console.log('Route66 Towns data:', route66Towns);
  console.log('Number of towns:', route66Towns?.length || 'undefined');

  // Get available end locations based on start location
  const availableEndLocations = useMemo(() => {
    if (!formData.startLocation) return route66Towns;
    
    const startIndex = route66Towns.findIndex(town => town.name === formData.startLocation);
    if (startIndex === -1) return route66Towns;
    
    // Return towns that are different from start location
    return route66Towns.filter(town => town.name !== formData.startLocation);
  }, [formData.startLocation]);

  // Calculate trip details
  const calculateTrip = () => {
    if (!formData.startLocation || !formData.endLocation) return;

    const startTown = route66Towns.find(town => town.name === formData.startLocation);
    const endTown = route66Towns.find(town => town.name === formData.endLocation);

    if (!startTown || !endTown) return;

    const totalDistance = calculateDistance(
      startTown.latLng[0], startTown.latLng[1],
      endTown.latLng[0], endTown.latLng[1]
    );

    // Estimate drive time (assuming average speed of 55 mph on Route 66)
    const totalDriveTime = totalDistance / 55;

    let numberOfDays: number;
    let dailyDistances: number[] = [];

    if (formData.travelDays > 0) {
      // Use user-specified days
      numberOfDays = formData.travelDays;
      const distancePerDay = totalDistance / numberOfDays;
      dailyDistances = Array(numberOfDays).fill(distancePerDay);
    } else {
      // Calculate based on daily driving limit
      const maxDailyDistance = formData.dailyDrivingLimit[0];
      numberOfDays = Math.ceil(totalDistance / maxDailyDistance);
      
      // Distribute distance across days
      for (let i = 0; i < numberOfDays; i++) {
        const remainingDistance = totalDistance - dailyDistances.reduce((sum, dist) => sum + dist, 0);
        const remainingDays = numberOfDays - i;
        
        if (i === numberOfDays - 1) {
          dailyDistances.push(remainingDistance);
        } else {
          const dailyDistance = Math.min(maxDailyDistance, remainingDistance / remainingDays);
          dailyDistances.push(dailyDistance);
        }
      }
    }

    const averageDailyDistance = totalDistance / numberOfDays;

    setCalculation({
      totalDistance,
      totalDriveTime,
      dailyDistances,
      numberOfDays,
      averageDailyDistance
    });
  };

  // Debug: Log current state
  console.log('Current state:', { 
    startLocation: formData.startLocation, 
    endLocation: formData.endLocation, 
    isButtonDisabled: !formData.startLocation || !formData.endLocation 
  });

  return {
    formData,
    setFormData,
    calculation,
    availableEndLocations,
    calculateTrip,
    isCalculateDisabled: !formData.startLocation || !formData.endLocation
  };
};
