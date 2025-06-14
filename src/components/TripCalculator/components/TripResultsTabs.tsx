
import React, { useState } from 'react';
import { TripPlan, DailySegment } from '../services/planning/TripPlanBuilder';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Route, 
  Calendar, 
  MapPin, 
  Camera, 
  Share2, 
  Download,
  Cloud,
  Clock,
  DollarSign,
  Utensils,
  Key,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import WeatherTabContent from './WeatherTabContent';
import AttractionsTabContent from './AttractionsTabContent';
import RestaurantsTabContent from './RestaurantsTabContent';
import CostTabContent from './CostTabContent';
import ShareTripButton from './ShareTripButton';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

interface TripResultsTabsProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string | null;
  onShareTrip?: () => void;
  isGeneratingShareUrl?: boolean;
}

const TripResultsTabs: React.FC<TripResultsTabsProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  onShareTrip,
  isGeneratingShareUrl = false
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isStoringKey, setIsStoringKey] = useState(false);
  const [keyMessage, setKeyMessage] = useState('');

  // Check if we have API key for weather
  const [hasWeatherApiKey, setHasWeatherApiKey] = React.useState(() => {
    return WeatherApiKeyManager.hasApiKey();
  });

  const handleStoreApiKey = async () => {
    if (!apiKey.trim()) {
      setKeyMessage('Please enter an API key');
      return;
    }

    setIsStoringKey(true);
    try {
      WeatherApiKeyManager.setApiKey(apiKey.trim());
      setKeyMessage('✅ API key saved! Weather forecasts are now enabled.');
      setApiKey('');
      setHasWeatherApiKey(true);
      
      // Refresh after a moment
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setKeyMessage('❌ Invalid API key. Please check your key and try again.');
    } finally {
      setIsStoringKey(false);
    }
  };

  console.log('📊 TripResultsTabs render:', {
    tripPlan: !!tripPlan,
    tripStartDate: tripStartDate?.toISOString(),
    hasWeatherApiKey,
    segmentCount: tripPlan?.segments?.length
  });

  const getTotalAttractions = () => {
    return tripPlan.segments?.reduce((total, segment) => 
      total + (segment.attractions?.length || 0), 0) || 0;
  };

  const getTotalRestaurants = () => {
    return 0;
  };

  const formatDrivingTime = (distance: number) => {
    const hours = Math.round(distance / 55 * 10) / 10;
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${wholeHours}h`;
    } else {
      return `${wholeHours}h ${minutes}m`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Weather API Key Setup - Prominent at top when needed */}
      {!hasWeatherApiKey && (
        <Card className="border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 text-blue-700 mb-4">
                <Cloud className="w-8 h-8" />
                <h3 className="text-xl font-bold">🌤️ Enable Live Weather Forecasts</h3>
              </div>
              
              <p className="text-blue-600 text-lg mb-4">
                Get real-time weather forecasts for each day of your Route 66 journey!
              </p>
              
              <div className="max-w-md mx-auto space-y-3">
                <div className="flex gap-3">
                  <Input
                    type="password"
                    placeholder="Enter your OpenWeatherMap API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 text-lg p-3"
                  />
                  <Button 
                    onClick={handleStoreApiKey}
                    disabled={isStoringKey || !apiKey.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                    size="lg"
                  >
                    {isStoringKey ? 'Saving...' : 'Enable Weather'}
                  </Button>
                </div>
                
                {keyMessage && (
                  <p className={`text-sm font-medium ${keyMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                    {keyMessage}
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-2 text-blue-600 mt-4">
                <ExternalLink className="w-4 h-4" />
                <a 
                  href="https://openweathermap.org/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg hover:underline font-medium"
                >
                  Get your free API key from OpenWeatherMap →
                </a>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-left max-w-lg mx-auto">
                <h5 className="font-medium text-blue-800 mb-2">Quick Setup:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 100% free for up to 1,000 calls per day</li>
                  <li>• No credit card required</li>
                  <li>• Keys activate within 10 minutes</li>
                  <li>• Stored securely in your browser only</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab System using shadcn/ui Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Overview
          </TabsTrigger>
          
          <TabsTrigger value="weather" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Weather
            {hasWeatherApiKey && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 ml-1">
                ✓
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="attractions" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Attractions
            <Badge variant="secondary" className="text-xs ml-1">
              {getTotalAttractions()}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="restaurants" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Restaurants
            <Badge variant="secondary" className="text-xs ml-1">
              {getTotalRestaurants()}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="costs" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Costs
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Trip Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-route66-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-route66-text-primary">
                  {tripPlan.segments?.length || 0}
                </div>
                <div className="text-sm text-route66-text-secondary">Days</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Route className="h-8 w-8 text-route66-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-route66-text-primary">
                  {Math.round(tripPlan.totalDistance || 0)}
                </div>
                <div className="text-sm text-route66-text-secondary">Miles</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-route66-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-route66-text-primary">
                  {formatDrivingTime(tripPlan.totalDistance || 0)}
                </div>
                <div className="text-sm text-route66-text-secondary">Drive Time</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="h-8 w-8 text-route66-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-route66-text-primary">
                  {getTotalAttractions()}
                </div>
                <div className="text-sm text-route66-text-secondary">Attractions</div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Breakdown */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-route66-text-primary">Daily Breakdown</h4>
            
            {tripPlan.segments?.map((segment, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-medium">
                        Day {segment.day}
                      </Badge>
                      <div>
                        <h5 className="font-semibold text-route66-text-primary">
                          {segment.startCity} → {segment.endCity}
                        </h5>
                        {tripStartDate && (
                          <p className="text-sm text-route66-text-secondary">
                            {format(
                              new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000),
                              'EEEE, MMMM d, yyyy'
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-route66-text-primary">
                        {Math.round(segment.distance)} miles
                      </div>
                      <div className="text-xs text-route66-text-secondary">
                        {formatDrivingTime(segment.distance)}
                      </div>
                    </div>
                  </div>

                  {segment.attractions && segment.attractions.length > 0 && (
                    <div className="mt-3">
                      <h6 className="text-sm font-medium text-route66-text-primary mb-2">
                        Recommended Stops ({segment.attractions.length}):
                      </h6>
                      <div className="flex flex-wrap gap-1">
                        {segment.attractions.slice(0, 3).map((attraction, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {attraction.name}
                          </Badge>
                        ))}
                        {segment.attractions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{segment.attractions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Share Section */}
          <div className="flex justify-center pt-4">
            <ShareTripButton
              onShare={onShareTrip}
              shareUrl={shareUrl}
              isGenerating={isGeneratingShareUrl}
            />
          </div>
        </TabsContent>

        {/* Weather Tab */}
        <TabsContent value="weather">
          <WeatherTabContent
            segments={tripPlan.segments || []}
            tripStartDate={tripStartDate}
            tripId={tripPlan.id}
            isVisible={true}
          />
        </TabsContent>

        {/* Attractions Tab */}
        <TabsContent value="attractions">
          <AttractionsTabContent
            segments={tripPlan.segments || []}
            isVisible={true}
          />
        </TabsContent>

        {/* Restaurants Tab */}
        <TabsContent value="restaurants">
          <RestaurantsTabContent
            segments={tripPlan.segments || []}
            isVisible={true}
          />
        </TabsContent>

        {/* Costs Tab */}
        <TabsContent value="costs">
          <CostTabContent
            tripPlan={tripPlan}
            isVisible={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripResultsTabs;
