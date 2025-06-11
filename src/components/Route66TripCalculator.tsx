import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Car, Clock, MapPin, Users, Key, ExternalLink, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TripCalculation } from './TripCalculator/types/tripCalculator';
import { TripPlan, DailySegment } from './TripCalculator/services/planning/TripPlanTypes';
import TripCalculatorResults from './TripCalculator/TripCalculatorResults';
import { EnhancedWeatherService } from './Route66Map/services/weather/EnhancedWeatherService';

const Route66TripCalculator = () => {
  const [startingCity, setStartingCity] = useState('');
  const [endCity, setEndCity] = useState('');
  const [tripStyle, setTripStyle] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [calculation, setCalculation] = useState<TripCalculation>();
  const [tripPlan, setTripPlan] = useState<TripPlan>();
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  
  // Weather API Key state
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showApiKeySuccess, setShowApiKeySuccess] = useState(false);

  const weatherService = EnhancedWeatherService.getInstance();

  // Check for existing API key on mount
  useEffect(() => {
    const existingKey = weatherService.hasApiKey();
    setHasApiKey(existingKey);
    console.log('🔑 Checking existing API key status:', existingKey);
  }, [weatherService]);

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) return;
    
    try {
      weatherService.setApiKey(apiKey.trim());
      weatherService.refreshApiKey();
      const keySet = weatherService.hasApiKey();
      
      if (keySet) {
        setHasApiKey(true);
        setShowApiKeySuccess(true);
        setApiKey(''); // Clear the input for security
        
        // Hide success message after 3 seconds
        setTimeout(() => setShowApiKeySuccess(false), 3000);
        
        console.log('✅ Weather API key successfully set');
      } else {
        console.error('❌ Failed to set weather API key');
      }
    } catch (error) {
      console.error('❌ Error setting weather API key:', error);
    }
  };

  const handleClearApiKey = () => {
    weatherService.performNuclearCleanup();
    setHasApiKey(false);
    setShowApiKeySuccess(false);
    console.log('🗑️ Weather API key cleared');
  };

  const handleCalculate = async () => {
    setLoading(true);
    setCalculation(undefined);
    setTripPlan(undefined);
    setShareUrl(null);

    try {
      // Basic validation
      if (!startingCity || !endCity || !tripStyle || !duration) {
        console.error('❌ Missing required fields for calculation');
        return;
      }

      // Simulate API call and data processing
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate a basic calculation (updated to match TripCalculation type)
      const newCalculation: TripCalculation = {
        totalDistance: 2448,
        totalDriveTime: 41,
        numberOfDays: 7,
        averageDailyDistance: 350,
        dailyDistances: [350, 350, 350, 350, 350, 350, 398],
        fuelCost: 300,
        accommodationCost: 700,
        foodCost: 500,
        attractionCost: 200,
        totalCost: 1700,
      };

      setCalculation(newCalculation);

      // Generate a basic trip plan (updated to match DailySegment type)
      const newTripPlan: TripPlan = {
        id: 'trip-plan-123',
        startCity: startingCity,
        endCity: endCity,
        totalDays: 7,
        totalDistance: 2448,
        segments: [
          { day: 1, startCity: startingCity, endCity: 'Springfield, IL', distance: 200, driveTimeHours: 3.5 },
          { day: 2, startCity: 'Springfield, IL', endCity: 'St. Louis, MO', distance: 100, driveTimeHours: 1.5 },
          { day: 3, startCity: 'St. Louis, MO', endCity: 'Tulsa, OK', distance: 300, driveTimeHours: 4.5 },
          { day: 4, startCity: 'Tulsa, OK', endCity: 'Oklahoma City, OK', distance: 100, driveTimeHours: 1.5 },
          { day: 5, startCity: 'Oklahoma City, OK', endCity: 'Amarillo, TX', distance: 250, driveTimeHours: 3.5 },
          { day: 6, startCity: 'Amarillo, TX', endCity: 'Albuquerque, NM', distance: 280, driveTimeHours: 4.0 },
          { day: 7, startCity: 'Albuquerque, NM', endCity: endCity, distance: 400, driveTimeHours: 5.5 },
        ],
      };

      setTripPlan(newTripPlan);

      // Generate a share URL (replace with actual logic)
      const newShareUrl = `https://example.com/trip/share/${newTripPlan.id}`;
      setShareUrl(newShareUrl);

      console.log('✅ Trip calculation and plan generated successfully');
    } catch (error) {
      console.error('❌ Error during trip calculation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Weather API Key Setup Section */}
      <Card className="border-2 border-blue-300 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
            <Key className="h-5 w-5" />
            🌤️ Weather API Setup (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasApiKey ? (
            <div className="space-y-4">
              <div className="bg-blue-100 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-700 font-medium mb-1">
                  Get live weather forecasts for your Route 66 journey!
                </p>
                <p className="text-xs text-blue-600">
                  Add your OpenWeatherMap API key to see current weather and 5-day forecasts for each destination.
                </p>
              </div>
              
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter your OpenWeatherMap API key (32 characters)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 text-sm"
                  maxLength={50}
                />
                <Button 
                  onClick={handleApiKeySubmit}
                  disabled={!apiKey.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Enable Weather
                </Button>
              </div>
              
              <div className="border-t border-blue-200 pt-3">
                <a 
                  href="https://openweathermap.org/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium bg-white px-3 py-2 rounded border border-blue-200 hover:border-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Get Free API Key at OpenWeatherMap
                </a>
                <div className="text-xs text-blue-500 mt-2">
                  • Free tier includes 1,000 API calls per day • No credit card required • Takes 10-15 minutes to activate
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {showApiKeySuccess && (
                <div className="flex items-center gap-2 text-green-700 bg-green-100 border border-green-200 rounded p-3">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Weather API key successfully configured!</span>
                </div>
              )}
              
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Weather forecasts enabled</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearApiKey}
                  className="text-xs"
                >
                  Remove Key
                </Button>
              </div>
              
              <p className="text-xs text-green-600">
                Your trip plans will now include live weather forecasts for each destination.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Trip Calculator Form */}
      <Card className="vintage-paper-texture border-2 border-route66-vintage-brown">
        <CardHeader className="bg-gradient-to-r from-route66-orange to-route66-vintage-yellow text-white">
          <CardTitle className="font-route66 text-2xl text-center flex items-center justify-center gap-3">
            <Car className="h-6 w-6" />
            ROUTE 66 TRIP CALCULATOR
            <MapPin className="h-6 w-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Trip Planning Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Starting City */}
            <div className="space-y-2">
              <Label htmlFor="starting-city" className="font-travel font-bold text-route66-vintage-brown">
                Starting City
              </Label>
              <Select value={startingCity} onValueChange={setStartingCity}>
                <SelectTrigger className="border-route66-tan bg-route66-cream">
                  <SelectValue placeholder="Choose your starting point" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chicago-il">Chicago, IL</SelectItem>
                  <SelectItem value="st-louis-mo">St. Louis, MO</SelectItem>
                  <SelectItem value="springfield-il">Springfield, IL</SelectItem>
                  <SelectItem value="tulsa-ok">Tulsa, OK</SelectItem>
                  <SelectItem value="oklahoma-city-ok">Oklahoma City, OK</SelectItem>
                  <SelectItem value="amarillo-tx">Amarillo, TX</SelectItem>
                  <SelectItem value="albuquerque-nm">Albuquerque, NM</SelectItem>
                  <SelectItem value="flagstaff-az">Flagstaff, AZ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Destination City */}
            <div className="space-y-2">
              <Label htmlFor="end-city" className="font-travel font-bold text-route66-vintage-brown">
                Destination City
              </Label>
              <Select value={endCity} onValueChange={setEndCity}>
                <SelectTrigger className="border-route66-tan bg-route66-cream">
                  <SelectValue placeholder="Choose your destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="santa-monica-ca">Santa Monica, CA</SelectItem>
                  <SelectItem value="los-angeles-ca">Los Angeles, CA</SelectItem>
                  <SelectItem value="flagstaff-az">Flagstaff, AZ</SelectItem>
                  <SelectItem value="albuquerque-nm">Albuquerque, NM</SelectItem>
                  <SelectItem value="amarillo-tx">Amarillo, TX</SelectItem>
                  <SelectItem value="oklahoma-city-ok">Oklahoma City, OK</SelectItem>
                  <SelectItem value="tulsa-ok">Tulsa, OK</SelectItem>
                  <SelectItem value="st-louis-mo">St. Louis, MO</SelectItem>
                  <SelectItem value="chicago-il">Chicago, IL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Trip Style */}
            <div className="space-y-2">
              <Label htmlFor="trip-style" className="font-travel font-bold text-route66-vintage-brown">
                Trip Style
              </Label>
              <Select value={tripStyle} onValueChange={setTripStyle}>
                <SelectTrigger className="border-route66-tan bg-route66-cream">
                  <SelectValue placeholder="How do you want to travel?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leisurely">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Leisurely - Lots of stops & sightseeing
                    </div>
                  </SelectItem>
                  <SelectItem value="moderate">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Moderate - Balanced pace with key attractions
                    </div>
                  </SelectItem>
                  <SelectItem value="quick">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Express - Focus on driving with minimal stops
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Trip Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="font-travel font-bold text-route66-vintage-brown">
                Trip Duration
              </Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="border-route66-tan bg-route66-cream">
                  <SelectValue placeholder="How long is your trip?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-5">3-5 days (Quick Route)</SelectItem>
                  <SelectItem value="7-10">7-10 days (Classic Route)</SelectItem>
                  <SelectItem value="14-21">2-3 weeks (Full Experience)</SelectItem>
                  <SelectItem value="custom">Custom Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Trip Start Date */}
          <div className="space-y-2 mb-6">
            <Label className="font-travel font-bold text-route66-vintage-brown">
              Trip Start Date (Optional)
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-route66-tan bg-route66-cream",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : 'Pick a start date for weather forecasts'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Calculate Button */}
          <Button 
            onClick={handleCalculate}
            disabled={!startingCity || !endCity || !tripStyle || !duration || loading}
            className="w-full bg-route66-vintage-red hover:bg-route66-vintage-red/90 text-white font-route66 text-lg py-6"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Planning Your Route 66 Adventure...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Plan My Route 66 Adventure
                <Car className="h-5 w-5" />
              </div>
            )}
          </Button>

          {/* Help Text */}
          <div className="mt-4 p-4 bg-route66-vintage-yellow rounded-lg">
            <p className="text-sm text-route66-navy font-travel text-center">
              💡 <strong>Planning Tip:</strong> Setting a start date enables weather forecasts for your journey. 
              The API key above unlocks live weather data for enhanced trip planning!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {(calculation || tripPlan) && (
        <TripCalculatorResults 
          calculation={calculation} 
          tripPlan={tripPlan} 
          shareUrl={shareUrl}
          tripStartDate={startDate}
        />
      )}
    </div>
  );
};

export default Route66TripCalculator;
