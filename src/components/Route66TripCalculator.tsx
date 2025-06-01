
import React, { useState, useMemo } from 'react';
import { route66Towns } from '@/types/route66';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TripCalculation {
  totalDistance: number;
  totalDriveTime: number;
  dailyDistances: number[];
  numberOfDays: number;
  averageDailyDistance: number;
}

const Route66TripCalculator = () => {
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  const [travelDays, setTravelDays] = useState<number>(0);
  const [dailyDrivingLimit, setDailyDrivingLimit] = useState<number[]>([300]);
  const [calculation, setCalculation] = useState<TripCalculation | null>(null);

  // Debug: Log the route66Towns data
  console.log('Route66 Towns data:', route66Towns);
  console.log('Number of towns:', route66Towns?.length || 'undefined');

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get available end locations based on start location
  const availableEndLocations = useMemo(() => {
    if (!startLocation) return route66Towns;
    
    const startIndex = route66Towns.findIndex(town => town.name === startLocation);
    if (startIndex === -1) return route66Towns;
    
    // Return towns that are different from start location
    return route66Towns.filter(town => town.name !== startLocation);
  }, [startLocation]);

  // Calculate trip details
  const calculateTrip = () => {
    if (!startLocation || !endLocation) return;

    const startTown = route66Towns.find(town => town.name === startLocation);
    const endTown = route66Towns.find(town => town.name === endLocation);

    if (!startTown || !endTown) return;

    const totalDistance = calculateDistance(
      startTown.latLng[0], startTown.latLng[1],
      endTown.latLng[0], endTown.latLng[1]
    );

    // Estimate drive time (assuming average speed of 55 mph on Route 66)
    const totalDriveTime = totalDistance / 55;

    let numberOfDays: number;
    let dailyDistances: number[] = [];

    if (travelDays > 0) {
      // Use user-specified days
      numberOfDays = travelDays;
      const distancePerDay = totalDistance / numberOfDays;
      dailyDistances = Array(numberOfDays).fill(distancePerDay);
    } else {
      // Calculate based on daily driving limit
      const maxDailyDistance = dailyDrivingLimit[0];
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

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  // Debug: Log current state
  console.log('Current state:', { startLocation, endLocation, isButtonDisabled: !startLocation || !endLocation });

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card className="vintage-paper-texture border-2 border-route66-vintage-brown">
        <CardHeader className="bg-gradient-to-r from-route66-vintage-red to-route66-rust text-white">
          <CardTitle className="font-route66 text-2xl text-center">
            ROUTE 66 TRIP CALCULATOR
          </CardTitle>
          <p className="text-center font-travel text-sm opacity-90">
            Calculate your Mother Road adventure
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Debug Info */}
          {(!route66Towns || route66Towns.length === 0) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Debug:</strong> Route66 towns data is not loading properly. 
              Towns available: {route66Towns?.length || 0}
            </div>
          )}

          {/* Start Location */}
          <div className="space-y-2">
            <Label className="font-travel font-bold text-route66-vintage-brown">
              Start Location
            </Label>
            <Select value={startLocation} onValueChange={setStartLocation}>
              <SelectTrigger className="border-2 border-route66-tan">
                <SelectValue placeholder="Select starting city" />
              </SelectTrigger>
              <SelectContent>
                {route66Towns && route66Towns.length > 0 ? (
                  route66Towns.map((town) => (
                    <SelectItem key={town.name} value={town.name}>
                      {town.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>
                    No towns data available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* End Location */}
          <div className="space-y-2">
            <Label className="font-travel font-bold text-route66-vintage-brown">
              End Location
            </Label>
            <Select value={endLocation} onValueChange={setEndLocation}>
              <SelectTrigger className="border-2 border-route66-tan">
                <SelectValue placeholder="Select destination city" />
              </SelectTrigger>
              <SelectContent>
                {availableEndLocations && availableEndLocations.length > 0 ? (
                  availableEndLocations.map((town) => (
                    <SelectItem key={town.name} value={town.name}>
                      {town.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>
                    No towns data available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Number of Travel Days */}
          <div className="space-y-2">
            <Label className="font-travel font-bold text-route66-vintage-brown">
              Number of Travel Days (Optional)
            </Label>
            <Input
              type="number"
              min="0"
              max="30"
              value={travelDays || ''}
              onChange={(e) => setTravelDays(Number(e.target.value) || 0)}
              placeholder="Leave blank to auto-calculate"
              className="border-2 border-route66-tan"
            />
            <p className="text-xs text-route66-vintage-brown opacity-75">
              Leave blank to calculate based on daily driving limit
            </p>
          </div>

          {/* Daily Driving Limit */}
          <div className="space-y-4">
            <Label className="font-travel font-bold text-route66-vintage-brown">
              Preferred Daily Driving Limit: {dailyDrivingLimit[0]} miles/day
            </Label>
            <div className="px-2">
              <Slider
                value={dailyDrivingLimit}
                onValueChange={setDailyDrivingLimit}
                max={500}
                min={100}
                step={25}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-route66-vintage-brown opacity-75 mt-1">
                <span>100 mi</span>
                <span>300 mi</span>
                <span>500 mi</span>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={calculateTrip}
            disabled={!startLocation || !endLocation}
            className="w-full vintage-button"
          >
            Calculate Trip
          </Button>
          
          {/* Debug info for button state */}
          <div className="text-xs text-gray-500">
            Debug: Button disabled = {(!startLocation || !endLocation).toString()}
            | Start: "{startLocation}" | End: "{endLocation}"
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {calculation && (
        <Card className="vintage-paper-texture border-2 border-route66-vintage-brown">
          <CardHeader className="bg-gradient-to-r from-route66-orange to-route66-vintage-yellow text-white">
            <CardTitle className="font-route66 text-xl text-center">
              YOUR ROUTE 66 ADVENTURE
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-route66-cream rounded-lg border border-route66-tan">
                <div className="font-route66 text-2xl text-route66-vintage-red">
                  {Math.round(calculation.totalDistance)}
                </div>
                <div className="font-travel text-sm text-route66-vintage-brown">
                  Total Miles
                </div>
              </div>
              
              <div className="text-center p-4 bg-route66-cream rounded-lg border border-route66-tan">
                <div className="font-route66 text-2xl text-route66-vintage-red">
                  {formatTime(calculation.totalDriveTime)}
                </div>
                <div className="font-travel text-sm text-route66-vintage-brown">
                  Drive Time
                </div>
              </div>
              
              <div className="text-center p-4 bg-route66-cream rounded-lg border border-route66-tan">
                <div className="font-route66 text-2xl text-route66-vintage-red">
                  {calculation.numberOfDays}
                </div>
                <div className="font-travel text-sm text-route66-vintage-brown">
                  Recommended Days
                </div>
              </div>
              
              <div className="text-center p-4 bg-route66-cream rounded-lg border border-route66-tan">
                <div className="font-route66 text-2xl text-route66-vintage-red">
                  {Math.round(calculation.averageDailyDistance)}
                </div>
                <div className="font-travel text-sm text-route66-vintage-brown">
                  Avg Miles/Day
                </div>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div className="space-y-3">
              <h3 className="font-travel font-bold text-route66-vintage-brown text-lg">
                Daily Driving Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {calculation.dailyDistances.map((distance, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-route66-vintage-beige rounded border border-route66-tan"
                  >
                    <span className="font-travel font-bold text-route66-vintage-brown">
                      Day {index + 1}
                    </span>
                    <span className="font-travel text-route66-vintage-brown">
                      {Math.round(distance)} miles
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-route66-vintage-yellow rounded-lg">
              <p className="text-sm text-route66-navy font-travel text-center">
                💡 <strong>Travel Tip:</strong> Allow extra time for exploring historic attractions, 
                dining at classic diners, and taking photos at iconic landmarks along the way!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Route66TripCalculator;
